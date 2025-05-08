import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ClienteService } from '../../interfaces/cliente.service';

@Component({
  selector: 'app-adquirir-membresia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './adquirir-membresia.component.html',
})
export class AdquirirMembresiaComponent implements OnInit {

  adquirirForm: FormGroup;
  metodoPagos: any[] = [];
  tipoMembresiaId!: number;
  mensaje: string = '';
  enviando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private clienteService: ClienteService
  ) {
    this.adquirirForm = this.fb.group({
      ci: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      observacion: ['Registrado por Web'],
      correo: ['', [Validators.required, Validators.email]],
      metodoPago: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.tipoMembresiaId = +this.route.snapshot.paramMap.get('id')!;

    this.http.get<any[]>('https://web-production-d581.up.railway.app/api/metodos-pago').subscribe({
      next: (data) => {
        const permitidos = ['Tarjeta', 'Transferencia', 'Pago en línea'];
        this.metodoPagos = data
          .filter(metodo => permitidos.includes(metodo.metodoPago))
          .sort((a, b) => permitidos.indexOf(a.metodoPago) - permitidos.indexOf(b.metodoPago));
      },
      error: () => {
        this.mensaje = 'Error al cargar métodos de pago. Intente nuevamente.';
      }
    });
  }

  enviarSolicitud() {
    if (this.adquirirForm.invalid || this.enviando) {
      this.mensaje = 'Por favor complete todos los campos correctamente.';
      return;
    }

    this.enviando = true;

    const datosCliente = {
      ci: this.adquirirForm.value.ci,
      nombre: this.adquirirForm.value.nombre,
      apellido: this.adquirirForm.value.apellido,
      fechaNacimiento: this.adquirirForm.value.fechaNacimiento,
      telefono: this.adquirirForm.value.telefono,
      direccion: this.adquirirForm.value.direccion,
      observacion: this.adquirirForm.value.observacion,
      correo: this.adquirirForm.value.correo,
      tipoMembresiaId: this.tipoMembresiaId,
      metodoPagoId: +this.adquirirForm.value.metodoPago,
    };

    this.clienteService.adquirirMembresia(datosCliente).subscribe({
      next: (res) => {
        console.log('✅ Registro exitoso', res);
        const contrasenaTemporal = res.usuario?.passwordTemporal || 'Cambiar123';
        alert(`Registro exitoso.\nCorreo: ${datosCliente.correo}\nContraseña temporal: ${contrasenaTemporal}`);

        this.enviando = false; // ✅ liberar
        this.adquirirForm.reset(); // opcional
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.mensaje = err?.error?.message || 'Hubo un problema al adquirir la membresía.';
        this.enviando = false;

        setTimeout(() => {
          this.mensaje = '';
        }, 5000);
      }
    });
  }
}

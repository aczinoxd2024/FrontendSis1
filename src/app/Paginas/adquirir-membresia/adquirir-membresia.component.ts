import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
      observacion: [''],
      correo: ['', [Validators.required, Validators.email]],
      metodoPago: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.tipoMembresiaId = +this.route.snapshot.paramMap.get('id')!;

    this.http.get<any[]>('https://web-production-d581.up.railway.app/api/metodos-pago').subscribe({
      next: (data) => {
        this.metodoPagos = data;
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

    const formValue = this.adquirirForm.value;

    const datosCliente = {
      ci: formValue.ci,
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      fechaNacimiento: new Date(formValue.fechaNacimiento).toISOString(),
      telefono: formValue.telefono,
      direccion: formValue.direccion,
      observacion: formValue.observacion,
      correo: formValue.correo,
      tipoMembresiaId: this.tipoMembresiaId,
      metodoPagoId: Number(formValue.metodoPago),
    };

    this.clienteService.adquirirMembresia(datosCliente).subscribe({
      next: (res) => {
        this.mensaje = `🎉 ${res.mensaje} Por favor revise su correo para cambiar la contraseña temporal.`;
        this.adquirirForm.reset();
        this.enviando = false;

        setTimeout(() => {
          this.mensaje = '';
        }, 5000);
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

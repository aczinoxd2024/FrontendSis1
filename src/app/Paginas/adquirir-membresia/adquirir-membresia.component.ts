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
  tipoMembresiaId!: number; // 📌 ID que viene por URL
  mensaje: string = '';

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
      observacion: [''],
      correo: ['', [Validators.required, Validators.email]],
      metodoPago: ['', Validators.required],
    });
  }

  ngOnInit() {
    // ✅ Obtener tipoMembresiaId de la URL
    this.tipoMembresiaId = +this.route.snapshot.paramMap.get('id')!;

    // ✅ Obtener métodos de pago
    this.http.get<any[]>('https://web-production-d581.up.railway.app/api/metodos-pago').subscribe({
      next: (data) => {
        this.metodoPagos = data;
        console.log('✅ Métodos de pago cargados', data);
      },
      error: (err) => {
        console.error('❌ Error al cargar métodos de pago', err);
      }
    });
  }

  enviarSolicitud() {
    if (this.adquirirForm.invalid) {
      this.mensaje = 'Por favor complete todos los campos correctamente.';
      return;
    }

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
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('❌ Error al registrar cliente', err);
        this.mensaje = 'Hubo un problema al adquirir la membresía.';
      }
    });
  }

  }



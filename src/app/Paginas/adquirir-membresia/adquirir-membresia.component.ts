import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ClienteService } from '../../interfaces/cliente.service';
import { PagoService } from '../../services/pagos.service';

@Component({
  selector: 'app-adquirir-membresia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './adquirir-membresia.component.html',
})
export class AdquirirMembresiaComponent implements OnInit {
  adquirirForm: FormGroup;
  metodoPagos: any[] = [];
  clases: any[] = [];
  tipoMembresiaId!: number;
  requiereClase: boolean = false;
  mensaje: string = '';
  enviando: boolean = false;
   precio: number = 0;
   nombreTipoMembresia: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private clienteService: ClienteService,
    private pagoService: PagoService
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
      idClase: [null], // se habilita solo si es necesario
    });
  }
tipo: any = null;

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.tipoMembresiaId = id;


    // 🔍 Detectar si requiere clase por tipo de nombre
   this.http.get<any>(`https://web-production-d581.up.railway.app/api/tipo_membresia/${id}`)
  .subscribe({
    next: (tipo) => {
       this.tipo = tipo;
      this.precio = tipo.Precio; // ✅ <-- AÑADE ESTO
      this.nombreTipoMembresia = tipo.NombreTipo || '';

    // Verificar si hay clases asociadas en el campo 'Clases'
this.requiereClase = tipo.Clases && tipo.Clases.length > 0;

      this.requiereClase = tipo.clasesIncluidas && tipo.clasesIncluidas.length > 0;

if (this.requiereClase) {
  this.clases = tipo.clasesIncluidas; // ✅ solo las clases permitidas por la membresía
}

    },
    error: () => this.mensaje = 'Error al obtener tipo de membresía.'
  });


    // Métodos de pago
    this.http
      .get<any[]>('https://web-production-d581.up.railway.app/api/metodos-pago')
      .subscribe({
        next: (data) => {
          const permitidos = ['Tarjeta', 'Transferencia', 'Pago en línea'];
          this.metodoPagos = data.filter(m => permitidos.includes(m.metodoPago));
        },
        error: () => this.mensaje = 'Error al cargar métodos de pago.',
      });
  }

 enviarSolicitud() {
  if (
    this.adquirirForm.invalid ||
    this.enviando ||
    (this.requiereClase && !this.adquirirForm.value.idClase)
  ) {
    this.mensaje = 'Por favor complete todos los campos requeridos.';
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
  ...(this.requiereClase && this.adquirirForm.value.idClase
    ? { idClase: +this.adquirirForm.value.idClase } // 👈 Aquí lo forzamos a número
    : {})
};

  this.clienteService.adquirirMembresia(datosCliente).subscribe({
    next: () => {
      const body: any = {
        email: datosCliente.correo,
        description: this.nombreTipoMembresia, // Por ejemplo: 'Disciplina'

        amount: this.precio, // ✅ Este campo es obligatorio para Stripe


      };
      console.log('Clase seleccionada:', this.adquirirForm.value.idClase);

      if (this.requiereClase) {
        body.idClase = this.adquirirForm.value.idClase;
      }

      console.log('Precio enviado a Stripe:', this.precio);

      this.http
        .post<{ url: string }>(
          'https://web-production-d581.up.railway.app/api/stripe/checkout',
          body
        )
        .subscribe({
          next: (resp) => {
            window.location.href = resp.url;
            this.enviando = false;
          },
          error: (err) => {
            console.error('❌ Error al redirigir a Stripe:', err);
            this.mensaje =
              'Hubo un problema al conectar con el sistema de pago.';
            this.enviando = false;
          },
        });
    },
    error: (err) => {
      this.mensaje =
        err?.error?.message || 'Hubo un problema al adquirir la membresía.';
      this.enviando = false;
      setTimeout(() => {
        this.mensaje = '';
      }, 5000);
    },
  });
}

}

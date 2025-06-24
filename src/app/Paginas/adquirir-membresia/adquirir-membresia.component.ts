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
  mensaje: string = '';
  enviando: boolean = false;

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
      idClase: [null],
    });
  }

  ngOnInit() {
    this.tipoMembresiaId = +this.route.snapshot.paramMap.get('id')!;

    // Cargar métodos de pago
    this.http
      .get<any[]>('https://web-production-d581.up.railway.app/api/metodos-pago')
      .subscribe({
        next: (data) => {
          const permitidos = ['Tarjeta', 'Transferencia', 'Pago en línea'];
          this.metodoPagos = data
            .filter((m) => permitidos.includes(m.metodoPago))
            .sort((a, b) => permitidos.indexOf(a.metodoPago) - permitidos.indexOf(b.metodoPago));

          if (this.tipoMembresiaId === 2 || this.tipoMembresiaId === 3) {
            this.adquirirForm.get('idClase')?.setValidators(Validators.required);
            this.adquirirForm.get('idClase')?.updateValueAndValidity();
          }
        },
        error: () => {
          this.mensaje = 'Error al cargar métodos de pago. Intente nuevamente.';
        },
      });

    // Cargar clases si aplica
    if (this.tipoMembresiaId === 2 || this.tipoMembresiaId === 3) {
      this.http
        .get<any[]>('https://web-production-d581.up.railway.app/api/clases')
        .subscribe({
          next: (data) => (this.clases = data),
          error: () => {
            this.mensaje = 'Error al cargar clases disponibles.';
          },
        });
    }
  }

  enviarSolicitud() {
    if (this.adquirirForm.invalid) {
      this.mensaje = 'Por favor complete todos los campos correctamente.';
      this.adquirirForm.markAllAsTouched();
      return;
    }
    if (this.enviando) return;

    this.enviando = true;
    this.mensaje = '';

    const datos = this.adquirirForm.value;

    const amount = this.tipoMembresiaId === 1 ? 15 : this.tipoMembresiaId === 2 ? 29 : 20;
    const description = this.tipoMembresiaId === 1 ? 'Básica' : this.tipoMembresiaId === 2 ? 'Gold' : 'Disciplina';

    this.pagoService.iniciarProcesoPago(
      datos.ci,
      this.tipoMembresiaId,
      amount,
      description,
      datos.correo,
      this.tipoMembresiaId === 2 || this.tipoMembresiaId === 3 ? datos.idClase : undefined
    );

    this.enviando = false;
  }
}

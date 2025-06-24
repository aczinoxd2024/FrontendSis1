import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MembresiaService } from '../../../../services/membresia.service';
import { MetodoPagoService } from '../../../../metodo-pago/metodo-pago.service';

@Component({
  selector: 'app-registrar-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-cliente.component.html',
})
export class RegistrarClienteComponent implements OnInit {

  clienteForm: FormGroup;
  membresias: any[] = []; // 📌 Membresías dinámicas
  metodosPago: any[] = []; // 📌 Métodos de pago dinámicos
  mensaje: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private membresiaService: MembresiaService,
    private metodoPagoService: MetodoPagoService
  ) {
    this.clienteForm = this.fb.group({
      ci: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      observacion: [''],
      correo: ['', [Validators.required, Validators.email]],
      tipoMembresia: ['', Validators.required],
      metodoPago: ['', Validators.required],
    });
  }

  ngOnInit() {
    // 📌 Cargar membresías
    this.membresiaService.obtenerMembresias().subscribe({
      next: (data) => {
        console.log('✅ Membresías recibidas:', data);
        this.membresias = data;
      },
      error: (err) => {
        console.error('❌ Error al obtener membresías:', err);
      }
    });

    // 📌 Cargar métodos de pago
    this.metodoPagoService.obtenerMetodosPago().subscribe({
      next: (data) => {
        console.log('✅ Métodos de Pago recibidos:', data);
        this.metodosPago = data;
      },
      error: (err) => {
        console.error('❌ Error al obtener métodos de pago:', err);
      }
    });
  }

  registrarCliente() {
    if (this.clienteForm.invalid) {
      this.mensaje = "Por favor complete todos los campos correctamente.";
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formValue = this.clienteForm.value;

    // 📌 Preparar objeto cliente para enviar → CORREGIDO con fecha en formato ISO
    const cliente = {
      ci: formValue.ci,
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      fechaNacimiento: new Date(formValue.fechaNacimiento).toISOString(), // 🔥 FORMATO CORRECTO ISO
      telefono: formValue.telefono,
      direccion: formValue.direccion,
      observacion: formValue.observacion,
      correo: formValue.correo,
      tipoMembresiaId: Number(formValue.tipoMembresia),
      metodoPagoId: Number(formValue.metodoPago),
    };

    console.log('📤 Cliente que se enviará al backend:', cliente);

    this.http.post('https://web-production-d581.up.railway.app/api/clientes', cliente, { headers })
      .subscribe({
        next: (res) => {
          console.log('✅ Cliente registrado:', res);
          this.mensaje = "Cliente registrado exitosamente!";
          this.clienteForm.reset();
        },
        error: (err) => {
          console.error('❌ Error al registrar cliente:', err);
          this.mensaje = "Error al registrar cliente. Verifique los datos.";
        }
      });
  }

}

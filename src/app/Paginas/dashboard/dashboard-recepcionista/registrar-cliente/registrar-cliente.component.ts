import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MembresiaService } from '../../../../services/menbresia.service';

@Component({
  selector: 'app-registrar-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-cliente.component.html',
})
export class RegistrarClienteComponent implements OnInit {

  clienteForm: FormGroup;
  membresias: any[] = []; // 📌 Ahora es dinámico, no es fijo
  mensaje: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private membresiaService: MembresiaService // 📌 Inyectamos el nuevo servicio
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
    });
  }

  // 📌 Se ejecuta cuando carga el componente
  ngOnInit() {
    this.membresiaService.obtenerMembresias().subscribe({
      next: (data) => {
        this.membresias = data;
      },
      error: (err) => {
        console.error('Error al obtener membresías:', err);
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

    // 📌 Preparamos el objeto para enviarlo correctamente
    const cliente = {
      ...this.clienteForm.value,
      tipoMembresiaId: this.clienteForm.value.tipoMembresia
    };


    // Eliminamos tipoMembresia porque solo se usó en el formulario
    delete cliente.tipoMembresia;

    this.http.post('http://localhost:3000/clientes', cliente, { headers })
      .subscribe({
        next: (res) => {
          this.mensaje = "Cliente registrado exitosamente!";
          this.clienteForm.reset();
        },
        error: (err) => {
          console.error(err);
          this.mensaje = "Error al registrar cliente. Verifique los datos.";
        }
      });
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClienteService } from '../../../../interfaces/cliente.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-actualizar-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // 👈 AÑADIDO
  templateUrl: './actualizar-cliente.component.html',
})
export class ActualizarClienteComponent {

  clienteForm: FormGroup;
  mensaje: string = '';
  ciBuscar: string = ''; // ✅ Este es el CI que vamos a buscar
  clienteCargado: boolean = false;

  ci: string = ''; // ✅ Este es el CI que se usará para actualizar (IMPORTANTE agregar esto)

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],     // ✅ Obligatorios una vez cargados
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
    });
  }

  buscarCliente() {
  if (!this.ciBuscar) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo requerido',
      text: 'Ingrese un CI para buscar.',
      confirmButtonColor: '#facc15'
    });
    return;
  }

      this.clienteService.obtenerClientePorCI(this.ciBuscar).subscribe({
    next: (cliente) => {
      this.clienteForm.patchValue({
        nombre: cliente.nombre || '',
        apellido: cliente.apellido || '',
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
      });

      this.ci = cliente.ci;
      this.clienteCargado = true;

      Swal.fire({
        icon: 'success',
        title: 'Cliente encontrado',
        text: 'Los datos se han cargado correctamente.',
        confirmButtonColor: '#10b981'
      });
    },
    error: (err) => {
      this.clienteCargado = false;

      Swal.fire({
        icon: 'error',
        title: 'Cliente no encontrado',
        text: 'No se encontró cliente con ese CI.',
        confirmButtonColor: '#ef4444'
      });
    }
  });
}

  actualizarCliente() {
  if (this.clienteForm.invalid) {
    Swal.fire({
      icon: 'warning',
      title: 'Formulario incompleto',
      text: 'Por favor complete todos los campos.',
      confirmButtonColor: '#facc15'
    });
    return;
  }

  this.clienteService.actualizarCliente(this.ci, this.clienteForm.value).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Cliente actualizado',
        text: '🎉 Cliente actualizado exitosamente.',
        confirmButtonColor: '#10b981'
      });
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: err?.error?.message || 'Error al actualizar cliente.',
        confirmButtonColor: '#ef4444'
      });
    }
  });
}
}

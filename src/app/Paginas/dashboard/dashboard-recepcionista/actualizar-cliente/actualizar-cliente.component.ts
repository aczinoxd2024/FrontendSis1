import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClienteService } from '../../../../interfaces/cliente.service';
import { CommonModule } from '@angular/common';


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
      this.mensaje = 'Ingrese un CI para buscar.';
      return;
    }

    this.clienteService.obtenerClientePorCI(this.ciBuscar).subscribe({
      next: (cliente) => {
        console.log('✅ Cliente encontrado:', cliente);
        this.clienteForm.patchValue({
          nombre: cliente.nombre || '',
          apellido: cliente.apellido || '',
          telefono: cliente.telefono || '',
          direccion: cliente.direccion || '',
        });

        this.ci = cliente.ci; // ✅ Guardamos el CI para usar al actualizar
        this.clienteCargado = true;
        this.mensaje = '';
      },
      error: (err) => {
        console.error('❌ Error al cargar cliente:', err);
        this.mensaje = 'No se encontró cliente con ese CI.';
        this.clienteCargado = false;
      }
    });
  }

  actualizarCliente() {
    if (this.clienteForm.invalid) {
      this.mensaje = 'Por favor complete todos los campos.';
      return;
    }

    this.clienteService.actualizarCliente(this.ci, this.clienteForm.value).subscribe({
      next: (res) => {
        console.log('✅ Cliente actualizado:', res);
        this.mensaje = '🎉 Cliente actualizado exitosamente.';
      },
      error: (err) => {
        console.error('❌ Error al actualizar cliente:', err);
        this.mensaje = err?.error?.message || 'Error al actualizar cliente.';
      }
    });
  }
}

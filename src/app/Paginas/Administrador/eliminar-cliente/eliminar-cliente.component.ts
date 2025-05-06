import { Component } from '@angular/core';
import { ClienteService } from '../../../interfaces/cliente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eliminar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eliminar-cliente.component.html',
})
export class EliminarClienteComponent {

  ciBuscar: string = '';
  cliente: any = null;
  mensaje: string = '';
  estadoClienteId: number | null = null;
  cargando: boolean = false; // ✅ NUEVO - Para mostrar loading mientras elimina

  constructor(private clienteService: ClienteService, private router: Router) {}

  // 👉 Buscar cliente por CI
  buscarCliente() {
    if (!this.ciBuscar.trim()) {
      this.mensaje = 'Debe ingresar un CI para buscar.';
      return;
    }

    this.cargando = true;
    this.clienteService.obtenerClientePorCI(this.ciBuscar).subscribe({
      next: (cliente) => {
        this.cargando = false;
        // 👇 Aquí transformamos el estado numérico a texto
        this.cliente = {
          ...cliente,
          estado: cliente.estado === 2 ? 'Inactivo' : 'Activo'
        };

        this.mensaje = '';
      },
      error: () => {
        this.cargando = false;
        this.cliente = null;
        this.mensaje = '❌ Cliente no encontrado.';
      }
    });
  }


  // 👉 Eliminar cliente
  eliminarCliente() {
    if (this.estadoClienteId === 2) {
      this.mensaje = '❌ Este cliente ya está eliminado (inactivo).';
      return;
    }

    if (!confirm('⚠️ ¿Está seguro que desea eliminar (desactivar) este cliente?')) return;

    this.cargando = true; // ✅ Iniciar loading

    this.clienteService.eliminarCliente(this.ciBuscar).subscribe({
      next: () => {
        this.mensaje = '✅ Cliente eliminado exitosamente.';
        this.ciBuscar = '';
        this.cliente = null;
        this.estadoClienteId = this.cliente.estado;
        this.cargando = false;
      },
      error: () => {
        this.mensaje = '❌ Error al eliminar cliente.';
        this.cargando = false;
      }
    });
  }
}

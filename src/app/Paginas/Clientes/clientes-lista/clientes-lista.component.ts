import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../../interfaces/cliente.service';
import { Cliente } from '../../../interfaces/cliente';

interface ClienteConDetalles extends Cliente {
  mostrarDetalles: boolean;
}

@Component({
  selector: 'app-clientes-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes-lista.component.html',
})
export class ClientesListaComponent implements OnInit {

  clientes: ClienteConDetalles[] = [];
  cargando: boolean = true;
  error: string = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes(): void {
    this.clienteService.obtenerClientes().subscribe({
      next: (data) => {
        this.clientes = data.map(cliente => ({
          ...cliente,
          mostrarDetalles: false
        }));
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener clientes', err);
        this.error = 'No se pudieron cargar los clientes';
        this.cargando = false;
      }
    });
  }

  toggleDetalles(index: number): void {
    this.clientes[index].mostrarDetalles = !this.clientes[index].mostrarDetalles;
  }
  getEstadoClase(estado: string): string {
    switch (estado) {
      case 'Activo':
        return 'text-green-600 font-bold';
      case 'Inactivo':
        return 'text-red-600 font-bold';
      case 'Suspendido':
        return 'text-yellow-500 font-bold';
      case 'Pendiente':
        return 'text-blue-600 font-bold';
      case 'Cancelado':
        return 'text-gray-500 font-bold';
      default:
        return 'text-gray-400';
    }
  }

}
  // ✅ Nuevo método para retornar la clase (color) según el estado

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- 🔑 IMPORTANTE
import { ClienteService } from '../../../interfaces/cliente.service';
import { Cliente } from '../../../interfaces/cliente';

interface ClienteConDetalles extends Cliente {
  mostrarDetalles: boolean;
}

@Component({
  selector: 'app-clientes-lista',
  standalone: true, // <-- 🔑 Esto ya lo debes tener por loadComponent
  imports: [CommonModule], // <-- 🔑 AQUÍ IMPORTAS CommonModule
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
  getEstadoTexto(estado: any): string {
    switch (+estado) {
      case 1:
        return 'Activo';
      case 2:
        return 'Inactivo';
      case 3:
        return 'Suspendido';
      case 4:
        return 'Pendiente';
      case 5:
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  }



}

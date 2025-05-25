import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../../services/reserva.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-reservas-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-reservas-cliente.component.html',
})
export class MisReservasClienteComponent implements OnInit {
  reservas: any[] = [];
  estadoFiltro: string = '';

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservaService.getMisReservas().subscribe({
      next: (res: any[]) => {
        this.reservas = res;

        if (this.reservas.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin reservas',
            text: 'No tienes reservas activas ni pasadas.',
            confirmButtonColor: '#3b82f6'
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar tus reservas.',
          confirmButtonColor: '#ef4444'
        });
      },
    });
  }

  cancelarReserva(idReserva: number): void {
    Swal.fire({
      title: '¿Cancelar reserva?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, volver',
      confirmButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservaService.cancelarReserva(idReserva).subscribe({
          next: (res: any) => {
            this.cargarReservas();
            Swal.fire({
              icon: 'success',
              title: 'Reserva cancelada',
              text: res.message || 'La reserva fue cancelada correctamente.',
              confirmButtonColor: '#10b981'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo cancelar la reserva.',
              confirmButtonColor: '#ef4444'
            });
          },
        });
      }
    });
  }

  get reservasFiltradas() {
    if (!this.estadoFiltro) return this.reservas;
    return this.reservas.filter(r => r.estado?.Estado === this.estadoFiltro);
  }
}

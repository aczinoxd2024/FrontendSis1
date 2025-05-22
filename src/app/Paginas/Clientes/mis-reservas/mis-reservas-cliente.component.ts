import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../../services/reserva.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-reservas-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-reservas-cliente.component.html',
})
export class MisReservasClienteComponent implements OnInit {
  reservas: any[] = [];
  estadoFiltro: string = '';

  constructor(
    private reservaService: ReservaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservaService.getMisReservas().subscribe({
      next: (res: any[]) => {
        this.reservas = res;
      },
      error: () => {
        this.toastr.error('Error al cargar reservas');
      },
    });
  }

  cancelarReserva(idReserva: number): void {
    this.reservaService.cancelarReserva(idReserva).subscribe({
      next: (res: any) => {
        console.log('Respuesta del backend:', res); // ✅ Para depurar si lo deseas
        this.toastr.success(res.message || 'Reserva cancelada');
        this.cargarReservas();
      },
      error: () => {
        this.toastr.error('No se pudo cancelar la reserva');
      },
    });
  }

  get reservasFiltradas() {
    if (!this.estadoFiltro) return this.reservas;
    return this.reservas.filter(r => r.estado?.Estado === this.estadoFiltro);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../../services/reserva.service';

@Component({
  selector: 'app-historial-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.component.html'
})
export class HistorialReservasComponent implements OnInit {
  reservas: any[] = [];
  fechaInicio?: string;
  fechaFin?: string;
  estado?: string;

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservaService.getReservasPasadas(this.fechaInicio, this.fechaFin).subscribe({
      next: (res) => {
        this.reservas = res;
      }
    });
  }

  limpiarFiltros(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.estado = '';
    this.cargarReservas();
  }
}

import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../services/reserva.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Reserva {
  clase?: { Nombre: string };
  horario?: { HoraIni: string, HoraFin: string };
  FechaReserva?: string;
  estado?: { Estado: string };
  estadoAsistencia?: string;
}

@Component({
  selector: 'app-reservas-historico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas-historico.component.html',
})
export class ReservasHistoricoComponent implements OnInit {
  reservas: Reserva[] = [];
  fechaInicio?: string;
  fechaFin?: string;
  estadoSeleccionado: string = '';

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservaService.getReservasPasadas(this.fechaInicio, this.fechaFin).subscribe({
      next: (response: any) => {
        const data: Reserva[] = response?.data || response || [];
        let filtradas = data.filter(r => !!r && !!r.horario && !!r.clase);

        if (this.estadoSeleccionado) {
          filtradas = filtradas.filter(r => r.estado?.Estado === this.estadoSeleccionado);
        }

        this.reservas = filtradas;
      },
      error: (err) => console.error('Error al cargar reservas', err)
    });
  }

  limpiarFiltros(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.estadoSeleccionado = '';
    this.cargarReservas();
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../../services/reserva.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // 👈 importación correcta

@Component({
  selector: 'app-agenda-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ReservaService],
  templateUrl: './agenda-reservas.component.html'
})
export class AgendaReservasComponent implements OnInit {
  reservas: any[] = [];
  reservasAgrupadas: any[] = [];
  ciCliente: string = '';
  estadoFiltro: string = '';
  fechaInicio?: string;
  fechaFin?: string;

  paginasPorClase: { [clase: string]: number } = {};
  itemsPorPagina = 5;

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.buscarReservas();
  }

  buscarReservas(): void {
    this.reservaService
      .getReservasFiltradas(this.ciCliente, this.estadoFiltro, this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (res: any[]) => {
          this.reservas = res;
          this.agruparReservasPorClase();
        },
        error: (err: any) => {
          console.error('Error al obtener reservas', err);
        }
      });
  }

  limpiarFiltros(): void {
    this.ciCliente = '';
    this.estadoFiltro = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.buscarReservas();
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Agenda de Reservas', 14, 20);

    let finalY = 30;

    this.reservasAgrupadas.forEach((grupo) => {
      doc.setFontSize(14);
      doc.text(`Clase: ${grupo.clase}`, 14, finalY);

      const tableResult: any = autoTable(doc, {
        startY: finalY + 5,
        head: [['CI Cliente', 'Horario', 'Estado']],
        body: grupo.items.map((r: any) => [
          r.cliente?.CI || '',
          `${r.horario?.HoraIni || '-'} - ${r.horario?.HoraFin || '-'}`,
          r.estado?.Estado || '',
        ]),
        theme: 'grid',
        styles: {
          fontSize: 10,
        },
      });

      finalY = tableResult?.finalY ? tableResult.finalY + 10 : finalY + 30; // fallback si no devuelve
    });

    doc.save('agenda_reservas.pdf');
  }

  cancelarReserva(idReserva: number): void {
    if (confirm('¿Estás seguro de cancelar esta reserva?')) {
      this.reservaService.cancelarReserva(idReserva).subscribe(() => {
        this.buscarReservas();
      });
    }
  }

  agruparReservasPorClase(): void {
    const grupos: { [clase: string]: any[] } = {};

    this.reservas.forEach((r) => {
      const nombreClase = r.clase?.Nombre || 'Clase sin nombre';
      if (!grupos[nombreClase]) {
        grupos[nombreClase] = [];
        this.paginasPorClase[nombreClase] = 1;
      }
      grupos[nombreClase].push(r);
    });

    this.reservasAgrupadas = Object.keys(grupos).map((clase) => ({
      clase,
      items: grupos[clase],
    }));
  }

  anteriorPagina(clase: string): void {
    if (this.paginasPorClase[clase] > 1) {
      this.paginasPorClase[clase]--;
    }
  }

  siguientePagina(clase: string, totalItems: number): void {
    const maxPaginas = Math.ceil(totalItems / this.itemsPorPagina);
    if (this.paginasPorClase[clase] < maxPaginas) {
      this.paginasPorClase[clase]++;
    }
  }
}

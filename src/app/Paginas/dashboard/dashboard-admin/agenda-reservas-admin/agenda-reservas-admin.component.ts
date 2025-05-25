// agenda-reservas-admin.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../../../services/reserva.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agenda-reservas-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda-reservas-admin.component.html',
})
export class AgendaReservasAdminComponent implements OnInit {
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
    // No buscar automáticamente
  }

  buscarReservas(): void {
    this.reservaService.getReservasFiltradas(this.ciCliente, this.estadoFiltro, this.fechaInicio, this.fechaFin).subscribe({
      next: (res: any[]) => {
        this.reservas = res;
        this.agruparReservasPorClase();
      },
      error: (err: any) => {
        console.error('Error al obtener reservas', err);
        Swal.fire('Error', 'No se pudieron cargar las reservas', 'error');
      },
    });
  }

  limpiarFiltros(): void {
    this.ciCliente = '';
    this.estadoFiltro = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.reservas = [];
    this.reservasAgrupadas = [];
  }

exportarPDF(): void {
  if (this.reservasAgrupadas.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Sin reservas',
      text: 'No hay reservas para exportar en este momento.',
      confirmButtonColor: '#3b82f6'
    });
    return;
  }

  const doc = new jsPDF();
  const fechaActual = new Date();

  // 🟢 Título principal
  doc.setFontSize(18);
  doc.text('Agenda de Reservas', 14, 20);

  // 📅 Fecha de exportación
  const fechaTexto = fechaActual.toLocaleString('es-BO', {
    dateStyle: 'long',
    timeStyle: 'short'
  });
  doc.setFontSize(11);
  doc.text(`Exportado: ${fechaTexto}`, 14, 28);

  let finalY = 40;

  this.reservasAgrupadas.forEach((grupo) => {
    doc.setFontSize(14);
    doc.text(`Clase: ${grupo.clase}`, 14, finalY);

    autoTable(doc, {
      startY: finalY + 6,
      head: [['CI Cliente', 'Horario', 'Estado']],
      body: grupo.items.map((r: any) => [
        r.cliente?.CI || '',
        `${r.horario?.HoraIni || '-'} - ${r.horario?.HoraFin || '-'}`,
        r.estado?.Estado || '',
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [26, 188, 156] }
    });

    finalY = (doc as any).lastAutoTable?.finalY + 10 || finalY + 30;
  });

  // ✍️ Firma final
  doc.setFontSize(10);
  doc.text('Oficinas-GoFit Gym', 14, finalY + 10);

  // 📄 Nombre de archivo dinámico
  const fechaNombre = fechaActual.toISOString().split('T')[0]; // yyyy-mm-dd
  const nombreArchivo = `agenda_reservas_${fechaNombre}.pdf`;

  doc.save(nombreArchivo);

  Swal.fire({
    icon: 'success',
    title: '¡Exportación exitosa!',
    text: `📄 El archivo "${nombreArchivo}" fue generado correctamente.`,
    confirmButtonColor: '#16a34a'
  });
}


  cancelarReserva(idReserva: number): void {
    Swal.fire({
      title: '¿Cancelar reserva?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservaService.cancelarReserva(idReserva).subscribe(() => {
          this.buscarReservas();
          Swal.fire('Cancelada', 'La reserva fue cancelada.', 'success');
        });
      }
    });
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

  calcularInicio(clase: string): number {
    return (this.paginasPorClase[clase] - 1) * this.itemsPorPagina;
  }

  calcularFin(clase: string): number {
    return this.paginasPorClase[clase] * this.itemsPorPagina;
  }
}

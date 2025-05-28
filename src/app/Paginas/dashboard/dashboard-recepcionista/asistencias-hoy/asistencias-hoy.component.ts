import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaService } from '../../../../services/asistencia.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-asistencias-hoy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistencias-hoy.component.html',
  styleUrls: [],
})
export class AsistenciasHoyComponent {
  asistencias: any[] = [];
  asistenciasFiltradas: any[] = [];
  filtroCliente = '';
  paginaActual = 1;
  elementosPorPagina = 10;

  constructor(private asistenciaService: AsistenciaService) {
    this.cargarAsistenciasHoy();
  }

  cargarAsistenciasHoy() {
    this.asistenciaService
      .obtenerAsistenciasDelDia()
      .pipe(
        catchError((err) => {
          console.error('Error al cargar asistencias del día:', err);
          return of([]);
        })
      )
      .subscribe((data) => {
        console.log('Asistencias del día recibidas:', data);
        this.asistencias = data;
        this.aplicarFiltros();
      });
  }

  aplicarFiltros() {
    const clienteLower = this.filtroCliente.toLowerCase();
    this.asistenciasFiltradas = this.asistencias.filter((asistencia) => {
      const nombre = `${asistencia.persona?.Nombre ?? ''} ${
        asistencia.persona?.Apellido ?? ''
      }`.toLowerCase();
      return nombre.includes(clienteLower);
    });
  }

  obtenerAsistenciasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    return this.asistenciasFiltradas.slice(
      inicio,
      inicio + this.elementosPorPagina
    );
  }

  totalPaginas(): number {
    return Math.ceil(
      this.asistenciasFiltradas.length / this.elementosPorPagina
    );
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
  }

  exportarPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Asistencias del Día', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['#', 'Nombre Cliente', 'Fecha', 'Hora Entrada']],
      body: this.asistenciasFiltradas.map((a: any, i: number) => [
        i + 1,
        `${a.persona?.Nombre || ''} ${a.persona?.Apellido || ''}`,
        a.fecha ? new Date(a.fecha).toLocaleDateString() : '',
        a.horaEntrada || '',
      ]),
      theme: 'grid',
    });
    doc.save('asistencias_dia.pdf');
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaService } from '../../../services/asistencia.service';
import { PersonalService } from '../../../services/personal.service';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-asistencias-generales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistencias-generales.component.html',
  styleUrls: []
})
export class AsistenciasGeneralesComponent {
  asistencias: any[] = [];
  asistenciasFiltradas: any[] = [];
  error = '';

  // Filtros clientes
  filtroCliente = '';
  filtroFecha = '';
  paginaActual = 1;
  elementosPorPagina = 10;

  // Filtros personal
  asistenciasPersonal: any[] = [];
  asistenciasPersonalFiltradas: any[] = [];
  filtroPersonal = '';
  filtroFechaPersonal = '';
  paginaActualPersonal = 1;

  constructor(
    private asistenciaService: AsistenciaService,
    private personalService: PersonalService,
    private http: HttpClient
  ) {
    this.cargarAsistencias();
    this.cargarAsistenciasPersonal();
  }

  // CLIENTES
  cargarAsistencias() {
    this.asistenciaService.obtenerHistorialConFechas().pipe(
      catchError(err => {
        this.error = 'Error al cargar las asistencias';
        console.error('Error en obtenerHistorialConFechas:', err);
        return of([]);
      })
    ).subscribe(data => {
      this.asistencias = data;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    this.paginaActual = 1;
    const clienteLower = this.filtroCliente.toLowerCase();
    this.asistenciasFiltradas = this.asistencias.filter(asistencia => {
      const nombreCompleto = `${asistencia.persona?.Nombre ?? ''} ${asistencia.persona?.Apellido ?? ''}`.toLowerCase();
      const fechaISO = new Date(asistencia.fecha).toISOString().split('T')[0];
      return (!this.filtroFecha || fechaISO.startsWith(this.filtroFecha)) &&
             nombreCompleto.includes(clienteLower);
    });
  }

  obtenerAsistenciasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    return this.asistenciasFiltradas.slice(inicio, inicio + this.elementosPorPagina);
  }

  totalPaginas(): number {
    return Math.ceil(this.asistenciasFiltradas.length / this.elementosPorPagina);
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Historial de Asistencias', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['#', 'Nombre Cliente', 'Fecha', 'Hora Entrada']],
      body: this.asistenciasFiltradas.map((a, i) => [
        i + 1,
        `${a.persona?.Nombre || ''} ${a.persona?.Apellido || ''}`,
        new Date(a.fecha).toLocaleDateString(),
        a.horaEntrada || '',
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
    });
    doc.save('historial_asistencias.pdf');
  }

  exportarExcel(): void {
    const data = this.asistenciasFiltradas.map((a, i) => ({
      '#': i + 1,
      'Nombre Cliente': `${a.persona?.Nombre || ''} ${a.persona?.Apellido || ''}`,
      'Fecha': new Date(a.fecha).toLocaleDateString(),
      'Hora Entrada': a.horaEntrada || '',
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { 'Asistencias': worksheet }, SheetNames: ['Asistencias'] };
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'historial_asistencias.xlsx');
  }

  // PERSONAL
  cargarAsistenciasPersonal() {
    this.personalService.obtenerHistorialPersonal().pipe(
      catchError(err => {
        console.error('Error al cargar asistencia del personal:', err);
        return of([]);
      })
    ).subscribe(data => {
      this.asistenciasPersonal = data;
      this.aplicarFiltrosPersonal();
    });
  }

  aplicarFiltrosPersonal() {
    this.paginaActualPersonal = 1;
    const texto = this.filtroPersonal.toLowerCase();
    this.asistenciasPersonalFiltradas = this.asistenciasPersonal.filter(asistencia => {
      const nombre = `${asistencia.persona?.Nombre ?? ''} ${asistencia.persona?.Apellido ?? ''}`.toLowerCase();
      const ci = asistencia.ci?.toLowerCase() ?? '';
      const fechaISO = new Date(asistencia.fecha).toISOString().split('T')[0];
      return (!this.filtroFechaPersonal || fechaISO.startsWith(this.filtroFechaPersonal)) &&
             (nombre.includes(texto) || ci.includes(texto));
    });
  }

  obtenerAsistenciasPersonalPaginadas() {
    const inicio = (this.paginaActualPersonal - 1) * this.elementosPorPagina;
    return this.asistenciasPersonalFiltradas.slice(inicio, inicio + this.elementosPorPagina);
  }

  totalPaginasPersonal(): number {
    return Math.ceil(this.asistenciasPersonalFiltradas.length / this.elementosPorPagina);
  }

  cambiarPaginaPersonal(pagina: number) {
    this.paginaActualPersonal = pagina;
  }

exportarPDFPersonal(): void {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Asistencia del Personal', 14, 20);
  autoTable(doc, {
    startY: 30,
    head: [['#', 'CI', 'Nombre', 'Fecha', 'Hora Entrada', 'Hora Salida', 'Estado', 'Registrado por']],
    body: this.asistenciasPersonalFiltradas.map((a, i) => [
      i + 1,
      a.ci || '',
      `${a.persona?.Nombre || ''} ${a.persona?.Apellido || ''}`,
      new Date(a.fecha).toLocaleDateString(),
      a.horaEntrada || '-',
      a.horaSalida || '-',
      a.estado || '-',
      `${a.responsable?.idPersona?.Nombre || ''} ${a.responsable?.idPersona?.Apellido || ''}`
    ]),
    theme: 'grid',
    styles: { fontSize: 10 },
  });
  doc.save('asistencia_personal.pdf');
}


  exportarExcelPersonal(): void {
  const data = this.asistenciasPersonalFiltradas.map((a, i) => ({
    '#': i + 1,
    'CI': a.ci || '',
    'Nombre': `${a.persona?.Nombre || ''} ${a.persona?.Apellido || ''}`,
    'Fecha': new Date(a.fecha).toLocaleDateString(),
    'Hora Entrada': a.horaEntrada || '-',
    'Hora Salida': a.horaSalida || '-',
    'Estado': a.estado || '-',
    'Registrado por': `${a.responsable?.idPersona?.Nombre || ''} ${a.responsable?.idPersona?.Apellido || ''}`
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = { Sheets: { 'Asistencias': worksheet }, SheetNames: ['Asistencias'] };
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'asistencia_personal.xlsx');
}

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaService } from '../../../services/asistencia.service';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient} from '@angular/common/http';
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

  // Filtros
  filtroCliente = '';
  filtroFecha = '';

  // Paginación
  paginaActual = 1;
  elementosPorPagina = 10;

  constructor(
    private asistenciaService: AsistenciaService,
    private http: HttpClient
  ) {
    this.cargarAsistencias();
  }

  cargarAsistencias() {
    this.asistenciaService.obtenerHistorialConFechas().pipe(
      catchError(err => {
        this.error = 'Error al cargar las asistencias';
        console.error('Error en obtenerHistorialConFechas:', err);
        return of([]);
      })
    ).subscribe(data => {
  console.log('Asistencias recibidas:', data);
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

    const fechaCoincide = this.filtroFecha ? fechaISO.startsWith(this.filtroFecha) : true;
    const clienteCoincide = nombreCompleto.includes(clienteLower);

    return fechaCoincide && clienteCoincide;
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

  let finalY = 30;

  // Suponiendo que 'asistencias' es tu array cargado con datos
  // Aquí construimos la tabla para el PDF:
  autoTable(doc, {
    startY: finalY,
    head: [['#', 'Nombre Cliente', 'Fecha', 'Hora Entrada']],
    body:this.asistenciasFiltradas.map((a: any, i: number) => [
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
  const data = this.asistencias.map((a: any, i: number) => ({
    '#': i + 1,
    'Nombre Cliente': `${a.persona?.Nombre || ''} ${a.persona?.Apellido || ''}`,
    'Fecha': new Date(a.fecha).toLocaleDateString(),
    'Hora Entrada': a.horaEntrada || '',
  }));

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: XLSX.WorkBook = { Sheets: { 'Asistencias': worksheet }, SheetNames: ['Asistencias'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  FileSaver.saveAs(blob, 'historial_asistencias.xlsx');
}
}

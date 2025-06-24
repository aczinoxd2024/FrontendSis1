import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-asistencias-estadisticas',
  standalone: true,
  imports: [NgxChartsModule, FormsModule],
  templateUrl: './asistencias-estadisticas.component.html'
})
export class AsistenciasEstadisticasComponent implements OnInit {
  asistencias: any[] = [];
  chartData: any[] = [];
  view: [number, number] = [window.innerWidth < 768 ? 300 : 700, 400];

  filtroCargo: string = 'instructor';
  fechaInicio: string = '';
  fechaFin: string = '';

  @ViewChild('graficoRef', { static: false }) graficoRef!: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    this.fechaInicio = inicio.toISOString().split('T')[0];
    this.fechaFin = fin.toISOString().split('T')[0];

    this.cargarDatos();

    window.addEventListener('resize', () => {
      this.view = [window.innerWidth < 768 ? 300 : 700, 400];
    });
  }

  cargarDatos(): void {
    const params = new HttpParams()
      .set('cargo', this.filtroCargo)
      .set('inicio', this.fechaInicio)
      .set('fin', this.fechaFin);

    this.http.get<any[]>('https://web-production-d581.up.railway.app/api/reportes/asistencias-personal', { params })
      .subscribe(data => {
        this.asistencias = data;
        this.actualizarGrafico();
      });
  }

  actualizarGrafico(): void {
    const resumen: { [key: string]: number } = {};

    this.asistencias.forEach(a => {
      const nombre = `${a.persona?.Nombre || ''} ${a.persona?.Apellido || ''}`;
      resumen[nombre] = (resumen[nombre] || 0) + 1;
    });

    this.chartData = Object.keys(resumen).map(nombre => ({
      name: nombre,
      value: resumen[nombre]
    })).sort((a, b) => b.value - a.value);
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    const cargo = this.filtroCargo || 'Todos';
    const fechaInicio = this.fechaInicio || 'sin filtro';
    const fechaFin = this.fechaFin || 'sin filtro';

    doc.text(`Reporte de Asistencias por Personal`, 14, 10);
    doc.text(`Cargo: ${cargo}`, 14, 18);
    doc.text(`Desde: ${fechaInicio}  Hasta: ${fechaFin}`, 14, 26);

    autoTable(doc, {
      head: [['Nombre', 'Asistencias']],
      body: this.chartData.map(item => [item.name, item.value]),
      startY: 32,
    });

    const nombreArchivo = `reporte-asistencias-${cargo.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    doc.save(nombreArchivo);
  }

  exportarExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    const cargo = this.filtroCargo || 'Todos';
    const fechaInicio = this.fechaInicio || 'sin filtro';
    const fechaFin = this.fechaFin || 'sin filtro';

    worksheet.addRow(['Reporte de Asistencias por Personal']);
    worksheet.addRow([`Cargo: ${cargo}`]);
    worksheet.addRow([`Desde: ${fechaInicio}`, `Hasta: ${fechaFin}`]);
    worksheet.addRow([]);

    worksheet.addRow(['Nombre', 'Asistencias']);
    worksheet.getRow(5).font = { bold: true };

    this.chartData.forEach(item => {
      worksheet.addRow([item.name, item.value]);
    });

    const nombreArchivo = `reporte-asistencias-${cargo.toLowerCase().replace(/\s+/g, '-')}.xlsx`;
    workbook.xlsx.writeBuffer().then(buffer => {
      saveAs(new Blob([buffer]), nombreArchivo);
    });
  }
}

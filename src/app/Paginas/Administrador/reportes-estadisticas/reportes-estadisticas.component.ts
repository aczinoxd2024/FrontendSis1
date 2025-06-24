import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-reportes-estadisticas',
  standalone: true,
  imports: [NgxChartsModule, FormsModule],
  templateUrl: './reportes-estadisticas.component.html'
})
export class ReportesEstadisticasComponent implements OnInit {
  reservas: any[] = [];
  chartData: any[] = [];
  view: [number, number] = [window.innerWidth < 768 ? 300 : 700, 400];

  filtroEstado: string = 'Todas';
  fechaInicio: string = '';
  fechaFin: string = '';
  tipoGrafico: string = 'barra';
@ViewChild('graficoRef', { static: false }) graficoRef!: ElementRef;


  constructor(private http: HttpClient,


  ) {}

  ngOnInit(): void {
    this.cargarDatos();
     window.addEventListener('resize', () => {
  this.view = [window.innerWidth < 768 ? 300 : 700, 400];
});
  }

  cargarDatos(): void {
    this.http.get<any[]>('https://web-production-d581.up.railway.app/api/reportes/reservas/clases')
      .subscribe(data => {
        this.reservas = data;
        this.actualizarGrafico();
      });
  }




  actualizarGrafico(): void {
    let datos = [...this.reservas];

    // 🧪 Filtro por estado
    if (this.filtroEstado !== 'Todas') {
      datos = datos.filter(r => r.Estado === this.filtroEstado);
    }

    // 📅 Filtro por fechas
    if (this.fechaInicio) {
      datos = datos.filter(r => new Date(r.FechaReserva) >= new Date(this.fechaInicio));
    }
    if (this.fechaFin) {
      datos = datos.filter(r => new Date(r.FechaReserva) <= new Date(this.fechaFin));
    }

    this.chartData = this.transformarDatos(datos);
  }

  transformarDatos(reservas: any[]) {
    const counts: { [key: string]: number } = {};

    reservas.forEach(r => {
      const clase = r.Clase || 'Sin clase';
      counts[clase] = (counts[clase] || 0) + 1;
    });

    return Object.keys(counts)
      .map(clase => ({ name: clase, value: counts[clase] }))
      .sort((a, b) => b.value - a.value);
  }

exportarPDF(): void {
  const doc = new jsPDF();

  // título dinámico
  const estado = this.filtroEstado !== 'Todas' ? this.filtroEstado : 'Todos los estados';
  const fechaInicio = this.fechaInicio ? this.fechaInicio : 'sin filtro';
  const fechaFin = this.fechaFin ? this.fechaFin : 'sin filtro';

  doc.text(`Reporte de Reservas por Clase`, 14, 10);
  doc.text(`Estado: ${estado}`, 14, 18);
  doc.text(`Desde: ${fechaInicio}  Hasta: ${fechaFin}`, 14, 26);

  autoTable(doc, {
    head: [['Clase', 'Reservas']],
    body: this.chartData.map((item) => [item.name, item.value]),
    startY: 32,
  });

  const nombreArchivo = `reporte-reservas-${estado.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  doc.save(nombreArchivo);
}

exportarExcel(): void {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reporte');

  // Encabezado personalizado
  const estado = this.filtroEstado !== 'Todas' ? this.filtroEstado : 'Todos los estados';
  const fechaInicio = this.fechaInicio || 'sin filtro';
  const fechaFin = this.fechaFin || 'sin filtro';

  worksheet.addRow(['Reporte de Reservas por Clase']);
  worksheet.addRow([`Estado: ${estado}`]);
  worksheet.addRow([`Desde: ${fechaInicio}`, `Hasta: ${fechaFin}`]);
  worksheet.addRow([]); // fila vacía

  //  Tabla
  worksheet.addRow(['Clase', 'Reservas']);
  worksheet.getRow(5).font = { bold: true };

  this.chartData.forEach((item) => {
    worksheet.addRow([item.name, item.value]);
  });

  const nombreArchivo = `reporte-reservas-${estado.toLowerCase().replace(/\s+/g, '-')}.xlsx`;

  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(new Blob([buffer]), nombreArchivo);
  });
}


}



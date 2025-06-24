import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-pagos-estadisticas',
  standalone: true,
  imports: [NgxChartsModule, FormsModule],
  templateUrl: './pagos-estadisticas.component.html'
})
export class PagosEstadisticasComponent implements OnInit {
  pagos: any[] = [];
  chartData: any[] = [];
  view: [number, number] = [window.innerWidth < 768 ? 300 : 700, 400];

  filtroMembresia: string = '';
  filtroPromocion: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  @ViewChild('graficoRef', { static: false }) graficoRef!: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarDatos();
    window.addEventListener('resize', () => {
      this.view = [window.innerWidth < 768 ? 300 : 700, 400];
    });
  }

  cargarDatos(): void {
    const params = new HttpParams()
      .set('membresia', this.filtroMembresia || '')
      .set('promocion', this.filtroPromocion || '')
      .set('inicio', this.fechaInicio || '')
      .set('fin', this.fechaFin || '');

    this.http.get<any[]>('https://web-production-d581.up.railway.app/api/reportes/pagos', { params })
      .subscribe(data => {
        this.pagos = data || [];
        this.actualizarGrafico();
      });
  }

  actualizarGrafico(): void {
    const agrupado: { [key: string]: { total: number; cantidad: number } } = {};

    this.pagos.forEach(p => {
      const tipo = p.tipoMembresia || 'Sin tipo';
      const monto = parseFloat(p.monto) || 0;
      if (!agrupado[tipo]) {
        agrupado[tipo] = { total: 0, cantidad: 0 };
      }
      agrupado[tipo].total += monto;
      agrupado[tipo].cantidad += 1;
    });

    this.chartData = Object.entries(agrupado)
      .map(([tipo, info]) => ({
        name: `${tipo} (${info.cantidad} membresía${info.cantidad > 1 ? 's' : ''})`,
        value: info.total
      }))
      .sort((a, b) => b.value - a.value);
  }

  exportarPDF(): void {
    const doc = new jsPDF();

    const m = this.filtroMembresia || 'Todas';
    const p = this.filtroPromocion || 'Todas';
    const fi = this.fechaInicio || 'sin filtro';
    const ff = this.fechaFin || 'sin filtro';

    doc.text(`Reporte de Ganancias por Membresía`, 14, 10);
    doc.text(`Membresía: ${m} | Promoción: ${p}`, 14, 18);
    doc.text(`Desde: ${fi}  Hasta: ${ff}`, 14, 26);

    autoTable(doc, {
      head: [['Membresía (cantidad)', 'Ganancia $']],
      body: this.chartData.map(item => [item.name, item.value.toFixed(2)]),
      startY: 32,
    });

    doc.save(`ganancias-${m.toLowerCase()}.pdf`);
  }

  exportarExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ganancias');

    const m = this.filtroMembresia || 'Todas';
    const p = this.filtroPromocion || 'Todas';
    const fi = this.fechaInicio || 'sin filtro';
    const ff = this.fechaFin || 'sin filtro';

    worksheet.addRow(['Reporte de Ganancias por Membresía']);
    worksheet.addRow([`Membresía: ${m} | Promoción: ${p}`]);
    worksheet.addRow([`Desde: ${fi}`, `Hasta: ${ff}`]);
    worksheet.addRow([]);

    worksheet.addRow(['Membresía (cantidad)', 'Ganancia $']);
    worksheet.getRow(5).font = { bold: true };

    this.chartData.forEach(item => {
      worksheet.addRow([item.name, item.value]);
    });

    workbook.xlsx.writeBuffer().then(buffer => {
      saveAs(new Blob([buffer]), `ganancias-${m.toLowerCase()}.xlsx`);
    });
  }
}

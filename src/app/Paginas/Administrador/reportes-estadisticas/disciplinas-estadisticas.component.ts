import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-disciplinas-estadisticas',
  standalone: true,
  imports: [NgxChartsModule, FormsModule],
  templateUrl: './disciplinas-estadisticas.component.html'
})
export class DisciplinasEstadisticasComponent implements OnInit {
  clasesActivas: any[] = [];
  todasLasClases: any[] = [];
  chartData: any[] = [];
  mostrarSoloActivas: boolean = false;

  view: [number, number] = [window.innerWidth < 768 ? 300 : 700, 400];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarClasesActivas();
    this.cargarClasesTotales();
    window.addEventListener('resize', () => {
      this.view = [window.innerWidth < 768 ? 300 : 700, 400];
    });
  }

  cargarClasesActivas(): void {
    const url = 'https://web-production-d581.up.railway.app/api/reportes/clases/activas';
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.clasesActivas = data;
        if (this.mostrarSoloActivas) {
          this.chartData = this.transformarDatos(data);
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar clases activas', error);
        this.clasesActivas = [];
      }
    });
  }

  cargarClasesTotales(): void {
    const url = 'https://web-production-d581.up.railway.app/api/reportes/clases/reporte';
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.todasLasClases = data;
        if (!this.mostrarSoloActivas) {
          this.chartData = this.transformarDatos(data);
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar clases totales', error);
        this.todasLasClases = [];
      }
    });
  }

  onToggleFiltroActivas(): void {
    this.mostrarSoloActivas
      ? (this.chartData = this.transformarDatos(this.clasesActivas))
      : (this.chartData = this.transformarDatos(this.todasLasClases));
  }

  transformarDatos(clases: any[]): any[] {
    return clases.map((clase) => ({
      name: clase.Nombre,
      value: clase.NumInscritos || 0,
    })).sort((a, b) => b.value - a.value);
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    const titulo = this.mostrarSoloActivas ? 'Clases Activas' : 'Todas las Clases';
    doc.text(`Reporte de ${titulo}`, 14, 10);

    autoTable(doc, {
      head: [['Clase', 'Inscritos']],
      body: this.chartData.map((item) => [item.name, item.value]),
      startY: 20,
    });

    doc.save(`reporte-${this.mostrarSoloActivas ? 'activas' : 'totales'}.pdf`);
  }

  exportarExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet(this.mostrarSoloActivas ? 'Clases Activas' : 'Todas las Clases');

    hoja.addRow(['Clase', 'Inscritos']);
    hoja.getRow(1).font = { bold: true };
    this.chartData.forEach((item) => {
      hoja.addRow([item.name, item.value]);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), `reporte-${this.mostrarSoloActivas ? 'activas' : 'totales'}.xlsx`);
    });
  }
}

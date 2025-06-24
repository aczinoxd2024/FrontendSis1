import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';


import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-clases-estadisticas',
  standalone: true,
  imports: [NgxChartsModule, FormsModule],
  templateUrl: './clases-estadisticas.component.html',
})
export class ClasesEstadisticasComponent implements OnInit {
  clases: any[] = [];
  chartData: any[] = [];
  view: [number, number] = [window.innerWidth < 768 ? 300 : 700, 400];
  filtroInstructor: string = '';
   instructores: string[] = [];
   tipoGrafico: string = 'barra';

  constructor(private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.cargarInstructores();
    window.addEventListener('resize', () => {
  this.view = [window.innerWidth < 768 ? 300 : 700, 400];
});
  }

  cargarDatos(): void {
    const params = this.filtroInstructor
      ? new HttpParams().set('instructor', this.filtroInstructor)
      : undefined;

    this.http
      .get<any[]>('https://web-production-d581.up.railway.app/api/reportes/clases/reporte', { params })
      .subscribe((data) => {
        this.clases = data;
        this.chartData = this.transformarDatos(data);
      });
  }

 cargarInstructores(): void {
  const url = 'https://web-production-d581.up.railway.app/api/reportes/instructores-desde-clases';

  this.http.get<string[]>(url).subscribe({
    next: (data: string[]) => {
      this.instructores = data || [];
      console.log('✅ Instructores cargados:', this.instructores);
    },
    error: (err) => {
      console.error('❌ Error al cargar instructores:', err);
      this.instructores = [];
    }
  });
}

  transformarDatos(clases: any[]): any[] {
    return clases.map((clase) => ({
      name: clase.Nombre,
      value: clase.NumInscritos || 0,
    })).sort((a, b) => b.value - a.value);
  }


  onInstructorChange(): void {
    this.cargarDatos();
  }


   exportarPDF(): void {
  const doc = new jsPDF();

  const titulo = this.filtroInstructor
    ? `Clases del Instructor: ${this.filtroInstructor}`
    : 'Clases de Todos los Instructores';

  doc.text(titulo, 14, 10);

  autoTable(doc, {
    head: [['Clase', 'Reservas']],
    body: this.chartData.map((item) => [item.name, item.value]),
    startY: 20,
  });

  const filename = this.filtroInstructor
    ? `clases-${this.filtroInstructor.replace(/\s+/g, '-')}.pdf`
    : 'clases-todos.pdf';

  doc.save(filename);
}


exportarExcel(): void {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reporte');

  const titulo = this.filtroInstructor
    ? `Clases del Instructor: ${this.filtroInstructor}`
    : 'Clases de Todos los Instructores';

  worksheet.addRow([titulo]);
  worksheet.mergeCells(`A1:B1`);
  worksheet.getRow(1).font = { bold: true };

  worksheet.addRow(['Clase', 'Reservas']);
  worksheet.getRow(2).font = { bold: true };

  this.chartData.forEach((item) => {
    worksheet.addRow([item.name, item.value]);
  });

  const filename = this.filtroInstructor
    ? `clases-${this.filtroInstructor.replace(/\s+/g, '-')}.xlsx`
    : 'clases-todos.xlsx';

  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(new Blob([buffer]), filename);
  });
}

}

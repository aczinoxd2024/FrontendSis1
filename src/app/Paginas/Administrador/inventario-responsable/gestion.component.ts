import { Component } from '@angular/core';
import { InventarioResponsableService } from '../../../services/inventario-responsable.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  standalone: true,
  imports: [FormsModule,CommonModule],
})
export class AsignacionMaterialesComponent {
  asignaciones: any[] = [];
  asignacionesFiltradas: any[] = [];
  error = '';

  filtroCI = '';
  filtroItem = '';
  paginaActual = 1;
  elementosPorPagina = 10;

  ////asignar material responsable
  ci = '';
  idItem!: number;
  observacion = '';
  descripcion = '';

  mostrarFormulario = false;
  constructor(private inventarioService: InventarioResponsableService) {
    this.cargarAsignaciones();
  }

  cargarAsignaciones() {
    this.inventarioService.listar().pipe(
      catchError(err => {
        this.error = 'Error al cargar asignaciones';
        console.error('Error en listar:', err);
        return of([]);
      })
    ).subscribe(data => {
      console.log('Datos recibidos:', data);
      this.asignaciones = data;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    this.paginaActual = 1;
    const filtroCILower = this.filtroCI.toLowerCase();
    const filtroItemLower = this.filtroItem.toLowerCase();
    this.asignacionesFiltradas = this.asignaciones.filter(a =>
      (a.CI?.toLowerCase().includes(filtroCILower)) &&
      ((a.item?.nombre ?? '').toLowerCase().includes(filtroItemLower))
    );
  }

  obtenerAsignacionesPaginadas() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    return this.asignacionesFiltradas.slice(inicio, inicio + this.elementosPorPagina);
  }

  totalPaginas(): number {
    return Math.ceil(this.asignacionesFiltradas.length / this.elementosPorPagina);
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
  }

  exportarPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Asignación de Materiales', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['#', 'CI Responsable', 'Nombre Ítem', 'Cantidad', 'Destino']],
      body: this.asignacionesFiltradas.map((a, i) => [
        i + 1,
        a.CI || '',
        a.item?.nombre || '',
        a.cantidad || '',
        a.destino || '',
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
    });

    doc.save('asignacion_materiales.pdf');
  }

  exportarExcel() {
    const data = this.asignacionesFiltradas.map((a, i) => ({
      '#': i + 1,
      'CI Responsable': a.CI || '',
      'Nombre Ítem': a.item?.nombre || '',
      'Cantidad': a.cantidad || '',
      'Destino': a.destino || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { 'Asignaciones': worksheet }, SheetNames: ['Asignaciones'] };
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'asignacion_materiales.xlsx');
  }

  //////////
  asignarMaterial() {
  const data = {
    CI: this.ci,
    IDItem: Number(this.idItem),
    Observacion: this.observacion,
  };

  console.log('Datos a enviar:', data);

  this.inventarioService.asignar(data).subscribe({
    next: res => {
      console.log('Asignación exitosa:', res);
      this.cargarAsignaciones(); // refresca la tabla
      this.ci = '';
      this.idItem = 0;
      this.observacion = '';
    },
    error: err => {
      console.error('Error al asignar material:', err);
    }
  });
}
eliminarAsignacion(ci: string, idItem: number) {
  console.log('Eliminar asignación de:', ci, 'con IDItem:', idItem);
  if (confirm(`¿Estás seguro de eliminar la asignación del ítem ${idItem} para el CI ${ci}?`)) {
    this.inventarioService.eliminar(ci, idItem).subscribe({
      next: () => {
        console.log('Asignación eliminada correctamente');
        this.cargarAsignaciones(); // recargar la tabla
      },
      error: err => {
        console.error('Error al eliminar asignación:', err);
      }
    });
  }
}
}

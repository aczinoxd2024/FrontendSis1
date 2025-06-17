import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-admin-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-inventario.component.html',
  styleUrls: ['./admin-inventario.component.css'],
})
export class AdminInventarioComponent implements OnInit {
  private apiUrl = 'https://web-production-d581.up.railway.app/api';

  filtros = {
    nombre: '',
    estadoId: '',
    cantidadMin: '',
    cantidadMax: '',
  };

  estados: any[] = [];
  estadosFiltrados: any[] = [];
  inventario: any[] = [];

  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  modalCrearAbierto = false;
  modalEditarAbierto = false;

  nuevoItem = {
    nombre: '',
    descripcion: '',
    cantidadActual: null,
    estadoId: '',
  };

  itemAEditar: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerEstados();
    this.obtenerInventario();
  }

  obtenerEstados(): void {
    this.http.get<any[]>(`${this.apiUrl}/estado-inventario`).subscribe(
      (data) => {
        this.estados = data;
        this.estadosFiltrados = data.filter((e) => e.estado !== 'Dañado');
      },
      (error) => {
        console.error('Error al obtener estados:', error);
      }
    );
  }

  obtenerInventario(): void {
    let params = new HttpParams();

    if (this.filtros.nombre) params = params.set('nombre', this.filtros.nombre);
    if (this.filtros.estadoId)
      params = params.set('estado', this.filtros.estadoId);
    if (this.filtros.cantidadMin)
      params = params.set('cantidadMin', this.filtros.cantidadMin);
    if (this.filtros.cantidadMax)
      params = params.set('cantidadMax', this.filtros.cantidadMax);

    this.http.get<any[]>(`${this.apiUrl}/inventario`, { params }).subscribe({
      next: (data) => (this.inventario = data),
      error: (err) => console.error('Error al obtener inventario:', err),
    });
  }

  limpiarFiltros(): void {
    this.filtros = {
      nombre: '',
      estadoId: '',
      cantidadMin: '',
      cantidadMax: '',
    };
    this.obtenerInventario();
  }

  crearItem() {
    this.nuevoItem = {
      nombre: '',
      descripcion: '',
      cantidadActual: null,
      estadoId: '',
    };
    this.modalCrearAbierto = true;
  }

  guardarNuevoItem() {
    this.http.post(`${this.apiUrl}/inventario`, this.nuevoItem).subscribe({
      next: () => {
        this.mensajeExito = '¡Ítem agregado con éxito!';
        this.mensajeError = null;
        this.modalCrearAbierto = false;
        this.obtenerInventario();

        setTimeout(() => (this.mensajeExito = null), 4000);
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'Error al registrar el ítem.';
        this.mensajeExito = null;

        setTimeout(() => (this.mensajeError = null), 5000);
      },
    });
  }

  editarItem(item: any) {
    this.itemAEditar = { ...item };
    this.modalEditarAbierto = true;
  }

  guardarEdicion() {
    const id = this.itemAEditar.idItem;
    const body = {
      nombre: this.itemAEditar.nombre,
      descripcion: this.itemAEditar.descripcion,
      cantidadActual: this.itemAEditar.cantidadActual,
      estadoId: this.itemAEditar.estado?.id,
    };

    this.http.put(`${this.apiUrl}/inventario/${id}`, body).subscribe({
      next: () => {
        this.mensajeExito = 'Ítem actualizado correctamente.';
        this.mensajeError = null;
        this.modalEditarAbierto = false;
        this.obtenerInventario();

        setTimeout(() => (this.mensajeExito = null), 4000);
      },
      error: (err) => {
        this.mensajeError =
          err.error?.message || 'Error al actualizar el ítem.';
        this.mensajeExito = null;

        setTimeout(() => (this.mensajeError = null), 5000);
      },
    });
  }

  darDeBaja(item: any) {
    this.http
      .put(`${this.apiUrl}/inventario/${item.idItem}/baja`, {})
      .subscribe({
        next: () => {
          this.mensajeExito = `Ítem "${item.nombre}" dado de baja correctamente.`;
          this.mensajeError = null;
          this.obtenerInventario();

          setTimeout(() => (this.mensajeExito = null), 4000);
        },
        error: (err) => {
          this.mensajeError =
            err.error?.message || 'Error al dar de baja el ítem.';
          this.mensajeExito = null;

          setTimeout(() => (this.mensajeError = null), 5000);
        },
      });
  }

  inventarioFiltrado() {
    return this.inventario;
  }
}

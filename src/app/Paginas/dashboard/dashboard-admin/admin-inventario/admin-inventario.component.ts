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
  filtros = {
    nombre: '',
    estadoId: '',
    cantidadMin: '',
    cantidadMax: '',
  };

  estados: any[] = [];
  inventario: any[] = [];
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerEstados();
    this.obtenerInventario();
  }

  obtenerEstados(): void {
    this.http.get<any[]>('/api/estado-inventario').subscribe({
      next: (data) => {
        // Filtramos para mostrar solo "Buen estado" y "Mal estado"
        this.estados = data.filter((estado) => estado.estado !== 'Dañado');
      },
      error: (err) => {
        console.error('Error al obtener estados:', err);
      },
    });
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

    this.http.get('/api/inventario', { params }).subscribe({
      next: (data: any) => (this.inventario = data),
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

  modalCrearAbierto = false;
  modalEditarAbierto = false;
  itemSeleccionado: any = null;

  nuevoItem = {
    nombre: '',
    descripcion: '',
    cantidadActual: null,
    estadoId: '',
  };

  crearItem() {
    this.modalCrearAbierto = true;
  }

  guardarNuevoItem() {
    this.http.post('/api/inventario', this.nuevoItem).subscribe({
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
    this.itemSeleccionado = JSON.parse(JSON.stringify(item)); // Clonar para evitar modificar directo
    this.modalEditarAbierto = true;
  }

  guardarEdicionItem() {
    if (this.itemSeleccionado.cantidadActual < 1) {
      this.mensajeError = 'La cantidad debe ser mayor a 0.';
      this.mensajeExito = null;
      return;
    }

    const id = this.itemSeleccionado.idItem;

    const body = {
      nombre: this.itemSeleccionado.nombre,
      descripcion: this.itemSeleccionado.descripcion,
      cantidadActual: this.itemSeleccionado.cantidadActual,
      estadoId: this.itemSeleccionado.estado.id,
    };

    this.http.put(`/api/inventario/${id}`, body).subscribe({
      next: () => {
        this.mensajeExito = 'Ítem actualizado con éxito';
        this.mensajeError = null;
        this.modalEditarAbierto = false;
        this.obtenerInventario();

        setTimeout(() => (this.mensajeExito = null), 4000);
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'Error al actualizar ítem.';
        this.mensajeExito = null;

        setTimeout(() => (this.mensajeError = null), 5000);
      },
    });
  }

  darDeBaja(item: any) {
    const confirmacion = confirm(
      `¿Estás seguro de que deseas dar de baja el ítem "${item.nombre}"? Esta acción no se puede deshacer.`
    );

    if (!confirmacion) return;

    this.http.put(`/api/inventario/${item.idItem}/baja`, {}).subscribe({
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

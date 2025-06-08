import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seguimiento-cliente',
  standalone: true,
  templateUrl: './seguimiento-cliente.component.html',
  imports: [CommonModule, FormsModule],
})
export class SeguimientoClienteComponent {
  ciCliente = '';
  ciBusquedaFecha = '';
  busquedaFecha = '';

  historial: any[] = [];
  cargando = false;

  modoFormulario = false;
  modoEditar = false;

  formulario: any = {
    Fecha: null,
    peso: null,
    altura: null,
    imc: null,
    pecho: null,
    abdomen: null,
    cintura: null,
    cadera: null,
    pierna: null,
    biceps: null,
    espalda: null,
  };

  private API = 'https://web-production-d581.up.railway.app/api/seguimiento';

  constructor(private http: HttpClient) {}

  buscarSeguimiento() {
    if (!this.ciCliente) {
      Swal.fire('Error', 'Debe ingresar un CI válido.', 'error');
      return;
    }

    this.cargando = true;
    this.http.get<any[]>(`${this.API}/cliente/${this.ciCliente}`).subscribe({
      next: (data) => {
        this.historial = data;
        if (data.length === 0) {
          Swal.fire('Sin resultados', 'No se encontraron seguimientos para este cliente.', 'info');
        }
        this.cargando = false;
      },
      error: () => {
        this.historial = [];
        Swal.fire('Error', 'No se pudo obtener el historial.', 'error');
        this.cargando = false;
      },
    });
  }

 buscarPorFecha() {
  if (!this.ciBusquedaFecha || !this.busquedaFecha) {
    Swal.fire('Error', 'Debe ingresar CI y fecha.', 'error');
    return;
  }

  const fecha = new Date(this.busquedaFecha).toISOString();
  const url = `${this.API}/${this.ciBusquedaFecha}/${encodeURIComponent(fecha)}`;

  this.cargando = true;
  this.http.get<any>(url).subscribe({
    next: (seguimiento) => {
      this.historial = [seguimiento];
      this.cargando = false;
    },
    error: () => {
      this.historial = [];
      Swal.fire('Sin resultados', 'No se encontró un seguimiento para esa fecha.', 'info');
      this.cargando = false;
    },
  });
}

  abrirNuevo() {
    this.modoFormulario = true;
    this.modoEditar = false;
    this.formulario = {
      Fecha: null,
      peso: null,
      altura: null,
      imc: null,
      pecho: null,
      abdomen: null,
      cintura: null,
      cadera: null,
      pierna: null,
      biceps: null,
      espalda: null,
    };
  }

  guardarSeguimiento() {
    if (!this.formulario.peso || !this.formulario.altura || (!this.modoEditar && !this.ciCliente)) {
      Swal.fire('Campos requeridos', 'Debe llenar CI, peso y altura.', 'warning');
      return;
    }

    const peso = Number(this.formulario.peso);
    const altura = Number(this.formulario.altura);
    const imcFinal = this.formulario.imc && !isNaN(this.formulario.imc)
      ? Number(this.formulario.imc)
      : parseFloat((peso / (altura * altura)).toFixed(2));

    const ci = this.modoEditar ? this.formulario.IDCliente || this.ciCliente : this.ciCliente;
    const ciInstructor = localStorage.getItem('ci');

    const payload: any = {
      ciCliente: ci,
      ciInstructor: ciInstructor,
      peso,
      altura,
      imc: imcFinal,
      pecho: Number(this.formulario.pecho) || null,
      abdomen: Number(this.formulario.abdomen) || null,
      cintura: Number(this.formulario.cintura) || null,
      cadera: Number(this.formulario.cadera) || null,
      pierna: Number(this.formulario.pierna) || null,
      biceps: Number(this.formulario.biceps) || null,
      espalda: Number(this.formulario.espalda) || null,
    };

    if (this.modoEditar && this.formulario.Fecha) {
      const url = `${this.API}/${ci}/${encodeURIComponent(this.formulario.Fecha)}`;
      this.http.put(url, payload).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Seguimiento actualizado correctamente.', 'success');
          this.modoFormulario = false;
          this.buscarSeguimiento();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el seguimiento.', 'error');
        },
      });
    } else {
      this.http.post(this.API, payload).subscribe({
        next: () => {
          Swal.fire('Registrado', 'Seguimiento registrado exitosamente.', 'success');
          this.modoFormulario = false;
          this.buscarSeguimiento();
        },
        error: (err) => {
          if (err.status === 400 && err.error?.message) {
            Swal.fire('No permitido', err.error.message, 'warning');
          } else {
            Swal.fire('Error', 'No se pudo registrar el seguimiento.', 'error');
          }
        },
      });
    }
  }

  eliminar(form: any) {
    if (!form?.Fecha || !form?.IDCliente) {
      Swal.fire('Error', 'No se puede eliminar: datos incompletos.', 'error');
      return;
    }

    const url = `${this.API}/${form.IDCliente}/${encodeURIComponent(form.Fecha)}`;
    this.http.delete(url).subscribe({
      next: () => {
        Swal.fire('Eliminado', 'Seguimiento eliminado correctamente.', 'success');
        this.formulario = {};
        this.modoFormulario = false;
        this.buscarSeguimiento();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo eliminar el seguimiento.', 'error');
      },
    });
  }
}

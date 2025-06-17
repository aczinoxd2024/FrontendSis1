import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgZone } from '@angular/core';


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
esCliente = false;
usuarioRol: string = '';
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

  constructor(private http: HttpClient, private zone: NgZone) {
      const rol = localStorage.getItem('rol');  //nuevos
  this.esCliente = rol?.toLowerCase() === 'cliente';
   }

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

    let fechaFormateada: string;

    if (this.busquedaFecha.includes('/')) {
      const [dia, mes, anio] = this.busquedaFecha.split('/');
      fechaFormateada = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    } else {
      fechaFormateada = this.busquedaFecha;
    }

    const url = `${this.API}/cliente/${this.ciBusquedaFecha}/${fechaFormateada}`;
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


async guardarSeguimiento() {
  if (!this.formulario.peso || !this.formulario.altura || !this.ciCliente) {
    await Swal.fire('Campos requeridos', 'Debe llenar CI, peso y altura.', 'warning');
    return;
  }

  const peso = Number(this.formulario.peso);
  const altura = Number(this.formulario.altura);
  const imcCalculado = peso / (altura * altura);
  const imcFinal = this.formulario.imc && !isNaN(this.formulario.imc)
    ? Number(this.formulario.imc)
    : parseFloat(imcCalculado.toFixed(2));

  const ci = this.ciCliente;
  const ciInstructor = localStorage.getItem('ci') ?? '';

  const payload = {
    ciCliente: ci,
    ciInstructor,
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

  if (this.modoEditar && this.formulario.fechaEditar) {
    const fecha = encodeURIComponent(this.formulario.fechaEditar);
    this.http.put(`${this.API}/cliente/${ci}/${fecha}`, payload).subscribe({
      next: async () => {
        await Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Seguimiento actualizado correctamente.',
        });
        this.modoFormulario = false;
        this.buscarSeguimiento();
      },
      error: (err) => {
        let mensaje = 'No se pudo actualizar el seguimiento.';
        if (Array.isArray(err.error?.message)) {
          mensaje = err.error.message.join('\n');
        } else if (typeof err.error?.message === 'string') {
          mensaje = err.error.message;
        }
        Swal.fire('Error de validación', mensaje, 'warning');
      }
    });
  } else {
    // POST → crear nuevo seguimiento
    this.http.post(this.API, payload).subscribe({
      next: async () => {
        await Swal.fire('Éxito', 'Seguimiento registrado correctamente.', 'success');
        this.modoFormulario = false;
        this.buscarSeguimiento();
      },
      error: (err) => {
        let mensaje = 'No se pudo registrar el seguimiento.';
        if (Array.isArray(err.error?.message)) {
          mensaje = err.error.message.join('\n');
        } else if (typeof err.error?.message === 'string') {
          mensaje = err.error.message;
        }
        Swal.fire('Error de validación', mensaje, 'warning');
      }
    });
  }
}


  actualizarSeguimiento() {
    if (!this.historial.length) {
      Swal.fire('Error', 'Debe buscar primero un seguimiento para actualizar.', 'error');
      return;
    }

    const seguimiento = this.historial[0];

    this.formulario = {
      Fecha: seguimiento.Fecha.split('T')[0],
      peso: seguimiento.Peso,
      altura: seguimiento.Altura,
      imc: seguimiento.IMC,
      pecho: seguimiento.Pecho,
      abdomen: seguimiento.Abdomen,
      cintura: seguimiento.Cintura,
      cadera: seguimiento.Cadera,
      pierna: seguimiento.Pierna,
      biceps: seguimiento.Biceps,
      espalda: seguimiento.Espalda,
    };

    this.ciCliente = seguimiento.IDCliente;
    this.modoFormulario = true;
    this.modoEditar = true;
  }

editarSeguimiento(item: any) {
  this.modoFormulario = true;
  this.modoEditar = true;

  this.formulario = {
   // fechaEditar: item.Fecha,
     fechaEditar: item.Fecha.split('T')[0], // solo la fecha
    peso: item.Peso,
    altura: item.Altura,
    imc: item.IMC,
    pecho: item.Pecho,
    abdomen: item.Abdomen,
    cintura: item.Cintura,
    cadera: item.Cadera,
    pierna: item.Pierna,
    biceps: item.Biceps,
    espalda: item.Espalda,
  };

  this.ciCliente = item.IDCliente;
}


eliminar(item: any) {
  if (!item?.Fecha || !item?.IDCliente) {
    Swal.fire('Error', 'No se puede eliminar: datos incompletos.', 'error');
    return;
  }

  const fechaLocal = new Date(item.Fecha).toISOString().split('T')[0];
  const url = `${this.API}/cliente/${item.IDCliente}/${fechaLocal}`;

  this.http.delete(url).subscribe({
    next: () => {
      Swal.fire('Eliminado', 'Seguimiento eliminado correctamente.', 'success');
      this.formulario = {};
      this.modoFormulario = false;
      this.buscarSeguimiento();
    },
    error: () => {
      Swal.fire('Error', 'No se pudo eliminar el seguimiento.', 'error');
    }
  });
}

ngOnInit(): void {
  this.usuarioRol = localStorage.getItem('rol') ?? '';

  if (this.usuarioRol === 'cliente') {
    this.ciCliente = localStorage.getItem('ci') ?? '';
    this.ciBusquedaFecha = this.ciCliente;
    this.buscarSeguimiento();
  }
}


}

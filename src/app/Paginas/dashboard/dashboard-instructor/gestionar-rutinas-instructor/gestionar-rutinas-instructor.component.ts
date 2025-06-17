
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RutinaService } from '../../../../services/rutina.service';
import { HttpClient } from '@angular/common/http';
import { NivelRutina, GeneroObjetivo, TipoAccesoRutina } from './rutina.enums';

@Component({
  selector: 'app-gestionar-rutinas-instructor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-rutinas-instructor.component.html',
})
export class GestionarRutinasInstructorComponent implements OnInit {
  rutina = {
    nombre: '',
    objetivo: '',
    nivel: NivelRutina.PRINCIPIANTE,
    generoObjetivo: GeneroObjetivo.AMBOS,
    descripcion: '',
    tipo: TipoAccesoRutina.GENERAL,
    IDClase: null,
    detalles: [{ idEjercicio: 0, idDia: 0, series: 0, repeticiones: 0 }]
  };

  rutinaSeleccionadaId: number | null = null;
  rutinasDisponibles: any[] = [];
  vistaPreviaDetalles: any[] = [];
  ejerciciosDisponibles: any[] = [];
  diasDisponibles: any[] = [];

  nivelRutinaList = Object.values(NivelRutina);
  generoObjetivoList = Object.values(GeneroObjetivo);
  tipoAccesoList = Object.values(TipoAccesoRutina);

  editando = false;

  constructor(
    private rutinaService: RutinaService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarRutinasDisponibles();
    this.cargarEjercicios();
    this.cargarDias();
  }

  cargarRutinasDisponibles(): void {
    this.rutinaService.getRutinas().subscribe({
      next: (data: any[]) => {
        this.rutinasDisponibles = data.filter(r =>
          Object.values(TipoAccesoRutina).includes(r.tipoAcceso)
        );
      },
      error: (err) => console.error('❌ Error al cargar rutinas:', err)
    });
  }

  cargarEjercicios(): void {
    this.http.get<any[]>('https://web-production-d581.up.railway.app/api/ejercicios').subscribe({
      next: data => this.ejerciciosDisponibles = data,
      error: err => console.error('Error al cargar ejercicios:', err)
    });
  }

  cargarDias(): void {
    this.http.get<any[]>('https://web-production-d581.up.railway.app/api/dias-semana').subscribe({
      next: data => this.diasDisponibles = data,
      error: err => console.error('Error al cargar días:', err)
    });
  }

  mostrarVistaPrevia(): void {
    const plantilla = this.rutinasDisponibles.find(r => r.id === this.rutinaSeleccionadaId);
    if (!plantilla) return;
    this.vistaPreviaDetalles = (plantilla.detalles || []).map((d: any) => ({
      ejercicio: d.ejercicio?.nombre || '',
      dia: d.dia?.Dia || '',
      series: d.series,
      repeticiones: d.repeticiones
    }));
  }

  confirmarCargaPlantilla(): void {
    const plantilla = this.rutinasDisponibles.find(r => r.id === this.rutinaSeleccionadaId);
    if (!plantilla) return;

    this.rutina = {
      nombre: plantilla.nombre,
      objetivo: plantilla.objetivo,
      nivel: plantilla.nivel,
      generoObjetivo: plantilla.generoObjetivo,
      descripcion: plantilla.descripcion,
      tipo: plantilla.tipoAcceso,
      IDClase: plantilla.IDClase || null,
      detalles: (plantilla.detalles || []).map((d: any) => ({
        idEjercicio: d.ejercicio?.IDEjercicio || 0,
        idDia: d.dia?.IDDia || 0,
        series: d.series,
        repeticiones: d.repeticiones
      }))
    };

    Swal.fire({
      icon: 'success',
      title: 'Plantilla cargada',
      text: 'Ejercicios prellenados con éxito.',
      toast: true,
      position: 'top-end',
      timer: 2000,
      showConfirmButton: false
    });
  }

  agregarDetalle(): void {
    this.rutina.detalles.push({ idEjercicio: 0, idDia: 0, series: 0, repeticiones: 0 });
  }

  eliminarDetalle(index: number): void {
    this.rutina.detalles.splice(index, 1);
  }

  prellenarEjemplo(): void {
    this.rutina.detalles = [
      { idEjercicio: 1, idDia: 1, series: 3, repeticiones: 12 },
      { idEjercicio: 2, idDia: 2, series: 3, repeticiones: 10 },
      { idEjercicio: 3, idDia: 3, series: 3, repeticiones: 15 }
    ];
  }

  mostrarResumenRutina(): void {
    const resumen = `
      <b>Nombre:</b> ${this.rutina.nombre}<br>
      <b>Objetivo:</b> ${this.rutina.objetivo}<br>
      <b>Nivel:</b> ${this.rutina.nivel}<br>
      <b>Género objetivo:</b> ${this.rutina.generoObjetivo}<br>
      <b>Tipo de rutina:</b> ${this.rutina.tipo}<br><br>
      <b>📋 Ejercicios:</b><br>
      ${this.rutina.detalles.map((d, i) => {
        const ejercicio = this.ejerciciosDisponibles.find(e => e.id === d.idEjercicio)?.nombre || '(?)';
        const dia = this.diasDisponibles.find(di => di.ID === d.idDia)?.Dia || '(?)';
        return `• ${ejercicio} - ${dia} - ${d.series} x ${d.repeticiones}`;
      }).join('<br>')}
    `;

    Swal.fire({
      title: '¿Deseas guardar esta rutina?',
      html: resumen,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#ef4444'
    }).then(result => {
      if (result.isConfirmed) {
        this.guardarRutinaFinal();
      }
    });
  }

  guardarRutinaFinal(): void {
    const { nombre, objetivo, nivel, tipo, generoObjetivo, detalles } = this.rutina;

    if (!nombre.trim() || !objetivo.trim() || !nivel || !tipo || !generoObjetivo || detalles.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Completa todos los campos requeridos.', confirmButtonColor: '#ef4444' });
      return;
    }

    const detallesValidos = detalles.every(
      d => d.idEjercicio && d.idDia && d.series > 0 && d.repeticiones > 0
    );
    if (!detallesValidos) {
      Swal.fire({ icon: 'error', title: 'Error en ejercicios', text: 'Verifica los campos de cada ejercicio.', confirmButtonColor: '#ef4444' });
      return;
    }

    const rutinaAEnviar = {
      nombre: nombre,
      objetivo: objetivo,
      nivel: nivel as NivelRutina,
      tipoAcceso: tipo as TipoAccesoRutina,
      generoObjetivo: generoObjetivo as GeneroObjetivo,
      descripcion: this.rutina.descripcion || '',
      ciInstructor: localStorage.getItem('ci') || '',
      detalles: detalles.map(d => ({
        idEjercicio: d.idEjercicio,
        idDia: d.idDia,
        series: d.series,
        repeticiones: d.repeticiones
      }))
    };

    this.rutinaService.crearRutina(rutinaAEnviar).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Rutina registrada', text: 'Se guardó correctamente.', confirmButtonColor: '#22c55e' });
        this.resetearFormulario();
      },
      error: (err) => {
        console.error('❌ Error al guardar rutina:', err);
        Swal.fire('Error', 'No se pudo registrar la rutina.', 'error');
      }
    });
  }

  actualizarRutina(): void {
    if (!this.rutinaSeleccionadaId) return;

    const rutinaActualizada = {
      nombre: this.rutina.nombre,
      objetivo: this.rutina.objetivo,
      nivel: this.rutina.nivel as NivelRutina,
      generoObjetivo: this.rutina.generoObjetivo as GeneroObjetivo,
      tipoAcceso: this.rutina.tipo as TipoAccesoRutina,
      descripcion: this.rutina.descripcion || '',
      ciInstructor: localStorage.getItem('ci') || '',
      detalles: this.rutina.detalles.map(d => ({
        idEjercicio: d.idEjercicio,
        idDia: d.idDia,
        series: d.series,
        repeticiones: d.repeticiones
      }))
    };

    this.rutinaService.actualizarRutina(this.rutinaSeleccionadaId, rutinaActualizada).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Rutina actualizada', text: 'Los cambios se guardaron correctamente.', confirmButtonColor: '#22c55e' });
        this.resetearFormulario();
        this.cargarRutinasDisponibles();
        this.editando = false;
      },
      error: (err) => {
        console.error('❌ Error al actualizar rutina:', err);
        Swal.fire('Error', 'No se pudo actualizar la rutina.', 'error');
      }
    });
  }

  cargarRutinaParaEditar(rutina: any): void {
    this.rutina = {
      nombre: rutina.nombre,
      objetivo: rutina.objetivo,
      nivel: rutina.nivel,
      generoObjetivo: rutina.generoObjetivo,
      descripcion: rutina.descripcion,
      tipo: rutina.tipoAcceso,
      IDClase: rutina.IDClase || null,
      detalles: (rutina.detalles || []).map((d: any) => ({
        idEjercicio: d.ejercicio?.IDEjercicio || d.idEjercicio || 0,
        idDia: d.dia?.IDDia || d.idDia || 0,
        series: d.series,
        repeticiones: d.repeticiones
      }))
    };
    this.rutinaSeleccionadaId = rutina.id;
    this.editando = true;
  }

  resetearFormulario(): void {
    this.rutina = {
      nombre: '',
      objetivo: '',
      nivel: NivelRutina.PRINCIPIANTE,
      generoObjetivo: GeneroObjetivo.AMBOS,
      descripcion: '',
      tipo: TipoAccesoRutina.GENERAL,
      IDClase: null,
      detalles: [{ idEjercicio: 0, idDia: 0, series: 0, repeticiones: 0 }]
    };
    this.rutinaSeleccionadaId = null;
    this.editando = false;
    this.vistaPreviaDetalles = [];
  }

  eliminarRutinaConfirmada(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta rutina será desactivada (no eliminada permanentemente).',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rutinaService.eliminarRutina(id).subscribe({
          next: () => {
            Swal.fire('Desactivada', 'La rutina fue eliminada lógicamente.', 'success');
            this.cargarRutinasDisponibles();
          },
          error: (err) => {
            console.error('❌ Error al eliminar rutina:', err);
            Swal.fire('Error', 'No se pudo desactivar la rutina.', 'error');
          }
        });
      }
    });
  }
}

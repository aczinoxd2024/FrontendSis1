import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RutinaService } from '../../../../services/rutina.service';
import { HttpClient } from '@angular/common/http';
import { RutinaCompleta } from '../../../../interfaces/rutina-completa.interface';
import { DetalleRutina } from '../../../../interfaces/detalle-rutina.interface';


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
  nivel: '',
  generoObjetivo: '',
  descripcion: '',
  tipo: '',            // para uso visual en el <select>
  tipoAcceso: '',      // para envío real al backend
  ciInstructor: '',    // se llenará con localStorage.getItem('ci')
  IDClase: null,
  detalles: [
    { idEjercicio: 0, idDia: 0, series: 0, repeticiones: 0, descanso: 1 }
  ]
};
  tiposRutina = ['general', 'gold', 'personalizada'];
  rutinaSeleccionadaId: number | null = null;
  rutinasDisponibles: any[] = [];
  vistaPreviaDetalles: any[] = [];

  ejerciciosDisponibles: any[] = [];
  diasDisponibles: any[] = [];

  editando: boolean = false;
  idRutinaEditando: number | null = null;

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
          ['general', 'gold', 'personalizada'].includes(r.tipoAcceso)
        );
      },
      error: (err) => {
        console.error('❌ Error al cargar rutinas disponibles:', err);
      }
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
      series: d.series || 0,
      repeticiones: d.repeticiones || 0,
      descanso: d.descanso || 1
    }));
  }

  confirmarCargaPlantilla(): void {
    const plantilla = this.rutinasDisponibles.find(r => r.id === this.rutinaSeleccionadaId);
    if (!plantilla) return;

    this.rutina.nombre = plantilla.nombre;
    this.rutina.objetivo = plantilla.objetivo;
    this.rutina.nivel = plantilla.nivel;
    this.rutina.generoObjetivo = plantilla.generoObjetivo;
    this.rutina.descripcion = plantilla.descripcion;
    this.rutina.tipo = plantilla.tipoAcceso;

    this.rutina.detalles = (plantilla.detalles || []).map((d: any) => ({
      idEjercicio: d.ejercicio?.IDEjercicio || d.idEjercicio || 0,
      idDia: d.dia?.IDDia || d.idDia || 0,
      series: d.series || 0,
      repeticiones: d.repeticiones || 0,
      descanso: d.descanso || 1
    }));

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
    this.rutina.detalles.push({
      idEjercicio: 0,
      idDia: 0,
      series: 0,
      repeticiones: 0,
      descanso: 1
    });
  }

  eliminarDetalle(index: number): void {
    this.rutina.detalles.splice(index, 1);
  }

  guardarRutinaFinal(): void {
    if (!this.rutina.nombre.trim() || !this.rutina.objetivo.trim() || !this.rutina.nivel || !this.rutina.tipo || !this.rutina.generoObjetivo || this.rutina.detalles.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los campos obligatorios antes de guardar.',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    const detallesValidos = this.rutina.detalles.every(
      d => d.idEjercicio && d.idDia && d.series > 0 && d.repeticiones > 0 && d.descanso > 0
    );

    if (!detallesValidos) {
      Swal.fire({
        icon: 'error',
        title: 'Error en ejercicios',
        text: 'Cada ejercicio debe tener datos completos (incluye descanso).',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    const rutinaAEnviar = {
      nombre: this.rutina.nombre,
      objetivo: this.rutina.objetivo,
      nivel: this.rutina.nivel,
      tipo: 'Publica',
      generoObjetivo: this.rutina.generoObjetivo,
      tipoAcceso: this.rutina.tipo,
      ciInstructor: localStorage.getItem('ci') || '',
      detalles: this.rutina.detalles.map((d: any) => ({
        idEjercicio: d.idEjercicio,
        idDia: d.idDia,
        series: d.series,
        repeticiones: d.repeticiones,
        descanso: d.descanso
      }))
    };

    console.log('📦 Enviando rutina:', JSON.stringify(rutinaAEnviar, null, 2));

    this.rutinaService.crearRutina(rutinaAEnviar).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Rutina registrada',
          text: 'Se guardó correctamente.',
          confirmButtonColor: '#22c55e'
        });
        this.resetearFormulario();
      },
      error: (err) => {
        console.error('❌ Error al guardar rutina:', err);
        Swal.fire('Error', 'No se pudo registrar la rutina.', 'error');
      }
    });
  }

  resetearFormulario(): void {
  this.rutina = {
    nombre: '',
    objetivo: '',
    nivel: '',
    generoObjetivo: '',
    descripcion: '',
    tipo: '',
    tipoAcceso: '',
    ciInstructor: localStorage.getItem('ci') || '',
    IDClase: null,
    detalles: [
      { idEjercicio: 0, idDia: 0, series: 0, repeticiones: 0, descanso: 1 }
    ]
  };
  this.rutinaSeleccionadaId = null;
  this.vistaPreviaDetalles = [];
  this.editando = false;
}
  prellenarEjemplo(): void {
    this.rutina.detalles = [
      { idEjercicio: 1, idDia: 1, series: 3, repeticiones: 15, descanso: 1 },
      { idEjercicio: 2, idDia: 2, series: 3, repeticiones: 12, descanso: 2 },
      { idEjercicio: 3, idDia: 3, series: 3, repeticiones: 1, descanso: 1 }
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
        const descanso = d.descanso ? `${d.descanso} min descanso` : 'sin descanso';
        return `• ${ejercicio} - ${dia} - ${d.series} x ${d.repeticiones} - ${descanso}`;
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

  cargarRutinaParaEditar(rutina: any): void {
   this.rutina = {
  nombre: rutina.nombre,
  objetivo: rutina.objetivo,
  nivel: rutina.nivel,
  generoObjetivo: rutina.generoObjetivo,
  descripcion: rutina.descripcion || '',
  tipo: rutina.tipoAcceso, // para <select>
  tipoAcceso: rutina.tipoAcceso, // para backend
  ciInstructor: rutina.ciInstructor || localStorage.getItem('ci') || '',
  IDClase: rutina.IDClase || null,
  detalles: (rutina.detalles || []).map((d: any) => ({
    idEjercicio: d.ejercicio?.IDEjercicio || d.idEjercicio || 0,
    idDia: d.dia?.IDDia || d.idDia || 0,
    series: d.series,
    repeticiones: d.repeticiones,
    descanso: d.descanso || 1
  }))
};
    this.rutinaSeleccionadaId = rutina.id;
    this.editando = true;
  }

actualizarRutina(): void {
  if (!this.rutinaSeleccionadaId) return;

  if (!this.rutina.nivel || !this.rutina.tipo || !this.rutina.generoObjetivo) {
    Swal.fire('Error', 'Faltan campos obligatorios para actualizar la rutina.', 'warning');
    return;
  }

  const rutinaActualizada = {
    nombre: this.rutina.nombre,
    objetivo: this.rutina.objetivo,
    nivel: this.rutina.nivel,
    generoObjetivo: this.rutina.generoObjetivo,
    tipoAcceso: this.rutina.tipo,
    descripcion: this.rutina.descripcion || '',
    ciInstructor: this.rutina.ciInstructor || localStorage.getItem('ci') || '',
    detalles: this.rutina.detalles.map(d => ({
      idEjercicio: d.idEjercicio,
      idDia: d.idDia,
      series: d.series,
      repeticiones: d.repeticiones,
      descanso: d.descanso
    }))
  };

  console.log('📦 Actualizando rutina con:', rutinaActualizada);

  this.rutinaService.actualizarRutina(this.rutinaSeleccionadaId, rutinaActualizada).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Rutina actualizada',
        text: 'Los cambios se guardaron correctamente.',
        confirmButtonColor: '#22c55e'
      });
      this.resetearFormulario();
      this.cargarRutinasDisponibles();
      this.editando = false;
    },
    error: (err) => {
      console.error('❌ Error al actualizar rutina:', err);

      // Manejo específico del error 500 (respuesta del backend incompleta)
      if (err.status === 500) {
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'La rutina fue actualizada, pero hubo un error al devolver la respuesta del servidor.',
          confirmButtonColor: '#f59e0b'
        });
        this.resetearFormulario();
        this.cargarRutinasDisponibles();
        this.editando = false;
      } else {
        Swal.fire('Error', 'No se pudo actualizar la rutina.', 'error');
      }
    }
  });
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
             Swal.fire({
            icon: 'success',
            title: 'Rutina desactivada',
            toast: true,
            position: 'top-end',
            timer: 2000,
            showConfirmButton: false
          });
          this.cargarRutinasDisponibles();
        },
          error: (err) => {
            console.error('❌ Error al eliminar rutina:', err);
            Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo desactivar la rutina.',
            confirmButtonColor: '#ef4444'
          });
          }
        });
      }
    });
  }

cargarParaEditar(rutina: any): void {
  this.editando = true;
  this.idRutinaEditando = rutina.id;

  this.rutina = {
    nombre: rutina.nombre,
    objetivo: rutina.objetivo,
    nivel: rutina.nivel,
    generoObjetivo: rutina.generoObjetivo,
    descripcion: rutina.descripcion || '',
    tipo: rutina.tipoAcceso, // para select visual
    tipoAcceso: rutina.tipoAcceso, // se envía al backend
    ciInstructor: rutina.ciInstructor || localStorage.getItem('ci') || '',
    IDClase: rutina.IDClase || null,
    detalles: (rutina.detalles || []).map((d: any) => ({
      idEjercicio: d.ejercicio?.IDEjercicio || d.idEjercicio || 0,
      idDia: d.dia?.IDDia || d.idDia || 0,
      series: d.series,
      repeticiones: d.repeticiones,
      descanso: d.descanso || 1
    }))
  };

  Swal.fire({
    icon: 'info',
    title: 'Editando rutina',
    text: 'Ahora puedes modificar la rutina seleccionada.',
    toast: true,
    position: 'top-end',
    timer: 2000,
    showConfirmButton: false
  });
}
}

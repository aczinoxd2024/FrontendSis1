import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RutinaService } from '../../../../services/rutina.service';
import { AuthService } from '../../../../services/auth.service';
import { ClasesService } from '../../../../services/clases.service';

@Component({
  selector: 'app-crear-rutina-clase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-rutina-clase.component.html',
})
export class CrearRutinaClaseComponent implements OnInit {
  rutinas: any[] = [];
  clasesInstructor: any[] = [];
  mostrarRutinas = false;

  nuevaRutina: any = {
    nombre: '',
    objetivo: '',
    nivel: '',
    descripcion: '',
    generoObjetivo: '',
    tipoAcceso: 'clase',
    esBasica: false,
    IDClase: null,
    detalles: [{ ejercicio: '', dia: '', series: 0, repeticiones: 0 }]
  };

  tipoClaseSeleccionada = '';

  constructor(
    private rutinaService: RutinaService,
    private authService: AuthService,
    private clasesService: ClasesService
  ) {}

  ngOnInit(): void {
    this.cargarRutinas();
    this.cargarClasesDelInstructor();
  }

  cargarClasesDelInstructor(): void {
    this.clasesService.obtenerMisClases().subscribe({
      next: (clases: any[]) => {
        this.clasesInstructor = clases;
      },
      error: (err: any) => {
        console.error('⛔ Error al obtener clases del instructor', err);
        Swal.fire('Error', 'No se pudieron cargar las clases del instructor', 'error');
      }
    });
  }

  onClaseSeleccionadaPorID(id: number | null) {
    if (id === null) return;
    const clase = this.clasesInstructor.find((c) => c.IDClase === id);
    if (clase) {
      this.tipoClaseSeleccionada = clase.Nombre?.toLowerCase() || '';
      this.precargarEjercicios(this.tipoClaseSeleccionada);
    }
  }

  precargarEjercicios(tipo: string) {
    const mapaEjercicios: { [clave: string]: any[] } = {
      zumba: [
        { ejercicio: 'Paso básico', dia: 'lunes', series: 3, repeticiones: 15 },
        { ejercicio: 'Movimiento de cadera', dia: 'miércoles', series: 2, repeticiones: 12 },
        { ejercicio: 'Caminata latina', dia: 'viernes', series: 3, repeticiones: 20 }
      ],
      spinning: [
        { ejercicio: 'Sprint corto', dia: 'martes', series: 4, repeticiones: 10 },
        { ejercicio: 'Subida de montaña', dia: 'jueves', series: 3, repeticiones: 8 },
        { ejercicio: 'Resistencia constante', dia: 'sábado', series: 2, repeticiones: 12 }
      ],
      crossfit: [
        { ejercicio: 'Burpees', dia: 'lunes', series: 4, repeticiones: 12 },
        { ejercicio: 'Thrusters', dia: 'miércoles', series: 3, repeticiones: 10 },
        { ejercicio: 'Pull-ups', dia: 'viernes', series: 3, repeticiones: 8 }
      ],
      yoga: [
        { ejercicio: 'Saludo al sol', dia: 'lunes', series: 2, repeticiones: 10 },
        { ejercicio: 'Postura del guerrero', dia: 'miércoles', series: 2, repeticiones: 8 },
        { ejercicio: 'Relajación guiada', dia: 'viernes', series: 1, repeticiones: 1 }
      ],
      funcional: [
        { ejercicio: 'Saltos en caja', dia: 'martes', series: 3, repeticiones: 10 },
        { ejercicio: 'Escalador', dia: 'jueves', series: 4, repeticiones: 15 },
        { ejercicio: 'Planchas', dia: 'sábado', series: 3, repeticiones: 30 }
      ]
    };

    const ejercicios = mapaEjercicios[tipo.toLowerCase().trim()];
    if (ejercicios) {
      this.nuevaRutina.detalles = ejercicios;
      Swal.fire({
        icon: 'success',
        title: `Ejercicios para ${tipo} cargados`,
        text: 'Puedes modificarlos si deseas antes de guardar.',
        toast: true,
        position: 'top-end',
        timer: 2500,
        showConfirmButton: false
      });
    } else {
      this.nuevaRutina.detalles = [{ ejercicio: '', dia: '', series: 0, repeticiones: 0 }];
      Swal.fire({
        icon: 'info',
        title: 'Clase no reconocida',
        text: 'Puedes ingresar los ejercicios manualmente.',
        toast: true,
        position: 'top-end',
        timer: 2500,
        showConfirmButton: false
      });
    }
  }

  crearRutina(): void {
    const ci = localStorage.getItem('ci');
    if (!ci) {
      Swal.fire('Error', 'No se encontró el CI del instructor', 'error');
      return;
    }

    const rutinaConCI = {
      ...this.nuevaRutina,
      ciInstructor: ci
    };

    this.rutinaService.crearRutina(rutinaConCI).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Rutina creada correctamente', 'success');
        this.cargarRutinas();
        this.resetearFormulario();
      },
      error: (error: any) => {
        console.error('❌ Error al crear rutina:', error);
        Swal.fire('Error', 'No se pudo crear la rutina', 'error');
      }
    });
  }

  eliminarRutina(id: number): void {
    this.rutinaService.eliminarRutina(id).subscribe({
      next: () => {
        Swal.fire('Eliminado', 'Rutina eliminada', 'success');
        this.cargarRutinas();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo eliminar', 'error');
      }
    });
  }

  resetearFormulario() {
    this.nuevaRutina = {
      nombre: '',
      objetivo: '',
      nivel: '',
      descripcion: '',
      generoObjetivo: '',
      tipoAcceso: 'clase',
      esBasica: false,
      IDClase: null,
      detalles: [{ ejercicio: '', dia: '', series: 0, repeticiones: 0 }]
    };
    this.tipoClaseSeleccionada = '';
  }

  cargarRutinas(): void {
    this.rutinaService.getRutinas().subscribe({
      next: (data: any[]) => {
        this.rutinas = data.filter(r => r.tipoAcceso?.toLowerCase() === 'clase');
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las rutinas', 'error');
      }
    });
  }

  agregarDetalle(): void {
    this.nuevaRutina.detalles.push({ ejercicio: '', dia: '', series: 0, repeticiones: 0, descanso : 0 });
  }

  eliminarDetalleDetalle(index: number): void {
    this.nuevaRutina.detalles.splice(index, 1);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PersonalService } from '../../../services/personal.service';

import { HttpErrorResponse } from '@angular/common/http';
import { DiaSemana, DiaService } from '../../../services/dias.service';
// Esta interfaz HorarioPersonal está bien aquí si no la tienes globalmente
export interface HorarioPersonal {
  idDia: number | null; // <--- CAMBIO AQUÍ: Ahora puede ser number o null
  // O si prefieres undefined: idDia?: number; (así sería opcional y undefined)
  horaInicio: string;
  horaFin: string;
}

@Component({
  selector: 'app-gestion-personal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-personal.component.html',
})
export class GestionPersonalComponent implements OnInit {
  listaPersonal: any[] = [];

  nuevoPersonal: any = {
    CI: '',
    Nombre: '',
    Apellido: '',
    Telefono: '',
    Direccion: '',
    correo: '',
    FechaNacimiento: '',
    FechaContratacion: '',
    AreaP: '',
    Sueldo: null,
    Cargo: '',
    horariosTrabajo: []
  };

  editando: boolean = false;

  diasSemana: DiaSemana[] = []; // Usa la interfaz importada
  nuevoHorario: HorarioPersonal = { idDia: null, horaInicio: '', horaFin: '' };

  constructor(
    private personalService: PersonalService,
    private DiaService: DiaService // <-- ¡CORREGIDO a camelCase!
  ) {}

  ngOnInit(): void {
    this.cargarPersonal();
    this.cargarDiasSemana();
  }

  cargarPersonal(): void {
    this.personalService.getPersonal().subscribe({
      next: (data: any[]) => { // <-- Tipado explícito
        console.log('📦 Personal recibido:', data);
        this.listaPersonal = data;
      },
      error: (err: HttpErrorResponse) => { // <-- Tipado explícito
        console.error('❌ Error al cargar personal:', err);
        Swal.fire('Error', 'No se pudo cargar el personal', 'error');
      }
    });
  }

  cargarDiasSemana(): void {
    this.DiaService.getDias().subscribe({ // <-- Usamos diaService (camelCase)
      next: (data: DiaSemana[]) => { // <-- Tipado explícito
        this.diasSemana = data;
      },
      error: (err: HttpErrorResponse) => { // <-- Tipado explícito
        console.error('❌ Error al cargar los días de la semana:', err);
        Swal.fire('Error', 'No se pudieron cargar los días de la semana para los horarios.', 'error');
      }
    });
  }

  agregarHorario(): void {
    if (this.nuevoHorario.idDia && this.nuevoHorario.horaInicio && this.nuevoHorario.horaFin) {
      if (this.nuevoHorario.horaInicio >= this.nuevoHorario.horaFin) {
        Swal.fire('Error', 'La hora de inicio debe ser menor que la hora de fin para el horario.', 'error');
        return;
      }

      const diaSeleccionado = this.diasSemana.find(d => d.ID === this.nuevoHorario.idDia)?.Dia;
      const horarioExistente = this.nuevoPersonal.horariosTrabajo.some(
        (h: HorarioPersonal) => h.idDia === this.nuevoHorario.idDia
      );

      if (horarioExistente) {
        Swal.fire('Advertencia', `Ya existe un horario asignado para el ${diaSeleccionado}.`, 'warning');
        return;
      }

      this.nuevoPersonal.horariosTrabajo.push({ ...this.nuevoHorario });
      this.nuevoHorario = { idDia: 0, horaInicio: '', horaFin: '' };
    } else {
      Swal.fire('Advertencia', 'Por favor, completa todos los campos para añadir el horario (Día, Hora Inicio, Hora Fin).', 'warning');
    }
  }

  eliminarHorario(index: number): void {
    this.nuevoPersonal.horariosTrabajo.splice(index, 1);
  }

  getNombreDia(idDia: number): string {
    const dia = this.diasSemana.find(d => d.ID === idDia);
    return dia ? dia.Dia : 'Día Desconocido';
  }

  guardarPersonal(): void {
    const payload: any = { // <-- Tipado explícito
      Nombre: this.nuevoPersonal.Nombre,
      Apellido: this.nuevoPersonal.Apellido,
      Telefono: this.nuevoPersonal.Telefono,
      Direccion: this.nuevoPersonal.Direccion,
      FechaNacimiento: this.nuevoPersonal.FechaNacimiento,
      FechaContratacion: this.nuevoPersonal.FechaContratacion,
      AreaP: this.nuevoPersonal.AreaP,
      Sueldo: Number(this.nuevoPersonal.Sueldo),
      Cargo: this.nuevoPersonal.Cargo
    };

    if (this.editando) {
      this.personalService.actualizarPersonal(this.nuevoPersonal.CI, payload).subscribe({
        next: (res: any) => { // <-- Tipado explícito
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: typeof res === 'string' ? res : res.message || 'Datos actualizados correctamente'
          });
          this.cargarPersonal();
          this.resetFormulario();
        },
        error: (err: HttpErrorResponse) => { // <-- Tipado explícito
          console.error('❌ Error al actualizar:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.message || 'No se pudo actualizar el personal'
          });
        }
      });

    } else {
      payload.CI = this.nuevoPersonal.CI;
      payload.correo = this.nuevoPersonal.correo;
      payload.horariosTrabajo = this.nuevoPersonal.horariosTrabajo;

      this.personalService.agregarPersonal(payload).subscribe({
        next: (res: any) => { // <-- Tipado explícito
          Swal.fire('✅ Registrado', 'Personal registrado correctamente', 'success');
          this.cargarPersonal();
          this.resetFormulario();
        },
        error: (err: HttpErrorResponse) => { // <-- Tipado explícito
          console.error('❌ Error al registrar:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.message || 'No se pudo registrar el personal'
          });
        }
      });
    }
  }

  editarPersonal(p: any): void {
    this.nuevoPersonal = {
      CI: p.CI,
      Nombre: p.persona?.Nombre || '',
      Apellido: p.persona?.Apellido || '',
      Telefono: p.persona?.Telefono || '',
      Direccion: p.persona?.Direccion || '',
      correo: p.usuario?.correo || '',
      FechaNacimiento: p.persona?.FechaNacimiento || '',
      FechaContratacion: p.FechaContratacion || '',
      AreaP: p.AreaP || '',
      Sueldo: Number(p.Sueldo) || null,
      Cargo: p.Cargo || '',
      horariosTrabajo: []
    };
    this.editando = true;
  }

  eliminarPersonal(ci: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción inhabilitará al personal.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.personalService.inhabilitarPersonal(ci).subscribe({
          next: (res: any) => { // <-- Tipado explícito
            Swal.fire('Inhabilitado', typeof res === 'string' ? res : res.message || 'Acceso revocado correctamente', 'success');
            this.cargarPersonal();
          },
          error: (err: HttpErrorResponse) => { // <-- Tipado explícito
            console.error('❌ Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo inhabilitar al personal', 'error');
          }
        });
      }
    });
  }

  reactivarPersonal(ci: string): void {
    Swal.fire({
      title: '¿Deseas reactivar este personal?',
      text: 'El acceso será restaurado.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, reactivar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.personalService.reactivarPersonal(ci).subscribe({
          next: (res: any) => { // <-- Tipado explícito
            Swal.fire('Reactivado', typeof res === 'string' ? res : res.message || 'Acceso restaurado correctamente', 'success');
            this.cargarPersonal();
          },
          error: (err: HttpErrorResponse) => { // <-- Tipado explícito
            console.error('❌ Error al reactivar:', err);
            Swal.fire('Error', 'No se pudo reactivar el personal', 'error');
          }
        });
      }
    });
  }

  resetFormulario(): void {
    this.nuevoPersonal = {
      CI: '',
      Nombre: '',
      Apellido: '',
      Telefono: '',
      Direccion: '',
      correo: '',
      FechaNacimiento: '',
      FechaContratacion: '',
      AreaP: '',
      Sueldo: null,
      Cargo: '',
      horariosTrabajo: []
    };
    this.nuevoHorario = { idDia: null, horaInicio: '', horaFin: '' }; // <-- Cambia 0 a null
    this.editando = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PersonalService } from '../../../services/personal.service';

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
    Cargo: ''
  };

  editando: boolean = false;

  constructor(private personalService: PersonalService) {}

  ngOnInit(): void {
    this.cargarPersonal();
  }

  cargarPersonal(): void {
    this.personalService.getPersonal().subscribe({
      next: (data) => {
        console.log('📦 Personal recibido:', data);
        this.listaPersonal = data;
      },
      error: (err) => {
        console.error('❌ Error al cargar personal:', err);
        Swal.fire('Error', 'No se pudo cargar el personal', 'error');
      }
    });
  }

  guardarPersonal(): void {
    const payload: any = {
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
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: typeof res === 'string' ? res : res.message || 'Datos actualizados correctamente'
          });
          this.cargarPersonal();
          this.resetFormulario();
        },
        error: (err) => {
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

      this.personalService.agregarPersonal(payload).subscribe({
        next: () => {
          Swal.fire('✅ Registrado', 'Personal registrado correctamente', 'success');
          this.cargarPersonal();
          this.resetFormulario();
        },
        error: (err) => {
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
      Cargo: p.Cargo || ''
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
          next: (res) => {
            Swal.fire('Inhabilitado', typeof res === 'string' ? res : res.message || 'Acceso revocado correctamente', 'success');
            this.cargarPersonal();
          },
          error: (err) => {
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
          next: (res) => {
            Swal.fire('Reactivado', typeof res === 'string' ? res : res.message || 'Acceso restaurado correctamente', 'success');
            this.cargarPersonal();
          },
          error: (err) => {
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
      Cargo: ''
    };
    this.editando = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClasesService } from '../../../../services/clases.service';
import { InstructorService } from '../../../../services/instructor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-clase',
  standalone: true,
  templateUrl: './crear-clase.component.html',
  imports: [CommonModule, FormsModule],
})
export class CrearClaseComponent implements OnInit {
  clase = {
    Nombre: '',
    IDSalaa: null,
    CIInstructor: '',
    CupoMaximo: null,
    Dia: '',
    HoraIni: '',
    HoraFin: ''
  };

  instructores: any[] = [];

  constructor(
    private clasesService: ClasesService,
    private instructorService: InstructorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarInstructores();
  }

  cargarInstructores() {
    this.instructorService.getInstructores().subscribe({
      next: (data) => this.instructores = data,
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los instructores.',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  crearClase() {
    const camposCompletos = Object.values(this.clase).every(valor => valor !== null && valor !== '');
    if (!camposCompletos) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos obligatorios.',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    const { Nombre, IDSalaa, CIInstructor, CupoMaximo, Dia, HoraIni, HoraFin } = this.clase;
    const payload = { Nombre, IDSalaa, CIInstructor, CupoMaximo, Dia, HoraIni, HoraFin };

    this.clasesService.crearClase(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Clase creada!',
          text: 'La clase fue registrada correctamente.',
          confirmButtonColor: '#22c55e'
        }).then(() => {
          this.router.navigate(['/dashboard-admin/todas-clases']);
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '❌ Hubo un problema al crear la clase.',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }
}

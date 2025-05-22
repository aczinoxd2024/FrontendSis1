import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClasesService } from '../../../../services/clases.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-clase',
  standalone: true,
  templateUrl: './crear-clase.component.html',
  imports: [CommonModule, FormsModule],
})
export class CrearClaseComponent implements OnInit {
  clase = {
    Nombre: '',
    Estado: 'Pendiente',
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
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.clasesService.obtenerInstructoresDisponibles().subscribe({
      next: (data) => this.instructores = data,
      error: (err) => {
        console.error('Error cargando instructores', err);
        this.toastr.error('No se pudieron cargar los instructores');
      }
    });
  }

  crearClase() {
    if (
      !this.clase.Nombre ||
      !this.clase.IDSalaa ||
      !this.clase.CIInstructor ||
      !this.clase.CupoMaximo ||
      !this.clase.Dia ||
      !this.clase.HoraIni ||
      !this.clase.HoraFin
    ) {
      this.toastr.warning('Completa todos los campos obligatorios');
      return;
    }

    this.clasesService.crearClase(this.clase).subscribe({
      next: () => {
        this.router.navigate(['/dashboard-admin/todas-clases'], {
          state: { mensaje: 'Clase creada con éxito' }
        });
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('❌ Error al crear la clase');
      }
    });
  }
}

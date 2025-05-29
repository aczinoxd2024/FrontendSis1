import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClasesService } from '../../../../services/clases.service';
import { InstructorService } from '../../../../services/instructor.service';
import { SalaService } from '../../../../services/sala.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-clase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-clase.component.html',
  styleUrls: ['./editar-clase.component.css']
})
export class EditarClaseComponent implements OnInit {
  claseId!: number;
  clase = {
    Nombre: '',
    IDSalaa: null,
    CIInstructor: '',
    CupoMaximo: 0,
    Dia: '',
    HoraIni: '',
    HoraFin: ''
  };
  instructores: any[] = [];
  salas: any[] = [];

  diasSemana: string[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
  ];

  constructor(
    private route: ActivatedRoute,
    private claseService: ClasesService,
    private salaService: SalaService,
    private instructorService: InstructorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.claseId = +this.route.snapshot.paramMap.get('id')!;

    Promise.all([
      this.salaService.obtenerSalas().toPromise(),
      this.instructorService.getInstructores().toPromise()
    ]).then(([salas = [], instructores = []]) => {
      this.salas = salas;
      this.instructores = instructores;

      this.claseService.getClasePorId(this.claseId).subscribe({
        next: (data) => {
          this.clase = {
            ...data,
            HoraIni: data.HoraIni?.slice(0, 5),
            HoraFin: data.HoraFin?.slice(0, 5),
            Dia: this.normalizarDia(data.Dia)
          };
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar la clase.',
            confirmButtonColor: '#ef4444'
          });
        }
      });
    });
  }

  actualizarClase(): void {
    const camposCompletos = Object.values(this.clase).every(v => v !== null && v !== '');
    if (!camposCompletos) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos.',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    if (!this.clase.Dia) {
      Swal.fire({
        icon: 'warning',
        title: 'Día faltante',
        text: 'Selecciona un día de la semana.',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    if (this.clase.HoraIni >= this.clase.HoraFin) {
      Swal.fire({
        icon: 'warning',
        title: 'Horario inválido',
        text: 'La hora de fin debe ser mayor que la hora de inicio.',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    const claseAEnviar = {
      Nombre: this.clase.Nombre,
      IDSalaa: this.clase.IDSalaa,
      CIInstructor: this.clase.CIInstructor,
      CupoMaximo: this.clase.CupoMaximo,
      Dia: this.clase.Dia,
      HoraIni: this.clase.HoraIni,
      HoraFin: this.clase.HoraFin
    };

    this.claseService.actualizarClase(this.claseId, claseAEnviar).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Clase actualizada',
          text: 'Los datos fueron guardados correctamente.',
          confirmButtonColor: '#22c55e'
        }).then(() => {
          this.router.navigate(['/dashboard-admin/todas-clases'], {
            //state: { mensaje: 'Clase actualizada correctamente.' }
          });
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la clase.',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  normalizarDia(dia: string): string {
    const mapaDias: { [key: string]: string } = {
      lunes: 'Lunes',
      martes: 'Martes',
      miercoles: 'Miércoles',
      miércoles: 'Miércoles',
      jueves: 'Jueves',
      viernes: 'Viernes',
      sabado: 'Sábado',
      sábado: 'Sábado'
    };

    return mapaDias[dia.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')] || dia;
  }
}

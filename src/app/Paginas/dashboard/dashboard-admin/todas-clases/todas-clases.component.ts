import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClasesService } from '../../../../services/clases.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-todas-clases',
  standalone: true,
  templateUrl: './todas-clases.component.html',
  styleUrls: ['./todas-clases.component.css'],
  imports: [CommonModule]
})
export class TodasClasesComponent implements OnInit {
  clases: any[] = [];

  constructor(
    private clasesService: ClasesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const mensaje = history.state?.mensaje;
    if (mensaje) {
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: mensaje,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#1f2937',
        color: '#fff',
        customClass: {
          popup: 'rounded-lg shadow-lg text-sm'
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
    }

    this.clasesService.obtenerTodasLasClases().subscribe({
      next: (data: any[]) => {
        console.log('📦 Clases recibidas:', data);
        data.forEach(c => {
          console.log(`Clase: ${c.Nombre} → Sala:`, c.sala);
        });
        this.clases = data;
      },
      error: (err: any) => {
        console.error('❌ Error al cargar clases', err);
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'error',
          title: 'Error al cargar las clases',
          showConfirmButton: false,
          timer: 3000,
          background: '#1f2937',
          color: '#fff'
        });
      }
    });
  }

  editarClase(id: number) {
    this.router.navigate(['/dashboard-admin/editar-clase', id]);
  }

  confirmarSuspension(idClase: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La clase será suspendida y los usuarios no podrán reservarla.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, suspender',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clasesService.suspenderClase(idClase).subscribe({
          next: () => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Clase suspendida con éxito',
              showConfirmButton: false,
              timer: 2000,
              background: '#1f2937',
              color: '#fff'
            });
            const index = this.clases.findIndex(c => c.IDClase === idClase);
            if (index !== -1) this.clases[index].Estado = 'Suspendida';
          },
          error: () => {
            Swal.fire('Error', 'No se pudo suspender la clase.', 'error');
          }
        });
      }
    });
  }

  confirmarReactivacion(idClase: number): void {
    Swal.fire({
      title: '¿Reactivar clase?',
      text: 'La clase volverá a estar disponible para reservas.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, reactivar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clasesService.reactivarClase(idClase).subscribe({
          next: () => {
            Swal.fire('¡Reactivada!', 'La clase fue activada con éxito.', 'success');
            const index = this.clases.findIndex(c => c.IDClase === idClase);
            if (index !== -1) this.clases[index].Estado = 'Activo';
          },
          error: () => {
            Swal.fire('Error', 'No se pudo reactivar la clase.', 'error');
          }
        });
      }
    });
  }
}

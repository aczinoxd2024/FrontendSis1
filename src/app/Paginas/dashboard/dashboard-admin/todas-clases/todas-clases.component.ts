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
    // ✅ Mostrar toast si viene mensaje de redirección
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
        background: '#1f2937', // Fondo oscuro (gray-900)
        color: '#fff', // Texto blanco
        customClass: {
          popup: 'rounded-lg shadow-lg text-sm'
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
    }

    // 🔄 Cargar clases
    this.clasesService.obtenerTodasLasClases().subscribe({
      next: (data: any[]) => {
        console.log('📦 Clases recibidas:', data);
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
  console.log('ID a editar:', id); // TEMPORAL: para depuración
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
          Swal.fire('¡Suspendida!', 'La clase fue suspendida con éxito.', 'success');

          // Volver a cargar la lista de clases
          this.clasesService.obtenerTodasLasClases().subscribe({
            next: (data: any[]) => {
              this.clases = data;
            },
            error: () => {
              Swal.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'error',
                title: 'Error al recargar las clases',
                showConfirmButton: false,
                timer: 3000,
                background: '#1f2937',
                color: '#fff'
              });
            }
          });
        },
        error: () => {
          Swal.fire('Error', 'No se pudo suspender la clase.', 'error');
        }
      });
    }
  });
}
}

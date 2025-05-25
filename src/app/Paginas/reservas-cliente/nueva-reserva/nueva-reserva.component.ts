import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../../services/reserva.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nueva-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-reserva.component.html',
})
export class NuevaReservaComponent implements OnInit {
  clases: any[] = [];
  reservasActivas: any[] = [];
  idClase: number | null = null;
  mensajeError: string = '';

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.cargarReservasYClases();
  }

  cargarReservasYClases() {
    this.reservaService.getMisReservas().subscribe({
      next: (reservas) => {
        this.reservasActivas = reservas;
        this.cargarClasesPermitidas();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar reservas del cliente',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  cargarClasesPermitidas() {
    this.reservaService.getClasesPermitidas().subscribe({
      next: (clases) => {
        this.clases = clases.map((clase: any) => {
          const yaReservada = this.reservasActivas.some(r => r.clase?.IDClase === clase.IDClase);
          const llena = clase.NumInscritos >= clase.CupoMaximo;
          const activa = clase.Estado === 'Activo';
          return { ...clase, yaReservada, llena, activa };
        });

        if (this.clases.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin clases disponibles',
            text: '🔒 No tienes clases disponibles actualmente.',
            confirmButtonColor: '#6b7280'
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar clases permitidas',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  puedeReservar(clase: any): boolean {
    return clase.activa && !clase.yaReservada && !clase.llena;
  }

  reservar() {
    if (!this.idClase) {
      this.mensajeError = '🔔 Debes seleccionar una clase';
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: this.mensajeError,
        confirmButtonColor: '#facc15'
      });
      return;
    }

    this.reservaService.crearReserva(this.idClase).subscribe({
      next: (res: any) => {
        this.mensajeError = '';

        Swal.fire({
          icon: 'success',
          title: '✅ Reserva confirmada',
          text: 'Tu reserva fue registrada correctamente',
          confirmButtonColor: '#10b981'
        });

        if (res.claseActivada) {
          Swal.fire({
            icon: 'info',
            title: '🎉 Clase activada',
            text: 'La clase se ha activado automáticamente',
            confirmButtonColor: '#3b82f6'
          });
        }

        this.cargarReservasYClases();
      },
      error: (err: any) => {
        const msg = err.error?.message || '❌ Error al crear la reserva';
        this.mensajeError = msg;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: msg,
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }
}

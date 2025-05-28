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

          console.log('Clase cargada:', {
            nombre: clase.Nombre,
            activa,
            yaReservada,
            llena,
            estado: clase.Estado
          });

          return { ...clase, yaReservada, llena, activa };
        });

        // Establecer clase seleccionada automáticamente si hay alguna válida
        const seleccionable = this.clases.find(c => this.puedeReservar(c));
        this.idClase = seleccionable?.IDClase ?? null;

        if (!seleccionable) {
          Swal.fire({
            icon: 'info',
            title: 'Sin clases disponibles para reservar',
            html: `
              🔒 Actualmente no hay clases disponibles que puedas reservar.<br><br>
              📅 Puede deberse a que:<br>
              - Ya reservaste esa clase<br>
              - La clase está llena<br>
              - Ya comenzó o quedan menos de 30 minutos para iniciar
            `,
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
    const ahora = new Date();
    const tieneHorarioValido = (clase.horarios || []).some((h: any) => {
      const hoy = new Date();
      const horaInicio = new Date(`${hoy.toISOString().split('T')[0]}T${h.HoraIni}`);
      return ahora < horaInicio;
    });

    console.log('🔍 Horarios válidos:', tieneHorarioValido, clase.horarios);
    return clase.activa && !clase.yaReservada && !clase.llena && tieneHorarioValido;
  }

  puedeReservarSeleccionada(): boolean {
    const clase = this.clases.find(c => Number(c.IDClase) === Number(this.idClase));
    return clase ? this.puedeReservar(clase) : false;
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

    const id = Number(this.idClase);

    this.reservaService.crearReserva(id).subscribe({
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
        console.error('❌ Error completo:', err);
        const msg =
          (err?.error && typeof err.error === 'object' && err.error.message) ||
          err?.message ||
          '❌ Error al crear la reserva';

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

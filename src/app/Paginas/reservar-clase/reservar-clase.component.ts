import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../services/reserva.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reservar-clase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservar-clase.component.html',
})
export class ReservarClaseComponent implements OnInit {
  clases: any[] = [];
  reservasActivas: any[] = [];
  idClase: number | null = null;
  mensajeError: string = '';


  constructor(
    private reservaService: ReservaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarReservasYClases();
  }

  cargarReservasYClases() {
    this.reservaService.getMisReservas().subscribe({
      next: (reservas) => {
        this.reservasActivas = reservas;
        this.cargarClases();
      },
      error: () => this.toastr.error('Error al cargar reservas del cliente')
    });
  }

  cargarClases() {
    this.reservaService.getClasesDisponibles().subscribe({
      next: (clases) => {
        this.clases = clases.map((clase: any) => {
          const yaReservada = this.reservasActivas.some(r => r.clase?.IDClase === clase.IDClase);
          const llena = clase.NumInscritos >= clase.CupoMaximo;
          return { ...clase, yaReservada, llena };
        });
      },
      error: () => this.toastr.error('Error al cargar clases')
    });
  }

  puedeReservar(clase: any): boolean {
    return !clase.yaReservada && !clase.llena;
  }

  reservar() {
  if (!this.idClase) {
    this.mensajeError = '🔔 Debes seleccionar una clase';
    this.toastr.warning(this.mensajeError);
    return;
  }

  this.reservaService.crearReserva(this.idClase).subscribe({
    next: (res: any) => {
      this.mensajeError = ''; // ✅ LIMPIA mensaje si se reserva bien
      this.toastr.success('✅ Reserva confirmada');
      if (res.claseActivada) {
        this.toastr.info('🎉 La clase se ha activado automáticamente');
      }
      this.cargarReservasYClases();
    },
    error: (err: any) => {
      const msg = err.error?.message || '❌ Error al crear la reserva';
      this.mensajeError = msg;
      this.toastr.error(msg);
    }
  });
}

}

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
  idClase: number | null = null;
  ciCliente: string = '';

  constructor(
    private reservaService: ReservaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  reservar() {
    if (!this.idClase || !this.ciCliente) {
      this.toastr.warning('🔔 Debes completar todos los campos');
      return;
    }

   this.reservaService.crearReserva(this.idClase, this.ciCliente).subscribe({
      next: (res: any) => {
        this.toastr.success('✅ Reserva confirmada');
        if (res.claseActivada) {
          this.toastr.info('🎉 La clase se ha activado automáticamente');
        }
      },
      error: (err: any) => {
        const msg = err.error?.message || '❌ Error al crear la reserva';
        this.toastr.error(msg);
      }
    });
  }
}

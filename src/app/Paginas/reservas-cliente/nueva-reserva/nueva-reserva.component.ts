import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../../services/reserva.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nueva-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-reserva.component.html'
})
export class NuevaReservaComponent implements OnInit {
  IDClase: number | null = null;
  clases: any[] = [];

  constructor(
    private reservaService: ReservaService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarClases();
  }

  cargarClases(): void {
    this.http.get<any[]>('https://web-production-d581.up.railway.app/api/clases')
      .subscribe({
        next: (data) => this.clases = data,
        error: (err) => {
          console.error('Error al cargar clases', err);
          this.toastr.error('❌ No se pudieron cargar las clases');
        }
      });
  }

  reservar(): void {
    if (!this.IDClase) {
      this.toastr.warning('🔔 Debes seleccionar una clase');
      return;
    }

    this.reservaService.crearReserva(this.IDClase).subscribe({
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

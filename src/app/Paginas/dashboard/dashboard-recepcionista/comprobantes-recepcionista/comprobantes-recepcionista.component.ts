import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../../../../services/pagos.service';

@Component({
  selector: 'app-comprobantes-recepcionista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comprobantes-recepcionista.component.html',
})
export class ComprobantesRecepcionistaComponent {
  ciBusqueda: string = '';
  pagos: any[] = [];
  mensaje: string = '';
  cargando: boolean = false;

  constructor(private pagoService: PagoService) {}

  buscarPagos(): void {
    const ci = this.ciBusqueda.trim();
    if (!ci) {
      this.mensaje = 'Debe ingresar un CI para buscar.';
      this.pagos = [];
      return;
    }

    this.mensaje = '';
    this.cargando = true;

    this.pagoService.getPagosPorCI(ci).subscribe({
      next: (data: any[]) => {
        this.pagos = data;
        if (data.length === 0) {
          this.mensaje = 'No se encontraron pagos para este cliente.';
        }
        this.cargando = false;
      },
      error: () => {
        this.mensaje = 'Error al buscar pagos. Intente nuevamente.';
        this.pagos = [];
        this.cargando = false;
      },
    });
  }

  descargar(nroPago: number): void {
    this.pagoService.descargarComprobante(nroPago);
  }
}

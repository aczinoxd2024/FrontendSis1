import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MembresiaService } from '../../services/membresia.service';

@Component({
  selector: 'app-membresias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './membresias.component.html',
})
export class MembresiasComponent implements OnInit {
  tipos: any[] = [];

  constructor(
    private router: Router,
    private membresiaService: MembresiaService
  ) {}

  ngOnInit(): void {
    this.membresiaService.obtenerMembresias().subscribe({
      next: (data) => this.tipos = data,
      error: (err) => console.error('Error al cargar membresías:', err),
    });
  }

  seleccionarMembresia(id: number): void {
    this.router.navigate(['/adquirir-membresia', id]);
  }

  promocionActiva(promo: any): boolean {
    if (!promo || !promo.Descuento || !promo.FechaInicio || !promo.FechaFin) return false;

    const hoy = new Date();
    const inicio = new Date(promo.FechaInicio);
    const fin = new Date(promo.FechaFin);

    return hoy >= inicio && hoy <= fin;
  }

  precioFinal(tipo: any): string {
    if (this.promocionActiva(tipo.promocion)) {
      const descuento = (+tipo.Precio) * (+tipo.promocion.Descuento) / 100;
      return `Bs. ${(tipo.Precio - descuento).toFixed(2)} / mes (Promoción!)`;
    }
    return `Bs. ${(+tipo.Precio).toFixed(2)} / mes`;
  }
}

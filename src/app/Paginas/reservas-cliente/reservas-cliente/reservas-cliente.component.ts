import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HistorialReservasComponent } from '../historial/historial.component';
import { NuevaReservaComponent } from '../nueva-reserva/nueva-reserva.component';

@Component({
  selector: 'app-reservas-cliente',
  standalone: true,
  imports: [CommonModule, HistorialReservasComponent, NuevaReservaComponent],
  templateUrl: './reservas-cliente.component.html'
})
export class ReservasClienteComponent implements AfterViewInit {
  tab: 'historial' | 'nueva' = 'historial';

  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    // Esperamos a que todo el ciclo de renderizado termine para leer el fragmento
    setTimeout(() => {
      const fragment = this.route.snapshot.fragment;
      if (fragment === 'nueva') {
        this.tab = 'nueva';
      }
    });
  }

  setTab(tab: 'historial' | 'nueva') {
    this.tab = tab;
  }
}

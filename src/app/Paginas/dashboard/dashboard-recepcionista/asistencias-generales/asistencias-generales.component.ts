import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaService } from '../../../../services/asistencia.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-asistencias-generales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asistencias-generales.component.html',
  styleUrls: []
})
export class AsistenciasGeneralesComponent {
  asistencias$: Observable<any[]>;
  error = '';

  constructor(private asistenciaService: AsistenciaService) {
    this.asistencias$ = this.asistenciaService.obtenerHistorialConFechas().pipe(
      catchError(err => {
        this.error = 'Error al cargar las asistencias';
        console.error('Error en obtenerHistorialConFechas:', err);
        return of([]); // Devuelve arreglo vacío para no romper el async pipe
      })
    );
  }
}

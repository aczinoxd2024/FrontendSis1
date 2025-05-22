import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaService } from '../../services/asistencia.service';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asistencia.component.html',
})
export class AsistenciaComponent implements OnInit {
  mensaje = '';

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit(): void {}

  marcarAsistencia() {
    this.asistenciaService.marcarAsistencia().subscribe({
      next: () => {
        this.mensaje = '✅ Asistencia registrada correctamente.';
      },
      error: (err) => {
        if (err.status === 409) {
          this.mensaje = '⚠️ Ya registraste tu asistencia hoy.';
        } else {
          this.mensaje = '❌ Error al registrar asistencia.';
        }
      },
    });
  }
}

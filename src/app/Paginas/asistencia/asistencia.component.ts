import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaService } from '../../services/asistencia.service';
import { ClienteService } from '../../interfaces/cliente.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asistencia.component.html',
})
export class AsistenciaComponent implements OnInit {
  mensaje = '';
  nombreUsuario = '';
  historialAsistencia: any[] = [];
  mostrarTablaCompleta: boolean = false;

  constructor(
    private asistenciaService: AsistenciaService,
    private clienteService: ClienteService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerNombreDesdeBackend();
    this.obtenerHistorial();
  }

  obtenerNombreDesdeBackend(): void {
    this.clienteService.obtenerPerfilCliente().subscribe({
      next: (data) => {
        const nombre = data.nombre ?? '';
        const apellido = data.apellido ?? '';
        this.nombreUsuario = `${nombre} ${apellido}`.trim();
      },
      error: (err) => {
        console.error('Error al obtener el nombre del cliente:', err);
        this.nombreUsuario = 'Cliente';
      }
    });
  }

  marcarAsistencia() {
    this.asistenciaService.marcarAsistencia().subscribe({
      next: () => {
        this.mensaje = '✅ Asistencia registrada correctamente.';
        this.obtenerHistorial();
      },
      error: (err) => {
        if (err.error?.message === 'Ya registraste tu asistencia hoy') {
          this.mensaje = '⚠️ Ya has registrado tu asistencia hoy.';
        } else {
          this.mensaje = '❌ Error al registrar asistencia.';
        }
        console.error('Error al marcar asistencia:', err);
      }
    });
  }

  obtenerHistorial() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.apiUrl}/asistencia/mi-historial`, { headers }).subscribe({
      next: (historial) => {
        this.historialAsistencia = historial;
      },
      error: (err) => {
        console.error('❌ Error al obtener historial:', err);
      }
    });
  }

  toggleTablaCompleta() {
    this.mostrarTablaCompleta = !this.mostrarTablaCompleta;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

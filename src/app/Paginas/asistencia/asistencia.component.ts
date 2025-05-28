import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaService } from '../../services/asistencia.service';
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
  historialAsistencia: any[] = []; // ✅ Aquí se guarda el historial
  mostrarTablaCompleta: boolean = false;
  constructor(
    private asistenciaService: AsistenciaService,
    private http: HttpClient, // ✅ HttpClient para llamada directa
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.nombreUsuario = payload.nombre || 'Cliente';
        this.obtenerHistorial(); // ✅ Cargar historial en OnInit
      } catch (e) {
        console.error('Token inválido:', e);
      }
    }
  }

  marcarAsistencia() {
    this.asistenciaService.marcarAsistencia().subscribe({
      next: (res) => {
        alert('Asistencia registrada correctamente.');
        this.obtenerHistorial(); // ✅ Refrescar historial tras marcar
      },
      error: (err) => {
        if (err.error?.message === 'Ya registraste tu asistencia hoy') {
          alert('Ya has registrado tu asistencia hoy. No puedes registrarla dos veces.');
        } else {
          alert('Error al registrar asistencia. Intenta más tarde.');
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
      console.log('✅ Historial recibido:', historial); // 🔍 Verifica aquí si llega
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
    localStorage.removeItem('token'); // Borra el token
    this.router.navigate(['/login']); // Redirige al login (ajusta la ruta si tienes otra)
  }


}

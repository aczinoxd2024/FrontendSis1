import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class PersonalService {
  private apiUrl = `${environment.apiUrl}/personal`;

  constructor(private http: HttpClient) {}

  registrarEntrada(ci: string) {
    return this.http.post(`${this.apiUrl}/asistencia-escanear`, { ci }, {
      headers: this.getHeaders()
    });
  }

  registrarSalida(ci: string) {
    return this.http.post(`${this.apiUrl}/asistencia-salida`, { ci }, {
      headers: this.getHeaders()
    });
  }
    // ✅ NUEVO: Obtener historial de asistencias del personal
  obtenerHistorialPersonal(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/asistencias/hoy`, {

      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RutinaService {
  private apiUrl = `${environment.apiUrl}/rutinas`;

  constructor(private http: HttpClient) {}

  // ✅ Obtener todas las rutinas
  getRutinas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // ✅ Crear nueva rutina
  crearRutina(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    });

    return this.http.post(this.apiUrl, data, { headers });
  }

  // ✅ Actualizar rutina existente
  actualizarRutina(id: number, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    });

    return this.http.put(`${this.apiUrl}/${id}`, data, { headers });
  }

  // ✅ Eliminar (desactivar) rutina - ajustar si tu backend usa DELETE o PUT
  eliminarRutina(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    });

    // Asumiendo que en el backend tienes PUT /rutinas/:id/desactivar
    return this.http.put(`${this.apiUrl}/${id}/desactivar`, {}, { headers });
  }
}

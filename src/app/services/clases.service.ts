import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClasesService {
  private apiUrl = 'https://web-production-d581.up.railway.app/api/clases';

  constructor(private http: HttpClient) {}

  // 🔹 Clases públicas visibles para clientes no autenticados
  obtenerClasesPublicas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/publicas`);
  }

  // 🔹 Clases asignadas al instructor logueado (requiere token)
  obtenerMisClases(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-clases`);
  }

  // 🔹 Instructores asignados a una clase
  obtenerInstructoresPorClase(idClase: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idClase}/instructores`);
  }

  // 🔹 Todas las clases del sistema (admin)
  obtenerTodasLasClases(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 🔹 Crear nueva clase
  crearClase(clase: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, clase);
  }

  // 🔹 Obtener instructores disponibles (fuera de clases en ese horario)
  obtenerInstructoresDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://web-production-d581.up.railway.app/api/instructores'
    );
  }

  // 🔹 Obtener clase específica por ID
  getClasePorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Actualizar clase
  actualizarClase(id: number, clase: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, clase);
  }

  // 🔹 Suspender clase
  suspenderClase(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/suspender`, {});
  }

  // 🔹 Reactivar clase
  reactivarClase(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/reactivar`, {});
  }

  // 🔹 Eliminar (o suspender lógicamente) clase
  eliminarClase(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

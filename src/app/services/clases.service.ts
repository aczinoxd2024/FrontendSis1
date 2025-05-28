import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
   private apiUrl = 'https://web-production-d581.up.railway.app/api/clases'; // Ajusta si estás en producción
   //private apiUrl = 'http://localhost:3000/api/clases';

  constructor(private http: HttpClient) {}

  obtenerClasesPublicas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/publicas`);
  }
   obtenerMisClases(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-clases`);
  }
   obtenerInstructoresPorClase(idClase: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idClase}/instructores`);
  }
  obtenerTodasLasClases(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}`);
}
crearClase(clase: any): Observable<any> {
  return this.http.post(`${this.apiUrl}`, clase);
}

obtenerInstructoresDisponibles(): Observable<any[]> {
  return this.http.get<any[]>('https://web-production-d581.up.railway.app/api/instructores');
}
// ✅ Obtener clase por ID
getClasePorId(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`);
}

// ✅ Actualizar clase existente
actualizarClase(id: number, clase: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${id}`, clase);
}

suspenderClase(id: number) {
  return this.http.patch(`${this.apiUrl}/${id}/suspender`, {});
}

reactivarClase(id: number) {
  return this.http.patch(`${this.apiUrl}/${id}/reactivar`, {});
}


eliminarClase(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`);
}


}

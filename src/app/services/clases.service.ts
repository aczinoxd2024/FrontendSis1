import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
   private apiUrl = 'https://web-production-d581.up.railway.app/api/clases'; // Ajusta si estás en producción
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
}

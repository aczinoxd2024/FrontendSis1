import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators'; // IMPORTAR map y catchError correctamente

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private baseUrl = 'https://web-production-d581.up.railway.app/api/asistencia';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  marcarAsistencia(): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrar`, null, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error al marcar asistencia:', error);
        return throwError(() => error);
      })
    );
  }

  obtenerHistorialConFechas(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}`, { headers: this.getHeaders() }).pipe(
    map((historial: any[]) => historial.map((item: any) => ({
      ...item,
      fecha: new Date(item.fecha)
    }))),
    catchError(error => {
      console.error('Error al obtener historial:', error);
      return throwError(() => error);
    })
  );
}
}

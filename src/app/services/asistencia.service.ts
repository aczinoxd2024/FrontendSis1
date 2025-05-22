import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    return this.http.post(`${this.baseUrl}/registrar`, {}, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error al marcar asistencia:', error);
        return throwError(() => error);
      })
    );
  }
}

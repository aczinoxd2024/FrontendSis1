import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


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

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}

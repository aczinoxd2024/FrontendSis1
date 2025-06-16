import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PersonalService {
  private apiUrl = `${environment.apiUrl}/gestion-personal`;

  constructor(private http: HttpClient) {}

  // 🔹 Listar personal
  getPersonal(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // 🔹 Agregar personal
  agregarPersonal(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data, {
      headers: this.getHeaders()
    });
  }

  // 🔹 Actualizar personal
  actualizarPersonal(ci: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${ci}`, data, {
      headers: this.getHeaders()
    });
  }

  // 🔹 Inhabilitar personal
  inhabilitarPersonal(ci: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${ci}`, {
      headers: this.getHeaders()
    });
  }

  // ✅ 🔹 Reactivar personal
  reactivarPersonal(ci: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reactivar/${ci}`, {}, {
      headers: this.getHeaders()
    });
  }

  // 🔄 Funciones usadas por escaneo (si las necesitas)
  registrarEntrada(ci: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/personal/asistencia-escanear`, { ci }, {
      headers: this.getHeaders()
    });
  }

  registrarSalida(ci: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/personal/asistencia-salida`, { ci }, {
      headers: this.getHeaders()
    });
  }

  // 🔐 Cabecera JWT
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}

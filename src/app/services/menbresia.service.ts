import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembresiaService {

  private apiUrl = 'https://web-production-d581.up.railway.app/api/tipos-membresia'; // Cambia esta ruta por tu endpoint real

  constructor(private http: HttpClient) {}

  obtenerMembresias(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'https://web-production-d581.up.railway.app/api';

  constructor(private http: HttpClient) {}

  updateUsuario(id: string, datosUsuario: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token. El usuario no está autenticado.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put(`${this.apiUrl}/usuarios/${id}`, datosUsuario, { headers });
  }

  // ✅ Método necesario para cargar el perfil en perfil-cliente.component.ts
  obtenerPerfil(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token. El usuario no está autenticado.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/usuarios/mi-perfil`, { headers });
  }
}

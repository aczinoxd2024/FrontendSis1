import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3010/auth'; // Ajusta si usas otra URL

  constructor(private http: HttpClient) {}

  login(correo: string, contrasena: string, rolSeleccionado: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      correo,
      contrasena,
      rolSeleccionado,
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}


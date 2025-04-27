import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // URL de tu backend para autenticación

  constructor(private http: HttpClient) {}

  /**
   * Método para realizar login y obtener el token JWT
   * @param correo El correo del usuario
   * @param contrasena La contraseña del usuario
   * @returns Un Observable que contiene el token de acceso si la autenticación es exitosa
   */
  login(correo: string, contrasena: string): Observable<any> {
    const loginPayload = { correo, contrasena }; // ✅ corregido aquí
    return this.http.post(`${this.apiUrl}/login`, loginPayload);
  }

  /**
   * Método para obtener el token almacenado en el localStorage
   * @returns El token JWT almacenado o null si no existe
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Método para guardar el token JWT en el localStorage
   * @param token El token JWT que se va a almacenar
   */
  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  /**
   * Método para hacer una solicitud protegida con el token JWT
   * @param endpoint El endpoint al que se desea acceder
   * @returns Observable con la respuesta del servidor
   */
  getProtectedData(endpoint: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/${endpoint}`, { headers });
  }
}

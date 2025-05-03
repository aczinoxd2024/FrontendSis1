import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  /**
   * Inicia sesión enviando las credenciales al backend
   * Almacena token, datos del usuario (incluyendo nombre) y rol en localStorage.
   */
  login(correo: string, contrasena: string, rolSeleccionado: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      correo,
      contrasena,
      rolSeleccionado
    }).pipe(
      tap(response => {
        // Guardar token
        localStorage.setItem('token', response.access_token);

        // Guardar usuario completo (id, correo, nombre, rol)
        localStorage.setItem('user', JSON.stringify(response.user));

        // Guardar rol (opcional porque ya está en user)
        localStorage.setItem('rol', response.user.rol);
      })
    );
  }

  /**
   * Cierra la sesión llamando al backend para registrar en bitácora
   * Luego limpia la sesión local y redirige al Welcome.
   */
  logout(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.clearSession();
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.post(`${this.apiUrl}/logout`, {}, { headers }).subscribe({
      next: () => {
        console.log('✅ Logout registrado en backend');
        this.clearSession();
      },
      error: (err) => {
        console.error('❌ Error al registrar logout:', err);
        this.clearSession();
      }
    });
  }

  /**
   * Limpia los datos locales y redirige al Welcome
   */
  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rol');

    // Redirigir al Welcome (inicio)
    window.location.href = '/';
  }

  /**
   * Retorna el token actual
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  /**
 * Obtiene el usuario actual desde localStorage
 */
getUser(): any {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
}

/**
 * Obtiene el rol actual desde localStorage
 */
getUserRole(): string | null {
  return localStorage.getItem('rol');
}


  /**
   * Verifica si el usuario está logueado (token presente)
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

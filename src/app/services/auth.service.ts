import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'https://web-production-d581.up.railway.app/api/auth';
  private isLoggingOut = false; // ✅ NUEVO: Control para evitar múltiples logout

  constructor(private http: HttpClient) {}

  /**
   * Inicia sesión enviando las credenciales al backend
   */
  login(correo: string, password: string, rol: string) {
  return this.http.post<any>(`${this.apiUrl}/login`, {
    correo,
    password,
    rol
  }).pipe(
    tap(response => {
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('rol', response.user.rol);

      // ✅ Guardar el CI de la persona logueada (Instructor, Cliente, etc.)
      const ci = response.user.ci || response.user.idPersona;
      if (ci) {
        localStorage.setItem('ci', ci);
      }
    })
  );
}


  /**
   * Cierra la sesión llamando al backend para registrar en bitácora
   */
  logout(): void {
    if (this.isLoggingOut) return; // ✅ Evitar que entre dos veces
    this.isLoggingOut = true; // ✅ Marcar que se está cerrando sesión

    const token = localStorage.getItem('token');

    if (!token) {
      this.clearSession(false);
      this.isLoggingOut = false;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.post(`${this.apiUrl}/logout`, {}, { headers }).subscribe({
      next: () => {
        console.log('✅ Logout registrado en backend');
        this.clearSession(true);
      },
      error: (err) => {
        console.error('❌ Error al registrar logout:', err);
        this.clearSession(true);
      }
    });
  }

  /**
   * Limpia los datos locales y redirige al Welcome
   */
  private clearSession(redirect: boolean): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rol');

    this.isLoggingOut = false; // ✅ Volver a permitir futuros logouts

    if (redirect) {
      window.location.assign('/');
    }
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

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }
}

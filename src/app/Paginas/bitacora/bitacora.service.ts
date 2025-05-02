import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {

  private apiUrl = 'http://localhost:3000/bitacora';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de registros de la bitácora desde el backend
   * Incluye el token de autenticación en la cabecera Authorization
   */
  getBitacora(): Observable<any[]> {
    const token = localStorage.getItem('token');

    // ✅ Validar que haya token para evitar errores
    if (!token) {
      console.error('❌ Token no encontrado. El usuario no está autenticado.');
      return new Observable<any[]>(); // Devuelve observable vacío si no hay token
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}

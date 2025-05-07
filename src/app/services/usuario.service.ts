import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Puedes definir la URL base de tu API aquí o usar environment
  private apiUrl = 'https://web-production-d581.up.railway.app/api';

  constructor(private http: HttpClient) {}

  /**
   * Actualiza los datos de un usuario por ID
   * @param id ID del usuario a actualizar
   * @param datosUsuario Objeto con los datos a actualizar
   * @returns Observable con la respuesta
   */
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

  // Puedes agregar otros métodos relacionados a usuarios aquí en el futuro, como:
  // obtenerUsuario(id: string) {}
  // eliminarUsuario(id: string) {}
  // listarUsuarios() {}
}

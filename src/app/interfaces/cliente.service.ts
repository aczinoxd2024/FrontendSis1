import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'https://web-production-d581.up.railway.app/api/clientes';

  constructor(private http: HttpClient) {}

  // ✅ Utilidad para generar headers con token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      return new HttpHeaders();
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
}


  // 👉 Registrar cliente
  registrarCliente(cliente: Cliente): Observable<any> {
    return this.http.post(this.apiUrl, cliente, { headers: this.getHeaders() });
  }

  // 👉 Obtener todos los clientes
  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // 👉 Adquirir membresía (público)
  adquirirMembresia(cliente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/adquirir`, cliente);
  }

  // 👉 Actualizar cliente
  actualizarCliente(ci: string, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ci}`, datos, { headers: this.getHeaders() });
  }

  // 👉 Obtener cliente por CI
  obtenerClientePorCI(ci: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${ci}`, { headers: this.getHeaders() });
  }

  // 👉 Eliminar cliente (desactivar)
  eliminarCliente(ci: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${ci}`, { headers: this.getHeaders() });
  }
}

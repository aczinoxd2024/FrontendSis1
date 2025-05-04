import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'https://web-production-d581.up.railway.app/api/clientes';

  constructor(private http: HttpClient) {}

  // 👉 Método para registrar cliente (requiere token)
  registrarCliente(cliente: Cliente): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(this.apiUrl, cliente, { headers });
  }

  // 👉 Método para obtener clientes (requiere token)
  obtenerClientes(): Observable<Cliente[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Cliente[]>(this.apiUrl, { headers });
  }

  // 👉 Método para adquirir membresía (NO requiere token → público)
  adquirirMembresia(cliente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/adquirir`, cliente);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MembresiaService {
  private apiUrl = 'https://web-production-d581.up.railway.app/api/tipo_membresia'; // ✅ ENDPOINT CORRECTO
  //private apiUrl = 'http://localhost:3000/api/tipo_membresia'; // si usas NestJS localmente

  constructor(private http: HttpClient) {}

  obtenerMembresias(): Observable<any[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  crearMembresia(membresia: any): Observable<any> {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.post(this.apiUrl, membresia, { headers });
}

obtenerMembresiaPorId(id: number): Observable<any> {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
}

actualizarMembresia(id: number, datos: any): Observable<any> {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.put(`${this.apiUrl}/${id}`, datos, { headers });
}

eliminarMembresia(id: number): Observable<any> {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.delete(`${this.apiUrl}/${id}`, { headers });
}

 // ✅ NUEVO: Para redirigir al pago directo desde renovación
 iniciarPagoDirecto(ci: string, tipoMembresiaId: number, correo: string) {
  return this.http.post<{ url: string }>(
    'https://web-production-d581.up.railway.app/api/stripe/checkout-renovacion',
    //'http://localhost:3000/api/stripe/checkout-renovacion', // ✅ local
    {
      ci,
      tipoMembresiaId,
      correo
    }
  );
}


}

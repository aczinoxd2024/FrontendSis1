import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromoService {
 private apiUrl = 'https://web-production-d581.up.railway.app/api/promociones-crud';


  constructor(private http: HttpClient) {}

  obtenerPromociones(): Observable<any[]> {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.get<any[]>(this.apiUrl, { headers });
}



  // Si en el futuro deseas crear/editar:
  crearPromocion(promo: any): Observable<any> {
    return this.http.post(this.apiUrl, promo);
  }

  eliminarPromocion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  actualizarPromocion(id: number, promo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, promo);
  }
}

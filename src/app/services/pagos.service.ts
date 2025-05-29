import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private apiUrl = 'http://localhost:3000/api/pagos'; // cambia esto si estás en producción

  constructor(private http: HttpClient) {}

  crearSesion(amount: number, description: string, email: string) {
    return this.http.post<{ id: string }>(`${this.apiUrl}/checkout`, {
      amount,
      description,
      email,
    });
  }

  getPagosPorCI(ci: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/${ci}`);
  }

  descargarComprobante(nroPago: number): void {
    const url = `${this.apiUrl}/comprobante/${nroPago}`;
    window.open(url, '_blank');
  }
}

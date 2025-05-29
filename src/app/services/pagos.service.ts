import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})


export class PagoService {
  private apiUrl = 'https://web-production-d581.up.railway.app/api/pagos'; // cambia esto si estás en producción

  constructor(private http: HttpClient) {}

  crearSesion(amount: number, description: string, email: string, idClase?: number) {
  const body: any = { amount, description, email };
  if (idClase) {
    body.idClase = idClase;
  }

  return this.http.post<{ url: string }>(
    'https://web-production-d581.up.railway.app/api/stripe/checkout',
    body
  );
}
getPagosPorCI(ci: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/${ci}`);
  }

  descargarComprobante(nroPago: number): void {
    const url = `${this.apiUrl}/comprobante/${nroPago}`;
    window.open(url, '_blank');
  }

}

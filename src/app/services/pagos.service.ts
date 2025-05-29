import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
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

}

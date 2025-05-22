import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PagoService {
  constructor(private http: HttpClient) {}

  crearSesion(amount: number, description: string, email: string) {
    return this.http.post<{ id: string }>('https://web-production-d581.up.railway.app/api/stripe/checkout', {
      amount,
      description,
      email
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {

  private apiUrl = 'https://web-production-d581.up.railway.app/api/metodos-pago';

  constructor(private http: HttpClient) {}

  obtenerMetodosPago(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

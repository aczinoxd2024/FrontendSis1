import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = '/api/reservas';

  constructor(private http: HttpClient) {}

  getReservasPasadas(fechaInicio?: string, fechaFin?: string): Observable<any[]> {
    const params: any = {};
    if (fechaInicio) params.fechaInicio = fechaInicio;
    if (fechaFin) params.fechaFin = fechaFin;

    return this.http.get<any[]>(`${this.apiUrl}/mis-reservas-pasadas`, { params });
  }

  // Aquí podrías agregar más métodos como crearReserva(), cancelarReserva(), etc.
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root' // 👈 necesario para la inyección
})
export class ReservaService {
  private apiUrl = 'https://web-production-d581.up.railway.app/api/reservas';

  constructor(private http: HttpClient) {}

crearReserva(IDClase: number) {
  return this.http.post(`${this.apiUrl}`, { IDClase });
}


  cancelarReserva(idReserva: number) {
    return this.http.patch(`${this.apiUrl}/${idReserva}/cancelar`, {});
  }

  getReservasPasadas(fechaInicio?: string, fechaFin?: string) {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);

    return this.http.get<any[]>(`${this.apiUrl}/historial`, { params });
  }

  getReservasFiltradas(ci?: string, estado?: string, fechaInicio?: string, fechaFin?: string) {
    let params = new HttpParams();
    if (ci) params = params.set('ci', ci);
    if (estado) params = params.set('estado', estado);
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);
    return this.http.get<any[]>(`${this.apiUrl}/filtradas`, { params });
  }
}

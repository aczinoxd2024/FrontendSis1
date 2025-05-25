import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'https://web-production-d581.up.railway.app/api/reservas';

  constructor(private http: HttpClient) {}

  crearReserva(IDClase: number) {
    return this.http.post(`${this.apiUrl}`, { IDClase });
  }

  getMisReservas() {
    return this.http.get<any[]>(`${this.apiUrl}/mis-reservas`);
  }

  cancelarReserva(id: number) {
    return this.http.put(`${this.apiUrl}/cancelar/${id}`, {});
  }

  getReservasPasadas(fechaInicio?: string, fechaFin?: string) {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);

    return this.http.get<any[]>(`${this.apiUrl}/historial`, { params });
  }

  getClasesDisponibles() {
    return this.http.get<any[]>(`https://web-production-d581.up.railway.app/api/clases/disponibles`);
  }

  getReservasFiltradas(ci?: string, estado?: string, fechaInicio?: string, fechaFin?: string) {
    let params = new HttpParams();
    if (ci) params = params.set('ci', ci);
    if (estado) params = params.set('estado', estado);
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);
    return this.http.get<any[]>(`${this.apiUrl}/filtradas`, { params });
  }

  // ✅ Nuevo método para obtener solo las clases permitidas según membresía
  getClasesPermitidas() {
  return this.http.get<any[]>(`https://web-production-d581.up.railway.app/api/clases/permitidas`);
}

}

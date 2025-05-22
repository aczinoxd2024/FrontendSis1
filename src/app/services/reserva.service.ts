import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NuevaReservaComponent } from '../Paginas/reservas-cliente/nueva-reserva/nueva-reserva.component';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'https://web-production-d581.up.railway.app/api/reservas';

  constructor(private http: HttpClient) {}

  /**
   * Obtener reservas pasadas del cliente logueado.
   * @param fechaInicio (opcional) Fecha de inicio en formato YYYY-MM-DD
   * @param fechaFin (opcional) Fecha de fin en formato YYYY-MM-DD
   */
  getReservasPasadas(fechaInicio?: string, fechaFin?: string): Observable<any[]> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);

    return this.http.get<any[]>(`${this.apiUrl}/mis-reservas-pasadas`, { params });
  }

  /**
   * Crear una reserva para una clase específica.
   * @param IDClase ID de la clase a reservar
   * @param CI CI del cliente que reserva
   */
  crearReserva(IDClase: number, CI: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/nueva-reserva`,{ IDClase, CI });
  }

  // Métodos futuros:
  // cancelarReserva(idReserva: number): Observable<any> { ... }
  // confirmarAsistencia(idReserva: number): Observable<any> { ... }
}

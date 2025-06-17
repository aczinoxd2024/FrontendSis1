import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioUsoService {
  private baseUrl = 'https://web-production-d581.up.railway.app/api/inventario-uso';

  constructor(private http: HttpClient) {}

  // Crear un nuevo uso de inventario
  crear(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // Obtener el historial de uso de un ítem específico
  getHistorialPorItem(idItem: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/item/${idItem}`);
  }

  // Listar todos los usos (opcional)
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Filtrar por tipoDestino o fecha (opcional)
  filtrar(tipoDestino?: string, fecha?: string): Observable<any[]> {
    const params: any = {};
    if (tipoDestino) params.tipoDestino = tipoDestino;
    if (fecha) params.fecha = fecha;

    return this.http.get<any[]>(`${this.baseUrl}/filtrar`, { params });
  }
}

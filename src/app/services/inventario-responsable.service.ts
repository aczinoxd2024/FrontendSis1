import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InventarioResponsableService {
  private baseUrl = 'https://web-production-d581.up.railway.app/api/inventario-responsable';

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<any[]>(this.baseUrl);
  }

  asignar(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  eliminar(ci: string, idItem: number) {
  return this.http.delete(`${this.baseUrl}/${ci}/${idItem}`);
}
}

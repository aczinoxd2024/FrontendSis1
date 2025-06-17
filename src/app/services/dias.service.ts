import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DiaSemana {
  ID: number;     // <-- ¡Cambiado de 'id' a 'ID'!
  Dia: string;    // <-- ¡Cambiado de 'nombre' a 'Dia'!
}

@Injectable({ // <-- ¡Importante! Asegúrate de que esta línea esté aquí
  providedIn: 'root' // <-- Y esta también
})
export class DiaService {
  private apiUrl = `${environment.apiUrl}/dias-semana`;

  constructor(private http: HttpClient) { }

  getDias(): Observable<DiaSemana[]> {
    return this.http.get<DiaSemana[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}

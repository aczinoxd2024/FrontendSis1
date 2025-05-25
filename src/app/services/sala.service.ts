import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaService {
  private apiUrl = 'https://web-production-d581.up.railway.app/api/salas';

  constructor(private http: HttpClient) {}

  obtenerSalas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InstructorService {
  private apiUrl = 'https://web-production-d581.up.railway.app/api/instructores';

  constructor(private http: HttpClient) {}

  getInstructores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

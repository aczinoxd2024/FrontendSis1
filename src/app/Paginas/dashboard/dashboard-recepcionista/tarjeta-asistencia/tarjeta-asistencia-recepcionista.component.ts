import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as QRCode from 'qrcode';
import { environment } from '../../../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-tarjeta-asistencia-recepcionista',
  templateUrl: './tarjeta-asistencia-recepcionista.component.html',
  imports: [CommonModule],
})
export class TarjetaAsistenciaRecepcionistaComponent implements OnInit {
  datos: any = null;
  qrUrl: string = '';
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get(`${environment.apiUrl}/personal/tarjeta/info`, { headers }).subscribe({
      next: (res: any) => {
        this.datos = res;
        QRCode.toDataURL(res.ci)
          .then((url: string) => (this.qrUrl = url))
          .catch(() => (this.qrUrl = ''));
      },
      error: () => {
        this.error = '❌ No se pudo cargar la tarjeta del personal';
      },
    });
  }
}

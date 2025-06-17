import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import * as QRCode from 'qrcode';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-tarjeta-asistencia-recepcionista',
  templateUrl: './tarjeta-asistencia.component.html',
  imports: [CommonModule], // ✅ HttpClientModule ya no se necesita aquí si usas provideHttpClient()
})
export class TarjetaAsistenciaRecepcionistaComponent implements OnInit {
  datos: any = null;
  qrUrl: string = '';
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('🟢 Componente cargado');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get(`${environment.apiUrl}/personal/tarjeta/info`, { headers }).subscribe({
      next: (res: any) => {
        console.log('✅ Datos recibidos:', res);
        this.datos = res;
       QRCode.toDataURL(res.qrData)
  .then((url: string) => (this.qrUrl = url))
  .catch(() => (this.qrUrl = ''));

      },
      error: (err) => {
        console.error('❌ Error al obtener la tarjeta:', err);
        this.error = '❌ No se pudo cargar la tarjeta del personal';
      },
    });
  }
}

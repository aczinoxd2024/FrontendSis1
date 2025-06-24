import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true, // ✅ obligatorio si no forma parte de otro módulo
  imports: [CommonModule], // ✅ Aquí asegúrate de incluirlo
  templateUrl: './pago-exitoso.component.html',
})
export class PagoExitosoComponent implements OnInit {
  correo: string = '';
  contrasena: string = 'Cambiar123';
  mostrarInfo: boolean = false;
  nroPago!: number;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}
mensajeRenovacion: string = ''; // ✅ NUEVO
  ngOnInit(): void {
      this.mensajeRenovacion = sessionStorage.getItem('mensajeRenovacion') || '';
  sessionStorage.removeItem('mensajeRenovacion'); // Limpiamos para no repetir

    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (sessionId) {
      this.http
        .get<any>(
          `https://web-production-d581.up.railway.app/api/stripe/success-info?session_id=${sessionId}`
        )

        .subscribe({
          next: (data) => {
            console.log('✅ Respuesta del backend:', data);
            this.correo = data.correo;
            this.nroPago = data.nroPago;
            this.mostrarInfo = true;
          },
          error: (err) => {
            console.error('❌ Error al obtener info post-pago', err);
          },
        });
    }
  }

  descargarComprobante(): void {
  if (!this.nroPago) {
    alert('No se encontró el número de comprobante.');
    return;
  }

  const token = localStorage.getItem('token');

  this.http.get(
    `https://web-production-d581.up.railway.app/api/pagos/comprobante/${this.nroPago}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // Necesario para descargar PDF
    }
  ).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprobante_pago_${this.nroPago}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Error al descargar comprobante:', err);
      alert('No se pudo descargar el comprobante. Reintente.');
    }
  });
}
irAlLogin(): void {
  this.router.navigate(['/login']);
}


}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private apiUrl = 'https://web-production-d581.up.railway.app/api/pagos';
  private stripeUrl = 'https://web-production-d581.up.railway.app/api/stripe';

  constructor(private http: HttpClient) {}

  // ✅ Headers con token para endpoints protegidos
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // ✅ Crear sesión Stripe directamente (solo si no se requiere previsualización)
  crearSesion(amount: number, description: string, email: string, idClase?: number) {
    const body: any = { amount, description, email };
    if (idClase) {
      body.idClase = idClase;
    }

    return this.http.post<{ url: string }>(
      `${this.stripeUrl}/checkout`,
      body
    );
  }

  // ✅ Combina la previsualización con redirección automática (recomendado)
  iniciarProcesoPago(ci: string, tipoNuevoID: number, amount: number, description: string, email: string, idClase?: number): void {
    this.previsualizarCambioMembresia(ci, tipoNuevoID).subscribe({
      next: (resp) => {
        // ✅ Guardamos mensaje para mostrar tras éxito del pago
        sessionStorage.setItem('mensajeRenovacion', resp.mensaje);

        // ✅ Continuamos a Stripe
        const body: any = { amount, description, email };
        if (idClase) {
          body.idClase = idClase;
        }

        this.http.post<{ url: string }>(`${this.stripeUrl}/checkout`, body).subscribe({
          next: (resp) => (window.location.href = resp.url),
          error: () => alert('Error al redirigir a Stripe'),
        });
      },
      error: () => alert('Error al validar el cambio de membresía'),
    });
  }

  // ✅ Previsualizar cambio de membresía (se usa internamente)
 public previsualizarCambioMembresia(ci: string, tipoNuevoID: number) {

    return this.http.get<{ mensaje: string; accion: string }>(
      `${this.apiUrl}/previsualizar-membresia?ci=${ci}&tipoNuevoID=${tipoNuevoID}`,
      { headers: this.getHeaders() }
    );
  }

  // ✅ Obtener todos los pagos por CI (protegido)
  getPagosPorCI(ci: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/${ci}`, {
      headers: this.getHeaders(),
    });
  }

  // ✅ Descargar comprobante PDF
  descargarComprobante(nroPago: number): void {
    const token = localStorage.getItem('token');

    this.http.get(`${this.apiUrl}/comprobante/${nroPago}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `comprobante_pago_${nroPago}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar comprobante:', err);
      }
    });
  }
}

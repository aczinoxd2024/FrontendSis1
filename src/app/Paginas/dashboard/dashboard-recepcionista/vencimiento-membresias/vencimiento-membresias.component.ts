import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { EmailResult, MembresiaVencimientoData, NotificationResponse } from '../../../../interfaces/email-result.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vencimiento-membresias',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './vencimiento-membresias.component.html',
  styleUrls: ['./vencimiento-membresias.component.css']
})
export class VencimientoMembresiasComponent implements OnInit {
  membresias: MembresiaVencimientoData[] = [];
  clientesVigentes: any[] = [];
  mensajePromocional = '';
  imagenSeleccionada: File | null = null;
  mensajePromocionConfirmacion = '';
  loading = false;
  mensaje = '';

  // Notificaciones vencimiento
  notificationDetails: EmailResult[] = [];
  notificationSummaryMessage = '';

  // 🔽 NUEVOS CAMPOS PARA FILTRADO
  tipoSeleccionado: string = '';
  tiposDisponibles: string[] = [];

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerVencimientos();
    this.obtenerClientesVigentes();
  }

  obtenerVencimientos(): void {
    this.loading = true;
    const headers = this.getAuthHeaders();
    this.http.get<MembresiaVencimientoData[]>(`${this.apiUrl}/notificaciones/listar-vencimientos`, { headers })
      .subscribe({
        next: (res) => {
          this.membresias = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Error al obtener vencimientos', err);
          this.loading = false;
          alert(`❌ Error al obtener vencimientos: ${err.status} - ${err.statusText}`);
        }
      });
  }

  enviarNotificaciones(): void {
    this.mensaje = '';
    this.notificationDetails = [];
    this.notificationSummaryMessage = '';
    this.loading = true;

    const headers = this.getAuthHeaders();
    this.http.post<NotificationResponse>(`${this.apiUrl}/notificaciones/notificar-vencimientos`, {}, { headers })
      .subscribe({
        next: (res) => {
          this.notificationSummaryMessage = res.message;
          this.notificationDetails = res.details;
          this.loading = false;

          const successCount = res.details.filter(d => d.status === 'success').length;
          const failedCount = res.details.filter(d => d.status === 'failed').length;
          this.mensaje = `${this.notificationSummaryMessage} (Enviados: ${successCount}, Fallidos: ${failedCount})`;
        },
        error: (err) => {
          console.error('❌ Error al enviar notificaciones', err);
          this.loading = false;
          alert(`❌ Error al enviar notificaciones: ${err.status} - ${err.statusText}`);
          this.mensaje = 'Ocurrió un error al intentar enviar las notificaciones.';
        }
      });
  }

  enviarPromocion(): void {
    if (!this.imagenSeleccionada) {
      alert('Por favor selecciona una imagen para la promoción.');
      return;
    }

    const formData = new FormData();
    formData.append('mensaje', this.mensajePromocional);
    formData.append('imagen', this.imagenSeleccionada);

    const headers = this.getAuthHeaders();

    this.loading = true;
    this.http.post(`${this.apiUrl}/promociones/enviar-con-imagen`, formData, { headers })
      .subscribe({
        next: (res: any) => {
          this.mensajePromocionConfirmacion = '📨 Promoción enviada con éxito.';
          this.loading = false;
        },
        error: (err) => {
  console.error('❌ Error al enviar promoción:', err);
  if (err.status === 400) {
    this.mensajePromocionConfirmacion = '⚠️ Error 400: Verifica que la imagen y el mensaje sean válidos.';
  } else if (err.status === 401 || err.status === 403) {
    this.mensajePromocionConfirmacion = '🚫 No tienes permisos o el token ha expirado.';
  } else if (err.status === 0) {
    this.mensajePromocionConfirmacion = '🌐 Error de red o CORS.';
  } else {
    this.mensajePromocionConfirmacion = `❌ Error desconocido (${err.status})`;
  }
  this.loading = false;
}

      });
  }

  obtenerClientesVigentes(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>(`${this.apiUrl}/promociones/clientes-vigentes`, { headers })
      .subscribe({
        next: (res) => {
          this.clientesVigentes = res;
          this.actualizarTiposDisponibles();
        },
        error: (err) => {
          console.error('❌ Error al obtener clientes vigentes', err);
        }
      });
  }

  actualizarTiposDisponibles(): void {
    this.tiposDisponibles = [...new Set(this.clientesVigentes.map(c =>
      (c.TipoMembresia || '').trim()
    ))];
  }

  clientesVigentesFiltrados(): any[] {
    if (!this.tipoSeleccionado) return this.clientesVigentes;
    return this.clientesVigentes.filter(c =>
      (c.TipoMembresia || '').trim().toLowerCase() === this.tipoSeleccionado.trim().toLowerCase()
    );
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.imagenSeleccionada = fileInput.files[0];
    }
  }

  irARenovar(ciCliente: string): void {
    console.log(`Intentando renovar membresía para el cliente con CI: ${ciCliente}`);
    alert(`Funcionalidad de renovar para CI: ${ciCliente} (implementar navegación)`);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}

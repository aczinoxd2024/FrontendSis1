import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { EmailResult, MembresiaVencimientoData, NotificationResponse } from '../../../../interfaces/email-result.interface';
// IMPORTANTE: Asegúrate de que esta ruta sea correcta para tu archivo de interfaz MembresiaVencimientoData


@Component({
  selector: 'app-vencimiento-membresias',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vencimiento-membresias.component.html',
  styleUrls: ['./vencimiento-membresias.component.css']
})
export class VencimientoMembresiasComponent implements OnInit {
  membresias: MembresiaVencimientoData[] = []; // Tipo actualizado: ahora es MembresiaVencimientoData[]
  loading = false;
  mensaje = '';
  notificationDetails: EmailResult[] = [];
  notificationSummaryMessage = '';

  private apiUrl = `${environment.apiUrl}/notificaciones`;

  constructor(private http: HttpClient) {} // Puedes inyectar 'private router: Router' aquí si usas el router para irARenovar

  ngOnInit(): void {
    this.obtenerVencimientos();
  }

  obtenerVencimientos(): void {
    this.loading = true;
    const headers = this.getAuthHeaders();
    // CAMBIO: Especificar el tipo de respuesta esperado como MembresiaVencimientoData[]
    this.http.get<MembresiaVencimientoData[]>(`${this.apiUrl}/listar-vencimientos`, { headers })
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
    this.http.post<NotificationResponse>(`${this.apiUrl}/notificar-vencimientos`, {}, { headers })
      .subscribe({
        next: (res) => {
          this.notificationSummaryMessage = res.message;
          this.notificationDetails = res.details;
          this.loading = false;
          console.log('Respuesta del servidor:', res);

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

  // Método irARenovar que se llama desde el HTML
  irARenovar(ciCliente: string): void {
    console.log(`Intentando renovar membresía para el cliente con CI: ${ciCliente}`);
    // Aquí puedes añadir la lógica de navegación a otra ruta, por ejemplo:
    // this.router.navigate(['/clientes', ciCliente, 'renovar-membresia']);
    alert(`Funcionalidad de renovar para CI: ${ciCliente} (implementar navegación)`);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}

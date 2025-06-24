import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard-recepcionista',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard-recepcionista.component.html',
})
export class DashboardRecepcionistaComponent implements OnInit {
  nombreUsuario: string = '';
  mostrarMenu = false;
  screenWidth = window.innerWidth;

  membresias: any[] = [];
  mensaje = '';
  loading = false;

  private apiUrl = `${environment.apiUrl}/notificaciones`;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    const user = this.authService.getUser();
    this.nombreUsuario = user?.nombre ?? 'Recepcionista';
  }

  ngOnInit(): void {
    this.obtenerVencimientos();
  }

  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  obtenerVencimientos(): void {
    this.loading = true;
    const headers = this.getAuthHeaders();
    this.http.get<any[]>(`${this.apiUrl}/listar-vencimientos`, { headers }).subscribe({
      next: (res) => {
        this.membresias = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al obtener vencimientos', err);
        this.loading = false;
      }
    });
  }

  enviarNotificaciones(): void {
    const headers = this.getAuthHeaders();
    this.http.post(`${this.apiUrl}/notificar-vencimientos`, {}, { headers }).subscribe({
      next: (res: any) => {
        this.mensaje = res?.message || '✔️ Correos enviados correctamente';
        console.log(res);
      },
      error: (err) => {
        console.error('❌ Error al enviar notificaciones', err);
        this.mensaje = 'Error al enviar notificaciones';
      }
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  imagen: File | null = null;

onFileSelected(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  this.imagen = file ?? null;
}

enviarPromocion(): void {
  if (!this.imagen) {
    this.mensaje = 'Por favor, selecciona una imagen.';
    return;
  }

  const formData = new FormData();
  formData.append('imagen', this.imagen);

  this.loading = true;
  const headers = this.getAuthHeaders();

  this.http.post(`${environment.apiUrl}/promociones/enviar-con-imagen`, formData, { headers })
    .subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || '✅ Promociones enviadas con éxito.';
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al enviar promociones', err);
        this.mensaje = '❌ Error al enviar promociones.';
        this.loading = false;
      }
    });
}

}

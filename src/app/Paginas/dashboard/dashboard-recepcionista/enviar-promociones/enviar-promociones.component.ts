import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-enviar-promociones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enviar-promociones.component.html',
  styleUrls: ['./enviar-promociones.component.css'],
})
export class EnviarPromocionesComponent implements OnInit {
  imagenSeleccionada: File | null = null;
  mensaje = '';
  mensajePromocional = '¡No te pierdas nuestras promociones especiales!';
  clientesVigentes: any[] = [];
  tipoSeleccionado: string = '';

  tiposDisponibles: string[] = ['Básica', 'Gold', 'Disciplina', 'Elite'];

  loading = false;

  private apiUrl = `${environment.apiUrl}/promociones`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerClientesVigentes();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.imagenSeleccionada = file ?? null;
  }

  enviarPromocion(): void {
    if (!this.imagenSeleccionada) {
      this.mensaje = 'Por favor, selecciona una imagen.';
      return;
    }

    const maxSizeInMB = 5;
    if (this.imagenSeleccionada.size > maxSizeInMB * 1024 * 1024) {
      this.mensaje = `La imagen no puede superar los ${maxSizeInMB} MB.`;
      return;
    }

    if (!this.mensajePromocional.trim()) {
      this.mensaje = 'El mensaje promocional no puede estar vacío.';
      return;
    }

    const formData = new FormData();
    formData.append('mensaje', this.mensajePromocional);
    formData.append('imagen', this.imagenSeleccionada);
    formData.append('tipoMembresia', this.tipoSeleccionado.trim());

    this.loading = true;
    const headers = this.getAuthHeaders();

    this.http.post(`${this.apiUrl}/enviar-con-imagen`, formData, { headers })
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

  obtenerClientesVigentes(): void {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/clientes-vigentes`;

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (res) => {
        this.clientesVigentes = res;
      },
      error: (err) => {
        console.error('❌ Error al obtener clientes', err);
      }
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}

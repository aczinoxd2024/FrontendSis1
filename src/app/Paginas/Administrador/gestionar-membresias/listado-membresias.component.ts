import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-listado-membresias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listado-membresias.component.html'
})
export class ListadoMembresiasComponent implements OnInit {
  membresias: any[] = [];
  mensaje = '';
  verInactivas = false;

  private apiUrl = 'https://web-production-d581.up.railway.app/api/tipo_membresia';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.obtenerMembresias();
  }

  obtenerMembresias(): void {
    const endpoint = this.verInactivas ? `${this.apiUrl}/inactivas` : this.apiUrl;
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>(endpoint, { headers }).subscribe({
      next: (data) => this.membresias = data,
      error: () => this.mensaje = '❌ Error al cargar membresías'
    });
  }

  editar(id: number): void {
    this.router.navigate(['/dashboard-admin/editar-membresia', id]);
  }

  eliminar(id: number): void {
    if (!confirm('¿Deseas eliminar esta membresía?')) return;

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`${this.apiUrl}/${id}`, { headers }).subscribe({
      next: () => {
        this.mensaje = '✅ Membresía eliminada';
        this.obtenerMembresias();
      },
      error: () => this.mensaje = '❌ Error al eliminar membresía'
    });
  }

  restaurar(id: number): void {
    if (!confirm('¿Deseas restaurar esta membresía?')) return;

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.put(`${this.apiUrl}/${id}/restaurar`, {}, { headers }).subscribe({
      next: () => {
        this.mensaje = '✅ Membresía restaurada correctamente';
        this.obtenerMembresias();
      },
      error: () => this.mensaje = '❌ Error al restaurar membresía'
    });
  }
}

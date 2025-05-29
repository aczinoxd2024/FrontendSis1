import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';
import { PagoService } from '../../../../services/pagos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seleccionar-clase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seleccionar-clase.component.html',
  styleUrls: ['./seleccionar-clase.component.css']
})
export class SeleccionarClaseComponent implements OnInit {
  tipo: 'disciplina' | 'gold' = 'disciplina';
  clases: any[] = [];
  claseSeleccionada: any = null;
  correoCliente: string = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private pagoService: PagoService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) this.correoCliente = user.correo;

    const tipoParam = this.route.snapshot.queryParamMap.get('tipo');
    if (tipoParam === 'gold') this.tipo = 'gold';

    // Obtener todas las clases disponibles (sin filtrar)
    this.http.get<any[]>('https://web-production-d581.up.railway.app/api/clases').subscribe({
      next: (res) => {
        this.clases = res.filter(c => c.Estado === 'Activo');
        this.loading = false;
      },
      error: () => {
        alert('Error al cargar clases');
        this.loading = false;
      }
    });
  }

  pagar(): void {
    if (!this.claseSeleccionada) return;

    const monto = this.tipo === 'gold' ? 35 : 15;
    const descripcion = this.tipo === 'gold' ? 'Gold' : 'Disciplina';

    this.pagoService.crearSesion(monto, descripcion, this.correoCliente, this.claseSeleccionada.IDClase)
      .subscribe({
        next: (resp: { url: string }) => window.location.href = resp.url,
        error: () => alert('Error al redirigir a Stripe')
      });
  }
}

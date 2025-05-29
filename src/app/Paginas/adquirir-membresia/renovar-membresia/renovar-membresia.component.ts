import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PagoService } from '../../../services/pagos.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-renovar-membresia',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './renovar-membresia.component.html',
  styleUrls: ['./renovar-membresia.component.css']
})
export class RenovarMembresiaComponent implements OnInit {
  correoCliente: string = '';

  tipos = [
    {
      id: 'basica',
      nombre: 'Membresía Básica',
      descripcion: 'Acceso a máquinas, pesas y cardio.',
      precio: '$20 / mes',
    },
    {
      id: 'disciplina',
      nombre: 'Solo Disciplina',
      descripcion: 'Acceso a una clase específica.',
      precio: '$15 / mes',
    },
    {
      id: 'gold',
      nombre: 'Membresía Gold',
      descripcion: 'Todo lo anterior + clases dirigidas.',
      precio: '$35 / mes',
    },
  ];

  constructor(
    private pagoService: PagoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.correoCliente = user.correo;
    }
  }

  redirigirAPago(tipo: 'basica' | 'gold' | 'disciplina') {
    if (tipo === 'gold' || tipo === 'disciplina') {
      // Redirigir a seleccionar clase
      this.router.navigate(['/dashboard-cliente/seleccionar-clase'], {
        queryParams: { tipo }
      });
    } else {
      // Básica: ir directo a Stripe
      const precios: any = {
        basica: { amount: 20, descripcion: 'Básica' }
      };
      const info = precios[tipo];

      this.pagoService.crearSesion(info.amount, info.descripcion, this.correoCliente)
        .subscribe({
          next: (resp: { url: string }) => (window.location.href = resp.url),
          error: () => alert('Error al redirigir a Stripe'),
        });
    }
  }
}

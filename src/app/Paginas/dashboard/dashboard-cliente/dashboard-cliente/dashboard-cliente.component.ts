import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { PagoService } from '../../../../services/pagos.service'; // ✅ Importamos el servicio de pagos

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-cliente.component.html',
  styleUrls: ['./dashboard-cliente.component.css'],
})
export class DashboardClienteComponent implements OnInit {
  usuarioRol: string | null = null;
  mostrarMembresias: boolean = false;
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
    private auth: AuthService,
    private router: Router,
    private pagoService: PagoService // ✅ Inyectamos el servicio de pagos
  ) {}

  ngOnInit(): void {
    this.usuarioRol = localStorage.getItem('rol');

    const user = this.auth.getUser();
    if (user) {
      this.correoCliente = user.correo;
    }
  }

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  mostrarSeccionMembresia() {
    this.mostrarMembresias = true;
  }

  redirigirAPago(tipo: 'basica' | 'gold' | 'disciplina') {
    const precios: any = {
      basica: { amount: 20, descripcion: 'Básica' },
      gold: { amount: 35, descripcion: 'Gold' },
      disciplina: { amount: 15, descripcion: 'Disciplina' },
    };

    const info = precios[tipo];

    this.pagoService
      .crearSesion(info.amount, info.descripcion, this.correoCliente)
      .subscribe({
        next: (resp) => (window.location.href = resp.url),
        error: () => alert('Error al redirigir a Stripe'),
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-cliente.component.html',
  styleUrls: ['./dashboard-cliente.component.css'],
})
export class DashboardClienteComponent implements OnInit {
  usuarioRol: string | null = null;
  correoCliente: string = '';
  mostrarMembresias: boolean = false;

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioRol = localStorage.getItem('rol');

    const user = this.auth.getUser();
    if (user) {
      this.correoCliente = user.correo;
    }

    // ✅ Mostrar mensaje post-pago solo si se está en una ruta que contiene 'success'
    const mensaje = sessionStorage.getItem('mensajeRenovacion');
    const success = this.router.url.includes('success');

    if (mensaje && success) {
      alert(mensaje);
      sessionStorage.removeItem('mensajeRenovacion');
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
    // ✅ Recomendación: en lugar de lanzar pago directo, redirigir a componente de renovación
    this.router.navigate(['/dashboard-cliente/renovar-membresia'], {
      queryParams: { tipo },
    });
  }
}

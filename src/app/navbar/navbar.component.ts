import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  menuAbierto = false;
  nombreUsuario: string = '';
  rolUsuario: string = ''; // 👈 rol normalizado

  constructor(private router: Router, private authService: AuthService) {
    const user = this.authService.getUser();
    console.log('Usuario navbar:', user); // 👈
    this.nombreUsuario = user?.nombre || 'Usuario';

    // ✅ Normalizamos el rol a minúsculas para que *ngIf="rolUsuario === 'cliente'" funcione
    this.rolUsuario = this.authService.getUserRole()?.toLowerCase() || '';
      console.log('Rol detectado:', this.rolUsuario); // 👈
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarSesion() {
    this.authService.logout();
  }

  irAPerfil() {
    this.router.navigate(['/perfil']);
  }

  iniciarSesion() {
    this.router.navigate(['/login']);
  }

  irAAgenda() {
    this.router.navigate(['/recepcionista/agenda']);
  }

  irAHistoricoReservas() {
    this.router.navigate(['/reservas/historico']);
  }
}

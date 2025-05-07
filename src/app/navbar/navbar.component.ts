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

  constructor(private router: Router, private authService: AuthService) {
    const user = this.authService.getUser();
    this.nombreUsuario = user?.nombre || 'Usuario';
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarSesion() {
    this.authService.logout();
  }

  irAPerfil() {
    // Lógica para ir al perfil (ajustar si tienes ruta real)
    this.router.navigate(['/perfil']);
  }

  iniciarSesion() {
    this.router.navigate(['/login']);
  }
}


import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  imports: [CommonModule, RouterModule],
})
export class WelcomeComponent implements OnInit {
  logueado = false;
  usuarioNombre = '';
  usuarioCorreo = '';
  usuarioRol = '';
  mostrarMenu = false;
  mostrarPerfil = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    this.logueado = !!token;
    this.usuarioNombre = user.nombre || '';
    this.usuarioCorreo = user.correo || '';
    this.usuarioRol = user.rol || '';
  }

  toggleDropdown(): void {
    this.mostrarMenu = !this.mostrarMenu;
    if (this.mostrarMenu) {
      this.mostrarPerfil = false;
    }
  }

  togglePerfil(): void {
    this.mostrarPerfil = !this.mostrarPerfil;
    if (this.mostrarPerfil) {
      this.mostrarMenu = false;
    }
  }

  irAIniciarSesion(): void {
    this.router.navigate(['/login']);
  }

  cerrarSesion(): void {
    this.authService.logout();
  }

  // Cierra menús si haces clic fuera
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const insideDropdown = target.closest('.dropdown');
    const insidePerfilPanel = target.closest('.perfil-panel');
    if (!insideDropdown && !insidePerfilPanel) {
      this.mostrarMenu = false;
      this.mostrarPerfil = false;
    }
  }

  cerrarMenus(): void {
    this.mostrarMenu = false;
    this.mostrarPerfil = false;
  }

  // Cierra menús al hacer scroll
  @HostListener('window:scroll')
  onScroll(): void {
    this.mostrarMenu = false;
    this.mostrarPerfil = false;
  }
}

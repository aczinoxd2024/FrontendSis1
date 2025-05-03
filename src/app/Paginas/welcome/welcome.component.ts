import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  imports: [NgIf,RouterModule],
})
export class WelcomeComponent implements OnInit {

  logueado = false;
  usuarioNombre: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.verificarSesion();
  }

  /**
   * Verifica si hay un usuario en sesión y carga su nombre
   */
  verificarSesion(): void {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userData && token) {  // ✅ Asegurarse que realmente esté logueado (también con token)
      const user = JSON.parse(userData);
      this.usuarioNombre = user.nombre || 'No identificado';
      this.logueado = true;
    } else {
      this.usuarioNombre = '';
      this.logueado = false;
    }
  }

  /**
   * Redirigir a login
   */
  irAIniciarSesion(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Cerrar sesión → backend + limpiar local + volver al welcome
   */
  cerrarSesion(): void {
    this.authService.logout();
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  // Inyección del servicio Router en el constructor
  constructor(private router: Router) {}

  /**
   * Método para cerrar sesión del usuario.
   * Elimina el token almacenado en el localStorage
   * y redirige al usuario a la página de inicio.
   */
  logout(): void {
    localStorage.removeItem('token');  // Elimina el token de autenticación del localStorage
    this.router.navigate(['/']);       // Redirige al usuario a la página de inicio
  }
}

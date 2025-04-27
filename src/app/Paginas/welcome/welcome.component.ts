import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  imports: [NgIf],
})
export class WelcomeComponent { // 👈 Corregido
  logueado = false;
  usuarioLogueado = ''; // 👈 Aquí guardamos el correo o nombre

  constructor(private router: Router) {}

  irAIniciarSesion() {
    this.router.navigate(['/login']);
  }

  cerrarSesion() {
    this.logueado = false;
    this.usuarioLogueado = '';
    localStorage.removeItem('token'); // Opcional: borrar token también
  }
}

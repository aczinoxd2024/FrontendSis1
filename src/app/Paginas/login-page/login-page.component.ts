import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: true, // ⬅️ Solo si estás usando Angular standalone
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  rolSeleccionado: string | null = null;
  errorMessage = '';

  // ✅ Corrige aquí la ruta de los íconos
  roles = [
    { nombre: 'Administrador', icono: 'admin.jpg' },
    { nombre: 'Instructor', icono: 'instructor.jpg' },
    { nombre: 'Recepcionista', icono: 'recepcionista.jpg' },
    { nombre: 'Cliente', icono: 'cliente.jpg' }
  ];


  constructor(private authService: AuthService, private router: Router) {}

  seleccionarRol(rol: string) {
    this.rolSeleccionado = rol;
  }

  login() {
    this.authService
      .login(this.correo.trim(), this.contrasena, this.rolSeleccionado!)
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          alert('Login fallido: ' + err.error.message);
        },
      });
  }
}




import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule] // ✅ Agregado RouterModule aquí
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  rolSeleccionado: string | null = null;
  errorMessage = '';

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
    if (!this.correo.trim() || !this.contrasena.trim() || !this.rolSeleccionado) {
      alert('Por favor complete todos los campos y seleccione un rol.');
      return;
    }

    this.authService
      .login(this.correo.trim(), this.contrasena.trim(), this.rolSeleccionado)
      .subscribe({
        next: (respuesta) => {
          localStorage.setItem('token', respuesta.access_token);

          const user = respuesta.user;
          const rolNormalizado = user.rol.trim().toLowerCase();
          localStorage.setItem('rol', rolNormalizado);

          // ✅ Guardar todos los datos del usuario en localStorage
          localStorage.setItem('user', JSON.stringify({
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            correo: user.correo,
            telefono: user.telefono,
            direccion: user.direccion,
            rol: rolNormalizado
          }));

          // 👉 Redirección según el rol
          switch (rolNormalizado) {
            case 'administrador':
              this.router.navigate(['/dashboard-admin']);
              break;
            case 'recepcionista':
              this.router.navigate(['/dashboard-recepcionista']);
              break;
            case 'instructor':
              this.router.navigate(['/dashboard-instructor']);
              break;
            case 'cliente':
              this.router.navigate(['/']);
              break;
            default:
              this.router.navigate(['/']);
              break;
          }
        },
        error: (err) => {
          alert('Login fallido: ' + err.error.message);
        },
      });
  }

  }


import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // ✅

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule], // ✅ Correcto aquí adentro
})
export class LoginPageComponent {
  formLogin: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formLogin = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required], // 👈 Aquí corregido
    });
  }

  onSubmit() {
    if (this.formLogin.invalid) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    const { correo, contrasena } = this.formLogin.value; // 👈 Aquí corregido

    this.authService.login(correo, contrasena).subscribe({
      next: (response: any) => {
        console.log('Login exitoso:', response);
        localStorage.setItem('access_token', response.access_token); // Guarda el token
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('Error en login:', err);
        console.error('Detalles del error:', err.error);
        alert('Credenciales inválidas');
      }
    });
  }
}

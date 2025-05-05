import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  token: string = '';
  mensaje = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    console.log('🔐 Token capturado:', this.token); // ✅ Log para ver si se capturó el token correctamente
  }

  cambiarContrasena() {
    if (this.form.invalid || !this.token) {
      this.error = 'Formulario inválido o token ausente';
      return;
    }

    const nueva = this.form.value.newPassword;
    console.log('📦 Enviando nueva contraseña con token:', nueva, this.token); // ✅ Log de lo que se está enviando

    this.authService.resetPassword(this.token, nueva).subscribe({
      next: (res: any) => {
        console.log('✅ Respuesta backend:', res); // ✅ Log de respuesta
        this.mensaje = res.message || 'Contraseña actualizada correctamente.';
        this.error = '';
      },
      error: (err) => {
        console.error('❌ Error backend:', err); // ✅ Log de error
        this.error = err.error?.message || 'Error al cambiar contraseña.';
        this.mensaje = '';
      }
    });
  }
}

// forgot-password.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class ForgotPasswordComponent {
  form: FormGroup;
  formReset: FormGroup;
  enviado = false;
  mensaje = '';
  error = '';
  mostrarResetManual = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.formReset = this.fb.group({
      token: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  enviarCorreo() {
    this.enviado = false;
    this.mensaje = '';
    this.error = '';

    if (this.form.invalid) return;

    const email = this.form.value.email;
    this.authService.forgotPassword(email).subscribe({
      next: (res: any) => {
        this.mensaje = res.message;
        this.enviado = true;
        this.mostrarResetManual = true;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al enviar correo.';
      }
    });
  }

  cambiarContrasenaManual() {
    if (this.formReset.invalid) return;

    const { token, newPassword } = this.formReset.value;

    this.authService.resetPassword(token, newPassword).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al cambiar contraseña.';
      }
    });
  }
}

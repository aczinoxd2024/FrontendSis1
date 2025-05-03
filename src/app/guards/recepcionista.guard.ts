import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecepcionistaGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const rol = this.authService.getUserRole();

    if (rol === 'recepcionista') {
      return true; // Permitir acceso
    }

    // No es recepcionista → redirigir
    this.router.navigate(['/']);
    return false;
  }
}

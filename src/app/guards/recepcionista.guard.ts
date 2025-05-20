import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const recepcionistaGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  if (user && user.rol === 'recepcionista') {
    return true;
  }

  alert('Acceso denegado: esta sección es solo para recepcionistas');
  router.navigate(['/login']);
  return false;
};

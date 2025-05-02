import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    const token = localStorage.getItem('token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp;

        // Verificar si el token aún es válido
        if (Date.now() < exp * 1000) {
          return true;
        }

      } catch (error) {
        console.error('Error al decodificar el token:', error);
        // En caso de error al decodificar, redirigimos al Welcome
        return this.router.createUrlTree(['/']);
      }
    }

    // Si no hay token o está expirado, redirigir al Welcome
    return this.router.createUrlTree(['/']);
  }
}

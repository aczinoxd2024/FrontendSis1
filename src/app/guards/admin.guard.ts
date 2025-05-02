import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {

    const rol = (localStorage.getItem('rol') ?? '').trim().toLowerCase();

if (!rol) {
  this.router.navigate(['/login']);
  return false;
}

if (rol === 'administrador') {
  return true;
}

this.router.navigate(['/']);
return false;

  }
}

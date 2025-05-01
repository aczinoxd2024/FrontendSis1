// frontend: routes.ts
import { Routes } from '@angular/router';// Asegúrate de importar el guard
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./Paginas/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./Paginas/login-page/login-page.component').then(m => m.LoginComponent)

  },
  {
    path: 'dashboard',
    loadComponent: () => import('./Paginas/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]  // Añadimos el guard aquí
  },
  {
    path: '**',
    redirectTo: ''
  }
];

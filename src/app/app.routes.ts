import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // RUTA DE BIENVENIDA (Welcome Page)
  {
    path: '',
    loadComponent: () => import('./Paginas/welcome/welcome.component').then(m => m.WelcomeComponent)
  },

  // LOGIN
  {
    path: 'login',
    loadComponent: () => import('./Paginas/login-page/login-page.component').then(m => m.LoginComponent)
  },

  // DASHBOARD ADMIN (SOLO ADMINISTRADOR)
  {
    path: 'dashboard-admin',
    loadComponent: () => import('./Paginas/dashboard/dashboard-admin/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AdminGuard]
  },

  // BITÁCORA (SOLO ADMINISTRADOR)
  {
    path: 'bitacora',
    loadComponent: () => import('./Paginas/bitacora/bitacora.component').then(m => m.BitacoraComponent),
    canActivate: [AdminGuard]
  },

  // WILDCARD → Redirige cualquier ruta no encontrada al Welcome
  {
    path: '**',
    redirectTo: '', // 🔴 IMPORTANTE: Welcome es la raíz
  }
];

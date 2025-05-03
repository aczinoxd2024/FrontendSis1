import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { RecepcionistaGuard } from './guards/recepcionista.guard';

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

  // MEMBRESÍAS → Público
  {
    path: 'menbresias',
    loadComponent: () => import('./Paginas/ver-menbresias/menbresias.component').then(m => m.MenbresiasComponent),
  },

  // ADQUIRIR MEMBRESÍA → Público
  {
    path: 'adquirir-menbresia/:id',
    loadComponent: () => import('./Paginas/adquirir-membresia/adquirir-membresia.component').then(m => m.AdquirirMembresiaComponent),
  },

  // BITÁCORA (SOLO ADMINISTRADOR)
  {
    path: 'bitacora',
    loadComponent: () => import('./Paginas/bitacora/bitacora.component').then(m => m.BitacoraComponent),
    canActivate: [AdminGuard]
  },

  // DASHBOARD RECEPCIONISTA (SOLO RECEPCIONISTA)
  {
    path: 'dashboard-recepcionista',
    loadComponent: () => import('./Paginas/dashboard/dashboard-recepcionista/dashboard-recepcionista.component').then(m => m.DashboardRecepcionistaComponent),
    canActivate: [RecepcionistaGuard],
    children: [
      {
        path: 'registrar-cliente',
        loadComponent: () => import('./Paginas/dashboard/dashboard-recepcionista/registrar-cliente/registrar-cliente.component').then(m => m.RegistrarClienteComponent)
      }
    ]
  },

  // WILDCARD → Redirige cualquier ruta no encontrada al Welcome
  {
    path: '**',
    redirectTo: '', // 🔴 IMPORTANTE: Welcome es la raíz
  }
];

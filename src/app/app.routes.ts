import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { RecepcionistaGuard } from './guards/recepcionista.guard';

export const routes: Routes = [
  // RUTA DE BIENVENIDA (PÚBLICO)
  {
    path: '',
    loadComponent: () => import('./Paginas/welcome/welcome.component').then(m => m.WelcomeComponent)
  },

  // LOGIN (PÚBLICO)
  {
    path: 'login',
    loadComponent: () => import('./Paginas/login-page/login-page.component').then(m => m.LoginComponent)
  },

  // DASHBOARD ADMINISTRADOR (PROTEGIDO)
  {
    path: 'dashboard-admin',
    loadComponent: () => import('./Paginas/Administrador/dashboard-inicio/dashboard-inicio.component').then(m => m.DashboardComponent),
    canActivate: [AdminGuard],
    children: [
      {
        path: 'eliminar-cliente',
        loadComponent: () => import('./Paginas/Administrador/eliminar-cliente/eliminar-cliente.component').then(m => m.EliminarClienteComponent)
      },
      {
        path: 'bitacora',
        loadComponent: () => import('./Paginas/Administrador/bitacora/bitacora.component').then(m => m.BitacoraComponent)
      },
      {
          path: 'clientes',
      loadComponent: () => import('./Paginas/Clientes/clientes-lista/clientes-lista.component').then(m => m.ClientesListaComponent)

      }
    ]
  },

  // MEMBRESÍAS (PÚBLICO)
  {
    path: 'menbresias',
    loadComponent: () => import('./Paginas/ver-menbresias/menbresias.component').then(m => m.MenbresiasComponent),
  },

  // ADQUIRIR MEMBRESÍA (PÚBLICO)
  {
    path: 'adquirir-menbresia/:id',
    loadComponent: () => import('./Paginas/adquirir-membresia/adquirir-membresia.component').then(m => m.AdquirirMembresiaComponent),
  },

  // DASHBOARD RECEPCIONISTA (PROTEGIDO)
  {
    path: 'dashboard-recepcionista',
    loadComponent: () => import('./Paginas/dashboard/dashboard-recepcionista/dashboard-recepcionista.component').then(m => m.DashboardRecepcionistaComponent),
    canActivate: [RecepcionistaGuard],
    children: [
      {
        path: 'registrar-cliente',
        loadComponent: () => import('./Paginas/dashboard/dashboard-recepcionista/registrar-cliente/registrar-cliente.component').then(m => m.RegistrarClienteComponent)
      },
      {
        path: 'actualizar-cliente',
        loadComponent: () => import('./Paginas/dashboard/dashboard-recepcionista/actualizar-cliente/actualizar-cliente.component').then(m => m.ActualizarClienteComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./Paginas/Clientes/clientes-lista/clientes-lista.component').then(m => m.ClientesListaComponent)
    }
    ]
  },

  // RECUPERAR CONTRASEÑA (PÚBLICO)
  {
    path: 'forgot-password',
    loadComponent: () => import('./Paginas/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./Paginas/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },

<<<<<<< HEAD
  // WILDCARD (CUALQUIER RUTA → Welcome)
=======
  {
    path: 'perfil',
    loadComponent: () => import('./Paginas/perfil/perfil.component').then(m => m.PerfilComponent),
  },

  {
    path: 'perfil/editar',
    loadComponent: () => import('./Paginas/perfil/editar-perfil/editar-perfil.component').then(m => m.EditarPerfilComponent),
  },



  // WILDCARD → Redirige cualquier ruta no encontrada al Welcome
>>>>>>> perfil/editar
  {
    path: '**',
    redirectTo: '',
  }
];

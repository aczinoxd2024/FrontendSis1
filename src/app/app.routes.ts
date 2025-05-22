import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { recepcionistaGuard } from './guards/recepcionista.guard';
import { AgendaReservasComponent } from './Paginas/Recepcionista/agenda-reservas/agenda-reservas.component';
import { ReservasHistoricoComponent } from './Paginas/reservas-historico/reservas-historico.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./Paginas/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./Paginas/login-page/login-page.component').then(m => m.LoginComponent)
  },

  // ✅ RUTA DE RECEPCIONISTA PROTEGIDA CON GUARD
  {
    path: 'recepcionista',
    canActivate: [recepcionistaGuard],
    children: [
      {
        path: 'agenda',
        component: AgendaReservasComponent
      }
    ]
  },

  // ADMINISTRADOR
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

  // RECEPCIONISTA DASHBOARD
  {
    path: 'dashboard-recepcionista',
    loadComponent: () => import('./Paginas/dashboard/dashboard-recepcionista/dashboard-recepcionista.component').then(m => m.DashboardRecepcionistaComponent),
    canActivate: [recepcionistaGuard],
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
      },
      {
      path: 'asistencias-generales', // ✅ NUEVA RUTA
      loadComponent: () => import('./Paginas/dashboard/dashboard-recepcionista/asistencias-generales/asistencias-generales.component').then(m => m.AsistenciasGeneralesComponent)
    },
    ]
  }, // ✅ COMA AGREGADA AQUÍ

  // INSTRUCTOR
  {
    path: 'dashboard-instructor',
    loadComponent: () => import('./Paginas/dashboard/dashboard-instructor/dashboard-instructor.component').then(m => m.DashboardInstructorComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'mis-clases',
        loadComponent: () => import('./Paginas/dashboard/dashboard-instructor/mis-clases/mis-clases.component').then(m => m.MisClasesComponent)
      }
    ]
  },
//RESERVAS PASADAS
  {
  path: 'reservas/historico',
  component: ReservasHistoricoComponent,
  canActivate: [AuthGuard], // si usas protección
},

// ✅ ASISTENCIA
  {
    path: 'asistencia',
    loadComponent: () => import('./Paginas/asistencia/asistencia.component').then(m => m.AsistenciaComponent),
    canActivate: [AuthGuard],
  },
  // MEMBRESÍAS
  {
    path: 'menbresias',
    loadComponent: () => import('./Paginas/ver-menbresias/menbresias.component').then(m => m.MenbresiasComponent),
  },
  {
    path: 'adquirir-menbresia/:id',
    loadComponent: () => import('./Paginas/adquirir-membresia/adquirir-membresia.component').then(m => m.AdquirirMembresiaComponent),
  },

  // PERFIL
  {
    path: 'perfil',
    loadComponent: () => import('./Paginas/perfil/perfil.component').then(m => m.PerfilComponent),
  },
  {
    path: 'perfil/editar',
    loadComponent: () => import('./Paginas/perfil/editar-perfil/editar-perfil.component').then(m => m.EditarPerfilComponent),
  },

  // RECUPERACIÓN
  {
    path: 'forgot-password',
    loadComponent: () => import('./Paginas/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./Paginas/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },

  // WILDCARD
  {
    path: '**',
    redirectTo: '',
  }
];

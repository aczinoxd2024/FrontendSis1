import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { recepcionistaGuard } from './guards/recepcionista.guard';

// ✅ Rutas con componentes standalone
import { ReservasHistoricoComponent } from './Paginas/reservas-historico/reservas-historico.component';
import { AgendaReservasAdminComponent } from './Paginas/dashboard/dashboard-admin/agenda-reservas-admin/agenda-reservas-admin.component';
import { SeguimientoClienteComponent } from './Paginas/dashboard/dashboard-instructor/seguimiento-cliente/seguimiento-cliente.component';
import { DashboardClienteComponent } from './Paginas/dashboard/dashboard-cliente/dashboard-cliente/dashboard-cliente.component';
import { ReportesEstadisticasComponent } from './Paginas/Administrador/reportes-estadisticas/reportes-estadisticas.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./Paginas/welcome/welcome.component').then(
        (m) => m.WelcomeComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./Paginas/login-page/login-page.component').then(
        (m) => m.LoginComponent
      ),
  },

/*
 // 🧾 ADMINISTRADOR
{
  path: 'dashboard-admin',
  loadComponent: () =>
    import('./Paginas/Administrador/dashboard-inicio/dashboard-inicio.component').then((m) => m.DashboardComponent),
  canActivate: [AdminGuard],
  children: [
    {
      path: 'todas-clases',
      loadComponent: () =>
        import('./Paginas/dashboard/dashboard-admin/todas-clases/todas-clases.component').then((m) => m.TodasClasesComponent),
    },
    {
      path: 'crear-clase',
      loadComponent: () =>
        import('./Paginas/dashboard/dashboard-admin/crear-clase/crear-clase.component').then((m) => m.CrearClaseComponent),
    },
    {
      path: 'editar-clase/:id',
      loadComponent: () =>
        import('./Paginas/dashboard/dashboard-admin/editar-clase/editar-clase.component').then((m) => m.EditarClaseComponent),
    },
    {
      path: 'eliminar-cliente',
      loadComponent: () =>
        import('./Paginas/Administrador/eliminar-cliente/eliminar-cliente.component').then((m) => m.EliminarClienteComponent),
    },
    {
      path: 'clientes',
      loadComponent: () =>
        import('./Paginas/Clientes/clientes-lista/clientes-lista.component').then((m) => m.ClientesListaComponent),
    },
    {
      path: 'bitacora',
      loadComponent: () =>
        import('./Paginas/Administrador/bitacora/bitacora.component').then((m) => m.BitacoraComponent),
    },
    {
      path: 'gestionar-personal',
      loadComponent: () =>
        import('./Paginas/Administrador/gestion-personal/gestion-personal.component')
        .then((m) => m.GestionPersonalComponent),
    },

    {
      path: 'asistencias-generales',
      loadComponent: () =>
        import('./Paginas/Administrador/asistencias-generales/asistencias-generales.component').then((m) => m.AsistenciasGeneralesComponent),
    },
    {
      path: 'agenda-reservas',  // ✅ AGREGADO
      loadComponent: () =>
        import('./Paginas/dashboard/dashboard-admin/agenda-reservas-admin/agenda-reservas-admin.component')
          .then((m) => m.AgendaReservasAdminComponent),
    },
    {
  path: 'dashboard-admin/reportes-estadisticas',   //roly ahora
  component: ReportesEstadisticasComponent
}

  ],
},*/


  // 🧾 ADMINISTRADOR
  {
    path: 'dashboard-admin',
    loadComponent: () =>
      import(
        './Paginas/Administrador/dashboard-inicio/dashboard-inicio.component'
      ).then((m) => m.DashboardComponent),
    canActivate: [AdminGuard],
    children: [
      {
        path: 'todas-clases',
        loadComponent: () =>
          import(
            './Paginas/dashboard/dashboard-admin/todas-clases/todas-clases.component'
          ).then((m) => m.TodasClasesComponent),
      },
      {
        path: 'crear-clase',
        loadComponent: () =>
          import(
            './Paginas/dashboard/dashboard-admin/crear-clase/crear-clase.component'
          ).then((m) => m.CrearClaseComponent),
      },
      {
        path: 'editar-clase/:id',
        loadComponent: () =>
          import(
            './Paginas/dashboard/dashboard-admin/editar-clase/editar-clase.component'
          ).then((m) => m.EditarClaseComponent),
      },
      {
        path: 'eliminar-cliente',
        loadComponent: () =>
          import(
            './Paginas/Administrador/eliminar-cliente/eliminar-cliente.component'
          ).then((m) => m.EliminarClienteComponent),
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import(
            './Paginas/Clientes/clientes-lista/clientes-lista.component'
          ).then((m) => m.ClientesListaComponent),
      },
      {
        path: 'bitacora',
        loadComponent: () =>
          import('./Paginas/Administrador/bitacora/bitacora.component').then(
            (m) => m.BitacoraComponent
          ),
      },
      {
        path: 'asistencias-generales',
        loadComponent: () =>
          import(
            './Paginas/Administrador/asistencias-generales/asistencias-generales.component'
          ).then((m) => m.AsistenciasGeneralesComponent),
      },
      {
        path: 'agenda-reservas', // ✅ AGREGADO
        loadComponent: () =>
          import(
            './Paginas/dashboard/dashboard-admin/agenda-reservas-admin/agenda-reservas-admin.component'
          ).then((m) => m.AgendaReservasAdminComponent),
      },
      {
        path: 'admin-inventario',
        loadComponent: () =>
          import(
            './Paginas/dashboard/dashboard-admin/admin-inventario/admin-inventario.component'
          ).then((m) => m.AdminInventarioComponent),
      },
      {
       path: 'asignar-material',
       loadComponent: () =>
        import('./Paginas/Administrador/inventario-responsable/gestion.component').then(
       (m) => m.AsignacionMaterialesComponent
      ),
     },
     {
  path: 'reportes/reservas-clase',
  loadComponent: () =>
    import('./Paginas/Administrador/reportes-estadisticas/reportes-estadisticas.component')
      .then(m => m.ReportesEstadisticasComponent)
},
{
  path: 'reportes/clases-instructor',
  loadComponent: () =>
    import('./Paginas/Administrador/reportes-estadisticas/clases-estadisticas.component')
      .then(m => m.ClasesEstadisticasComponent)
},
{
  path: 'reportes/clases-reporte',
  loadComponent: () =>
    import('./Paginas/Administrador/reportes-estadisticas/disciplinas-estadisticas.component')
      .then(m => m.DisciplinasEstadisticasComponent)
},

{
  path: 'reportes/clases-activas',
  loadComponent: () =>
    import('./Paginas/Administrador/reportes-estadisticas/disciplinas-estadisticas.component')
      .then(m => m.DisciplinasEstadisticasComponent)
},
{
  path: 'reportes/asistencias-personal',
  loadComponent: () =>
    import('./Paginas/Administrador/reportes-estadisticas/asistencias-estadisticas.component')
      .then(m => m.AsistenciasEstadisticasComponent)
},
{
  path: 'reportes/pagos',
  loadComponent: () =>
    import('./Paginas/Administrador/reportes-estadisticas/pagos-estadisticas.component')
      .then(m => m.PagosEstadisticasComponent)
}



    ],
  },



  // 🧾 RECEPCIONISTA (corregido aquí)
  {
    path: 'dashboard-recepcionista',
    loadComponent: () =>
      import(
        './Paginas/dashboard/dashboard-recepcionista/dashboard-recepcionista.component'
      ).then((m) => m.DashboardRecepcionistaComponent),
    canActivate: [recepcionistaGuard],
    children: [
      {
        path: 'registrar-cliente',
        loadComponent: () =>
          import(
            './Paginas/dashboard/dashboard-recepcionista/registrar-cliente/registrar-cliente.component'
          ).then((m) => m.RegistrarClienteComponent),
      },
      {
        path: 'actualizar-cliente',
        loadComponent: () =>
          import(
            './Paginas/dashboard/dashboard-recepcionista/actualizar-cliente/actualizar-cliente.component'
          ).then((m) => m.ActualizarClienteComponent),
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import(
            './Paginas/Clientes/clientes-lista/clientes-lista.component'
          ).then((m) => m.ClientesListaComponent),
      },
      {
        path: 'asistencias-hoy',
        loadComponent: () =>
          import(
            './Paginas/dashboard/dashboard-recepcionista/asistencias-hoy/asistencias-hoy.component'
          ).then((m) => m.AsistenciasHoyComponent),
      },
      {
        path: 'comprobantes',
        loadComponent: () =>
          import(
            './Paginas/dashboard/dashboard-recepcionista/comprobantes-recepcionista/comprobantes-recepcionista.component'
          ).then((m) => m.ComprobantesRecepcionistaComponent),
      },
      {
        path: 'escanear-asistencia',
        loadComponent: () =>
          import(
            './Paginas/dashboard/dashboard-recepcionista/escanear-asistencia/escanear-asistencia.component'
          ).then((m) => m.EscanearAsistenciaComponent),
        canActivate: [recepcionistaGuard],
      },
      {
        path: 'tarjeta-asistencia',
        loadComponent: () =>
          import(
            './Paginas/tarjeta-asistencia/tarjeta-asistencia.component'
          ).then((m) => m.TarjetaAsistenciaRecepcionistaComponent),
        canActivate: [recepcionistaGuard],
      },
      {
    path: 'vencimientos', // ✅ NUEVA RUTA
    loadComponent: () =>
      import(
        './Paginas/dashboard/dashboard-recepcionista/vencimiento-membresias/vencimiento-membresias.component'
      ).then((m) => m.VencimientoMembresiasComponent),
  },

      {
        path: 'agenda',
        loadComponent: () =>
          import(
            './Paginas/dashboard/dashboard-admin/agenda-reservas-admin/agenda-reservas-admin.component'
          ).then((m) => m.AgendaReservasAdminComponent),
      },
    ],
  },

  // 🧾 INSTRUCTOR
  {
    path: 'dashboard-instructor',
    loadComponent: () =>
      import(
        './Paginas/dashboard/dashboard-instructor/dashboard-instructor.component'
      ).then((m) => m.DashboardInstructorComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'seguimiento',
        loadComponent: () =>
          import(
            './Paginas/dashboard/dashboard-instructor/seguimiento-cliente/seguimiento-cliente.component'
          ).then((m) => m.SeguimientoClienteComponent),
      },
      {
        path: 'tarjeta-asistencia',
        loadComponent: () =>
          import(
            './Paginas/tarjeta-asistencia/tarjeta-asistencia.component'
          ).then((m) => m.TarjetaAsistenciaRecepcionistaComponent),
      },

      {
        path: 'mis-clases',
        loadComponent: () =>
          import(
            './Paginas/dashboard/dashboard-instructor/mis-clases/mis-clases.component'
          ).then((m) => m.MisClasesComponent),
      },

      {
  path: 'gestionar-rutinas',
  loadComponent: () =>
    import('./Paginas/dashboard/dashboard-instructor/gestionar-rutinas-instructor/gestionar-rutinas-instructor.component')
      .then((m) => m.GestionarRutinasInstructorComponent),
},

{
  path: 'crear-rutina',
  loadComponent: () =>
    import('./Paginas/dashboard/dashboard-instructor/crear-rutina-clase/crear-rutina-clase.component')
      .then((m) => m.CrearRutinaClaseComponent),
},






    ],
  },

  // 🧾 CLIENTE
  {
  path: 'dashboard-cliente',
  component: DashboardClienteComponent,
  children: [
    {
      path: 'historial',
      loadComponent: () =>
        import('./Paginas/reservas-cliente/historial/historial.component').then(m => m.HistorialReservasComponent),
    },
    {
      path: 'nueva',
      loadComponent: () =>
        import('./Paginas/reservas-cliente/nueva-reserva/nueva-reserva.component').then(m => m.NuevaReservaComponent),
    },
    {
      path: 'mis-reservas',
      loadComponent: () =>
        import('./Paginas/Clientes/mis-reservas/mis-reservas-cliente.component').then(m => m.MisReservasClienteComponent),
    },
    {
      path: 'seguimiento',
      loadComponent: () =>
        import('./Paginas/dashboard/dashboard-instructor/seguimiento-cliente/seguimiento-cliente.component')
          .then(m => m.SeguimientoClienteComponent),
    },
    {
      path: 'seleccionar-clase',
      loadComponent: () =>
        import('./Paginas/dashboard/dashboard-cliente/seleccionar-clase/seleccionar-clase.component')
          .then(m => m.SeleccionarClaseComponent),
    },
    {
      path: 'asistencia',
      loadComponent: () =>
        import('./Paginas/asistencia/asistencia.component')
          .then(m => m.AsistenciaComponent),
    },
  ]
},
 /* {               --paque no digan que lo cague ahi estan las otras rutas por si no funciona sus metodos
    path: 'dashboard-cliente',
    loadComponent: () =>
      import(
        './Paginas/dashboard/dashboard-cliente/dashboard-cliente/dashboard-cliente.component'
      ).then((m) => m.DashboardClienteComponent),
    children: [
      {
        path: 'historial',
        loadComponent: () =>
          import(
            './Paginas/reservas-cliente/historial/historial.component'
          ).then((m) => m.HistorialReservasComponent),
      },
      {
        path: 'nueva',
        loadComponent: () =>
          import(
            './Paginas/reservas-cliente/nueva-reserva/nueva-reserva.component'
          ).then((m) => m.NuevaReservaComponent),
      },
      {
        path: 'mis-reservas',
        loadComponent: () =>
          import(
            './Paginas/Clientes/mis-reservas/mis-reservas-cliente.component'
          ).then((m) => m.MisReservasClienteComponent),
      },
      {
        path: 'dashboard-cliente',
        component: DashboardClienteComponent,
        children: [
          { path: 'seguimiento', loadComponent: () => import('./Paginas/dashboard/dashboard-instructor/seguimiento-cliente/seguimiento-cliente.component').then(m => m.SeguimientoClienteComponent) },
        ]
      },
      {
        path: 'seleccionar-clase',
        loadComponent: () =>
          import(
            './Paginas/dashboard/dashboard-cliente/seleccionar-clase/seleccionar-clase.component'
          ).then((m) => m.SeleccionarClaseComponent),
      },
      {
        path: 'asistencia',
        loadComponent: () =>
          import('./Paginas/asistencia/asistencia.component').then(
            (m) => m.AsistenciaComponent
          ),
      },

    ],
  },
*/
  // 📌 MEMBRESÍAS
  {
  path: 'membresias',
  loadComponent: () =>
    import('./Paginas/ver-membresias/membresias.component').then(
      (m) => m.MembresiasComponent
    ),
},
  {
    path: 'adquirir-membresia/:id',
    loadComponent: () =>
      import('./Paginas/adquirir-membresia/adquirir-membresia.component').then(
        (m) => m.AdquirirMembresiaComponent
      ),
  },
  {
    path: 'renovar-membresia',
    loadComponent: () =>
      import(
        './Paginas/adquirir-membresia/renovar-membresia/renovar-membresia.component'
      ).then((m) => m.RenovarMembresiaComponent),
  },

  // 📌 PERFIL
  {
    path: 'perfil',
    loadComponent: () =>
      import('./Paginas/perfil/perfil.component').then(
        (m) => m.PerfilComponent
      ),
  },
  {
    path: 'perfil/editar',
    loadComponent: () =>
      import('./Paginas/perfil/editar-perfil/editar-perfil.component').then(
        (m) => m.EditarPerfilComponent
      ),
  },

  // 📌 HISTÓRICO DE RESERVAS
  {
    path: 'reservas/historico',
    component: ReservasHistoricoComponent,
    canActivate: [AuthGuard],
  },

  // 📌 RECUPERACIÓN DE CONTRASEÑA
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./Paginas/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./Paginas/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },

  // 📌 PAGOS
  {
    path: 'pagos/success',
    loadComponent: () =>
      import('./pagos/pago-exitoso.component').then(
        (m) => m.PagoExitosoComponent
      ),
  },
  {
    path: 'pagos/cancel',
    loadComponent: () =>
      import('./pagos/pago-cancelado.component').then(
        (m) => m.PagoCanceladoComponent
      ),
  },

  // ❗ WILDCARD
  {
    path: '**',
    redirectTo: '',
  },
];

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/services/auth.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';




bootstrapApplication(AppComponent, {
  providers: [
      provideHttpClient(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    // ✅ IMPORTANTE: configuración global de Toastr
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot()
    )
  ]
}).catch(err => console.error(err));



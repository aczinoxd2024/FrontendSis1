import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, providePlatformInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-tailwind-bottom-center',
        preventDuplicates: true
      })
    ),
    provideHttpClient(
      withInterceptorsFromDi()
    )
  ]
};

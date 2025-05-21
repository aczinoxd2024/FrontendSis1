import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  imports: [CommonModule,RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-green-100 p-6">
      <div class="bg-white shadow-xl rounded-xl p-10 text-center max-w-md">
        <h1 class="text-2xl font-bold text-green-700 mb-4">¡Pago realizado con éxito!</h1>
        <p class="text-gray-700 mb-6">Gracias por adquirir tu membresía. Ya puedes iniciar sesión y disfrutar de nuestros servicios.</p>
        <a routerLink="/login" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full">
          Iniciar sesión
        </a>
      </div>
    </div>
  `,
})
export class PagoExitosoComponent {}

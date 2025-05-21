import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ Importar esto

@Component({
  selector: 'app-pago-cancelado',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ Incluir aquí
  template: `
    <div class="min-h-screen flex items-center justify-center bg-red-100 p-6">
      <div class="bg-white shadow-xl rounded-xl p-10 text-center max-w-md">
        <h1 class="text-2xl font-bold text-red-700 mb-4">Pago cancelado</h1>
        <p class="text-gray-700 mb-6">Tu proceso de pago fue cancelado. Puedes intentarlo nuevamente cuando estés listo.</p>
        <a routerLink="/menbresias" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full">
          Volver a Membresías
        </a>
      </div>
    </div>
  `,
})
export class PagoCanceladoComponent {}

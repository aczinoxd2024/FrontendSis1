
import { CommonModule } from '@angular/common'; // 👈 AÑADE ESTO
import { NgModule } from '@angular/core';
import { BitacoraComponent } from './bitacora.component';

@NgModule({
  imports: [CommonModule], // 👈 AÑADE ESTO
})
export class BitacoraModule {}

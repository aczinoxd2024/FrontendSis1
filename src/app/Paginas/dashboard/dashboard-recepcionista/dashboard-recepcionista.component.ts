import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Importación necesaria
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-recepcionista',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule // ✅ Para *ngIf, *ngFor, ngClass, etc.
  ],
  templateUrl: './dashboard-recepcionista.component.html',
})
export class DashboardRecepcionistaComponent {

  nombreUsuario: string = '';
  mostrarMenu = false; // ✅ Controla el menú móvil

  constructor(private authService: AuthService, private router: Router) {
    const user = this.authService.getUser();
    this.nombreUsuario = user?.nombre ?? 'Recepcionista';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

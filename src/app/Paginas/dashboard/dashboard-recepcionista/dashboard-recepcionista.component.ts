import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-recepcionista',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard-recepcionista.component.html',
})
export class DashboardRecepcionistaComponent {

  nombreUsuario: string = '';

  constructor(private authService: AuthService, private router: Router) {
    const user = this.authService.getUser();
    this.nombreUsuario = user?.nombre ?? 'Recepcionista';
  }

  logout() {
    this.authService.logout();
  }
}

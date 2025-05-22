import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-cliente.component.html',
  styleUrls: ['./dashboard-cliente.component.css'],
})
export class DashboardClienteComponent {
  constructor(private auth: AuthService, private router: Router) {}

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}

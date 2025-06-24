import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ necesario para *ngIf y *ngFor
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-instructor',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ agregado CommonModule aquí
  templateUrl: './dashboard-instructor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardInstructorComponent {
  nombreUsuario: string = '';
  mostrarMenu = false;

  constructor(private router: Router, private authService: AuthService) {
    const user = this.authService.getUser();
    this.nombreUsuario = user?.nombre ?? 'Instructor';
  }

  refrescarTarjeta() {
    this.router.navigate(['/dashboard-instructor/tarjeta-asistencia']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

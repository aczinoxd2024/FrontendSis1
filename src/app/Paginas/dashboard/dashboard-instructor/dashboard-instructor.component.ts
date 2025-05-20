import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // ✅ Import necesario

@Component({
  selector: 'app-dashboard-instructor',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard-instructor.component.html',
  styleUrls: ['./dashboard-instructor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardInstructorComponent {}

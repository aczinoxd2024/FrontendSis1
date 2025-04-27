import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // <-- 🔥 Agregado aquí
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // 🔥 También era "styleUrl" pero es "styleUrls" con "s"
})
export class AppComponent {
  title = 'FrontendGim';
}

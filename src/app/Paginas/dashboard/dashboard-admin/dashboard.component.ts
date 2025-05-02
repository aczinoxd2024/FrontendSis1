import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BitacoraComponent } from '../../bitacora/bitacora.component';
// ✅ IMPORTAR BITACORA

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [CommonModule, BitacoraComponent] // ✅ AGREGAR AQUI TAMBIEN
})
export class DashboardComponent implements OnInit {

  rol: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.rol = (localStorage.getItem('rol') ?? '').trim().toLowerCase();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }
}

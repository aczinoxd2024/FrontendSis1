import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BitacoraComponent } from '../bitacora/bitacora.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard-inicio.component.html',
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit {
    mostrarMenu: boolean = false;

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

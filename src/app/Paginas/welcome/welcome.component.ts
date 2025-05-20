import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ClasesService } from '../../services/clases.service';


@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  imports: [CommonModule, RouterModule],
})
export class WelcomeComponent implements OnInit {
  logueado = false;
  usuarioNombre = '';
  usuarioCorreo = '';
  usuarioRol = '';
  mostrarMenu = false;
  mostrarPerfil = false;

  clases: any[] = []; // ✅ NUEVO: lista de clases públicas

  constructor(
    private authService: AuthService,
    private router: Router,
    private clasesService: ClasesService // ✅ NUEVO: inyección del servicio
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    this.logueado = !!token;
    this.usuarioNombre = user.nombre || '';
    this.usuarioCorreo = user.correo || '';
    this.usuarioRol = user.rol || '';

    // ✅ NUEVO: cargar clases públicas
      this.clasesService.getClasesDisponibles().subscribe({
      next: (data: any[]) => (this.clases = data),
      error: (err: any) => console.error('Error al cargar clases', err),
    });
  }
  toggleDropdown(): void {
    this.mostrarMenu = !this.mostrarMenu;
    if (this.mostrarMenu) {
      this.mostrarPerfil = false;
    }
  }

  togglePerfil(): void {
    this.mostrarPerfil = !this.mostrarPerfil;
    if (this.mostrarPerfil) {
      this.mostrarMenu = false;
    }
  }

  irAIniciarSesion(): void {
    this.router.navigate(['/login']);
  }

  cerrarSesion(): void {
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const insideDropdown = target.closest('.dropdown');
    const insidePerfilPanel = target.closest('.perfil-panel');
    if (!insideDropdown && !insidePerfilPanel) {
      this.mostrarMenu = false;
      this.mostrarPerfil = false;
    }
  }

  cerrarMenus(): void {
    this.mostrarMenu = false;
    this.mostrarPerfil = false;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.mostrarMenu = false;
    this.mostrarPerfil = false;
  }
  scrollToClases(): void {
  const seccion = document.getElementById('seccion-clases');
  if (seccion) {
    seccion.scrollIntoView({ behavior: 'smooth' });
  }
}

}

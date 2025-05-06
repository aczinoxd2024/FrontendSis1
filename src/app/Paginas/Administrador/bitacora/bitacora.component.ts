import { Component, OnInit } from '@angular/core';
import { BitacoraService } from './bitacora.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-bitacora',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bitacora.component.html',
})
export class BitacoraComponent implements OnInit {

  bitacoras: any[] = [];
  usuarioNombre: string = '';

  // ✅ Inyectamos AuthService
  constructor(
    private bitacoraService: BitacoraService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarBitacora();
  }

  /**
   * Cargar datos del usuario en sesión desde localStorage
   */
  cargarUsuario(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.usuarioNombre = user.nombre || 'No identificado';
    } else {
      this.usuarioNombre = 'No identificado';
    }
  }

  /**
   * Cargar registros de bitácora desde el backend
   */
  cargarBitacora(): void {
    this.bitacoraService.getBitacora().subscribe({
      next: (data) => {
        this.bitacoras = data;
        console.log('✅ Bitácora cargada:', data);
      },
      error: (err) => {
        console.error('❌ Error al cargar la bitácora:', err);
      }
    });
  }

  /**
   * Cerrar sesión del usuario (usando AuthService)
   */
  logout(): void {
    this.authService.logout(); // ✅ Ya se encarga de registrar y redirigir
  }

  /**
   * Determinar si el registro es un cierre de sesión
   */
  esCierreSesion(accion: string): boolean {
    return accion.toLowerCase().includes('cierre de sesión');
  }

}

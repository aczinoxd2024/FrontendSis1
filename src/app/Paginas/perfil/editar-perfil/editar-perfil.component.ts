import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../../../interfaces/cliente.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-perfil.component.html',
})
export class EditarPerfilComponent implements OnInit {

  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  rol: string = '';
  telefono: string = '';
  direccion: string = '';

  passwordActual: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';

  constructor(
    private router: Router,
    private clienteService: ClienteService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // ✅ Obtener perfil desde el servicio
    this.clienteService.obtenerPerfilCliente().subscribe({
      next: (data: any) => {
        this.nombre = data.nombre || 'Sin datos';
        this.apellido = data.apellido || 'Sin datos';
        this.correo = data.correo || 'Sin datos';
        this.telefono = data.telefono || 'Sin datos';
        this.direccion = data.direccion || 'Sin datos';
        this.rol = data.rol || '';
      },
      error: (err) => {
        console.error('Error al cargar el perfil:', err);
        alert('Error al cargar el perfil. Intenta más tarde.');
      }
    });
  }

  guardarCambios(): void {
    const datos = {
      nombre: this.nombre,
      apellido: this.apellido,
      telefono: this.telefono,
      direccion: this.direccion
    };

    this.clienteService.actualizarPerfil(datos).subscribe({
      next: () => {
        // ✅ Actualizar localStorage con todos los datos
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.nombre = this.nombre;
        user.apellido = this.apellido;
        user.telefono = this.telefono;
        user.direccion = this.direccion;
        user.correo = this.correo; // 🔑 Importante para cuando vuelva a entrar
        localStorage.setItem('user', JSON.stringify(user));

        alert('Perfil actualizado correctamente.');
        this.router.navigate(['/perfil']);
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        alert('Hubo un error al actualizar el perfil.');
      }
    });
  }


  cambiarPassword(): void {
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      alert('Las nuevas contraseñas no coinciden.');
      return;
    }

    const body = {
      passwordActual: this.passwordActual,
      nuevaContrasena: this.nuevaContrasena,
      confirmarContrasena: this.confirmarContrasena,
    };

    const token = localStorage.getItem('token');

    this.http.post('https://web-production-d581.up.railway.app/api/auth/cambiar-password', body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).subscribe({
      next: () => {
        alert('Contraseña actualizada correctamente.');

        // 🔐 Limpiar sesión
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('user');

        // 🔄 Redirigir al login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        if (err.error?.message === 'La contraseña actual es incorrecta.') {
          alert('La contraseña actual es incorrecta.');
        } else {
          alert('Error al cambiar la contraseña.');
        }
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/perfil']);
  }
}

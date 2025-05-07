import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../../../interfaces/cliente.service';
import { HttpClient } from '@angular/common/http';


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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.nombre = user.nombre || '';
    this.apellido = user.apellido || '';
    this.correo = user.correo || '';
    this.rol = user.rol || '';
    this.telefono = user.telefono || '';
    this.direccion = user.direccion || '';
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
        // ✅ Actualizar localStorage con los nuevos datos
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.nombre = this.nombre;
        user.telefono = this.telefono;
        user.direccion = this.direccion;
        user.apellido = this.apellido;
        localStorage.setItem('user', JSON.stringify(user));

        alert('Perfil actualizado correctamente.');
        this.router.navigate(['/perfil']);
      },
      error: (err: any) => {
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
        this.passwordActual = '';
        this.nuevaContrasena = '';
        this.confirmarContrasena = '';
      },
      error: (err) => {
        console.error(err);
        const msg = err?.error?.message;

        if (msg === 'La contraseña actual es incorrecta.') {
          alert('La contraseña actual es incorrecta.');
        } else if (msg === 'Las nuevas contraseñas no coinciden.') {
          alert('Las nuevas contraseñas no coinciden.');
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



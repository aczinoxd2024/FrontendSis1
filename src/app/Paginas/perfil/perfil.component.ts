import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../interfaces/cliente.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
})
export class PerfilComponent implements OnInit {
  nombre = '';
  apellido = '';
  correo = '';
  rol = '';
  telefono = '';
  direccion = '';

  constructor(private router: Router, private clienteService: ClienteService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.rol = user.rol || ''; // Solo rol se mantiene local

    // 🔑 Ahora tomamos TODO desde backend (incluyendo correo)
    this.clienteService.obtenerPerfilCliente().subscribe({
      next: (data) => {
        this.nombre = data.nombre ?? '';
        this.apellido = data.apellido ?? '';
        this.correo = data.correo ?? ''; // 👈 Correo desde backend
        this.telefono = data.telefono ?? '';
        this.direccion = data.direccion ?? '';
      },
      error: (err) => {
        console.error('Error al cargar el perfil:', err);
      }
    });
  }

  editarPerfil(): void {
    this.router.navigate(['/perfil/editar']);
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}

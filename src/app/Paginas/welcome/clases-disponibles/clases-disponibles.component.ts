import { Component, OnInit } from '@angular/core';
import { ClasesService } from '../../../services/clases.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clases-disponibles',
  templateUrl: './clases-disponibles.component.html',
  standalone: true, // ✅ si estás usando Angular standalone
  imports: [CommonModule],      // puedes añadir CommonModule si lo necesitas
})
export class ClasesDisponiblesComponent implements OnInit {
  clases: any[] = [];

  constructor(private clasesService: ClasesService) {}

  ngOnInit(): void {
    this.clasesService.obtenerClasesPublicas().subscribe({
      next: (data: any[]) => (this.clases = data),
      error: (err: any) => console.error('Error al cargar clases públicas', err),
    });
  }

  irAIniciarSesion(): void {
    window.location.href = '/login';
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClasesService } from '../../../../services/clases.service';
 // ← RUTA CORREGIDA
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mis-clases',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-clases.component.html',
  styleUrls: ['./mis-clases.component.css']
})
export class MisClasesComponent implements OnInit {
  clases: any[] = [];

  constructor(private clasesService: ClasesService) {
    console.log('✅ ClasesService inyectado');
  }

  ngOnInit(): void {
    this.clasesService.obtenerMisClases().subscribe({
      next: (data: any[]) => {
        console.log('Clases recibidas:', data);
        this.clases = data;
      },
      error: (err: any) => console.error('Error al obtener clases', err)
    });
  }

 getHorariosUnicos(horarios: any[]): any[] {
  const vistos = new Set();
  return (horarios || []).filter(h => {
    if (!h.dia || !h.horaInicio || !h.horaFin) return false;
    const clave = `${h.dia}-${h.horaInicio}-${h.horaFin}`;
    if (vistos.has(clave)) return false;
    vistos.add(clave);
    return true;
  });
}


}



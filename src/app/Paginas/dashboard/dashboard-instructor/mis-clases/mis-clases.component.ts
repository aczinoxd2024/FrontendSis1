import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClasesService } from '../../../../services/clases.service';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-mis-clases',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-clases.component.html',
})
export class MisClasesComponent implements OnInit {
  clases: any[] = [];

  constructor(
    private clasesService: ClasesService,
    private router: Router,
    private cdr: ChangeDetectorRef // ✅ Inyectamos el detector de cambios
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('/dashboard-instructor/mis-clases')) {
          this.cargarClases();
        }
      });
  }

  ngOnInit(): void {
    this.cargarClases();
  }

  cargarClases(): void {
    this.clasesService.obtenerMisClases().subscribe({
      next: (data: any[]) => {
        console.log('Clases recibidas:', data);
        this.clases = data;
        this.cdr.detectChanges(); // ✅ Forzamos la actualización de la vista
      },
      error: (err: any) => console.error('Error al obtener clases', err)
    });
  }

  getHorariosUnicos(horarios: any[]): any[] {
  const vistos = new Set();
  return (horarios || []).filter(h => {
    const dia = h.diaSemana?.Dia || '';
    const horaInicio = h.HoraIni;
    const horaFin = h.HoraFin;

    if (!dia || !horaInicio || !horaFin) return false;

    const clave = `${dia}-${horaInicio}-${horaFin}`;
    if (vistos.has(clave)) return false;
    vistos.add(clave);
    return true;
  });
}

}

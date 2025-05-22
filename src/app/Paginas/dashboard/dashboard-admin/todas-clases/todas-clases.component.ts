import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClasesService } from '../../../../services/clases.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todas-clases',
  standalone: true,
  templateUrl: './todas-clases.component.html',
  styleUrls: ['./todas-clases.component.css'],
  imports: [CommonModule]
})
export class TodasClasesComponent implements OnInit {
  clases: any[] = [];

  constructor(
    private clasesService: ClasesService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const mensaje = history.state?.mensaje;
    if (mensaje) {
      this.toastr.success(mensaje, '✅ Éxito', {
        positionClass: 'toast-bottom-right'
      });
    }

    this.clasesService.obtenerTodasLasClases().subscribe({
      next: (data: any[]) => {
        console.log('📦 Clases recibidas:', data);
        this.clases = data;
      },
      error: (err: any) => console.error('❌ Error al cargar clases', err)
    });
  }
}

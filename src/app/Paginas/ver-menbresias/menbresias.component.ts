import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menbresias',
  templateUrl: './menbresias.component.html',
})
export class MenbresiasComponent {
  constructor(private router: Router) {}

  seleccionarMembresia(tipo: 'basica' | 'gold' | 'disciplina') {
    let id = 0;

    if (tipo === 'basica') {
      id = 1; // ID en la base de datos para Básica
    } else if (tipo === 'gold') {
      id = 2; // ID en la base de datos para Gold
    } else if (tipo === 'disciplina') {
      id = 3;
    }

    this.router.navigate(['/adquirir-menbresia', id]);
  }
  verDisciplinas(): void {
    this.router.navigate(['/clases']);
  }
}

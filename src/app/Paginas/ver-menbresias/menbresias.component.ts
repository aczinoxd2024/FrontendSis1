import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menbresias',
  templateUrl: './menbresias.component.html',
})
export class MenbresiasComponent {

  constructor(private router: Router) {}

  seleccionarMembresia(tipo: 'basica' | 'gold') {
    this.router.navigate(['/registro'], {
      queryParams: { membresia: tipo }
    });
  }
}

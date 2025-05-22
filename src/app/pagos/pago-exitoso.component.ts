import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pago-exitoso',
  templateUrl: './pago-exitoso.component.html',
})
export class PagoExitosoComponent implements OnInit {
  correo: string = '';
  contrasena: string = 'Cambiar123';
  mostrarInfo: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (sessionId) {
      this.http
        .get<any>(`https://web-production-d581.up.railway.app/api/stripe/success-info?session_id=${sessionId}`)
        .subscribe({
          next: (data) => {
            console.log('Respuesta del backend:', data); // 👈 para confirmar
            this.correo = data.correo;
            this.mostrarInfo = true;
          },
          error: (err) => {
            console.error('Error al obtener info post-pago', err);
          },
        });
    }
  }

  irAlLogin() {
    this.router.navigate(['/login']);
  }
}

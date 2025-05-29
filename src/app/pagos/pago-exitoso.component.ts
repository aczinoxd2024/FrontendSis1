import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true, // ✅ obligatorio si no forma parte de otro módulo
  imports: [CommonModule], // ✅ Aquí asegúrate de incluirlo
  templateUrl: './pago-exitoso.component.html',
})
export class PagoExitosoComponent implements OnInit {
  correo: string = '';
  contrasena: string = 'Cambiar123';
  mostrarInfo: boolean = false;
  nroPago!: number;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (sessionId) {
      this.http
        .get<any>(
          `https://web-production-d581.up.railway.app/api/stripe/success-info?session_id=${sessionId}`
        )

        .subscribe({
          next: (data) => {
            console.log('✅ Respuesta del backend:', data);
            this.correo = data.correo;
            this.nroPago = data.nroPago;
            this.mostrarInfo = true;
          },
          error: (err) => {
            console.error('❌ Error al obtener info post-pago', err);
          },
        });
    }
  }

  descargarComprobante() {
  if (!this.nroPago) {
    alert('No se encontró el número de comprobante.');
    return;
  }

  const link = document.createElement('a');
  link.href = `https://web-production-d581.up.railway.app/api/pagos/comprobante/${this.nroPago}`;
  link.target = '_blank';
  link.click();
}

  irAlLogin() {
    this.router.navigate(['/login']);
  }
}

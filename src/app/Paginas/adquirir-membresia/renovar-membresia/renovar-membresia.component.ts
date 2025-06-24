import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { PagoService } from '../../../services/pagos.service';
import { RouterModule, Router } from '@angular/router';
import { MembresiaService } from '../../../services/membresia.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-renovar-membresia',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './renovar-membresia.component.html',
  styleUrls: ['./renovar-membresia.component.css'],
})
export class RenovarMembresiaComponent implements OnInit {
  membresias: any[] = [];
  procesando = false;
  mensaje = '';

  constructor(
    private membresiaService: MembresiaService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.membresiaService.obtenerMembresias().subscribe({
      next: (data) => this.membresias = data,
      error: () => this.mensaje = '❌ Error al cargar membresías',
    });
  }

 adquirir(membresia: any): void {
  if (this.procesando) return;
  this.procesando = true;

  const usuario = this.authService.getUser();
  const ci = this.authService.getCIUsuario();

  if (!usuario || !usuario.correo || !ci) {
    alert('⚠️ No se pudo obtener tus datos de sesión.');
    this.procesando = false;
    return;
  }

  const payload = {
    ci: ci,
    tipoMembresiaId: membresia.ID,
    correo: usuario.correo,
  };

  console.log('📤 Payload enviado:', payload);
  console.log('📦 Membresía seleccionada:', membresia);

  if (membresia.Clases && membresia.Clases.length > 0) {
    // 👉 Membresía con clases: redirigir a seleccionar clase
    this.router.navigate(['/dashboard-cliente/seleccionar-clase'], {
      queryParams: {
        tipoID: membresia.ID,
        esRenovacion: true
      }
    });
    this.procesando = false;
  } else {
    // 👉 Membresía sin clases: redirigir a Stripe directo
    this.membresiaService.iniciarPagoDirecto(payload.ci, payload.tipoMembresiaId, payload.correo).subscribe({
      next: (res: any) => window.location.href = res.url,
      error: () => {
        alert('❌ No se pudo iniciar el pago.');
        this.procesando = false;
      }
    });
  }
}


}

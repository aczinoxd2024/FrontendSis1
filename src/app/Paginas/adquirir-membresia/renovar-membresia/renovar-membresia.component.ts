import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PagoService } from '../../../services/pagos.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-renovar-membresia',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './renovar-membresia.component.html',
  styleUrls: ['./renovar-membresia.component.css'],
})
export class RenovarMembresiaComponent implements OnInit {
  correoCliente: string = '';
  procesando: boolean = false;

  tipos = [
    {
      id: 'basica',
      nombre: 'Membresía Básica',
      descripcion: 'Acceso a máquinas, pesas y cardio.',
      precio: '$20 / mes',
    },
    {
      id: 'disciplina',
      nombre: 'Solo Disciplina',
      descripcion: 'Acceso a una clase específica.',
      precio: '$15 / mes',
    },
    {
      id: 'gold',
      nombre: 'Membresía Gold',
      descripcion: 'Todo lo anterior + clases dirigidas.',
      precio: '$35 / mes',
    },
  ];

  constructor(
    private pagoService: PagoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.correo) {
      this.correoCliente = user.correo;
    }
  }

  redirigirAPago(tipo: 'basica' | 'gold' | 'disciplina') {
    if (this.procesando) return;
    this.procesando = true;

    const user = this.authService.getUser();
    const ci = this.authService.getCIUsuario();

    if (!user || !user.correo || !ci) {
      alert('No se pudo obtener tus datos de sesión. Intenta iniciar sesión nuevamente.');
      this.procesando = false;
      return;
    }

    const tipoNuevoID = tipo === 'basica' ? 1 : tipo === 'gold' ? 2 : 3;
    const precios = {
      basica: { amount: 20, descripcion: 'Básica' },
      gold: { amount: 35, descripcion: 'Gold' },
      disciplina: { amount: 15, descripcion: 'Disciplina' },
    };
    const info = precios[tipo];

    // ✅ Para Gold y Disciplina redirigimos a seleccionar clase
    if (tipo === 'gold' || tipo === 'disciplina') {
      this.pagoService.previsualizarCambioMembresia(ci, tipoNuevoID).subscribe({
        next: (resultado) => {
          sessionStorage.setItem('mensajeRenovacion', resultado.mensaje);
          this.router.navigate(['/dashboard-cliente/seleccionar-clase'], {
            queryParams: { tipo },
          });
          this.procesando = false;
        },
        error: (err) => {
          console.error('❌ Error al previsualizar:', err);
          alert('No se pudo verificar tu membresía actual. Intenta nuevamente.');
          this.procesando = false;
        },
      });
    } else {
      // ✅ Para básica se inicia el flujo completo de pago
      this.pagoService.iniciarProcesoPago(
        ci,
        tipoNuevoID,
        info.amount,
        info.descripcion,
        user.correo
      );
      this.procesando = false;
    }
  }
}

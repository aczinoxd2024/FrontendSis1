import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MembresiaService } from '../../../services/membresia.service';
import { ClasesService } from '../../../services/clases.service';
import { PromoService } from '../../../services/promo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-editar-membresia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './editar-membresia.component.html'
})
export class EditarMembresiaComponent implements OnInit {
  membresiaForm!: FormGroup;
  mensaje = '';
  id!: number;

  clasesDisponibles: any[] = [];
  clasesSeleccionadas: number[] = [];
  promocionesDisponibles: any[] = [];
  incluirClases = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private membresiaService: MembresiaService,
    private clasesService: ClasesService,
    private promoService: PromoService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.membresiaForm = this.fb.group({
      NombreTipo: ['', Validators.required],
      Descripcion: [''],
      DuracionDias: [30, [Validators.required, Validators.min(1)]],
      Precio: [0, [Validators.required, Validators.min(1)]],
      Beneficios: [''],
      IncluyeClases: [false],
      PromocionID: [null],
      CantidadClasesCliente: [0]
    });

    this.clasesService.obtenerTodasLasClases().subscribe({
  next: data => {
    this.clasesDisponibles = data;
    console.log('✅ Clases cargadas:', this.clasesDisponibles); // ⬅️ Aquí
  },
  error: () => console.error('❌ Error cargando clases')
});


    this.promoService.obtenerPromociones().subscribe({
      next: data => this.promocionesDisponibles = data,
      error: () => console.error('❌ Error cargando promociones')
    });

    this.cargarDatosMembresia();
  }

  cargarDatosMembresia(): void {
    this.membresiaService.obtenerMembresiaPorId(this.id).subscribe({
      next: data => {
        this.membresiaForm.patchValue({
          NombreTipo: data.NombreTipo,
          Descripcion: data.Descripcion,
          DuracionDias: data.DuracionDias,
          Precio: data.Precio,
          Beneficios: data.Beneficios,
          PromocionID: data.IDPromocion ?? null,
          CantidadClasesCliente: data.CantidadClasesCliente ?? 0,
          IncluyeClases: data.Clases && data.Clases.length > 0
        });

        this.incluirClases = data.Clases && data.Clases.length > 0;
        this.clasesSeleccionadas = Array.isArray(data.Clases)
  ? data.Clases
  : typeof data.Clases === 'string'
    ? JSON.parse(data.Clases)
    : [];

      },
      error: () => this.mensaje = '❌ Error al cargar membresía.'
    });
  }

  toggleClase(id: number): void {
    if (this.clasesSeleccionadas.includes(id)) {
      this.clasesSeleccionadas = this.clasesSeleccionadas.filter(c => c !== id);
    } else {
      this.clasesSeleccionadas.push(id);
    }
  }

  actualizarMembresia(): void {
    if (this.membresiaForm.invalid) return;

    if (this.membresiaForm.value.IncluyeClases && this.clasesSeleccionadas.length === 0) {
      this.mensaje = '❗ Debes seleccionar al menos una clase.';
      return;
    }

    const payload = {
      ...this.membresiaForm.value,
      IDPromocion: this.membresiaForm.value.PromocionID ?? null,
      Clases: this.membresiaForm.value.IncluyeClases ? this.clasesSeleccionadas : []
    };

    delete payload.PromocionID;
    delete payload.IncluyeClases;

    this.membresiaService.actualizarMembresia(this.id, payload).subscribe({
      next: () => this.mensaje = '✅ Membresía actualizada correctamente.',
      error: () => this.mensaje = '❌ Error al actualizar membresía.'
    });
  }

  onCheckboxChange(event: Event, id: number): void {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    if (!this.clasesSeleccionadas.includes(id)) {
      this.clasesSeleccionadas.push(id);
    }
  } else {
    this.clasesSeleccionadas = this.clasesSeleccionadas.filter(c => c !== id);
  }
}

}

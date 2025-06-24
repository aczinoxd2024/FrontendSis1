import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MembresiaService } from '../../../services/membresia.service';
import { ClasesService } from '../../../services/clases.service';
import { FormsModule } from '@angular/forms';
import { PromoService } from '../../../services/promo.service'; // 🔸 Asegúrate de crearlo

@Component({
  selector: 'app-gestionar-membresias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './gestionar-membresias.component.html'
})
export class GestionarMembresiasComponent implements OnInit {
  membresiaForm!: FormGroup;
  mensaje = '';

  clasesDisponibles: any[] = [];
  clasesSeleccionadas: number[] = [];
  promocionesDisponibles: any[] = [];
  

  constructor(
    private fb: FormBuilder,
    private membresiaService: MembresiaService,
    private clasesService: ClasesService,
    private promoService: PromoService
  ) {}

  ngOnInit(): void {
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
      next: (data: any[]) => this.clasesDisponibles = data,
      error: () => console.error('❌ Error cargando clases')
    });

    this.promoService.obtenerPromociones().subscribe({
  next: (data: any[]) => {
    console.log('✅ Promociones cargadas:', data); // 👈 Añade esto
    this.promocionesDisponibles = data;
  },
  error: () => console.error('❌ Error cargando promociones')
});
  }

  toggleClase(id: number): void {
    if (this.clasesSeleccionadas.includes(id)) {
      this.clasesSeleccionadas = this.clasesSeleccionadas.filter(c => c !== id);
    } else {
      this.clasesSeleccionadas.push(id);
    }
  }

 crearMembresia(): void {
  if (this.membresiaForm.invalid) return;
   // ⚠️ Validar si se marcaron clases pero no se eligió ninguna
  if (this.membresiaForm.value.IncluyeClases && this.clasesSeleccionadas.length === 0) {
    this.mensaje = '❗ Debes seleccionar al menos una clase si decides incluir clases.';
    return;
  }

  const payload = {
    ...this.membresiaForm.value,
    IDPromocion: this.membresiaForm.value.PromocionID ?? null,
    Clases: this.membresiaForm.value.IncluyeClases ? this.clasesSeleccionadas : []
  };

  console.log('📦 Payload enviado:', payload);

  delete payload.PromocionID;
  delete payload.IncluyeClases;


   

  this.membresiaService.crearMembresia(payload).subscribe({
    next: () => {
      this.mensaje = '✅ Membresía creada correctamente.';
      this.membresiaForm.reset();
      this.clasesSeleccionadas = [];
    },
    error: () => this.mensaje = '❌ Error al crear membresía.'
  });
}


}

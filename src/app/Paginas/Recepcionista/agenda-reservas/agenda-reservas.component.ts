import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agenda-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda-reservas.component.html'
})
export class AgendaReservasComponent {
  reservas: any[] = [];
  reservasAgrupadas: { clase: string, items: any[] }[] = [];
  ciCliente: string = '';
  estadoFiltro: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  paginasPorClase: { [clase: string]: number } = {};
  itemsPorPagina: number = 5;


  baseUrl: string = 'https://web-production-d581.up.railway.app/api/reservas';

  constructor(private http: HttpClient) {}

  buscarReservas() {
    let url = this.baseUrl;
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Token no encontrado. Inicie sesión nuevamente.');
      return;
    }

    if (this.ciCliente) {
      url += `/cliente/${this.ciCliente}`;
      const params: string[] = [];

      if (this.estadoFiltro) {
        params.push(`estado=${encodeURIComponent(this.estadoFiltro)}`);
      }
      if (this.fechaInicio) {
        params.push(`fechaInicio=${this.fechaInicio}`);
      }
      if (this.fechaFin) {
        params.push(`fechaFin=${this.fechaFin}`);
      }

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
    }

    console.log('🔗 URL usada:', url);

    this.http.get<any[]>(url, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    }).subscribe({
      next: res => {
        console.log('✅ Reservas obtenidas:', res);
        this.reservas = res;
        this.agruparPorClase();
      },
      error: err => {
        console.error('❌ Error en la petición:', err);
        alert('Error al obtener reservas');
      }
    });
  }

  agruparPorClase() {
    const agrupadas: { [clase: string]: any[] } = {};

    this.reservas.forEach(r => {
      const nombre = r.clase?.Nombre || 'Sin clase';
      if (!agrupadas[nombre]) {
        agrupadas[nombre] = [];
      }
      agrupadas[nombre].push(r);
    });

    this.reservasAgrupadas = Object.entries(agrupadas).map(([clase, items]) => ({ clase, items }));
    this.paginasPorClase = {};
    this.reservasAgrupadas.forEach(grupo => {
    this.paginasPorClase[grupo.clase] = 1;
  });

  }
  anteriorPagina(clase: string) {
  this.paginasPorClase[clase] = Math.max(1, this.paginasPorClase[clase] - 1);
}

siguientePagina(clase: string, totalItems: number) {
  const totalPaginas = Math.ceil(totalItems / this.itemsPorPagina);
  this.paginasPorClase[clase] = Math.min(totalPaginas, this.paginasPorClase[clase] + 1);
}


  cancelarReserva(id: number) {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Token no encontrado. Inicie sesión nuevamente.');
      return;
    }

    if (!confirm('¿Cancelar esta reserva?')) return;

    this.http.patch(`${this.baseUrl}/${id}/cancelar`, {}, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    }).subscribe({
      next: () => {
        alert('✅ Reserva cancelada correctamente');
        this.buscarReservas(); // Recarga la tabla
      },
      error: err => {
        console.error('❌ Error al cancelar:', err);
        alert('No se pudo cancelar la reserva');
      }
    });
  }

  limpiarFiltros() {
    this.ciCliente = '';
    this.estadoFiltro = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.buscarReservas();
  }

  exportarPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Agenda de Reservas - GoFit Gym', 14, 20);
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

    const data = this.reservas.map(r => [
      r.cliente?.CI || '',
      r.clase?.Nombre || '',
      `${r.horario?.HoraIni} - ${r.horario?.HoraFin}`,
      r.estado?.Estado || ''
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['CI Cliente', 'Clase', 'Horario', 'Estado']],
      body: data
    });

    doc.save('Agenda_Reservas_GoFit.pdf');
  }
}

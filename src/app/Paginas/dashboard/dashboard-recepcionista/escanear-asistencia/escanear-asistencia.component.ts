import { Component, OnInit, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CommonModule } from '@angular/common';
import { PersonalService } from '../../../../services/personal.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-escanear-asistencia',
  templateUrl: './escanear-asistencia.component.html',
  styleUrls: ['./escanear-asistencia.component.css'],
  imports: [CommonModule, ZXingScannerModule, FormsModule],
})
export class EscanearAsistenciaComponent implements OnInit {
  modo: 'entrada' | 'salida' = 'entrada';
  resultadoQR: string = '';
  hasPermission: boolean = false;
  availableDevices: MediaDeviceInfo[] = [];
  selectedDeviceId: string = '';
  scannerError: string = '';

  @ViewChild(ZXingScannerComponent) scanner?: ZXingScannerComponent;

  constructor(private PersonalService: PersonalService) {}

  ngOnInit(): void {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.hasPermission = true;
        console.log('✅ Permiso de cámara concedido');
        stream.getTracks().forEach((t) => t.stop());
      })
      .catch((err) => {
        this.scannerError = '❌ No se pudo acceder a la cámara: ' + err.message;
        console.error(this.scannerError);
        this.hasPermission = false;
      });
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    console.log('📷 Cámaras detectadas:', devices);

    if (devices.length > 0) {
      // Seleccionar la cámara física si es posible
      const camFisica = devices.find((d) =>
        /hp|webcam|camera/i.test(d.label)
      );
      this.selectedDeviceId = camFisica?.deviceId || devices[0].deviceId;
      console.log('✅ Cámara seleccionada:', this.selectedDeviceId);

      // Solicitar permiso, pero NO llamar a reset() aquí
      setTimeout(() => {
        this.scanner?.askForPermission().then((granted) => {
          this.hasPermission = granted;
          console.log('📸 Cámara con permiso:', granted);
        });
      }, 500);
    }
  }

  onCodeResult(ci: string) {
    this.resultadoQR = ci;

    const fn =
      this.modo === 'entrada'
        ? this.PersonalService.registrarEntrada(ci)
        : this.PersonalService.registrarSalida(ci);

fn.subscribe({
  next: (res: any) => {
    console.log('✅ RESPUESTA OK:', res);
    alert(res.mensaje);
  },
  error: (err) => {
    console.error('❌ ERROR COMPLETO:', err);
    alert(err?.error?.message || err?.message || '❌ Error inesperado');
  },
});

  }

  cambiarModo() {
    this.modo = this.modo === 'entrada' ? 'salida' : 'entrada';
  }

  onScanError(err: any) {
    console.error('📛 Error en el escáner:', err);
    this.scannerError = '❌ Error al acceder a la cámara: ' + err?.name;

    if (err?.name === 'NotReadableError') {
      console.warn('🔁 Reiniciando scanner tras NotReadableError...');
      setTimeout(() => {
        try {
          this.scanner?.reset();
          console.log('🔄 Scanner reiniciado tras error');
        } catch (e: any) {
          console.warn('⚠️ No se pudo reiniciar el scanner aún:', e?.message);
        }
      }, 800);
    }
  }
}

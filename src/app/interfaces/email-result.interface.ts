export interface EmailResult {
  recipient: string;
  status: 'success' | 'failed';
  message: string;
}

export interface NotificationResponse {
  message: string;
  details: EmailResult[];
}

// NUEVA INTERFAZ: MembresiaVencimientoData
export interface MembresiaVencimientoData {
  IDMembresia: number;
  CICliente: string;
  FechaFin: string; // La fecha se recibe como string desde el backend
  TipoMembresiaID: number;
  PlataformaWeb: string;
  tipoNombre: string;
  diasRestantes: number;
}

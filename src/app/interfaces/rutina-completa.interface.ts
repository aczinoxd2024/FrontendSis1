import { DetalleRutina } from './detalle-rutina.interface';

export interface RutinaCompleta {
  nombre: string;
  objetivo: string;
  nivel: string;
  generoObjetivo: string;
  descripcion: string;
  tipo: string;
  tipoAcceso: string;
  ciInstructor: string;
  IDClase: number | null;
  detalles: DetalleRutina[];
}

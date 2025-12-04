import { ObjectId } from 'mongodb';

export interface ReportToolOrPart {
  nombre: string;
  unidad: string;
  cantidad?: number;
  observaciones?: string;
  fotoUrls?: string[];
}

export interface WorkReport {
  _id?: ObjectId;
  folio: string;
  subsistema: string;
  ubicacion: string;
  fecha: string; // ISO date YYYY-MM-DD
  fechaHoraInicio: string; // ISO datetime
  fechaHoraTermino: string; // ISO datetime
  turno: string;
  tipoMantenimiento: string;
  frecuencia: string;
  templateId?: string;
  
  responsable: string; // nombreResponsable in frontend
  trabajadores: string[]; // equipoTrabajo in user request, trabajadores in frontend
  
  inspeccionRealizada: boolean;
  observacionesActividad?: string;
  evidencias?: any[]; // URLs or file objects
  
  // Frontend sends string[], but we might want to normalize to objects later.
  // For now, we'll keep it flexible or map it.
  herramientas: string[] | ReportToolOrPart[]; 
  refacciones: string[] | ReportToolOrPart[];
  
  observacionesGenerales?: string;
  firmaResponsable?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface WarehouseItem {
  id: string;
  name: string;
  units: number;
  observations: string;
  evidences: {
      id: string;
      previewUrl: string;
  }[];
}

export interface WarehouseReport {
  _id?: ObjectId;
  folio: string;
  subsistema: string;
  
  fechaHoraEntrega: string;
  fechaHoraRecepcion: string;
  turno: string;
  tipoMantenimiento: string;
  frecuencia: string;
  templateId?: string;

  nombreQuienRecibe: string;
  nombreAlmacenista: string;
  nombreQuienEntrega: string;
  nombreAlmacenistaCierre: string;

  herramientas: WarehouseItem[];
  refacciones: WarehouseItem[];

  observacionesGenerales?: string;
  
  firmaQuienRecibe?: string;
  firmaAlmacenista?: string;
  firmaQuienEntrega?: string;

  createdAt: Date;
  updatedAt: Date;
}

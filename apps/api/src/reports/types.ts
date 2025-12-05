import { ObjectId } from 'mongodb';

export interface ReportToolOrPart {
  nombre: string;
  unidad: string;
  cantidad?: number;
  observaciones?: string;
  fotoUrls?: string[];
}

export interface ActivityDetail {
  templateId: string;
  realizado: boolean;
  observaciones?: string;
  evidencias?: any[]; // URLs or file objects
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
  
  templateIds?: string[]; // Kept for reference/querying
  actividadesRealizadas?: ActivityDetail[];
  
  responsable: string; // nombreResponsable in frontend
  trabajadores: string[]; // equipoTrabajo in user request, trabajadores in frontend
  
  // Global fields (optional/legacy)
  inspeccionRealizada?: boolean;
  observacionesActividad?: string;
  evidencias?: any[]; 
  
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

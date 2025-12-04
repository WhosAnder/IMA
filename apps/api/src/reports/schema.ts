import { z } from 'zod';

// Helper schemas
const WarehouseItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  units: z.number(),
  observations: z.string().optional(),
  evidences: z.array(z.object({
    id: z.string(),
    previewUrl: z.string()
  })).optional()
});

// Work Report Schema
export const WorkReportSchema = z.object({
  subsistema: z.string().min(1),
  ubicacion: z.string().min(1),
  fechaHoraInicio: z.string().min(1),
  fechaHoraTermino: z.string().optional(), // Can be set by backend if missing
  turno: z.string(),
  frecuencia: z.string().min(1),
  tipoMantenimiento: z.string().min(1),
  templateId: z.string().optional(),
  
  trabajadores: z.array(z.string()).min(1),
  
  inspeccionRealizada: z.boolean(),
  observacionesActividad: z.string().optional(),
  evidencias: z.array(z.any()).optional(),
  
  herramientas: z.array(z.string()).optional(), // Accepting strings as per frontend
  refacciones: z.array(z.string()).optional(),
  
  observacionesGenerales: z.string().optional(),
  nombreResponsable: z.string().min(1),
  firmaResponsable: z.string().optional().nullable(),
});

// Warehouse Report Schema
export const WarehouseReportSchema = z.object({
  subsistema: z.string().min(1),
  fechaHoraEntrega: z.string().min(1),
  fechaHoraRecepcion: z.string().optional(), // Can be set by backend
  turno: z.string(),
  tipoMantenimiento: z.string().min(1),
  frecuencia: z.string().optional(),
  templateId: z.string().optional(),
  
  nombreQuienRecibe: z.string().min(1),
  nombreAlmacenista: z.string().min(1),
  nombreQuienEntrega: z.string().optional(),
  nombreAlmacenistaCierre: z.string().optional(),
  
  herramientas: z.array(WarehouseItemSchema).optional(),
  refacciones: z.array(WarehouseItemSchema).optional(),
  
  observacionesGenerales: z.string().optional(),
  
  firmaQuienRecibe: z.string().optional(),
  firmaAlmacenista: z.string().optional(),
  firmaQuienEntrega: z.string().optional(),
});

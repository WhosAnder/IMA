import { z } from 'zod';

const warehouseItemSchema = z.object({
    id: z.string(),
    sku: z.string().optional(),
    name: z.string().min(1, "El nombre es obligatorio"),
    units: z.number().min(1, "Debe ser al menos 1 unidad"),
    observations: z.string().default(''),
    evidences: z.array(z.object({
        id: z.string(),
        previewUrl: z.string(),
    })).default([]),
});

export const warehouseReportSchema = z.object({
    subsistema: z.string().min(1, "El subsistema es obligatorio"),
    fechaHoraEntrega: z.string().min(1, "La fecha de entrega es obligatoria"),
    turno: z.string(),
    tipoMantenimiento: z.string().min(1, "El tipo de mantenimiento es obligatorio"),
    frecuencia: z.string().min(1, "La frecuencia es obligatoria"),

    nombreQuienRecibe: z.string().min(1, "El nombre de quien recibe es obligatorio"),
    nombreAlmacenista: z.string().min(1, "El nombre del almacenista es obligatorio"),

    herramientas: z.array(warehouseItemSchema).default([]),
    refacciones: z.array(warehouseItemSchema).default([]),

    observacionesGenerales: z.string().optional().default(''),

    fechaHoraRecepcion: z.string().min(1, "La fecha de recepción es obligatoria"),
    nombreQuienEntrega: z.string().min(1, "El nombre de quien entrega es obligatorio"),
    nombreAlmacenistaCierre: z.string().min(1, "El nombre del almacenista (cierre) es obligatorio"),

    firmaQuienRecibe: z.string().nullable().optional(),
    firmaAlmacenista: z.string().nullable().optional(),
    firmaQuienEntrega: z.string().nullable().optional(),
});

export type WarehouseReportFormValues = z.infer<typeof warehouseReportSchema>;

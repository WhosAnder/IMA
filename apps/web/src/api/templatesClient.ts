import { API_URL } from "@/config/env";

export interface TemplateSectionConfig {
  enabled: boolean;
  label?: string;
  required?: boolean;
}

export interface Template {
  _id: string;
  codigoMantenimiento?: string | null;
  
  tipoReporte: 'work' | 'warehouse';
  subsistema: string;
  tipoMantenimiento: string;
  frecuencia: string;

  nombreCorto: string;
  descripcion?: string;

  secciones: Record<string, TemplateSectionConfig>;
  activo: boolean;
}

export interface TemplateFilters {
  tipo?: 'work' | 'warehouse';
  tipoReporte?: 'work' | 'warehouse';
  subsistema?: string;
  tipoMantenimiento?: string;
  frecuencia?: string;
  codigo?: string;
  activo?: boolean | 'all';
}

export async function getTemplates(filters: TemplateFilters = {}): Promise<Template[]> {
  const params = new URLSearchParams();
  if (filters.tipo) params.append('tipo', filters.tipo);
  if (filters.tipoReporte) params.append('tipoReporte', filters.tipoReporte);
  if (filters.subsistema) params.append('subsistema', filters.subsistema);
  if (filters.tipoMantenimiento) params.append('tipoMantenimiento', filters.tipoMantenimiento);
  if (filters.frecuencia) params.append('frecuencia', filters.frecuencia);
  if (filters.codigo) params.append('codigo', filters.codigo);
  if (filters.activo !== undefined) params.append('activo', String(filters.activo));

  const response = await fetch(`${API_URL}/templates?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }
  return response.json();
}

export async function fetchTemplatesByParams(params: {
  tipoReporte: "work" | "warehouse";
  subsistema?: string;
  tipoMantenimiento?: string;
  frecuencia?: string;
}) {
  const query = new URLSearchParams();
  query.set("tipoReporte", params.tipoReporte);
  if (params.subsistema) query.set("subsistema", params.subsistema);
  if (params.tipoMantenimiento) query.set("tipoMantenimiento", params.tipoMantenimiento);
  if (params.frecuencia) query.set("frecuencia", params.frecuencia);

  const res = await fetch(`${API_URL}/templates?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch templates");
  return res.json();
}

export async function getTemplateById(id: string): Promise<Template> {
  const response = await fetch(`${API_URL}/templates/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch template');
  }
  return response.json();
}

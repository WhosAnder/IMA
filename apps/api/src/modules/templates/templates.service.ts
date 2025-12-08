import { ObjectId } from 'mongodb';
import { CreateTemplateInput } from './templates.schema';
import { Template } from './templates.types';
import {
  NewTemplate,
  findTemplateById,
  findTemplates,
  insertTemplate,
} from './templates.repository';

export interface TemplateListParams {
  tipo?: string;
  tipoReporte?: string;
  subsistema?: string;
  tipoMantenimiento?: string;
  frecuencia?: string;
  frecuenciaCodigo?: string;
  activo?: string;
}

export async function listTemplates(params: TemplateListParams) {
  const query: Record<string, unknown> = {};

  if (params.tipoReporte) query.tipoReporte = params.tipoReporte;
  else if (params.tipo) query.tipoReporte = params.tipo;

  if (params.subsistema) query.subsistema = params.subsistema;
  if (params.tipoMantenimiento) query.tipoMantenimiento = params.tipoMantenimiento;
  if (params.frecuencia) query.frecuencia = params.frecuencia;
  if (params.frecuenciaCodigo) query.frecuenciaCodigo = params.frecuenciaCodigo;

  if (params.activo === 'false') {
    query.activo = false;
  } else if (params.activo === 'all') {
    // no filter
  } else {
    query.activo = true;
  }

  return findTemplates(query);
}

export async function getTemplateByObjectId(id: ObjectId) {
  return findTemplateById(id);
}

export async function createTemplate(data: CreateTemplateInput) {
  const now = new Date();
  const template: NewTemplate = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  const result = await insertTemplate(template);
  return result.insertedId;
}

export async function getTemplateFilters(tipoReporte?: string, subsistema?: string) {
  const baseQuery: Record<string, unknown> = {};
  if (tipoReporte) baseQuery.tipoReporte = tipoReporte;

  const templates = await findTemplates(baseQuery);

  const subsistemas = Array.from(new Set(templates.map((t) => t.subsistema))).sort();

  let filteredTemplates: Template[] = templates;
  if (subsistema) {
    filteredTemplates = templates.filter((t) => t.subsistema === subsistema);
  }

  const frecuenciasMap = new Map<string, string>();
  filteredTemplates.forEach((t) => {
    if (t.frecuenciaCodigo && t.frecuencia) {
      frecuenciasMap.set(t.frecuenciaCodigo, t.frecuencia);
    }
  });

  const order = ['1D', '1M', '3M', '6M', '1Y', '>1Y'];
  const frecuencias = Array.from(frecuenciasMap.entries())
    .map(([code, label]) => ({ code, label }))
    .sort((a, b) => {
      const indexA = order.indexOf(a.code);
      const indexB = order.indexOf(b.code);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });

  return { subsistemas, frecuencias };
}

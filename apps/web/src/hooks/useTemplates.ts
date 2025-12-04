import { useQuery } from "@tanstack/react-query";
import { getTemplates, getTemplateById, fetchTemplatesByParams, TemplateFilters } from "../api/templatesClient";

export function useTemplates(filters: TemplateFilters = {}) {
  return useQuery({
    queryKey: ['templates', filters],
    queryFn: () => getTemplates(filters)
  });
}

export function useTemplate(id: string | undefined) {
  return useQuery({
    queryKey: ['template', id],
    queryFn: () => getTemplateById(id!),
    enabled: !!id
  });
}

export function useTemplateForReport(params: {
  tipoReporte: "work" | "warehouse";
  subsistema?: string;
  tipoMantenimiento?: string;
  frecuencia?: string;
}) {
  return useQuery({
    queryKey: ["templateForReport", params],
    queryFn: () => fetchTemplatesByParams(params).then((list: any[]) => list[0] ?? null),
    enabled: !!params.tipoReporte && !!params.subsistema, // Enable even if others are missing, but usually we want all
  });
}

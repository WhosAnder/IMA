export interface WarehouseReportListItem {
  id: string;
  folio: string;
  subsistema: string;
  fechaEntrega: string;
  responsableAlmacen: string;
  responsableRecepcion: string;
}

export interface WarehouseItem {
  id: string;
  name: string;
  units: number;
  observations: string;
  evidences: any[];
}

export interface WarehouseReportDetail {
  subsistema: string;
  fechaHoraEntrega: string;
  turno: string;
  nombreQuienRecibe: string;
  nombreAlmacenista: string;
  herramientas: WarehouseItem[];
  refacciones: WarehouseItem[];
  observacionesGenerales: string;
  fechaHoraRecepcion: string;
  nombreQuienEntrega: string;
  nombreAlmacenistaCierre: string;
  firmaQuienRecibe?: string;
  firmaAlmacenista?: string;
  firmaQuienEntrega?: string;
}

import { WarehouseReportListItem, WarehouseReportDetail } from '../types/warehouseReport';

export const warehouseReports: WarehouseReportListItem[] = [
  {
    id: "wh-1",
    folio: "FA-0001",
    subsistema: "Almacén general",
    fechaEntrega: "24/11/2025 07:10 a. m.",
    responsableAlmacen: "Carlos Almacenista",
    responsableRecepcion: "Ana Ingeniera",
  },
  {
    id: "wh-2",
    folio: "FA-0002",
    subsistema: "Refacciones Vía",
    fechaEntrega: "24/11/2025 10:30 a. m.",
    responsableAlmacen: "Luis Almacenista",
    responsableRecepcion: "Juan Supervisor",
  },
  {
    id: "wh-3",
    folio: "FA-0003",
    subsistema: "Herramientas Especiales",
    fechaEntrega: "23/11/2025 04:45 p. m.",
    responsableAlmacen: "Carlos Almacenista",
    responsableRecepcion: "Pedro Tecnico",
  },
];

export const warehouseReportDetails: Record<string, WarehouseReportDetail> = {
  "wh-1": {
    subsistema: "Almacén general",
    fechaHoraEntrega: "2025-11-24T07:10",
    turno: "Matutino",
    nombreQuienRecibe: "Ana Ingeniera",
    nombreAlmacenista: "Carlos Almacenista",
    herramientas: [
      { id: "h1", name: "Taladro percutor", units: 1, observations: "Buen estado", evidences: [] },
      { id: "h2", name: "Juego de brocas", units: 1, observations: "Completo", evidences: [] }
    ],
    refacciones: [
      { id: "r1", name: "Tornillos M8", units: 50, observations: "Caja sellada", evidences: [] }
    ],
    observacionesGenerales: "Entrega para mantenimiento correctivo.",
    fechaHoraRecepcion: "2025-11-24T07:20",
    nombreQuienEntrega: "Carlos Almacenista",
    nombreAlmacenistaCierre: "Carlos Almacenista",
    firmaQuienRecibe: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    firmaAlmacenista: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    firmaQuienEntrega: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  },
  "wh-2": {
    subsistema: "Refacciones Vía",
    fechaHoraEntrega: "2025-11-24T10:30",
    turno: "Matutino",
    nombreQuienRecibe: "Juan Supervisor",
    nombreAlmacenista: "Luis Almacenista",
    herramientas: [],
    refacciones: [
      { id: "r2", name: "Riel tipo A", units: 2, observations: "Para cambio de tramo", evidences: [] }
    ],
    observacionesGenerales: "Material pesado, se usó montacargas.",
    fechaHoraRecepcion: "2025-11-24T11:00",
    nombreQuienEntrega: "Luis Almacenista",
    nombreAlmacenistaCierre: "Luis Almacenista",
    firmaQuienRecibe: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    firmaAlmacenista: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    firmaQuienEntrega: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  },
  "wh-3": {
    subsistema: "Herramientas Especiales",
    fechaHoraEntrega: "2025-11-23T16:45",
    turno: "Vespertino",
    nombreQuienRecibe: "Pedro Tecnico",
    nombreAlmacenista: "Carlos Almacenista",
    herramientas: [
      { id: "h3", name: "Osciloscopio", units: 1, observations: "Calibrado", evidences: [] }
    ],
    refacciones: [],
    observacionesGenerales: "Devolución programada para mañana.",
    fechaHoraRecepcion: "2025-11-23T17:00",
    nombreQuienEntrega: "Carlos Almacenista",
    nombreAlmacenistaCierre: "Carlos Almacenista",
    firmaQuienRecibe: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    firmaAlmacenista: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    firmaQuienEntrega: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  },
};
export const getWarehouseReportById = (id: string): (WarehouseReportListItem & WarehouseReportDetail) | undefined => {
  const summary = warehouseReports.find((r) => r.id === id);
  const detail = warehouseReportDetails[id];

  if (!summary || !detail) return undefined;

  return { ...summary, ...detail };
};

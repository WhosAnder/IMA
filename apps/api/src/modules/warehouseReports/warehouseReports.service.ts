import {
  NewWarehouseReport,
  WarehouseReportFilters,
  findWarehouseReportById,
  findWarehouseReports,
  insertWarehouseReport,
} from './warehouseReports.repository';

export async function listWarehouseReports(
  filters: WarehouseReportFilters = {}
) {
  return findWarehouseReports(filters);
}

export async function getWarehouseReportById(id: string) {
  return findWarehouseReportById(id);
}

export async function createWarehouseReport(data: NewWarehouseReport) {
  return insertWarehouseReport(data);
}

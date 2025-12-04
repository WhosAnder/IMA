import { WorkReport } from "../types/workReport";
import { WorkReportListItem } from "../types/workReportList";
import { WarehouseReport } from "../types/warehouseReport";
import { WarehouseReportListItem } from "../types/warehouseReportList";
import { API_URL } from "../config/env";

// Work reports
export async function fetchWorkReports(): Promise<WorkReportListItem[]> {
  const res = await fetch(`${API_URL}/api/reports`);
  if (!res.ok) throw new Error("Error fetching work reports");
  return res.json();
}

export async function fetchWorkReportById(id: string): Promise<WorkReport> {
  const res = await fetch(`${API_URL}/api/reports/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("NOT_FOUND");
    throw new Error("Error fetching work report");
  }
  return res.json();
}

// Warehouse reports
export async function fetchWarehouseReports(): Promise<WarehouseReportListItem[]> {
  const res = await fetch(`${API_URL}/api/warehouse-reports`);
  if (!res.ok) throw new Error("Error fetching warehouse reports");
  return res.json();
}

export async function fetchWarehouseReportById(id: string): Promise<WarehouseReport> {
  const res = await fetch(`${API_URL}/api/warehouse-reports/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("NOT_FOUND");
    throw new Error("Error fetching warehouse report");
  }
  return res.json();
}

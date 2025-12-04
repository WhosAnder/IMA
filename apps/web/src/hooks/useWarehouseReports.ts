import { useQuery } from "@tanstack/react-query";
import { fetchWarehouseReports, fetchWarehouseReportById } from "../api/reportsClient";

export function useWarehouseReportsQuery() {
  return useQuery({
    queryKey: ["warehouseReports"],
    queryFn: fetchWarehouseReports,
  });
}

export function useWarehouseReportQuery(id: string) {
  return useQuery({
    queryKey: ["warehouseReports", id],
    queryFn: () => fetchWarehouseReportById(id),
    enabled: Boolean(id),
  });
}

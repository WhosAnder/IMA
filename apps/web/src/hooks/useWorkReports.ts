import { useQuery } from "@tanstack/react-query";
import { fetchWorkReports, fetchWorkReportById } from "../api/reportsClient";

export function useWorkReportsQuery() {
  return useQuery({
    queryKey: ["workReports"],
    queryFn: fetchWorkReports,
  });
}

export function useWorkReportQuery(id: string) {
  return useQuery({
    queryKey: ["workReports", id],
    queryFn: () => fetchWorkReportById(id),
    enabled: Boolean(id),
  });
}

import { Hono } from "hono";
import { warehouseReports, getWarehouseReportById } from "../data/warehouseReports";

export const warehouseReportsRouter = new Hono();

// GET /api/warehouse-reports - List all warehouse reports
warehouseReportsRouter.get("/", (c) => {
  return c.json(warehouseReports);
});

warehouseReportsRouter.get("/:id", (c) => {
  const id = c.req.param("id");
  const report = getWarehouseReportById(id);

  if (!report) {
    return c.json({ error: "Report not found" }, 404);
  }

  return c.json(report);
});

import { Hono } from 'hono';
import { warehouseReports, warehouseReportDetails } from '../data/warehouseReports';

export const warehouseReportsRoute = new Hono();

// GET /api/warehouse-reports - List all warehouse reports
warehouseReportsRoute.get('/', (c) => {
  return c.json(warehouseReports);
});

// GET /api/warehouse-reports/:id - Get specific warehouse report details
warehouseReportsRoute.get('/:id', (c) => {
  const { id } = c.req.param();
  const report = warehouseReportDetails[id];
  
  if (!report) {
    return c.json({ error: 'Report not found' }, 404);
  }
  
  return c.json(report);
});

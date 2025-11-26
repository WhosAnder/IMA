import { Hono } from 'hono';
import { workReports, workReportDetails } from '../data/workReports';

export const reportsRoute = new Hono();

// GET /api/reports - List all work reports
reportsRoute.get('/', (c) => {
  return c.json(workReports);
});

// GET /api/reports/:id - Get specific work report details
reportsRoute.get('/:id', (c) => {
  const { id } = c.req.param();
  const report = workReportDetails[id];
  
  if (!report) {
    return c.json({ error: 'Report not found' }, 404);
  }
  
  return c.json(report);
});

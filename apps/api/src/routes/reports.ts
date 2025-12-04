import { Hono } from 'hono';
import { workReports, getWorkReportById } from '../data/workReports';

export const reportsRoute = new Hono();

reportsRoute.get('/', (c) => {
  return c.json(workReports);
});

reportsRoute.get('/:id', (c) => {
  const id = c.req.param('id');
  const report = getWorkReportById(id);
  
  if (!report) {
    return c.json({ error: 'Report not found' }, 404);
  }
  
  return c.json(report);
});

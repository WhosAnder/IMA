import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { reportsRoute } from './routes/reports';
import { warehouseReportsRoute } from './routes/warehouseReports';

const app = new Hono();

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API routes namespace
const api = new Hono();

// Ping endpoint for testing
api.get('/ping', (c) => c.json({ message: 'pong' }));

// Mount report routes
api.route('/reports', reportsRoute);
api.route('/warehouse-reports', warehouseReportsRoute);

// Mount API routes under /api prefix
app.route('/api', api);

// Start server
const port = Number(process.env.PORT) || 4000;

console.log(`🚀 API server starting on http://localhost:${port}`);
console.log(`📊 Health check: http://localhost:${port}/health`);
console.log(`📝 Work reports: http://localhost:${port}/api/reports`);
console.log(`📦 Warehouse reports: http://localhost:${port}/api/warehouse-reports`);

serve({
  fetch: app.fetch,
  port
});

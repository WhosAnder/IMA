import { Hono } from 'hono';
import {
  createWarehouseReportController,
  getWarehouseReportByIdController,
  listWarehouseReportsController,
} from './warehouseReports.controller';

export const warehouseReportsRoute = new Hono();

warehouseReportsRoute.get('/', listWarehouseReportsController);
warehouseReportsRoute.get('/:id', getWarehouseReportByIdController);
warehouseReportsRoute.post('/', createWarehouseReportController);

import { Hono } from 'hono';
import { createWarehouseReport, getWarehouseReportById, getWarehouseReports } from '../reports/warehouseReportRepository';
import { WarehouseReportSchema } from '../reports/schema';

export const warehouseReportsRouter = new Hono();

warehouseReportsRouter.get('/', async (c) => {
  const subsistema = c.req.query('subsistema');
  const frecuencia = c.req.query('frecuencia');
  const tipoMantenimiento = c.req.query('tipoMantenimiento');
  
  const filters: any = {};
  if (subsistema) filters.subsistema = subsistema;
  if (frecuencia) filters.frecuencia = frecuencia;
  if (tipoMantenimiento) filters.tipoMantenimiento = tipoMantenimiento;

  const reports = await getWarehouseReports(filters);
  return c.json(reports);
});

warehouseReportsRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const report = await getWarehouseReportById(id);
    if (!report) {
      return c.json({ error: 'Report not found' }, 404);
    }
    return c.json(report);
  } catch (error) {
    return c.json({ error: 'Invalid ID format' }, 400);
  }
});

warehouseReportsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = WarehouseReportSchema.parse(body);
    
    const dataToCreate = {
      ...validatedData,
      fechaHoraRecepcion: validatedData.fechaHoraRecepcion || new Date().toISOString(),
      herramientas: (validatedData.herramientas || []).map(h => ({
        ...h,
        observations: h.observations || '',
        evidences: h.evidences || []
      })),
      refacciones: (validatedData.refacciones || []).map(r => ({
        ...r,
        observations: r.observations || '',
        evidences: r.evidences || []
      })),
      frecuencia: validatedData.frecuencia || 'Eventual',
      // Ensure other optional fields are handled if needed
      nombreQuienEntrega: validatedData.nombreQuienEntrega || '',
      nombreAlmacenistaCierre: validatedData.nombreAlmacenistaCierre || '',
    };

    const newReport = await createWarehouseReport(dataToCreate);
    return c.json(newReport, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({ error: 'Validation Error', details: error.errors }, 400);
    }
    console.error('Error creating warehouse report:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

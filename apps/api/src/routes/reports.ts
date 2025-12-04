import { Hono } from 'hono';
import { createWorkReport, getWorkReportById, getWorkReports } from '../reports/workReportRepository';
import { WorkReportSchema } from '../reports/schema';

export const reportsRoute = new Hono();

reportsRoute.get('/', async (c) => {
  const subsistema = c.req.query('subsistema');
  const frecuencia = c.req.query('frecuencia');
  const tipoMantenimiento = c.req.query('tipoMantenimiento');
  
  const filters: any = {};
  if (subsistema) filters.subsistema = subsistema;
  if (frecuencia) filters.frecuencia = frecuencia;
  if (tipoMantenimiento) filters.tipoMantenimiento = tipoMantenimiento;

  const reports = await getWorkReports(filters);
  return c.json(reports);
});

reportsRoute.get('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const report = await getWorkReportById(id);
    if (!report) {
      return c.json({ error: 'Report not found' }, 404);
    }
    return c.json(report);
  } catch (error) {
    return c.json({ error: 'Invalid ID format' }, 400);
  }
});

reportsRoute.post('/', async (c) => {
  try {
    const body = await c.req.json();
    console.log('Received Work Report Body:', JSON.stringify(body, null, 2));
    
    const validatedData = WorkReportSchema.parse(body);
    
    // Ensure fechaHoraTermino is set if not provided (though schema makes it optional, repository expects it in types?)
    // In types.ts, WorkReport has fechaHoraTermino as string (required).
    // In schema.ts, it is optional.
    // We should set it here if missing.
    
    const dataToCreate = {
      ...validatedData,
      fechaHoraTermino: validatedData.fechaHoraTermino || new Date().toISOString(),
      // Ensure arrays are present if optional in schema but required in type?
      // Type says string[] | ToolObject[]. Schema says optional.
      // We should default to empty arrays.
      herramientas: validatedData.herramientas || [],
      refacciones: validatedData.refacciones || [],
      evidencias: validatedData.evidencias || [],
      // fecha is required in type but not in schema?
      // Schema has fechaHoraInicio. Type has fecha AND fechaHoraInicio.
      // We should derive fecha from fechaHoraInicio.
      fecha: (validatedData.fechaHoraInicio.split('T')[0] || new Date().toISOString().split('T')[0]) as string,
      responsable: validatedData.nombreResponsable,
      firmaResponsable: validatedData.firmaResponsable || undefined,
    };

    const newReport = await createWorkReport(dataToCreate);
    return c.json(newReport, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      console.error('Validation Error:', JSON.stringify(error.errors, null, 2));
      return c.json({ error: 'Validation Error', details: error.errors }, 400);
    }
    console.error('Error creating report:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

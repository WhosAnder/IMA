import { Hono } from 'hono';
import { ObjectId } from 'mongodb';
import { getTemplateCollection } from '../db/mongo';
import { TemplateSchema } from '../templates/schema';
import { ReportType } from '../templates/types';

export const templatesRoute = new Hono();

// GET /api/templates
templatesRoute.get('/', async (c) => {
  try {
    const collection = await getTemplateCollection();
    
    const tipo = c.req.query('tipo') as ReportType | undefined; // Keep 'tipo' for backward compat or use 'tipoReporte'
    const tipoReporte = c.req.query('tipoReporte') as ReportType | undefined;
    const subsistema = c.req.query('subsistema');
    const tipoMantenimiento = c.req.query('tipoMantenimiento');
    const frecuencia = c.req.query('frecuencia');
    const activoParam = c.req.query('activo');

    const query: any = {};

    if (tipoReporte) query.tipoReporte = tipoReporte;
    else if (tipo) query.tipoReporte = tipo; // Fallback

    if (subsistema) query.subsistema = subsistema;
    if (tipoMantenimiento) query.tipoMantenimiento = tipoMantenimiento;
    if (frecuencia) query.frecuencia = frecuencia;
    
    // Default to active=true unless explicitly requested otherwise
    if (activoParam === 'false') {
      query.activo = false;
    } else if (activoParam === 'all') {
      // No filter on activo
    } else {
      query.activo = true;
    }

    const templates = await collection.find(query).toArray();
    return c.json(templates);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// GET /api/templates/:id
templatesRoute.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    if (!ObjectId.isValid(id)) {
      return c.json({ error: 'Invalid ID format' }, 400);
    }

    const collection = await getTemplateCollection();
    const template = await collection.findOne({ _id: new ObjectId(id) });

    if (!template) {
      return c.json({ error: 'Template not found' }, 404);
    }

    return c.json(template);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// POST /api/templates
templatesRoute.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const result = TemplateSchema.safeParse(body);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    const collection = await getTemplateCollection();
    const newTemplate = {
      ...result.data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const insertResult = await collection.insertOne(newTemplate);
    
    return c.json({ id: insertResult.insertedId }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

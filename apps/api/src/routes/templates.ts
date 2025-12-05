import { Hono } from 'hono';
import { ObjectId } from 'mongodb';
import { getTemplateCollection } from '../db/mongo';
import { TemplateSchema } from '../templates/schema';
import { ReportType } from '../templates/types';

export const templatesRoute = new Hono();

// GET /api/templates/filters
templatesRoute.get('/filters', async (c) => {
  try {
    const collection = await getTemplateCollection();
    
    const tipoReporte = c.req.query('tipoReporte') as ReportType | undefined;
    const subsistema = c.req.query('subsistema');

    const query: any = {};
    if (tipoReporte) query.tipoReporte = tipoReporte;
    
    // Get all templates matching the base query (tipoReporte)
    const templates = await collection.find(query).toArray();

    // Extract unique subsystems
    const subsistemas = Array.from(new Set(templates.map(t => t.subsistema))).sort();

    // Extract frequencies, optionally filtered by subsistema
    let filteredTemplates = templates;
    if (subsistema) {
      filteredTemplates = templates.filter(t => t.subsistema === subsistema);
    }

    const frecuenciasMap = new Map<string, string>();
    filteredTemplates.forEach(t => {
      if (t.frecuenciaCodigo && t.frecuencia) {
        frecuenciasMap.set(t.frecuenciaCodigo, t.frecuencia);
      }
    });

    // Sort frequencies by code logic (1D, 1M, 3M, 6M, 1Y, >1Y)
    const order = ["1D", "1M", "3M", "6M", "1Y", ">1Y"];
    const frecuencias = Array.from(frecuenciasMap.entries())
      .map(([code, label]) => ({ code, label }))
      .sort((a, b) => {
        const indexA = order.indexOf(a.code);
        const indexB = order.indexOf(b.code);
        // If not in order list, put at end
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });

    return c.json({
      subsistemas,
      frecuencias
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

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
    if (c.req.query('frecuenciaCodigo')) query.frecuenciaCodigo = c.req.query('frecuenciaCodigo');
    
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

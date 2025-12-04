import { ObjectId } from 'mongodb';
import { getWorkReportCollection } from '../db/mongo';
import { WorkReport } from './types';

export async function getWorkReports(filters: Partial<WorkReport> = {}): Promise<WorkReport[]> {
  const collection = await getWorkReportCollection();
  // Simple equality filters for now
  const query: any = {};
  if (filters.subsistema) query.subsistema = filters.subsistema;
  if (filters.frecuencia) query.frecuencia = filters.frecuencia;
  if (filters.tipoMantenimiento) query.tipoMantenimiento = filters.tipoMantenimiento;

  return collection.find(query).sort({ createdAt: -1 }).toArray();
}

export async function getWorkReportById(id: string): Promise<WorkReport | null> {
  const collection = await getWorkReportCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

async function generateFolio(): Promise<string> {
  const collection = await getWorkReportCollection();
  const lastReport = await collection.findOne({}, { sort: { createdAt: -1 } });
  
  let nextNum = 1;
  if (lastReport && lastReport.folio && lastReport.folio.startsWith('FT-')) {
    const parts = lastReport.folio.split('-');
    if (parts.length === 2 && parts[1]) {
      const num = parseInt(parts[1], 10);
      if (!isNaN(num)) {
        nextNum = num + 1;
      }
    }
  }
  
  return `FT-${nextNum.toString().padStart(4, '0')}`;
}

export async function createWorkReport(data: Omit<WorkReport, '_id' | 'folio' | 'createdAt' | 'updatedAt'>): Promise<WorkReport> {
  const collection = await getWorkReportCollection();
  
  const folio = await generateFolio();
  const now = new Date();
  
  const newReport: WorkReport = {
    ...data,
    folio,
    createdAt: now,
    updatedAt: now
  };
  
  const result = await collection.insertOne(newReport);
  return { ...newReport, _id: result.insertedId };
}

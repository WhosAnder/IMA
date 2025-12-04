import { ObjectId } from 'mongodb';
import { getWarehouseReportCollection } from '../db/mongo';
import { WarehouseReport } from './types';

export async function getWarehouseReports(filters: Partial<WarehouseReport> = {}): Promise<WarehouseReport[]> {
  const collection = await getWarehouseReportCollection();
  const query: any = {};
  if (filters.subsistema) query.subsistema = filters.subsistema;
  if (filters.frecuencia) query.frecuencia = filters.frecuencia;
  if (filters.tipoMantenimiento) query.tipoMantenimiento = filters.tipoMantenimiento;

  return collection.find(query).sort({ createdAt: -1 }).toArray();
}

export async function getWarehouseReportById(id: string): Promise<WarehouseReport | null> {
  const collection = await getWarehouseReportCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

async function generateFolio(): Promise<string> {
  const collection = await getWarehouseReportCollection();
  const lastReport = await collection.findOne({}, { sort: { createdAt: -1 } });
  
  let nextNum = 1;
  if (lastReport && lastReport.folio && lastReport.folio.startsWith('FA-')) {
    const parts = lastReport.folio.split('-');
    if (parts.length === 2 && parts[1]) {
      const num = parseInt(parts[1], 10);
      if (!isNaN(num)) {
        nextNum = num + 1;
      }
    }
  }
  
  return `FA-${nextNum.toString().padStart(4, '0')}`;
}

export async function createWarehouseReport(data: Omit<WarehouseReport, '_id' | 'folio' | 'createdAt' | 'updatedAt'>): Promise<WarehouseReport> {
  const collection = await getWarehouseReportCollection();
  
  const folio = await generateFolio();
  const now = new Date();
  
  const newReport: WarehouseReport = {
    ...data,
    folio,
    createdAt: now,
    updatedAt: now
  };
  
  const result = await collection.insertOne(newReport);
  return { ...newReport, _id: result.insertedId };
}

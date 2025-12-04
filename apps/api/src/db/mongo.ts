import { MongoClient, Collection } from 'mongodb';
import dotenv from 'dotenv';
import { Template } from '../templates/types';

dotenv.config();

const url = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB_NAME || 'ima_templates';

let client: MongoClient;

export async function getClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(url);
    await client.connect();
    console.log('Connected successfully to MongoDB');
  }
  return client;
}

export async function getTemplateCollection(): Promise<Collection<Template>> {
  const client = await getClient();
  const db = client.db(dbName);
  return db.collection<Template>('templates');
}

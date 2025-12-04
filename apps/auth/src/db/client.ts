import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
});

// Pool connects automatically when a query is made
pool.on('error', (err) => {
  console.error('[auth] Unexpected error on idle client', err);
  process.exit(-1);
});

export const db = drizzle(pool, { schema });
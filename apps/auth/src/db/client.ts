import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida");
}

const client = new Client({
  connectionString,
});

// SIN await, solo lanzamos la promesa
client
  .connect()
  .then(() => {
    console.log("[auth] DB conectada");
  })
  .catch((err) => {
    console.error("[auth] Error al conectar a la DB:", err);
    process.exit(1);
  });

export const db = drizzle(client, { schema });
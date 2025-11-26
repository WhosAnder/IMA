import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { auth } from "./routes/auth";
import "dotenv/config";

const app = new Hono();

app.get("/health", (c) => c.json({ ok: true, service: "auth" }));

app.route("/auth", auth);

const port = Number(process.env.PORT) || 5000;

console.log(`🔐 Auth service running on http://localhost:${port}`);
console.log(`📊 Health check: http://localhost:${port}/health`);
console.log(`🔑 Register: POST http://localhost:${port}/auth/register`);
console.log(`🔓 Login: POST http://localhost:${port}/auth/login`);

serve({
  fetch: app.fetch,
  port
});

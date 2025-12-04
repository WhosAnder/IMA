import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./routes/auth";

const app = new Hono();

// Enable CORS for the web app
app.use('/*', cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}));

app.get("/health", (c) => c.json({ ok: true, service: "auth" }));

app.route("/auth", auth);

const port = Number(process.env.PORT) || 5001;

console.log(`🔐 Auth service running on http://localhost:${port}`);
console.log(`📊 Health check: http://localhost:${port}/health`);
console.log(`🔑 Register: POST http://localhost:${port}/auth/register`);
console.log(`🔓 Login: POST http://localhost:${port}/auth/login`);

serve({
  fetch: app.fetch,
  port
});

import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { router } from "./router";
import { logger } from "hono/logger";

const app = new Hono();

const port: number = Number(process.env.PORT || 5001);

// Routes
app.route("/", router);

// Middleware
app.use(logger());

serve({
  fetch: app.fetch,
  port
}).on('listening', () => {
  console.log(`[Auth] service running on http://127.0.0.1:${port}`);
});

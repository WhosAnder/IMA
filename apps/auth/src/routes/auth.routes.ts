import { Hono } from "hono";
import { auth } from "../lib/auth";

export const authRoute = new Hono();

// Handle all HTTP methods for Better Auth routes
authRoute.all("/*", async (c) => {
  const response = await auth.handler(c.req.raw);
  return response;
});
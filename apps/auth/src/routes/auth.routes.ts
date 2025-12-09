import { Hono } from "hono";
import { auth } from "../lib/auth";

export const authRoute = new Hono();

// Register and Login are now handled natively by BetterAuth's client API
// which calls /auth/* routes handled below


// Handle all remaining Better Auth routes (session, sign-out, admin, etc.)
authRoute.all("/*", async (c) => {
  const response = await auth.handler(c.req.raw);
  return response;
});

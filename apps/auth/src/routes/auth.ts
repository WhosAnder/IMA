import { Hono } from "hono";
import { AuthService } from "../services/auth.service";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

export const auth = new Hono();

auth.post("/register", async (c) => {
  try {
    const body = await c.req.json();
    const data = registerSchema.parse(body);

    const result = await AuthService.register(data);
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

auth.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const data = loginSchema.parse(body);

    const result = await AuthService.login(data);
    return c.json(result);
  } catch (error: any) {
    const status = error.message === "User not found" ? 404 : 401;
    return c.json({ error: error.message }, status);
  }
});

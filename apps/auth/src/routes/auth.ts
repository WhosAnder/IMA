import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db/client";
import { users } from "../db/schema";
import { generateId } from "better-auth";
import { hashPassword, verifyPassword } from "better-auth/crypto";

export const auth = new Hono();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string()
});

auth.post("/register", async (c) => {
  try {
    const body = await c.req.json();
    const data = registerSchema.parse(body);

    const passwordHash = await hashPassword(data.password);

    await db.insert(users).values({
      id: generateId(),
      email: data.email,
      passwordHash,
      role: data.role
    });

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

auth.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const data = loginSchema.parse(body);

    const found = await db.query.users.findFirst({
      where: (t, { eq }) => eq(t.email, data.email)
    });

    if (!found) return c.json({ error: "User not found" }, 404);

    const ok = await verifyPassword(found.passwordHash, data.password);
    if (!ok) return c.json({ error: "Invalid credentials" }, 401);

    return c.json({
      id: found.id,
      email: found.email,
      role: found.role
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

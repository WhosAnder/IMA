import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "better-auth";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";

export class AuthService {
  static async register(data: RegisterInput) {
    const passwordHash = await hashPassword(data.password);

    await db.insert(users).values({
      id: generateId(),
      name: data.email.split('@')[0],
      email: data.email,
      emailVerified: false,
      passwordHash,
      role: data.role || 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { success: true };
  }

  static async login(data: LoginInput) {
    const result = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    const found = result[0];

    if (!found) {
      throw new Error("User not found");
    }

    if (!found.passwordHash || found.passwordHash.length === 0) {
      throw new Error("Invalid credentials");
    }

    const ok = await verifyPassword(found.passwordHash, data.password);
    if (!ok) {
      throw new Error("Invalid credentials");
    }

    return {
      id: found.id,
      email: found.email,
      role: found.role
    };
  }
}

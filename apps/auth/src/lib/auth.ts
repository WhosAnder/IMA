import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/client";
import { authSchema } from "../db/schema";
import { admin } from "better-auth/plugins";

const authConfig: BetterAuthOptions = {
    // @ts-expect-error - Admin plugin has a type incompatibility with nullable image field
    // This is a known type system issue where the plugin returns image?: string | null | undefined
    // but Better Auth expects image?: string | undefined. Runtime behavior is correct.
    plugins: [admin()],
    database: drizzleAdapter(db, {
        schema: authSchema,
        provider: "pg",
        usePlural: true,
    }),
    emailAndPassword: {
        enabled: true,
    },
    basePath: '/auth',
};

export const auth: ReturnType<typeof betterAuth> = betterAuth(authConfig);

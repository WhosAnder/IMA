import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/client";
import { users, sessions, accounts, verifications } from "../db/schema";
import { admin } from "better-auth/plugins";

const authConfig: BetterAuthOptions = {
    plugins: [admin()],
    database: drizzleAdapter(db, {
        schema: {
            user: users,
            session: sessions,
            account: accounts,
            verification: verifications,
        },
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
    },
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5001',
    basePath: '/auth',
    trustedOrigins: ['http://localhost:3000', 'http://localhost:5001'],
};

export const auth: ReturnType<typeof betterAuth> = betterAuth(authConfig);

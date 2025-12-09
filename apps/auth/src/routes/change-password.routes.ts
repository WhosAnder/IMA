import { Hono } from "hono";

// Manual password change route removed.
// BetterAuth's admin plugin or client API should be used for password changes.
export const changePasswordRoute = new Hono();

import { Hono } from "hono";
import { SessionUser } from "../lib/session";

// This file previously contained manual user management routes.
// These are now handled or deprecated in favor of BetterAuth's admin plugin or other mechanisms.
export const adminUsersRoute = new Hono<{ Variables: { adminUser: SessionUser } }>();

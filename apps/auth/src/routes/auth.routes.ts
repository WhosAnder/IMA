import { Hono } from "hono";
import { auth } from "../lib/auth";

export const authRoute = new Hono();

authRoute.post("/*", (c) => auth.handler(c.req.raw));
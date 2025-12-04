import { Hono } from "hono";
import { authRoute } from "./routes/auth.routes";

export const router = new Hono();

router.get("/health", (c) => c.json({ ok: true, service: "auth" }));
router.route("/auth", authRoute);
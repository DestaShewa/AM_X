import { Router } from "express";

export interface DatabaseHealthCheck {
  query(text: string): Promise<unknown>;
}

export function createHealthRouter(pool: DatabaseHealthCheck): Router {
  const router = Router();

  router.get("/health", async (_request, response) => {
    try {
      await pool.query("SELECT 1");
      return response.status(200).json({
        status: "ok",
        checks: { database: "ok" },
      });
    } catch {
      return response.status(503).json({
        status: "degraded",
        checks: { database: "unavailable" },
      });
    }
  });

  return router;
}

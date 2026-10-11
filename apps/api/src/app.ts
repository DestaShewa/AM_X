import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import type { Store } from "express-session";
import { createAuthRouter } from "./auth/routes.js";
import type { AuthRepository } from "./auth/repository.js";
import { createSessionMiddleware } from "./auth/session.js";
import { createHealthRouter, type DatabaseHealthCheck } from "./routes/health.js";

type RequestLogger = Pick<Console, "info" | "error">;

function createRequestLogger(logger: RequestLogger): RequestHandler {
  return (request, response, next) => {
    const startedAt = performance.now();
    response.once("finish", () => {
      logger.info({
        event: "http.request",
        method: request.method,
        path: request.path,
        status: response.statusCode,
        duration_ms: Math.round(performance.now() - startedAt),
      });
    });
    next();
  };
}

function isMalformedJsonError(error: unknown): error is Error & { type: string } {
  return (
    error instanceof Error &&
    "type" in error &&
    error.type === "entity.parse.failed"
  );
}

export function createApp({
  pool,
  authRepository,
  sessionStore,
  sessionSecret,
  frontendOrigin,
  production,
  logger = console,
}: {
  pool: DatabaseHealthCheck;
  authRepository: AuthRepository;
  sessionStore: Store;
  sessionSecret: string;
  frontendOrigin: string;
  production: boolean;
  logger?: RequestLogger;
}): express.Express {
  const app = express();

  app.disable("x-powered-by");
  if (production) {
    app.set("trust proxy", 1);
  }
  app.use(createRequestLogger(logger));
  app.use((request, response, next) => {
    const origin = request.get("origin");
    if (origin && origin !== frontendOrigin) {
      response.status(403).json({
        error: { code: "ORIGIN_FORBIDDEN", message: "Origin is not allowed" },
      });
      return;
    }
    if (origin) {
      response.setHeader("Access-Control-Allow-Origin", origin);
      response.setHeader("Access-Control-Allow-Credentials", "true");
      response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      response.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, X-CSRF-Token",
      );
      response.setHeader("Vary", "Origin");
    }
    if (request.method === "OPTIONS") {
      response.status(204).end();
      return;
    }
    next();
  });
  app.use(
    createSessionMiddleware({
      secret: sessionSecret,
      store: sessionStore,
      production,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(
    "/api/v1/auth",
    createAuthRouter({ repository: authRepository, logger, production }),
  );
  app.use("/api/v1", createHealthRouter(pool));

  app.use((_request, response) => {
    response.status(404).json({
      error: { code: "NOT_FOUND", message: "Resource not found" },
    });
  });

  const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
    if (response.headersSent) {
      return next(error);
    }

    if (isMalformedJsonError(error)) {
      return response.status(400).json({
        error: {
          code: "INVALID_JSON",
          message: "Request body must be valid JSON",
        },
      });
    }

    logger.error({
      event: "http.unhandled_error",
      method: request.method,
      path: request.path,
      error_name: error instanceof Error ? error.name : "UnknownError",
    });
    return response.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
    });
  };
  app.use(errorHandler);

  return app;
}

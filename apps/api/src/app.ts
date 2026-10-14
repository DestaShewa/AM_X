import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import type { Store } from "express-session";
import { createAuthRouter } from "./auth/routes.js";
import type { AuthRepository } from "./auth/repository.js";
import { createSessionMiddleware } from "./auth/session.js";
import { createManagementRouter } from "./management/routes.js";
import type { ManagementRepository } from "./management/repository.js";
import { createPublicInquiryRouter } from "./inquiries/routes.js";
import type { PublicInquiryRepository } from "./inquiries/repository.js";
import {
  createPublicPackageRouter,
} from "./packages/routes.js";
import type { PublicPackageRepository } from "./packages/repository.js";
import { createFollowUpRouter } from "./follow-ups/routes.js";
import type { FollowUpRepository } from "./follow-ups/repository.js";
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
  packageRepository,
  inquiryRepository,
  managementRepository,
  followUpRepository,
  sessionStore,
  sessionSecret,
  frontendOrigin,
  production,
  logger = console,
}: {
  pool: DatabaseHealthCheck;
  authRepository: AuthRepository;
  packageRepository: PublicPackageRepository;
  inquiryRepository?: PublicInquiryRepository;
  managementRepository?: ManagementRepository;
  followUpRepository?: FollowUpRepository;
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
      response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
      response.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, X-CSRF-Token, Idempotency-Key",
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
  if (managementRepository) {
    app.use(
      "/api/v1/admin",
      createManagementRouter({
        repository: managementRepository,
        authRepository,
        inquiryRepository,
      }),
    );
  }
  if (followUpRepository) {
    app.use(
      "/api/v1/admin/follow-ups",
      createFollowUpRouter({ repository: followUpRepository, authRepository }),
    );
  }
  app.use("/api/v1/packages", createPublicPackageRouter(packageRepository));
  if (inquiryRepository) {
    app.use("/api/v1/inquiries", createPublicInquiryRouter(inquiryRepository));
  }
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

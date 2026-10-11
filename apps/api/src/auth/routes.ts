import argon2 from "argon2";
import { randomBytes, timingSafeEqual } from "node:crypto";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
  type RequestHandler,
} from "express";
import rateLimit from "express-rate-limit";
import type { AuthRepository } from "./repository.js";
import {
  SESSION_MAX_LIFETIME_MS,
  type AuthenticatedUser,
} from "./session.js";

type SecurityLogger = Pick<Console, "info">;

function csrfMatches(sessionToken: string | undefined, providedToken: unknown): boolean {
  if (typeof providedToken !== "string" || !sessionToken) {
    return false;
  }
  const expected = Buffer.from(sessionToken);
  const actual = Buffer.from(providedToken);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function requireCsrf(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (!csrfMatches(request.session.csrfToken, request.get("x-csrf-token"))) {
    response.status(403).json({
      error: { code: "CSRF_INVALID", message: "Request verification failed" },
    });
    return;
  }
  next();
}

function regenerateSession(request: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    request.session.regenerate((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function saveSession(request: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    request.session.save((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function destroySession(request: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    request.session.destroy((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function isLoginBody(value: unknown): value is { email: string; password: string } {
  if (!value || typeof value !== "object") {
    return false;
  }
  const body = value as Record<string, unknown>;
  return (
    typeof body.email === "string" &&
    body.email.length <= 255 &&
    typeof body.password === "string" &&
    body.password.length > 0 &&
    body.password.length <= 1024
  );
}

function sendUnauthorized(response: Response): void {
  response.status(401).json({
    error: { code: "AUTH_REQUIRED", message: "Authentication required" },
  });
}

function sendForbidden(response: Response): void {
  response.status(403).json({
    error: {
      code: "ADMINISTRATOR_REQUIRED",
      message: "Administrator access required",
    },
  });
}

function createRequireRole(
  repository: AuthRepository,
  requiredRole?: string,
): RequestHandler {
  return async (request, response, next) => {
    const user = request.session.user;
    const authenticatedAt = request.session.authenticatedAt;

    if (
      !user ||
      !authenticatedAt ||
      Date.now() - authenticatedAt >= SESSION_MAX_LIFETIME_MS
    ) {
      if (request.session) {
        await destroySession(request);
      }
      sendUnauthorized(response);
      return;
    }

    const activeUser = await repository.findActiveById(user.id);
    if (!activeUser) {
      await destroySession(request);
      sendUnauthorized(response);
      return;
    }

    request.session.user = activeUser;
    if (requiredRole && activeUser.role !== requiredRole) {
      sendForbidden(response);
      return;
    }
    next();
  };
}

export function createRequireAuthentication(
  repository: AuthRepository,
): RequestHandler {
  return createRequireRole(repository);
}

export function createRequireAdministrator(
  repository: AuthRepository,
): RequestHandler {
  return createRequireRole(repository, "Administrator");
}

export function createAuthRouter({
  repository,
  logger = console,
  production,
}: {
  repository: AuthRepository;
  logger?: SecurityLogger;
  production: boolean;
}): Router {
  const router = Router();
  const requireAdministrator = createRequireAdministrator(repository);
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      error: { code: "LOGIN_RATE_LIMITED", message: "Too many login attempts" },
    },
  });

  router.get("/csrf-token", (request, response, next) => {
    request.session.csrfToken = randomBytes(32).toString("base64url");
    response.setHeader("Cache-Control", "no-store");
    request.session.save((error) => {
      if (error) {
        next(error);
        return;
      }
      response.json({ csrf_token: request.session.csrfToken });
    });
  });

  router.post("/login", loginLimiter, requireCsrf, async (request, response) => {
    if (!isLoginBody(request.body)) {
      response.status(400).json({
        error: { code: "INVALID_REQUEST", message: "Email and password are required" },
      });
      return;
    }

    const email = request.body.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      response.status(400).json({
        error: { code: "INVALID_REQUEST", message: "Enter a valid email address" },
      });
      return;
    }

    const credential = await repository.findByEmail(email);
    let passwordMatches = false;
    if (credential) {
      passwordMatches = await argon2.verify(
        credential.passwordHash,
        request.body.password,
      );
    } else {
      await argon2.hash(request.body.password, { type: argon2.argon2id });
    }

    if (!credential || credential.status !== "ACTIVE" || !passwordMatches) {
      logger.info(
        JSON.stringify({
          event: "auth.login",
          outcome: "failure",
          reason: "invalid_credentials",
        }),
      );
      response.status(401).json({
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
      });
      return;
    }

    await regenerateSession(request);
    request.session.user = {
      id: credential.id,
      fullName: credential.fullName,
      email: credential.email,
      role: credential.role,
      permissions: credential.permissions,
    } satisfies AuthenticatedUser;
    request.session.authenticatedAt = Date.now();
    request.session.csrfToken = randomBytes(32).toString("base64url");
    await repository.recordLogin(credential.id);
    await saveSession(request);
    response.setHeader("Cache-Control", "no-store");
    logger.info(
      JSON.stringify({
        event: "auth.login",
        outcome: "success",
        user_id: credential.id,
      }),
    );
    response.json({
      user: request.session.user,
      csrf_token: request.session.csrfToken,
    });
  });

  router.get("/me", requireAdministrator, (request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.json({ user: request.session.user });
  });

  router.post(
    "/logout",
    createRequireAuthentication(repository),
    requireCsrf,
    async (request, response) => {
      const userId = request.session.user?.id;
      await destroySession(request);
      response.clearCookie("amx.sid", {
        httpOnly: true,
        secure: production,
        sameSite: "lax",
        path: "/",
      });
      logger.info(
        JSON.stringify({
          event: "auth.logout",
          outcome: "success",
          user_id: userId,
        }),
      );
      response.status(204).end();
    },
  );

  return router;
}

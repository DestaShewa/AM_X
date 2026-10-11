import session from "express-session";
import type { RequestHandler } from "express";
import type { Store } from "express-session";

export const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000;
export const SESSION_MAX_LIFETIME_MS = 12 * 60 * 60 * 1000;

export interface AuthenticatedUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  permissions: Record<string, unknown>;
}

export function createSessionMiddleware({
  secret,
  store,
  production,
}: {
  secret: string;
  store: Store;
  production: boolean;
}): RequestHandler {
  return session({
    secret,
    store,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    name: "amx.sid",
    cookie: {
      httpOnly: true,
      secure: production,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_IDLE_TIMEOUT_MS,
    },
  });
}

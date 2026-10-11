import type { AuthenticatedUser } from "./session.js";

declare module "express-session" {
  interface SessionData {
    user?: AuthenticatedUser;
    authenticatedAt?: number;
    csrfToken?: string;
  }
}

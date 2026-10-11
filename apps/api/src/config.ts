const DEFAULT_API_PORT = 4000;

export interface ApiConfig {
  databaseUrl: string;
  port: number;
  sessionSecret: string;
  frontendOrigin: string;
  production: boolean;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ApiConfig {
  const databaseUrl = env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("Missing required environment variable: DATABASE_URL");
  }

  let parsedDatabaseUrl: URL;
  try {
    parsedDatabaseUrl = new URL(databaseUrl);
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL");
  }

  if (
    parsedDatabaseUrl.protocol !== "postgres:" &&
    parsedDatabaseUrl.protocol !== "postgresql:"
  ) {
    throw new Error("DATABASE_URL must use the postgres or postgresql protocol");
  }

  const rawPort = env.API_PORT?.trim();
  const port = rawPort ? Number(rawPort) : DEFAULT_API_PORT;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("API_PORT must be an integer between 1 and 65535");
  }

  const sessionSecret = env.SESSION_SECRET?.trim();
  if (!sessionSecret || sessionSecret.length < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 characters");
  }

  const frontendOrigin = env.FRONTEND_ORIGIN?.trim();
  if (!frontendOrigin) {
    throw new Error("Missing required environment variable: FRONTEND_ORIGIN");
  }

  let parsedFrontendOrigin: URL;
  try {
    parsedFrontendOrigin = new URL(frontendOrigin);
  } catch {
    throw new Error("FRONTEND_ORIGIN must be a valid origin URL");
  }
  if (parsedFrontendOrigin.origin !== frontendOrigin) {
    throw new Error("FRONTEND_ORIGIN must not include a path or trailing slash");
  }

  const production = env.NODE_ENV === "production";
  if (production && parsedFrontendOrigin.protocol !== "https:") {
    throw new Error("FRONTEND_ORIGIN must use HTTPS in production");
  }

  return { databaseUrl, port, sessionSecret, frontendOrigin, production };
}

import { createServer } from "node:http";
import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import { createApp } from "./app.js";
import { createAuthRepository } from "./auth/repository.js";
import { SESSION_IDLE_TIMEOUT_MS } from "./auth/session.js";
import { loadConfig } from "./config.js";
import { createDatabasePool } from "./database.js";

const config = loadConfig();
const pool = createDatabasePool(config.databaseUrl);
const PgSessionStore = connectPgSimple(session);
const sessionStore = new PgSessionStore({
  pool,
  schemaName: "public",
  tableName: "user_sessions",
  createTableIfMissing: false,
  ttl: SESSION_IDLE_TIMEOUT_MS / 1000,
  pruneSessionInterval: 15 * 60,
});
const app = createApp({
  pool,
  authRepository: createAuthRepository(pool),
  sessionStore,
  sessionSecret: config.sessionSecret,
  frontendOrigin: config.frontendOrigin,
  production: config.production,
});
const server = createServer(app);

pool.on("error", (error: Error) => {
  console.error(
    JSON.stringify({
      event: "database.pool_error",
      error_name: error.name,
    }),
  );
});

server.listen(config.port, () => {
  console.info(JSON.stringify({ event: "api.started", port: config.port }));
});

server.on("error", (error: NodeJS.ErrnoException) => {
  console.error(
    JSON.stringify({
      event: "api.startup_error",
      error_code: error.code,
      error_name: error.name,
    }),
  );
  process.exitCode = 1;
  sessionStore.close();
  void pool.end();
});

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  console.info(JSON.stringify({ event: "api.shutdown", signal }));
  server.close(async (error) => {
    try {
      sessionStore.close();
      await pool.end();
      if (error) {
        console.error(
          JSON.stringify({
            event: "api.shutdown_error",
            error_name: error.name,
          }),
        );
        process.exitCode = 1;
      }
    } catch (shutdownError) {
      console.error(
        JSON.stringify({
          event: "database.shutdown_error",
          error_name:
            shutdownError instanceof Error ? shutdownError.name : "UnknownError",
        }),
      );
      process.exitCode = 1;
    }
  });
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));

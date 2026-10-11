import assert from "node:assert/strict";
import test from "node:test";
import { loadConfig } from "../src/config.js";

test("loads the API configuration from the environment", () => {
  assert.deepEqual(
    loadConfig({
      SESSION_SECRET: "test-session-secret-that-is-at-least-32-characters",
      FRONTEND_ORIGIN: "http://localhost:3000",
      DATABASE_URL: "postgres://amx:local-only@localhost:5432/amx",
    }),
    {
      databaseUrl: "postgres://amx:local-only@localhost:5432/amx",
      port: 4000,
      sessionSecret: "test-session-secret-that-is-at-least-32-characters",
      frontendOrigin: "http://localhost:3000",
      production: false,
    },
  );
});

test("rejects a missing database URL", () => {
  assert.throws(
    () => loadConfig({}),
    { message: "Missing required environment variable: DATABASE_URL" },
  );
});

test("rejects a malformed or non-PostgreSQL database URL", () => {
  assert.throws(
    () => loadConfig({ DATABASE_URL: "not a URL" }),
    { message: "DATABASE_URL must be a valid PostgreSQL connection URL" },
  );
  assert.throws(
    () => loadConfig({ DATABASE_URL: "https://example.test" }),
    { message: "DATABASE_URL must use the postgres or postgresql protocol" },
  );
});

test("rejects an invalid API port", () => {
  assert.throws(
    () =>
      loadConfig({
        DATABASE_URL: "postgres://amx:local-only@localhost:5432/amx",
        API_PORT: "70000",
        SESSION_SECRET: "test-session-secret-that-is-at-least-32-characters",
        FRONTEND_ORIGIN: "http://localhost:3000",
      }),
    { message: "API_PORT must be an integer between 1 and 65535" },
  );
});

test("requires a strong session secret and an HTTPS origin in production", () => {
  assert.throws(
    () =>
      loadConfig({
        DATABASE_URL: "postgres://localhost:5432/amx",
        SESSION_SECRET: "too-short",
        FRONTEND_ORIGIN: "http://localhost:3000",
      }),
    { message: "SESSION_SECRET must contain at least 32 characters" },
  );
  assert.throws(
    () =>
      loadConfig({
        DATABASE_URL: "postgres://localhost:5432/amx",
        SESSION_SECRET: "test-session-secret-that-is-at-least-32-characters",
        FRONTEND_ORIGIN: "http://localhost:3000",
        NODE_ENV: "production",
      }),
    { message: "FRONTEND_ORIGIN must use HTTPS in production" },
  );
});

import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import test from "node:test";
import session from "express-session";
import { createApp } from "../src/app.js";
import type { AuthRepository } from "../src/auth/repository.js";
import type { PublicPackageRepository } from "../src/packages/repository.js";
import type { DatabaseHealthCheck } from "../src/routes/health.js";

const emptyAuthRepository: AuthRepository = {
  findByEmail: async () => null,
  findActiveById: async () => null,
  recordLogin: async () => {},
};
const emptyPackageRepository: PublicPackageRepository = {
  listActive: async () => ({ items: [], totalItems: 0 }),
  findActiveBySlug: async () => null,
};

async function withServer(
  pool: DatabaseHealthCheck,
  run: (baseUrl: string) => Promise<void>,
): Promise<void> {
  const logger: Pick<Console, "info" | "error"> = { info() {}, error() {} };
  const server = createServer(
    createApp({
      pool,
      authRepository: emptyAuthRepository,
      packageRepository: emptyPackageRepository,
      sessionStore: new session.MemoryStore(),
      sessionSecret: "test-session-secret-that-is-at-least-32-characters",
      frontendOrigin: "http://localhost:3000",
      production: false,
      logger,
    }),
  );
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  try {
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Test server did not bind to a TCP address");
    }
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    server.close();
    await once(server, "close");
  }
}

test("health endpoint reports application and database health", async () => {
  const pool: DatabaseHealthCheck = {
    query: async () => ({ rows: [{ "?column?": 1 }] }),
  };

  await withServer(pool, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      status: "ok",
      checks: { database: "ok" },
    });
  });
});

test("health endpoint reports an unavailable database without leaking details", async () => {
  const pool: DatabaseHealthCheck = {
    query: async () => {
      throw new Error("connection password must not be returned");
    },
  };

  await withServer(pool, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/health`);
    assert.equal(response.status, 503);
    const body: unknown = await response.json();
    assert.deepEqual(body, {
      status: "degraded",
      checks: { database: "unavailable" },
    });
    assert.equal(JSON.stringify(body).includes("password"), false);
  });
});

test("unknown routes return a not-found response", async () => {
  const pool: DatabaseHealthCheck = { query: async () => ({ rows: [] }) };

  await withServer(pool, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/missing`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), {
      error: { code: "NOT_FOUND", message: "Resource not found" },
    });
  });
});

test("malformed JSON returns a client error", async () => {
  const pool: DatabaseHealthCheck = { query: async () => ({ rows: [] }) };

  await withServer(pool, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/health`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      error: {
        code: "INVALID_JSON",
        message: "Request body must be valid JSON",
      },
    });
  });
});

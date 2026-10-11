import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import session from "express-session";
import test from "node:test";
import { createApp } from "../src/app.js";
import type { AuthRepository } from "../src/auth/repository.js";
import type {
  PublicPackage,
  PublicPackageRepository,
} from "../src/packages/repository.js";
import type { DatabaseHealthCheck } from "../src/routes/health.js";

const experience: PublicPackage = {
  id: "e3fe2a41-f6b0-49c8-a69f-f5c570ce28ed",
  name: "Lake Experience",
  slug: "lake-experience",
  description: "An approved example package description.",
  destination: "Arba Minch",
  duration_days: 1,
  highlights: ["Lake scenery"],
  itinerary: [],
  inclusions: [],
  exclusions: [],
  important_information: null,
  cancellation_terms: null,
  base_price: null,
  currency: "ETB",
  media_references: [],
};

const authRepository: AuthRepository = {
  findByEmail: async () => null,
  findActiveById: async () => null,
  recordLogin: async () => {},
};

async function withServer(
  repository: PublicPackageRepository,
  run: (baseUrl: string) => Promise<void>,
): Promise<void> {
  const logger: Pick<Console, "info" | "error"> = { info() {}, error() {} };
  const app = createApp({
    pool: { query: async () => ({ rows: [] }) } satisfies DatabaseHealthCheck,
    authRepository,
    packageRepository: repository,
    sessionStore: new session.MemoryStore(),
    sessionSecret: "test-session-secret-that-is-at-least-32-characters",
    frontendOrigin: "http://localhost:3000",
    production: false,
    logger,
  });
  const server = createServer(app);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Test server did not bind to a TCP address");
    }
    await run(`http://127.0.0.1:${address.port}/api/v1/packages`);
  } finally {
    server.close();
    await once(server, "close");
  }
}

test("public package listing is unauthenticated and uses the standard page envelope", async () => {
  let requestedPage = 0;
  let requestedPageSize = 0;
  const repository: PublicPackageRepository = {
    async listActive(page, pageSize) {
      requestedPage = page;
      requestedPageSize = pageSize;
      return { items: [experience], totalItems: 21 };
    },
    async findActiveBySlug() {
      return experience;
    },
  };

  await withServer(repository, async (baseUrl) => {
    const response = await fetch(`${baseUrl}?page=2&page_size=10`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "public, max-age=60, s-maxage=300");
    assert.deepEqual(await response.json(), {
      data: [experience],
      meta: { page: 2, page_size: 10, total_items: 21, total_pages: 3 },
    });
    assert.equal(requestedPage, 2);
    assert.equal(requestedPageSize, 10);
  });
});

test("public package listing rejects invalid and repeated pagination parameters", async () => {
  let repositoryCalls = 0;
  const repository: PublicPackageRepository = {
    async listActive() {
      repositoryCalls += 1;
      return { items: [], totalItems: 0 };
    },
    async findActiveBySlug() {
      return null;
    },
  };

  await withServer(repository, async (baseUrl) => {
    for (const query of [
      "?page=0",
      "?page_size=101",
      "?page=1&page=2",
      "?page=999999999999999999999",
    ]) {
      const response = await fetch(`${baseUrl}${query}`);
      assert.equal(response.status, 400);
      assert.deepEqual(await response.json(), {
        error: {
          code: "INVALID_PAGINATION",
          message: "Page must be positive and page_size must be between 1 and 100",
        },
      });
    }
    assert.equal(repositoryCalls, 0);
  });
});

test("public package detail retrieves by slug and does not expose inactive packages", async () => {
  const repository: PublicPackageRepository = {
    async listActive() {
      return { items: [experience], totalItems: 1 };
    },
    async findActiveBySlug(slug) {
      return slug === experience.slug ? experience : null;
    },
  };

  await withServer(repository, async (baseUrl) => {
    const activeResponse = await fetch(`${baseUrl}/lake-experience`);
    assert.equal(activeResponse.status, 200);
    assert.deepEqual(await activeResponse.json(), { data: experience });

    const inactiveResponse = await fetch(`${baseUrl}/draft-experience`);
    assert.equal(inactiveResponse.status, 404);
    assert.deepEqual(await inactiveResponse.json(), {
      error: { code: "NOT_FOUND", message: "Package not found" },
    });

    const malformedSlugResponse = await fetch(`${baseUrl}/Invalid%20Slug`);
    assert.equal(malformedSlugResponse.status, 404);
  });
});

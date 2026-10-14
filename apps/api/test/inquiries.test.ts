import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { createServer } from "node:http";
import session from "express-session";
import test from "node:test";
import { createApp } from "../src/app.js";
import type { AuthRepository } from "../src/auth/repository.js";
import {
  IdempotencyPayloadConflictError,
  isManualInquiryStatusTransitionAllowed,
  isInquiryStatusTransitionAllowed,
  type InquiryStatus,
  type PublicInquiry,
  type PublicInquiryInput,
  type PublicInquiryRepository,
  UnavailablePackageError,
} from "../src/inquiries/repository.js";
import type { PublicPackageRepository } from "../src/packages/repository.js";
import type { DatabaseHealthCheck } from "../src/routes/health.js";

const PACKAGE_ID = "e3fe2a41-f6b0-49c8-a69f-f5c570ce28ed";
const INQUIRY: PublicInquiry = {
  id: "78ff2b64-c9c3-4b88-b021-f1c937ac6f2a",
  reference: "INQ-20990101-ABCDEF123456",
  status: "NEW",
  created_at: "2099-01-01T00:00:00.000Z",
};
const FUTURE_DATE = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);
const VALID_INPUT = {
  customer_name: "Test Traveler",
  phone: "+251 911 222 333",
  email: null,
  preferred_contact_method: "PHONE",
  package_id: null,
  travel_date: FUTURE_DATE,
  traveler_count: 2,
  duration_days: 3,
  arrival_location: "Arba Minch",
  budget_amount: "12000.00",
  interests: "Nature",
  hotel_required: false,
  transport_required: true,
  special_requests: null,
  privacy_consent: true,
};

test("inquiry transitions match the approved state model", () => {
  const statuses: readonly InquiryStatus[] = [
    "NEW",
    "CONTACTED",
    "PROVIDER_CHECKING",
    "QUOTATION_SENT",
    "AWAITING_CONFIRMATION",
    "CONVERTED",
    "DECLINED",
    "CANCELLED",
    "CLOSED",
  ];
  const transitions: Record<InquiryStatus, readonly InquiryStatus[]> = {
    NEW: ["CONTACTED", "CANCELLED"],
    CONTACTED: ["PROVIDER_CHECKING", "CANCELLED", "CLOSED"],
    PROVIDER_CHECKING: ["QUOTATION_SENT", "CONTACTED", "CANCELLED"],
    QUOTATION_SENT: ["AWAITING_CONFIRMATION", "CANCELLED"],
    AWAITING_CONFIRMATION: ["CONVERTED", "DECLINED", "CANCELLED"],
    CONVERTED: ["CLOSED"],
    DECLINED: ["CLOSED"],
    CANCELLED: ["CLOSED"],
    CLOSED: [],
  };
  for (const current of statuses) {
    for (const next of statuses) {
      assert.equal(
        isInquiryStatusTransitionAllowed(current, next),
        transitions[current].some((status) => status === next),
        `${current} -> ${next}`,
      );
    }
  }
  assert.equal(
    isManualInquiryStatusTransitionAllowed("AWAITING_CONFIRMATION", "CONVERTED"),
    false,
    "conversion requires the transactional booking workflow",
  );
  assert.equal(
    isManualInquiryStatusTransitionAllowed("AWAITING_CONFIRMATION", "DECLINED"),
    true,
  );
});
const AUTH_REPOSITORY: AuthRepository = {
  findByEmail: async () => null,
  findActiveById: async () => null,
  recordLogin: async () => {},
};
const PACKAGE_REPOSITORY: PublicPackageRepository = {
  listActive: async () => ({ items: [], totalItems: 0 }),
  findActiveBySlug: async () => null,
};

async function withInquiryServer(
  repository: PublicInquiryRepository,
  run: (baseUrl: string) => Promise<void>,
): Promise<void> {
  const logger: Pick<Console, "info" | "error"> = { info() {}, error() {} };
  const app = createApp({
    pool: { query: async () => ({ rows: [] }) } satisfies DatabaseHealthCheck,
    authRepository: AUTH_REPOSITORY,
    packageRepository: PACKAGE_REPOSITORY,
    inquiryRepository: repository,
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
    await run(`http://127.0.0.1:${address.port}/api/v1/inquiries`);
  } finally {
    server.close();
    await once(server, "close");
  }
}

function createRepository(): PublicInquiryRepository {
  const submissions = new Map<
    string,
    { hash: string; inquiry: PublicInquiry }
  >();
  return {
    async create(input: PublicInquiryInput, idempotencyKey: string) {
      const hash = JSON.stringify(input);
      const existing = submissions.get(idempotencyKey);
      if (existing) {
        if (existing.hash !== hash) {
          throw new IdempotencyPayloadConflictError();
        }
        return { inquiry: existing.inquiry, replayed: true };
      }
      const inquiry = { ...INQUIRY };
      submissions.set(idempotencyKey, { hash, inquiry });
      return { inquiry, replayed: false };
    },
  };
}

async function submit(
  baseUrl: string,
  body: unknown = VALID_INPUT,
  key = randomUUID(),
): Promise<Response> {
  return fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": key,
    },
    body: JSON.stringify(body),
  });
}

test("public inquiry accepts valid input and returns only the safe confirmation fields", async () => {
  await withInquiryServer(createRepository(), async (baseUrl) => {
    const key = randomUUID();
    const response = await submit(baseUrl, VALID_INPUT, key);
    assert.equal(response.status, 201);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const body = await response.json();
    assert.deepEqual(body, {
      data: INQUIRY,
      meta: {
        replayed: false,
        privacy_notice_version: "2026-10-11-v1",
      },
    });
    assert.equal("customer_name" in body.data, false);

    const replay = await submit(baseUrl, VALID_INPUT, key);
    assert.equal(replay.status, 200);
    assert.equal((await replay.json()).meta.replayed, true);

    const conflict = await submit(
      baseUrl,
      { ...VALID_INPUT, customer_name: "Changed Traveler" },
      key,
    );
    assert.equal(conflict.status, 409);
    assert.equal((await conflict.json()).error.code, "IDEMPOTENCY_CONFLICT");
  });
});

test("public inquiry rejects invalid fields and missing idempotency key", async () => {
  let repositoryCalls = 0;
  const repository: PublicInquiryRepository = {
    async create() {
      repositoryCalls += 1;
      return { inquiry: INQUIRY, replayed: false };
    },
  };
  await withInquiryServer(repository, async (baseUrl) => {
    const invalid = await submit(
      baseUrl,
      {
        ...VALID_INPUT,
        travel_date: "2000-01-01",
        traveler_count: 0,
        preferred_contact_method: "EMAIL",
        email: null,
        privacy_consent: false,
        ignored: "not allowed",
      },
    );
    assert.equal(invalid.status, 400);
    const body = await invalid.json();
    assert.equal(body.error.code, "VALIDATION_ERROR");
    assert.deepEqual(
      body.error.details.map((detail: { field: string }) => detail.field),
      [
        "ignored",
        "email",
        "travel_date",
        "traveler_count",
        "privacy_consent",
      ],
    );

    const missingKey = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(VALID_INPUT),
    });
    assert.equal(missingKey.status, 400);
    assert.equal(repositoryCalls, 0);
  });
});

test("public inquiry rejects inactive package selections", async () => {
  await withInquiryServer(
    {
      async create() {
        throw new UnavailablePackageError();
      },
    },
    async (baseUrl) => {
      const response = await submit(baseUrl, {
        ...VALID_INPUT,
        package_id: PACKAGE_ID,
      });
      assert.equal(response.status, 400);
      assert.equal((await response.json()).error.code, "PACKAGE_UNAVAILABLE");
    },
  );
});

test("public inquiry submission is rate limited and permits the idempotency header in CORS", async () => {
  await withInquiryServer(createRepository(), async (baseUrl) => {
    const options = await fetch(baseUrl, {
      method: "OPTIONS",
      headers: { Origin: "http://localhost:3000" },
    });
    assert.equal(options.status, 204);
    assert.match(
      options.headers.get("access-control-allow-headers") ?? "",
      /Idempotency-Key/,
    );

    for (let index = 0; index < 5; index += 1) {
      const response = await submit(baseUrl);
      assert.notEqual(response.status, 429);
    }
    const limited = await submit(baseUrl);
    assert.equal(limited.status, 429);
    assert.equal((await limited.json()).error.code, "RATE_LIMITED");
  });
});

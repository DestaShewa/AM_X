import assert from "node:assert/strict";
import argon2 from "argon2";
import { once } from "node:events";
import { createServer } from "node:http";
import session from "express-session";
import test from "node:test";
import { createApp } from "../src/app.js";
import type { AuthRepository } from "../src/auth/repository.js";
import type { PublicPackageRepository } from "../src/packages/repository.js";
import type { DatabaseHealthCheck } from "../src/routes/health.js";
import type {
  FollowUpDetail,
  FollowUpInput,
  FollowUpRepository,
  FollowUpStatus,
} from "../src/follow-ups/repository.js";

const ADMIN_ID = "e3fe2a41-f6b0-49c8-a69f-f5c570ce28ed";
const FOLLOW_UP_ID = "3f7f8b1c-0e3d-4c89-a9b0-5fa4a2da98c1";
const CUSTOMER_ID = "f2a980fb-f664-46b8-b163-f75bf5778a54";
const SESSION_SECRET = "test-session-secret-that-is-at-least-32-characters";
const FRONTEND_ORIGIN = "http://localhost:3000";
const followUp: FollowUpDetail = {
  id: FOLLOW_UP_ID,
  target_type: "CUSTOMER",
  target_id: CUSTOMER_ID,
  target_label: "Test Traveler",
  customer_name: "Test Traveler",
  assigned_user_id: null,
  assigned_user_name: null,
  description: "Confirm travel plans",
  due_at: "2026-10-20T12:00:00.000Z",
  status: "PENDING",
  completed_at: null,
  outcome_notes: null,
  created_at: "2026-10-14T12:00:00.000Z",
  updated_at: "2026-10-14T12:00:00.000Z",
  history: [],
};

function createRepository(calls: {
  created?: FollowUpInput;
  transitioned?: { status: FollowUpStatus; outcomeNotes?: string | null };
}): FollowUpRepository {
  return {
    async list(page, pageSize, status, due, search) {
      assert.equal(page, 2);
      assert.equal(pageSize, 10);
      assert.equal(status, "PENDING");
      assert.equal(due, "OVERDUE");
      assert.equal(search, "plans");
      return { items: [followUp], totalItems: 1 };
    },
    async listTargets(type) {
      return {
        items: [{ id: CUSTOMER_ID, label: "Test Traveler", target_type: type }],
        totalItems: 1,
      };
    },
    async listAssignees() {
      return [{ id: ADMIN_ID, full_name: "AMX Administrator" }];
    },
    async get(id) {
      return id === FOLLOW_UP_ID ? followUp : null;
    },
    async create(input) {
      calls.created = input;
      return followUp;
    },
    async update() {
      return followUp;
    },
    async transition(_id, status, _actorId, outcomeNotes) {
      calls.transitioned = { status, outcomeNotes };
      return {
        ...followUp,
        status,
        completed_at:
          status === "COMPLETED" ? "2026-10-14T13:00:00.000Z" : null,
        outcome_notes: outcomeNotes ?? null,
      };
    },
  };
}

async function withServer(
  run: (baseUrl: string, calls: Parameters<typeof createRepository>[0]) => Promise<void>,
  role = "Administrator",
): Promise<void> {
  const passwordHash = await argon2.hash("valid-test-password", {
    type: argon2.argon2id,
  });
  const authRepository: AuthRepository = {
    findByEmail: async () => ({
      id: ADMIN_ID,
      fullName: "AMX Administrator",
      email: "admin@example.test",
      role,
      permissions: {},
      passwordHash,
      status: "ACTIVE",
    }),
    findActiveById: async (id) =>
      id === ADMIN_ID
        ? {
            id: ADMIN_ID,
            fullName: "AMX Administrator",
            email: "admin@example.test",
            role,
            permissions: {},
          }
        : null,
    recordLogin: async () => {},
  };
  const calls: Parameters<typeof createRepository>[0] = {};
  const packageRepository: PublicPackageRepository = {
    listActive: async () => ({ items: [], totalItems: 0 }),
    findActiveBySlug: async () => null,
  };
  const logger: Pick<Console, "info" | "error"> = { info() {}, error() {} };
  const server = createServer(
    createApp({
      pool: { query: async () => ({ rows: [] }) } satisfies DatabaseHealthCheck,
      authRepository,
      packageRepository,
      followUpRepository: createRepository(calls),
      sessionStore: new session.MemoryStore(),
      sessionSecret: SESSION_SECRET,
      frontendOrigin: FRONTEND_ORIGIN,
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
    await run(`http://127.0.0.1:${address.port}/api/v1`, calls);
  } finally {
    server.close();
    await once(server, "close");
  }
}

function sessionCookie(response: Response): string {
  const cookie = response.headers.get("set-cookie")?.split(";", 1)[0];
  assert.ok(cookie);
  return cookie;
}

async function adminCredentials(baseUrl: string): Promise<{
  cookie: string;
  csrfToken: string;
}> {
  const csrfResponse = await fetch(`${baseUrl}/auth/csrf-token`, {
    headers: { Origin: FRONTEND_ORIGIN },
  });
  const csrfCookie = sessionCookie(csrfResponse);
  const csrfBody = (await csrfResponse.json()) as { csrf_token: string };
  const loginResponse = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      Origin: FRONTEND_ORIGIN,
      Cookie: csrfCookie,
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfBody.csrf_token,
    },
    body: JSON.stringify({
      email: "admin@example.test",
      password: "valid-test-password",
    }),
  });
  assert.equal(loginResponse.status, 200);
  const loginBody = (await loginResponse.json()) as { csrf_token: string };
  return { cookie: sessionCookie(loginResponse), csrfToken: loginBody.csrf_token };
}

test("follow-up API protects administrator access and validates write payloads", async () => {
  await withServer(async (baseUrl, calls) => {
    const anonymous = await fetch(`${baseUrl}/admin/follow-ups`);
    assert.equal(anonymous.status, 401);

    const { cookie, csrfToken } = await adminCredentials(baseUrl);
    const listed = await fetch(
      `${baseUrl}/admin/follow-ups?page=2&page_size=10&status=PENDING&due=OVERDUE&search=plans`,
      { headers: { Cookie: cookie, Origin: FRONTEND_ORIGIN } },
    );
    assert.equal(listed.status, 200);
    const listBody = (await listed.json()) as {
      data: FollowUpDetail[];
      meta: { total_items: number };
    };
    assert.equal(listBody.data[0]?.id, FOLLOW_UP_ID);
    assert.equal(listBody.meta.total_items, 1);

    const invalid = await fetch(`${baseUrl}/admin/follow-ups`, {
      method: "POST",
      headers: {
        Cookie: cookie,
        Origin: FRONTEND_ORIGIN,
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        target_type: "CUSTOMER",
        description: "Missing target and due date",
      }),
    });
    assert.equal(invalid.status, 400);

    const created = await fetch(`${baseUrl}/admin/follow-ups`, {
      method: "POST",
      headers: {
        Cookie: cookie,
        Origin: FRONTEND_ORIGIN,
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        target_type: "CUSTOMER",
        target_id: CUSTOMER_ID,
        description: "Confirm travel plans",
        due_at: "2026-10-20T12:00:00.000Z",
        assigned_user_id: null,
      }),
    });
    assert.equal(created.status, 201);
    assert.equal(calls.created?.target_id, CUSTOMER_ID);

    const completed = await fetch(
      `${baseUrl}/admin/follow-ups/${FOLLOW_UP_ID}/complete`,
      {
        method: "POST",
        headers: {
          Cookie: cookie,
          Origin: FRONTEND_ORIGIN,
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ outcome_notes: "Customer confirmed." }),
      },
    );
    assert.equal(completed.status, 200);
    assert.deepEqual(calls.transitioned, {
      status: "COMPLETED",
      outcomeNotes: "Customer confirmed.",
    });
  });
});

test("follow-up API rejects non-administrator staff", async () => {
  await withServer(async (baseUrl) => {
    const { cookie } = await adminCredentials(baseUrl);
    const response = await fetch(`${baseUrl}/admin/follow-ups`, {
      headers: { Cookie: cookie, Origin: FRONTEND_ORIGIN },
    });
    assert.equal(response.status, 403);
  }, "Staff");
});

import assert from "node:assert/strict";
import argon2 from "argon2";
import { once } from "node:events";
import { createServer } from "node:http";
import session from "express-session";
import test from "node:test";
import { createApp } from "../src/app.js";
import type { AuthRepository } from "../src/auth/repository.js";
import type {
  ManagementRepository,
  ManagedPackage,
  ManagedProvider,
  PackageInput,
  PackageStatus,
  PackageUpdate,
  ProviderInput,
  ProviderStatus,
  ProviderUpdate,
  ProviderVerificationStatus,
} from "../src/management/repository.js";
import type { PublicPackageRepository } from "../src/packages/repository.js";
import type { DatabaseHealthCheck } from "../src/routes/health.js";

const ADMIN_ID = "e3fe2a41-f6b0-49c8-a69f-f5c570ce28ed";
const PACKAGE_ID = "f2a980fb-f664-46b8-b163-f75bf5778a54";
const PROVIDER_ID = "f33e0fc9-1360-4e1a-88b9-29cde7254534";
const SESSION_SECRET = "test-session-secret-that-is-at-least-32-characters";
const FRONTEND_ORIGIN = "http://localhost:3000";

const packageRecord: ManagedPackage = {
  id: PACKAGE_ID,
  name: "Lake Walk",
  slug: "lake-walk",
  description: "A day by the lake.",
  destination: "Arba Minch",
  duration_days: 1,
  highlights: [],
  itinerary: [],
  inclusions: [],
  exclusions: [],
  important_information: null,
  cancellation_terms: null,
  base_price: null,
  currency: "ETB",
  media_references: [],
  status: "DRAFT",
  provider_ids: [],
  created_at: "2026-10-11T00:00:00.000Z",
  updated_at: "2026-10-11T00:00:00.000Z",
};

const providerRecord: ManagedProvider = {
  id: PROVIDER_ID,
  name: "Local Guide",
  provider_type: "Guide",
  phone: "+251911000000",
  email: null,
  location: "Arba Minch",
  languages: [],
  services_offered: [],
  pricing_notes: null,
  availability_notes: null,
  verification_status: "UNVERIFIED",
  license_details: null,
  qualification_details: null,
  agreement_status: "PENDING",
  commission_terms: null,
  notes: null,
  status: "INACTIVE",
  created_at: "2026-10-11T00:00:00.000Z",
  updated_at: "2026-10-11T00:00:00.000Z",
};

function createManagementRepository(): ManagementRepository {
  return {
    listPackages: async () => ({ items: [packageRecord], totalItems: 1 }),
    getPackage: async () => packageRecord,
    createPackage: async (_input: PackageInput, actorId: string) => {
      assert.equal(actorId, ADMIN_ID);
      return packageRecord;
    },
    updatePackage: async (_id: string, _input: PackageUpdate) => packageRecord,
    updatePackageStatus: async (
      _id: string,
      status: PackageStatus,
    ) => ({ ...packageRecord, status }),
    listProviders: async () => ({ items: [providerRecord], totalItems: 1 }),
    getProvider: async () => providerRecord,
    createProvider: async (_input: ProviderInput, actorId: string) => {
      assert.equal(actorId, ADMIN_ID);
      return providerRecord;
    },
    updateProvider: async (_id: string, _input: ProviderUpdate) =>
      providerRecord,
    updateProviderStatus: async (_id: string, status: ProviderStatus) => ({
      ...providerRecord,
      status,
    }),
    updateProviderVerification: async (
      _id: string,
      status: ProviderVerificationStatus,
    ) => ({ ...providerRecord, verification_status: status }),
  };
}

async function withServer(
  run: (baseUrl: string) => Promise<void>,
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
      managementRepository: createManagementRepository(),
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
    await run(`http://127.0.0.1:${address.port}/api/v1`);
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

test("management API requires an authenticated Administrator and CSRF for writes", async () => {
  await withServer(async (baseUrl) => {
    const anonymous = await fetch(`${baseUrl}/admin/packages`);
    assert.equal(anonymous.status, 401);

    const { cookie, csrfToken } = await adminCredentials(baseUrl);
    const packagesResponse = await fetch(`${baseUrl}/admin/packages`, {
      headers: { Cookie: cookie, Origin: FRONTEND_ORIGIN },
    });
    assert.equal(packagesResponse.status, 200);
    const packageBody = (await packagesResponse.json()) as {
      data: ManagedPackage[];
      meta: { total_items: number };
    };
    assert.equal(packageBody.data[0]?.status, "DRAFT");
    assert.equal(packageBody.meta.total_items, 1);

    const invalidCsrf = await fetch(`${baseUrl}/admin/packages`, {
      method: "POST",
      headers: {
        Cookie: cookie,
        Origin: FRONTEND_ORIGIN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "Invalid" }),
    });
    assert.equal(invalidCsrf.status, 403);

    const invalidInput = await fetch(`${baseUrl}/admin/packages`, {
      method: "POST",
      headers: {
        Cookie: cookie,
        Origin: FRONTEND_ORIGIN,
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Invalid",
        slug: "Invalid Slug",
        description: "Incomplete package",
        destination: "Arba Minch",
        duration_days: 1,
      }),
    });
    assert.equal(invalidInput.status, 400);
    assert.deepEqual(await invalidInput.json(), {
      error: {
        code: "INVALID_REQUEST",
        message: "slug must contain lowercase letters, numbers and hyphens",
      },
    });

    const createResponse = await fetch(`${baseUrl}/admin/packages`, {
      method: "POST",
      headers: {
        Cookie: cookie,
        Origin: FRONTEND_ORIGIN,
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Lake Walk",
        slug: "lake-walk",
        description: "A day by the lake.",
        destination: "Arba Minch",
        duration_days: 1,
      }),
    });
    assert.equal(createResponse.status, 201);
    assert.equal(
      (await createResponse.json() as { data: ManagedPackage }).data.status,
      "DRAFT",
    );

    const statusResponse = await fetch(
      `${baseUrl}/admin/packages/${PACKAGE_ID}/status`,
      {
        method: "PATCH",
        headers: {
          Cookie: cookie,
          Origin: FRONTEND_ORIGIN,
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "ACTIVE" }),
      },
    );
    assert.equal(statusResponse.status, 200);
    const statusBody = (await statusResponse.json()) as {
      data: ManagedPackage;
    };
    assert.equal(statusBody.data.status, "ACTIVE");
  });
});

test("management API denies authenticated users without the Administrator role", async () => {
  await withServer(async (baseUrl) => {
    const { cookie } = await adminCredentials(baseUrl);
    const response = await fetch(`${baseUrl}/admin/packages`, {
      headers: { Cookie: cookie, Origin: FRONTEND_ORIGIN },
    });
    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), {
      error: {
        code: "FORBIDDEN",
        message: "Administrator access is required",
      },
    });
  }, "Visitor");
});

test("provider management endpoints keep lifecycle and verification states explicit", async () => {
  await withServer(async (baseUrl) => {
    const { cookie, csrfToken } = await adminCredentials(baseUrl);
    const createResponse = await fetch(`${baseUrl}/admin/providers`, {
      method: "POST",
      headers: {
        Cookie: cookie,
        Origin: FRONTEND_ORIGIN,
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Local Guide",
        provider_type: "Guide",
        phone: "+251911000000",
        location: "Arba Minch",
      }),
    });
    assert.equal(createResponse.status, 201);

    const response = await fetch(
      `${baseUrl}/admin/providers/${PROVIDER_ID}/verification`,
      {
        method: "PATCH",
        headers: {
          Cookie: cookie,
          Origin: FRONTEND_ORIGIN,
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "VERIFIED" }),
      },
    );
    assert.equal(response.status, 200);
    const body = (await response.json()) as { data: ManagedProvider };
    assert.equal(body.data.verification_status, "VERIFIED");

    const invalidStatus = await fetch(
      `${baseUrl}/admin/providers/${PROVIDER_ID}/status`,
      {
        method: "PATCH",
        headers: {
          Cookie: cookie,
          Origin: FRONTEND_ORIGIN,
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "VERIFIED" }),
      },
    );
    assert.equal(invalidStatus.status, 400);
  });
});

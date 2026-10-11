import assert from "node:assert/strict";
import argon2 from "argon2";
import { once } from "node:events";
import { createServer } from "node:http";
import session from "express-session";
import test from "node:test";
import { createApp } from "../src/app.js";
import type {
  AuthRepository,
  StaffCredential,
} from "../src/auth/repository.js";
import type { DatabaseHealthCheck } from "../src/routes/health.js";

const passwordValue = "correct-horse-battery-staple";
const sessionSecret = "test-session-secret-that-is-at-least-32-characters";
const frontendOrigin = "http://localhost:3000";
const emptyPool: DatabaseHealthCheck = { query: async () => ({ rows: [] }) };

function createRepository(
  status: StaffCredential["status"] = "ACTIVE",
): AuthRepository {
  const credential: StaffCredential = {
    id: "e3fe2a41-f6b0-49c8-a69f-f5c570ce28ed",
    fullName: "AMX Administrator",
    email: "admin@example.test",
    role: "Administrator",
    permissions: {},
    passwordHash: "",
    status,
  };
  return {
    async findByEmail() {
      return { ...credential };
    },
    async findActiveById(id) {
      return id === credential.id && status === "ACTIVE"
        ? {
            id: credential.id,
            fullName: credential.fullName,
            email: credential.email,
            role: credential.role,
            permissions: credential.permissions,
          }
        : null;
    },
    async recordLogin() {},
  };
}

async function withAuthServer(
  repository: AuthRepository,
  run: (
    baseUrl: string,
    store: session.MemoryStore,
  ) => Promise<void>,
  store = new session.MemoryStore(),
): Promise<void> {
  const logger: Pick<Console, "info" | "error"> = { info() {}, error() {} };
  const server = createServer(
    createApp({
      pool: emptyPool,
      authRepository: repository,
      sessionStore: store,
      sessionSecret,
      frontendOrigin,
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
    await run(`http://127.0.0.1:${address.port}/api/v1/auth`, store);
  } finally {
    server.close();
    await once(server, "close");
  }
}

function cookieFrom(response: Response): string {
  const cookie = response.headers.get("set-cookie")?.split(";", 1)[0];
  assert.ok(cookie, "Expected a session cookie");
  return cookie;
}

async function getCsrfToken(baseUrl: string): Promise<{
  cookie: string;
  token: string;
  maxAgeHeader: string;
}> {
  const response = await fetch(`${baseUrl}/csrf-token`, {
    headers: { Origin: frontendOrigin },
  });
  assert.equal(response.status, 200);
  const body = (await response.json()) as { csrf_token: string };
  assert.equal(typeof body.csrf_token, "string");
  return {
    cookie: cookieFrom(response),
    token: body.csrf_token,
    maxAgeHeader: response.headers.get("set-cookie") ?? "",
  };
}

async function login(
  baseUrl: string,
  cookie: string,
  token: string,
  email = "admin@example.test",
  password = passwordValue,
): Promise<Response> {
  return fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      Origin: frontendOrigin,
      Cookie: cookie,
      "Content-Type": "application/json",
      "X-CSRF-Token": token,
    },
    body: JSON.stringify({ email, password }),
  });
}

test("login rotates the session, exposes the user profile, and logout invalidates it", async () => {
  const repository = createRepository();
  const credential = await repository.findByEmail("admin@example.test");
  assert.ok(credential);
  credential.passwordHash = await argon2.hash(passwordValue, {
    type: argon2.argon2id,
  });
  repository.findByEmail = async () => credential;

  await withAuthServer(repository, async (baseUrl) => {
    const initial = await getCsrfToken(baseUrl);
    assert.match(initial.maxAgeHeader, /Expires=/i);
    const initialExpiry = Date.parse(
      /Expires=([^;]+)/i.exec(initial.maxAgeHeader)?.[1] ?? "",
    );
    assert.ok(initialExpiry - Date.now() > 29 * 60 * 1000);
    assert.ok(initialExpiry - Date.now() <= 30 * 60 * 1000);

    const loginResponse = await login(baseUrl, initial.cookie, initial.token);
    assert.equal(loginResponse.status, 200);
    const loginCookie = cookieFrom(loginResponse);
    assert.notEqual(loginCookie, initial.cookie, "Login must rotate the session ID");
    assert.match(loginResponse.headers.get("set-cookie") ?? "", /HttpOnly/i);
    const loginBody = (await loginResponse.json()) as {
      csrf_token: string;
      user: { email: string; fullName: string; role: string };
    };
    assert.deepEqual(loginBody.user, {
      id: "e3fe2a41-f6b0-49c8-a69f-f5c570ce28ed",
      email: "admin@example.test",
      fullName: "AMX Administrator",
      role: "Administrator",
      permissions: {},
    });
    assert.equal(Object.hasOwn(loginBody.user, "passwordHash"), false);

    const profileResponse = await fetch(`${baseUrl}/me`, {
      headers: { Cookie: loginCookie, Origin: frontendOrigin },
    });
    assert.equal(profileResponse.status, 200);

    const logoutResponse = await fetch(`${baseUrl}/logout`, {
      method: "POST",
      headers: {
        Cookie: loginCookie,
        Origin: frontendOrigin,
        "X-CSRF-Token": loginBody.csrf_token,
      },
    });
    assert.equal(logoutResponse.status, 204);

    const invalidatedResponse = await fetch(`${baseUrl}/me`, {
      headers: { Cookie: loginCookie, Origin: frontendOrigin },
    });
    assert.equal(invalidatedResponse.status, 401);
  });
});

test("an existing session is rejected immediately after account deactivation", async () => {
  const passwordHash = await argon2.hash(passwordValue, {
    type: argon2.argon2id,
  });
  let status: StaffCredential["status"] = "ACTIVE";
  const repository = createRepository();
  repository.findByEmail = async () => ({
    id: "e3fe2a41-f6b0-49c8-a69f-f5c570ce28ed",
    fullName: "AMX Administrator",
    email: "admin@example.test",
    role: "Administrator",
    permissions: {},
    passwordHash,
    status,
  });
  repository.findActiveById = async () =>
    status === "ACTIVE"
      ? {
          id: "e3fe2a41-f6b0-49c8-a69f-f5c570ce28ed",
          fullName: "AMX Administrator",
          email: "admin@example.test",
          role: "Administrator",
          permissions: {},
        }
      : null;

  await withAuthServer(repository, async (baseUrl) => {
    const csrf = await getCsrfToken(baseUrl);
    const loginResponse = await login(baseUrl, csrf.cookie, csrf.token);
    assert.equal(loginResponse.status, 200);
    const loginCookie = cookieFrom(loginResponse);

    status = "INACTIVE";
    const response = await fetch(`${baseUrl}/me`, {
      headers: { Cookie: loginCookie, Origin: frontendOrigin },
    });
    assert.equal(response.status, 401);
  });
});

test("login uses generic errors for unknown emails, wrong passwords, and inactive accounts", async () => {
  const passwordHash = await argon2.hash(passwordValue, {
    type: argon2.argon2id,
  });
  let availableCredential: StaffCredential | null = {
    id: "e3fe2a41-f6b0-49c8-a69f-f5c570ce28ed",
    fullName: "AMX Administrator",
    email: "admin@example.test",
    role: "Administrator",
    permissions: {},
    passwordHash,
    status: "ACTIVE",
  };
  const repository = createRepository();
  repository.findByEmail = async () => availableCredential;
  repository.findActiveById = async () =>
    availableCredential?.status === "ACTIVE"
      ? {
          id: availableCredential.id,
          fullName: availableCredential.fullName,
          email: availableCredential.email,
          role: availableCredential.role,
          permissions: availableCredential.permissions,
        }
      : null;

  await withAuthServer(repository, async (baseUrl) => {
    const csrf = await getCsrfToken(baseUrl);
    const wrongPassword = await login(
      baseUrl,
      csrf.cookie,
      csrf.token,
      "admin@example.test",
      "wrong-password",
    );
    const wrongPasswordBody = await wrongPassword.json();
    assert.equal(wrongPassword.status, 401);

    availableCredential = null;
    const unknownEmail = await login(
      baseUrl,
      csrf.cookie,
      csrf.token,
      "unknown@example.test",
    );
    assert.equal(unknownEmail.status, 401);
    assert.deepEqual(await unknownEmail.json(), wrongPasswordBody);

    availableCredential = {
      id: "e3fe2a41-f6b0-49c8-a69f-f5c570ce28ed",
      fullName: "AMX Administrator",
      email: "admin@example.test",
      role: "Administrator",
      permissions: {},
      passwordHash,
      status: "INACTIVE",
    };
    const inactive = await login(
      baseUrl,
      csrf.cookie,
      csrf.token,
      "admin@example.test",
      passwordValue,
    );
    assert.equal(inactive.status, 401);
    assert.deepEqual(await inactive.json(), wrongPasswordBody);
  });
});

test("login requires CSRF validation and rejects untrusted origins", async () => {
  const repository = createRepository();
  await withAuthServer(repository, async (baseUrl) => {
    const csrf = await getCsrfToken(baseUrl);
    const csrfResponse = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: {
        Origin: frontendOrigin,
        Cookie: csrf.cookie,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "admin@example.test", password: passwordValue }),
    });
    assert.equal(csrfResponse.status, 403);
    assert.deepEqual(await csrfResponse.json(), {
      error: { code: "CSRF_INVALID", message: "Request verification failed" },
    });

    const originResponse = await fetch(`${baseUrl}/csrf-token`, {
      headers: { Origin: "https://attacker.example" },
    });
    assert.equal(originResponse.status, 403);
  });
});

test("login throttles attempts after five requests in the rate-limit window", async () => {
  const repository = createRepository();
  const credential = await repository.findByEmail("admin@example.test");
  assert.ok(credential);
  credential.passwordHash = await argon2.hash(passwordValue, {
    type: argon2.argon2id,
  });
  repository.findByEmail = async () => credential;

  await withAuthServer(repository, async (baseUrl) => {
    const csrf = await getCsrfToken(baseUrl);
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await login(
        baseUrl,
        csrf.cookie,
        csrf.token,
        "admin@example.test",
        "incorrect-password",
      );
      assert.equal(response.status, 401);
    }
    const limitedResponse = await login(
      baseUrl,
      csrf.cookie,
      csrf.token,
      "admin@example.test",
      "incorrect-password",
    );
    assert.equal(limitedResponse.status, 429);
  });
});

test("authentication enforces the twelve-hour absolute session lifetime", async () => {
  const repository = createRepository();
  const credential = await repository.findByEmail("admin@example.test");
  assert.ok(credential);
  credential.passwordHash = await argon2.hash(passwordValue, {
    type: argon2.argon2id,
  });
  repository.findByEmail = async () => credential;
  const store = new session.MemoryStore();

  await withAuthServer(
    repository,
    async (baseUrl, sessionStore) => {
      const csrf = await getCsrfToken(baseUrl);
      const loginResponse = await login(baseUrl, csrf.cookie, csrf.token);
      assert.equal(loginResponse.status, 200);
      const loginCookie = cookieFrom(loginResponse);
      const sessionId = decodeURIComponent(loginCookie.split("=", 2)[1]!)
        .slice(2)
        .split(".")[0]!;
      const savedSession = await new Promise<session.SessionData>(
        (resolve, reject) => {
          sessionStore.get(sessionId, (error, value) => {
            if (error) {
              reject(error);
            } else if (value) {
              resolve(value);
            } else {
              reject(new Error("Expected the authenticated session in the store"));
            }
          });
        },
      );
      savedSession.authenticatedAt = Date.now() - 12 * 60 * 60 * 1000;
      await new Promise<void>((resolve, reject) => {
        sessionStore.set(sessionId, savedSession, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      const response = await fetch(`${baseUrl}/me`, {
        headers: { Cookie: loginCookie, Origin: frontendOrigin },
      });
      assert.equal(response.status, 401);
    },
    store,
  );
});

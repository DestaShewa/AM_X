# AMX Development Environment

**Project:** AMX — Arba Minch Experiences
**Status:** Technical foundation; business/domain implementation decisions remain subject to their approval gates.

## 1. Required tools

* Node.js 24.x and npm 11.x.
* TypeScript, installed through the locked workspace dependencies.
* Docker Engine with Docker Compose.
* Git.

The Node major version is recorded in `.nvmrc`. The root `package.json` declares the supported Node and npm ranges. Application source and tests use TypeScript; the API has a strict TypeScript check in its workspace scripts, and the Next.js workspace type-checks using its `tsconfig.json`.

## 2. Local setup

From the repository root:

```sh
cp .env.example .env
npm install
docker compose up -d db
npm run db:up
```

Start the API and website in separate terminals:

```sh
npm run dev:api
npm run dev:web
```

The API listens on `http://localhost:4000` by default, with its health endpoint at `/api/v1/health`. The website listens on `http://localhost:3000`.

## 3. Configuration and secrets

`.env.example` documents the required local variables. Copy it to `.env` and change values as appropriate for a local machine. Replace `SESSION_SECRET` with a random value of at least 32 characters (for example, generate one with `openssl rand -hex 32`). The example database credentials and session secret are for local-only use; do not reuse them in shared or production environments.

The API requires `DATABASE_URL`, `SESSION_SECRET`, and `FRONTEND_ORIGIN`. It validates these values and `API_PORT` at startup and reports invalid/missing configuration without printing credentials. Production frontend origins must use HTTPS. Set `NEXT_PUBLIC_API_BASE_URL` in the web build environment when the API is not at the local default URL. `.env` and real secrets must not be committed.

## 4. Database and migrations

Local PostgreSQL runs as the `db` service in `compose.yaml` on host port `5435` by default to avoid colliding with common local PostgreSQL services on port `5432`. The container stores data in a named Docker volume. Stop the service with `docker compose down`; use `docker compose down -v` only when intentionally deleting local database data.

The chosen migration tool is `node-pg-migrate`. Use `npm run db:up`, `npm run db:down`, and `npm run db:status` from the repository root. The status script reports whether the migration tracking table exists and lists applied migrations. VS-002 adds the `roles`, `users`, and `user_sessions` authentication tables. VS-004 adds only the `packages` table for public read-only browsing; package management and other tourism business tables remain in separate slices.

After applying the authentication migration, provision the first Administrator interactively with `npm run admin:create`. The command prompts for a name, email, and password, hashes the password with Argon2id, and refuses to create another Administrator. There is no public registration endpoint.

### Staff sign-in

Open `http://localhost:3000/login` after both development servers are running. The first Administrator must have been provisioned with `npm run admin:create`. The login endpoint rate-limits attempts to five per IP address per 15 minutes per API process. Successful sign-in creates a 30-minute rolling idle session, while the API enforces a 12-hour absolute maximum lifetime.

### Public experiences

Open `http://localhost:3000/experiences` to browse active packages or `/experiences/<slug>` for an active package detail page. The read-only public API is `GET /api/v1/packages` and `GET /api/v1/packages/<slug>`. No sample package content is seeded; until approved packages are entered through the later package-administration slice, visitors see the documented empty state.

## 5. Verification commands

```sh
npm test
npm run lint
npm run typecheck
npm run build
npm run db:status
```

The API health endpoint returns HTTP 200 when PostgreSQL responds to a simple query and HTTP 503 with a sanitized degraded-health response when it does not.
# AMX — Arba Minch Experiences

AMX is developed as a modular monolith with a Next.js website, an Express API, and PostgreSQL.
Frontend and backend application source and tests use TypeScript.

## Local development

Requirements: Node.js 24.x, npm 11.x, and Docker Compose.

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

The website runs at <http://localhost:3000>. The API health endpoint is <http://localhost:4000/api/v1/health>.

Run checks:

```sh
npm test
npm run lint
npm run typecheck
npm run build
npm run db:status
```

`db:up` currently initializes the migration tool's tracking table only. `db:status` reports whether tracking is initialized and lists applied migrations. No AMX business tables or domain migrations are included in this technical foundation. Domain migrations must wait for the corresponding database and business rules to be approved or formally deferred.

The sample credentials in `.env.example` are for local development only. Do not use them in shared or production environments. Keep `.env` and all real credentials out of version control.

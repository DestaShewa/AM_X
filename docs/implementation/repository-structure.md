# AMX Repository Structure

**Project:** AMX — Arba Minch Experiences
**Document:** `docs/implementation/repository-structure.md`
**Version:** 1.0

## 1. Purpose

Define the repository layout for AMX so the frontend, backend, database resources, tests, documentation, and deployment configuration remain organized and maintainable.

## 2. Architecture

AMX uses a **modular monolith** with one frontend application, one backend API, and one PostgreSQL database.

* **Frontend:** Next.js, React, JavaScript, Tailwind CSS.
* **Backend:** Node.js, Express, JavaScript.
* **Database:** PostgreSQL with version-controlled migrations.
* **Infrastructure:** Docker and a Linux-based deployment environment.
* **API:** REST under `/api/v1/`.

The frontend and backend are separate applications within one Git repository.

## 3. Root Directory Structure

```text
amx/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   └── shared/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── README.md
├── docs/
│   ├── requirements/
│   ├── analysis/
│   ├── specification/
│   ├── architecture/
│   ├── database/
│   ├── api/
│   ├── ui-ux/
│   └── implementation/
├── infrastructure/
│   ├── docker/
│   └── deployment/
├── scripts/
├── .github/
│   └── workflows/
├── .env.example
├── .gitignore
├── compose.yaml
├── package.json
├── package-lock.json
└── README.md
```

Use the directories as defined below. Do not create every possible file or module before it is needed.

## 4. Frontend Structure — `apps/web/`

```text
apps/web/
├── public/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   ├── admin/
│   │   ├── login/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│   ├── features/
│   │   ├── experiences/
│   │   ├── inquiries/
│   │   ├── customers/
│   │   ├── providers/
│   │   ├── quotations/
│   │   ├── bookings/
│   │   ├── payments/
│   │   ├── follow-ups/
│   │   ├── reviews/
│   │   ├── complaints/
│   │   └── reports/
│   ├── lib/
│   ├── hooks/
│   └── config/
├── tests/
├── next.config.js
├── package.json
└── README.md
```

### Frontend Responsibilities

* Render public and administrative screens.
* Provide reusable components and consistent layouts.
* Collect user input and display validation feedback.
* Communicate with the backend through the API client.
* Present server-calculated values and workflow statuses.
* Hide or disable unavailable actions for usability, without replacing backend authorization.

The exact Next.js configuration filename should follow the installed framework version.

## 5. Backend Structure — `apps/api/`

```text
apps/api/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── customers/
│   │   ├── inquiries/
│   │   ├── providers/
│   │   ├── packages/
│   │   ├── quotations/
│   │   ├── bookings/
│   │   ├── payments/
│   │   ├── follow-ups/
│   │   ├── reviews/
│   │   ├── complaints/
│   │   ├── reports/
│   │   └── audit-logs/
│   ├── database/
│   ├── integrations/
│   ├── utils/
│   └── docs/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── package.json
└── README.md
```

### Backend Module Convention

Each module should contain only the files it needs. A typical module may use:

```text
inquiries/
├── inquiry.routes.js
├── inquiry.controller.js
├── inquiry.service.js
├── inquiry.repository.js
├── inquiry.validation.js
└── inquiry.test.js
```

Responsibilities:

* **Routes:** Define HTTP endpoints and middleware.
* **Controllers:** Translate HTTP requests into service calls and format responses.
* **Services:** Enforce business workflows and rules.
* **Repositories:** Encapsulate database access where this abstraction is useful.
* **Validation:** Validate request data and parameters.
* **Tests:** Verify module behavior.

Do not create empty files for every module in advance. Introduce files when implementing the corresponding vertical slice.

## 6. Shared Package — `packages/shared/`

```text
packages/shared/
├── src/
│   ├── constants/
│   └── utilities/
├── package.json
└── README.md
```

Use this package only for genuinely shared, environment-independent code, such as stable constants or simple utilities.

Do not share server secrets, database logic, authorization decisions, or business rules that must be enforced by the backend. Avoid unnecessary frontend/backend coupling.

## 7. Database Structure

```text
database/
├── migrations/
├── seeds/
└── README.md
```

* **Migrations:** Ordered, version-controlled schema changes.
* **Seeds:** Repeatable development or test data, without real customer information or production secrets.
* **README:** Database setup, migration commands, seed instructions, and recovery notes.

Use a single documented migration tool for schema changes. Do not rely on manually editing a production database or automatically synchronizing schemas at application startup.

## 8. Infrastructure and Automation

```text
infrastructure/
├── docker/
└── deployment/

scripts/
.github/
└── workflows/
```

* `infrastructure/docker/`: Custom Dockerfiles or supporting container configuration when needed.
* `infrastructure/deployment/`: Deployment and operational instructions.
* `scripts/`: Repeatable setup, validation, and maintenance commands.
* `.github/workflows/`: Automated checks such as linting, tests, and build verification.
* `compose.yaml`: Local development services and their connections.

Keep production secrets outside the repository. Use separate configuration for development, testing, and production.

## 9. Root Configuration Responsibilities

| File                | Responsibility                                                |
| ------------------- | ------------------------------------------------------------- |
| `package.json`      | Root scripts and workspace configuration                      |
| `package-lock.json` | Reproducible dependency installation                          |
| `.env.example`      | Required variable names and safe example values               |
| `.gitignore`        | Exclude secrets, dependencies, build outputs, and local files |
| `compose.yaml`      | Define local services and networking                          |
| `README.md`         | Project overview and initial setup instructions               |

If using npm workspaces, configure the root `package.json` to include the intended application and shared-package directories. Commit the lockfile and use consistent package-manager commands.

## 10. Documentation Organization

Keep the existing SDLC documentation under `docs/`:

* `requirements/` — approved and traceable requirements.
* `analysis/` — workflows, models, and analysis.
* `specification/` — system requirements and business rules.
* `architecture/` — architecture decisions and diagrams.
* `database/` — data models, tables, constraints, and financial rules.
* `api/` — endpoint definitions, API standards, and security.
* `ui-ux/` — screen inventory, wireframes, and design standards.
* `implementation/` — implementation plan, repository structure, coding standards, and development workflow.

Update documents when implementation decisions materially change the agreed design.

## 11. Repository Rules

1. Keep frontend, backend, and database responsibilities separate.
2. Use feature-oriented modules instead of one large controller or service.
3. Keep business rules in backend services and enforce data integrity in PostgreSQL where appropriate.
4. Use migrations for all schema changes.
5. Never commit `.env` files containing secrets, real credentials, or production data.
6. Add tests alongside implemented features.
7. Avoid circular dependencies and unnecessary abstractions.
8. Document important architecture or dependency changes.
9. Do not create microservices for the initial MVP.
10. Keep the structure simple enough for a solo developer to maintain.

## 12. Completion Criteria

The repository structure is ready to guide implementation when:

* The root layout and application responsibilities are understood.
* Frontend and backend boundaries are clear.
* Database migrations have a defined location.
* Existing SDLC documentation remains organized.
* Environment configuration and secrets handling are specified.
* Testing and automation locations are defined.
* The structure supports incremental vertical-slice delivery.

## 13. Next Document

Create `docs/implementation/coding-standards.md` to define JavaScript, React, Express, naming, error-handling, security, and code-quality conventions before implementation begins.

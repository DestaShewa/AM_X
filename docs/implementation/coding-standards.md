# AMX Coding Standards

**Project:** AMX — Arba Minch Experiences
**Document:** `docs/implementation/coding-standards.md`
**Version:** 1.0

## 1. Purpose

Define consistent coding practices for the AMX frontend, backend, database integration, testing, and security. These standards apply to manually written and AI-generated code.

## 2. General Principles

* Write readable, maintainable, and modular code.
* Prefer simple solutions over unnecessary abstractions.
* Use clear names that communicate intent.
* Keep functions focused on one responsibility.
* Avoid duplicated business logic.
* Validate inputs and handle errors explicitly.
* Never trust client-submitted prices, roles, permissions, or transaction statuses.
* Follow the approved architecture, requirements, and API specifications.
* Do not introduce new dependencies without a clear justification.

## 3. JavaScript Standards

Use modern JavaScript with ES modules and the project's configured Node.js version.

### Naming

| Element   | Convention                                   | Example              |
| --------- | -------------------------------------------- | -------------------- |
| Variables | `camelCase`                                  | `bookingStatus`      |
| Functions | `camelCase`                                  | `createQuotation()`  |
| Classes   | `PascalCase`                                 | `BookingService`     |
| Constants | `UPPER_SNAKE_CASE` for true constants        | `MAX_PAGE_SIZE`      |
| Files     | Consistent descriptive names                 | `booking.service.js` |
| Folders   | Lowercase, preferably plural for collections | `bookings/`          |

### Rules

* Use `const` by default and `let` when reassignment is required.
* Avoid `var`.
* Prefer `async/await` for asynchronous operations.
* Handle rejected promises and expected failures explicitly.
* Avoid deeply nested conditionals; use early returns when clearer.
* Use strict equality (`===` and `!==`).
* Avoid unexplained magic numbers and strings.
* Remove unused variables, dead code, and debugging statements.
* Do not suppress errors merely to make a workflow continue.

## 4. Frontend Standards

**Stack:** Next.js, React, JavaScript, and Tailwind CSS.

### React and Components

* Use functional React components and hooks.
* Name components in `PascalCase`.
* Keep components focused on presentation or a clearly defined UI responsibility.
* Extract reusable UI patterns when repetition justifies it.
* Keep API calls and complex workflow logic out of large presentation components.
* Use stable keys when rendering lists.
* Do not mutate React state directly.
* Avoid unnecessary effects and duplicated state.
* Use semantic HTML before creating custom interactive elements.
* Keep forms accessible with labels, validation feedback, and visible focus indicators.

### Next.js

* Follow the routing and rendering conventions supported by the installed Next.js version.
* Use server components by default where appropriate; add client components only when browser-side interactivity is needed.
* Keep secrets and privileged operations on the server.
* Never expose private environment variables through public client-side configuration.
* Do not treat middleware or hidden UI elements as substitutes for backend authorization.

### Styling

* Use Tailwind CSS and the approved AMX design system.
* Avoid inconsistent one-off colors, spacing, and typography.
* Prefer reusable components for common controls.
* Ensure layouts work on mobile, tablet, and desktop.
* Respect reduced-motion preferences and accessibility requirements.

## 5. Backend Standards

**Stack:** Node.js and Express.

### Module Responsibilities

* **Routes:** Define endpoints and attach appropriate middleware.
* **Controllers:** Handle HTTP concerns and return consistent responses.
* **Services:** Enforce business rules and coordinate operations.
* **Repositories:** Encapsulate database access where useful.
* **Validation:** Validate request data, parameters, and query filters.
* **Middleware:** Handle authentication, authorization, request processing, and error handling.

Keep modules focused. Do not place the entire application's business logic in route handlers or controllers.

### API Rules

* Use the `/api/v1/` base path.
* Use resource-oriented, lowercase, plural paths.
* Use `snake_case` for JSON field names.
* Return consistent response and error structures defined in `docs/api/request-response-specification.md`.
* Use appropriate HTTP methods and status codes.
* Validate request bodies, path parameters, and query parameters.
* Apply authentication and authorization before protected operations.
* Avoid exposing stack traces, database details, secrets, or internal implementation details to clients.
* Document endpoint changes in the OpenAPI specification.

## 6. Database Standards

**Database:** PostgreSQL.

* Use `snake_case` for table and column names.
* Use plural table names, such as `bookings` and `payment_transactions` if the approved schema adopts that name.
* Use UUID primary keys according to the database design.
* Store timestamps using `TIMESTAMPTZ`.
* Store monetary amounts using appropriate `NUMERIC` precision, not floating-point types.
* Use foreign keys, unique constraints, and check constraints where appropriate.
* Apply schema changes through version-controlled migrations.
* Use parameterized queries or safe ORM query methods.
* Use transactions for operations that must succeed or fail together.
* Avoid hard deletion of important operational and financial history.
* Do not access PostgreSQL directly from frontend code.

The approved database baseline and migration definitions take precedence over illustrative naming examples in this document.

## 7. Business Rules and Financial Logic

These rules are especially important for AMX.

* The backend is authoritative for prices, totals, permissions, booking status, and payment summaries.
* An inquiry must not be treated as a booking.
* Quotation acceptance must not automatically imply that all provider arrangements are confirmed.
* A quotation accepted by the customer must retain its agreed price, services, and terms.
* Prevent multiple bookings from being created from the same quotation.
* Only verified eligible payment transactions may affect payment summaries.
* Record refunds as separate transactions according to the approved financial design.
* Protect sensitive financial and booking changes with authorization, transactions, and audit records.
* Use decimal-safe monetary calculations and preserve currency information.
* Enforce allowed status transitions in backend services.

Do not implement unresolved business policies by guessing. Resolve them against the approved requirements and business decisions before implementing the affected feature.

## 8. Security Standards

* Store passwords using a suitable password-hashing algorithm such as Argon2id or bcrypt.
* Use secure, server-managed authentication sessions.
* Enforce role-based access control on the backend.
* Validate and normalize user input.
* Use parameterized database operations.
* Protect cookie-based authentication against CSRF where applicable.
* Configure HTTPS, CORS, cookie attributes, and security headers appropriately for deployment.
* Apply rate limiting to sensitive endpoints such as login and public inquiry submission.
* Keep secrets in environment configuration or a suitable secrets manager.
* Never log passwords, session tokens, or unnecessary sensitive customer information.
* Audit important administrative, permission, booking, and financial actions.
* Return generic authentication failures where detailed errors could reveal sensitive account information.

## 9. Error Handling and Logging

* Use centralized Express error-handling middleware.
* Return the standardized API error format.
* Distinguish validation failures, authentication errors, authorization failures, missing records, conflicts, and unexpected server errors.
* Do not return raw exception messages or stack traces in production responses.
* Log sufficient diagnostic context without exposing sensitive data.
* Use a request or correlation ID where supported.
* Ensure errors do not leave partial financial or booking updates.
* Provide understandable user-facing error messages and a clear recovery action where possible.

## 10. Testing and Code Quality

* Write unit tests for business logic and utility functions.
* Write integration tests for API endpoints and database behavior.
* Test authentication and permissions for protected operations.
* Test invalid input, missing records, duplicate operations, and invalid status transitions.
* Test financial calculations, refunds, and transaction boundaries.
* Test concurrent operations that could create duplicate bookings or incorrect financial results.
* Use realistic test fixtures without real customer information.
* Run linting, formatting, tests, and build checks before merging changes.
* Do not claim a test passed unless it was actually executed successfully.

Use the testing tools selected in the implementation environment and API testing strategy.

## 11. Git and Code Review

* Use descriptive branch names and commit messages.
* Keep changes small and related to one task.
* Avoid committing generated build files, local databases, secrets, or temporary debug output.
* Review AI-generated code for correctness, security, maintainability, and consistency.
* Update documentation when behavior, endpoints, schema, or setup instructions change.
* Do not merge code with unresolved critical defects or failing required checks.

## 12. AI-Assisted Development Rules

Before asking an AI coding agent to implement a task, provide:

1. The relevant requirement IDs.
2. The relevant architecture, API, database, and UI/UX documents.
3. The exact task scope.
4. Acceptance criteria.
5. Files or modules that may be changed.
6. Required tests and verification commands.

Require the agent to:

* Inspect existing code before editing.
* Avoid unrelated changes and unnecessary dependencies.
* Report files changed and decisions made.
* Identify assumptions or conflicts with the documentation.
* Run relevant checks and report their actual results.
* Never claim completion based solely on generated code.

A human review is required before accepting security-sensitive, financial, authentication, or database migration changes.

## 13. Definition of Done

A coding task is complete only when:

* The implementation matches its approved requirements.
* Code follows the relevant conventions.
* Validation and authorization are enforced where required.
* Errors are handled appropriately.
* Relevant tests pass.
* Linting and build checks pass where configured.
* Documentation is updated when necessary.
* No secrets or sensitive test data have been committed.
* Changes have been reviewed and are ready to merge.

## 14. Next Document

Create `docs/implementation/git-workflow.md` to define the branch strategy, commit conventions, pull-request process, and change-review rules for AMX.

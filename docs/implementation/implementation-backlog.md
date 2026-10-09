# AMX Implementation Backlog

**Project:** AMX — Arba Minch Experiences
**Document:** `docs/implementation/implementation-backlog.md`
**Version:** 1.0

## 1. Purpose

Organize implementation work into prioritized, manageable tasks that follow the approved requirements, architecture, database design, API specifications, and UI/UX design.

Every implementation task must reference the relevant requirement IDs, define acceptance criteria, and include appropriate testing.

## 2. Priority Levels

* **P0 — Foundation:** Required before dependent features can be built safely.
* **P1 — MVP Critical:** Essential for the first usable release.
* **P2 — MVP Supporting:** Important for reliable daily operations.
* **P3 — Future:** Excluded from the initial MVP unless formally approved.

## 3. Implementation Backlog

### Epic 1 — Repository and Development Foundation

**Priority: P0**

* [ ] Create the repository and configure the planned project structure.
* [ ] Configure npm workspaces and root scripts.
* [ ] Initialize the Next.js frontend and Express backend.
* [ ] Configure environment variables and `.env.example`.
* [ ] Configure PostgreSQL and Docker Compose for local development.
* [ ] Add linting, formatting, and test scripts.
* [ ] Establish Git branches, commits, and review workflow.
* [ ] Add a root README with setup and run instructions.

**Acceptance criteria:** Both applications can be started locally, environment secrets are excluded from Git, and setup instructions are reproducible.

### Epic 2 — Database and API Foundations

**Priority: P0**

* [ ] Reconcile database tables, relationships, constraints, and naming.
* [ ] Resolve critical financial and booking rules before implementation.
* [ ] Select and configure a database migration tool.
* [ ] Create and review the initial database migrations.
* [ ] Configure database access and transaction handling.
* [ ] Implement Express application setup and centralized error handling.
* [ ] Implement `/api/v1/` routing and health-check endpoint.
* [ ] Configure request validation and standardized API responses.
* [ ] Generate or maintain OpenAPI documentation.
* [ ] Add database and API integration-test foundations.

**Acceptance criteria:** The database can be initialized from migrations, the API starts reliably, and basic automated checks run successfully.

**Important:** Do not finalize payment/refund logic, booking snapshots, follow-up relationships, or other unresolved business rules by guessing. Resolve and document them first.

### Epic 3 — Authentication and Permissions

**Priority: P1**

* [ ] Implement staff login and logout.
* [ ] Implement secure server-managed sessions.
* [ ] Implement password hashing and account protection.
* [ ] Implement role-based access control.
* [ ] Create and manage staff accounts and roles.
* [ ] Protect administrative frontend routes and backend endpoints.
* [ ] Add authentication, authorization, and session tests.

**Acceptance criteria:** Unauthenticated users cannot access protected operations, and each staff role can perform only its authorized actions.

### Epic 4 — Public Website and Experience Packages

**Priority: P1**

* [ ] Build the responsive public layout and navigation.
* [ ] Implement the homepage and experience listing.
* [ ] Implement package detail pages.
* [ ] Display package prices, inclusions, exclusions, and relevant conditions.
* [ ] Implement provider profile pages using approved public information.
* [ ] Build About, How It Works, Contact, Terms, Cancellation, and Privacy pages.
* [ ] Add WhatsApp contact links.
* [ ] Implement loading, empty, error, and not-found states.
* [ ] Test responsive behavior and accessibility.

**Acceptance criteria:** Visitors can discover experiences, understand the offer, and find a clear way to contact AMX or submit an inquiry.

### Epic 5 — Customers and Inquiries

**Priority: P1**

* [ ] Build the custom-trip inquiry form.
* [ ] Validate traveler details, dates, group size, budget, interests, and contact information.
* [ ] Store inquiries and associate them with customer records.
* [ ] Prevent or handle duplicate submissions appropriately.
* [ ] Build the inquiry list, search, filters, and detail view.
* [ ] Implement inquiry status transitions.
* [ ] Add staff notes and follow-up scheduling.
* [ ] Audit important inquiry changes.
* [ ] Test the public submission-to-admin workflow.

**Acceptance criteria:** A visitor can submit an inquiry, authorized staff can review and update it, and the inquiry history is preserved.

### Epic 6 — Providers and Packages Administration

**Priority: P1**

* [ ] Implement provider creation and editing.
* [ ] Record provider contact details, services, prices, availability, and verification information.
* [ ] Implement provider verification and suspension controls.
* [ ] Implement package creation, editing, publication, and archiving.
* [ ] Associate relevant providers and services with packages.
* [ ] Restrict public information to approved fields.
* [ ] Test permissions and verification rules.

**Acceptance criteria:** Authorized staff can maintain packages and provider records, and unverified providers are not presented as verified.

### Epic 7 — Quotations

**Priority: P1**

* [ ] Create quotations from inquiries.
* [ ] Add services, providers, prices, inclusions, exclusions, and terms.
* [ ] Calculate totals on the backend.
* [ ] Support quotation revisions and expiry.
* [ ] Record quotation delivery and customer responses.
* [ ] Implement acceptance, decline, and change-request workflows.
* [ ] Preserve the exact accepted quotation details.
* [ ] Prevent duplicate booking creation from one quotation.
* [ ] Test concurrent acceptance and invalid transitions.

**Acceptance criteria:** Staff can prepare and revise quotations, and accepted prices, services, and terms remain traceable.

### Epic 8 — Bookings and Service Coordination

**Priority: P1**

* [ ] Create a booking through the approved quotation-acceptance workflow.
* [ ] Generate a unique booking number.
* [ ] Preserve agreed booking details and financial terms.
* [ ] Manage individual booking services and provider arrangements.
* [ ] Implement booking status transitions.
* [ ] Display booking details and operational history.
* [ ] Record cancellations according to the approved policy.
* [ ] Test transactional consistency and duplicate operations.

**Acceptance criteria:** An accepted quotation can produce at most one booking, and booking status accurately reflects the operational workflow.

### Epic 9 — Payment Records and Financial Tracking

**Priority: P1**

* [ ] Record customer payment submissions and payment methods.
* [ ] Allow authorized staff to verify or reject payment records.
* [ ] Record refunds as separate transactions under the approved policy.
* [ ] Calculate net paid and outstanding balances on the backend.
* [ ] Implement booking payment summaries.
* [ ] Restrict financial actions by role.
* [ ] Audit financial changes.
* [ ] Test partial payments, refunds, overpayments, duplicates, and concurrent updates.

**Acceptance criteria:** Only eligible verified transactions affect financial summaries, and financial history is traceable.

**Scope boundary:** The MVP records and manages payment information; it does not process online payments automatically.

### Epic 10 — Follow-ups, Reviews, and Complaints

**Priority: P2**

* [ ] Implement follow-up creation and status management.
* [ ] Link follow-ups to the approved target records.
* [ ] Display due and overdue follow-ups.
* [ ] Implement review submission and moderation.
* [ ] Implement complaint recording, investigation, and resolution.
* [ ] Enforce access and eligibility rules.
* [ ] Test status transitions and audit history.

**Acceptance criteria:** Staff can track outstanding actions, manage feedback, and resolve complaints with appropriate access controls.

### Epic 11 — Reports, Audit, and Operational Visibility

**Priority: P2**

* [ ] Build an operational dashboard.
* [ ] Report inquiries, quotations, bookings, and completed trips.
* [ ] Report revenue and payment balances using approved financial definitions.
* [ ] Implement date filters and relevant search filters.
* [ ] Implement audit-log viewing for authorized staff.
* [ ] Add application logging and request IDs.
* [ ] Verify that reports match source records.

**Acceptance criteria:** Authorized staff can review core operational and financial performance without exposing restricted information.

### Epic 12 — Integration, Security, and Release Readiness

**Priority: P1**

* [ ] Run end-to-end tests for the inquiry-to-trip workflow.
* [ ] Test all role permissions and sensitive actions.
* [ ] Test invalid inputs, duplicate requests, and error handling.
* [ ] Review accessibility and mobile layouts.
* [ ] Configure production environment variables and secrets.
* [ ] Configure database backup and recovery procedures.
* [ ] Configure HTTPS, security headers, and rate limits.
* [ ] Document deployment, recovery, and incident-response procedures.
* [ ] Conduct acceptance testing against the requirements.
* [ ] Fix release-blocking defects before launch.

**Acceptance criteria:** Critical workflows pass their required tests, access controls work, backups and recovery are documented and verified, and release approval is recorded.

## 4. Future Scope — Not in MVP

**Priority: P3**

* Native mobile applications.
* Customer and provider self-service accounts.
* Automated provider availability integrations.
* Online payment gateway integration.
* Live vehicle tracking.
* AI chatbot or automated trip planner.
* Automatic commission splitting.
* Multi-city marketplace expansion.

Add any future feature to the backlog only after its value, requirements, costs, and impact on the current release are reviewed.

## 5. Task Management Rules

Each task must include:

* Unique task ID and title.
* Epic and priority.
* Related requirement IDs from the SRS.
* Links to relevant architecture, database, API, and UI/UX documents.
* Clear scope and acceptance criteria.
* Dependencies and unresolved decisions.
* Required tests and verification evidence.
* Status: `Backlog`, `Ready`, `In Progress`, `In Review`, `Blocked`, or `Done`.

A task may be marked **Ready** only when its requirements and dependencies are sufficiently clear. A task may be marked **Done** only when its acceptance criteria are met, relevant checks have actually passed, and documentation is updated where needed.

## 6. Implementation Order

Follow this dependency order:

1. Repository and development foundation.
2. Database and API foundations.
3. Authentication and permissions.
4. Public packages and inquiry submission.
5. Customer and inquiry operations.
6. Provider and package administration.
7. Quotations.
8. Bookings and service coordination.
9. Payment records and financial tracking.
10. Follow-ups, reviews, and complaints.
11. Reports and audit visibility.
12. Integration testing, security hardening, and release preparation.

The backlog is a planning document, not evidence that tasks have been implemented or tested. Update task status only when supported by actual work and verification.

## 7. Next Document

Create `docs/implementation/vertical-slice-plan.md` to define how each prioritized feature will be delivered end to end, from database and API through user interface, authorization, and tests.

# AMX Implementation Plan

**Project:** AMX — Arba Minch Experiences
**Document:** `docs/implementation/implementation-plan.md`
**Version:** 1.0

## 1. Purpose

Define the implementation strategy for converting the approved AMX requirements, architecture, database/API design, and UI/UX baseline into a working, maintainable MVP.

## 2. Implementation Objectives

* Build a responsive public website for discovering experiences and submitting trip inquiries.
* Build a secure administrative dashboard for managing operations.
* Implement the approved business workflows and data rules.
* Maintain data integrity, privacy, security, and auditability.
* Deliver features incrementally with verifiable results.
* Prepare the application for formal testing, deployment, and pilot operation.

## 3. Scope

### Included in the MVP

1. Repository and development environment setup.
2. Public website and experience packages.
3. Trip inquiry submission and management.
4. Customer and provider management.
5. Package management.
6. Staff authentication and role-based authorization.
7. Quotations and quotation revisions.
8. Booking and booking-service management.
9. Payment transaction recording and verification.
10. Follow-ups, reviews, and complaints.
11. Reports and audit logs.
12. Error handling, logging, database migrations, and backup preparation.

### Excluded from the MVP

* Online payment processing.
* Customer and provider self-service accounts.
* Native mobile applications.
* AI chatbot and AI-based recommendations.
* Live vehicle tracking.
* Automated provider availability integrations.
* Multi-city marketplace functionality.
* Automatic commission splitting.

## 4. Technology Stack

| Layer                       | Technology                       |
| --------------------------- | -------------------------------- |
| Public website and admin UI | Next.js, React, JavaScript       |
| Styling                     | Tailwind CSS                     |
| Backend                     | Node.js, Express                 |
| API                         | REST, `/api/v1/`, JSON           |
| Database                    | PostgreSQL                       |
| Database changes            | Version-controlled migrations    |
| Containers                  | Docker                           |
| Version control             | Git and GitHub                   |
| API documentation           | OpenAPI                          |
| Automated tests             | Unit, integration, and API tests |
| Deployment target           | Linux-based cloud server or VPS  |

Use the versions selected during repository setup and record them in project configuration. Do not introduce additional frameworks or infrastructure without a clear need.

## 5. Implementation Principles

* **Documentation first:** Follow the approved requirements and design documents.
* **Vertical slices:** Build complete, testable features across UI, API, and database.
* **Backend authority:** Enforce business rules, calculations, and permissions on the server.
* **Data integrity:** Use database constraints and transactions where appropriate.
* **Security by design:** Validate inputs, protect sessions, restrict access, and avoid exposing secrets.
* **Small changes:** Implement one clearly defined task at a time.
* **Evidence-based completion:** Mark work complete only after its acceptance criteria and checks pass.
* **AI-assisted development:** Review AI-generated code, understand it, and run the relevant checks before accepting it.

## 6. Implementation Sequence

### Step 1 — Repository and Environment

* Create the agreed repository structure.
* Configure Git, `.gitignore`, and environment-variable templates.
* Initialize the Next.js frontend and Express backend.
* Configure PostgreSQL and Docker.
* Add health checks and basic development documentation.
* Verify that the application starts locally.

**Deliverable:** A reproducible development environment with a working frontend, backend, and database connection.

### Step 2 — Engineering Foundations

* Establish coding and Git standards.
* Configure centralized API error handling and request validation.
* Implement database migration conventions.
* Add structured application logging.
* Configure authentication and server-side role authorization.
* Establish automated test commands.

**Deliverable:** Secure and testable application foundations.

### Step 3 — Public Experience and Inquiry

* Build the public layout and navigation.
* Display active experience packages.
* Implement package details.
* Build the custom-trip inquiry form.
* Validate and store inquiries in PostgreSQL.
* Display submission confirmation and useful error messages.

**Deliverable:** A visitor can browse experiences and submit an inquiry that authorized staff can retrieve.

### Step 4 — Core Operational Management

Implement the following modules in a controlled sequence:

1. Users, roles, and permissions.
2. Customers and inquiries.
3. Providers and packages.
4. Quotations and quotation revisions.
5. Bookings and booking services.
6. Payment transaction recording and verification.
7. Follow-ups.
8. Reviews and complaints.
9. Reports and audit logs.

For each module, implement the database changes, API, interface, validation, permissions, error states, and relevant tests before considering the module complete.

### Step 5 — Integration and Hardening

* Verify workflows across modules.
* Check transaction handling and duplicate-operation protection.
* Confirm quotation and booking data integrity.
* Verify payment summaries use only eligible verified transactions.
* Review sensitive-action permissions and audit records.
* Check responsive layouts and accessibility.
* Verify configuration, logging, backups, and recovery procedures.

**Deliverable:** An integrated MVP ready for formal Phase 9 testing and QA.

## 7. Vertical-Slice Acceptance Criteria

Each vertical slice must include:

* Clear reference to the relevant requirement IDs.
* Database changes and migrations where needed.
* API endpoints and request/response validation.
* UI states for loading, success, empty results, and errors as applicable.
* Server-side authorization for protected operations.
* Business-rule enforcement and data-integrity controls.
* Relevant automated tests.
* Updated API and technical documentation.
* Successful local verification.

## 8. Security and Data Protection

* Store secrets outside source control.
* Use secure password hashing and protected staff sessions.
* Apply least-privilege database access and role permissions.
* Validate and authorize every protected server operation.
* Use parameterized database queries through a suitable database library or ORM.
* Keep the database inaccessible to the public internet.
* Audit important financial, booking, permission, and record changes.
* Avoid logging passwords, session tokens, or unnecessary personal information.
* Establish backup and restoration procedures before production use.

## 9. Implementation Deliverables

The phase should produce:

* Version-controlled application source code.
* Documented frontend and backend structure.
* Database migrations and schema implementation.
* Implemented REST API and OpenAPI documentation.
* Responsive public website and admin dashboard.
* Authentication and role-based authorization.
* Automated tests for implemented features.
* Development setup instructions and environment template.
* Implementation backlog with task status and evidence.
* Updated technical documentation and known-issues record.

## 10. Completion Criteria

Phase 8 is complete when:

* All approved MVP features have been implemented.
* Core workflows operate across the frontend, backend, and database.
* Database migrations can be applied reproducibly.
* Authentication and authorization are enforced server-side.
* Critical business rules and financial calculations are implemented.
* Required implementation-level checks pass and results are recorded.
* No known critical implementation blocker remains unresolved.
* Documentation reflects the actual implementation.
* The application is ready to enter **Phase 9 — Testing & QA**.

Completion of implementation does not mean the application is production-ready; formal testing, security verification, deployment preparation, and pilot acceptance remain separate activities.

## 11. Next Document

Create `docs/implementation/repository-structure.md` to define the exact project directory layout before initializing the application code.

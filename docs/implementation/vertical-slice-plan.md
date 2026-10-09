# AMX Vertical Slice Plan

**Project:** AMX — Arba Minch Experiences
**File:** `docs/implementation/vertical-slice-plan.md`
**Version:** 1.0
**Phase:** 8 — Implementation Planning

## 1. Purpose

This document defines how AMX features will be implemented, tested, and integrated as complete vertical slices.

A **vertical slice** delivers one usable business capability across all required layers:

**User interface → API → business logic → database → authorization → tests → documentation**

AMX will not be developed by completing the entire frontend first, then the backend, and finally the database. Instead, each slice will deliver a small, complete, verifiable capability that integrates with the existing system.

This plan follows the requirements, analysis, architecture, database, API, UI/UX, and implementation documents already established for AMX.

## 2. Core Implementation Principles

1. **Requirements before code:** Every slice must trace to approved requirements and relevant design documents.
2. **Small, complete deliveries:** Each slice must deliver a working capability, not disconnected code.
3. **Database integrity:** Use migrations, constraints, transactions, and approved data relationships.
4. **Backend authority:** Business rules, totals, permissions, and status transitions must be enforced by the backend.
5. **Security by default:** Protect staff operations, validate inputs, and avoid exposing sensitive information.
6. **Test before integration:** Add appropriate tests with each slice instead of postponing all testing.
7. **Preserve history:** Do not silently overwrite accepted quotations, verified financial transactions, or important operational changes.
8. **No invented business policies:** Resolve critical decisions before implementing behavior that depends on them.
9. **Incremental delivery:** Integrate and verify each slice before starting dependent work.
10. **AI-assisted development with human review:** AI may help implement tasks, but generated changes must be reviewed and tested before acceptance.

## 3. Standard Vertical-Slice Structure

Every slice follows the same delivery process.

<text color="secondary" size="sm">Implementation workflow</text>

<box border radius="lg" padding={3} gap={2} align="center">
  <box background="surface-secondary" radius="md" padding={3} width="100%" align="center">
    **1. Define the capability**

```
<text textAlign="center" size="sm">Business outcome, requirement IDs, scope, and acceptance criteria</text>
```

  </box>
  <icon name="arrow-down" color="secondary" size="lg" />
  <box background="surface" border radius="md" padding={3} width="100%" align="center">
    **2. Confirm the design**

```
<text textAlign="center" size="sm">Data model, API contract, UI states, permissions, and dependencies</text>
```

  </box>
  <icon name="arrow-down" color="secondary" size="lg" />
  <box background="surface" border radius="md" padding={3} width="100%" align="center">
    **3. Implement the complete slice**

```
<text textAlign="center" size="sm">Migration → backend → frontend → validation → error handling</text>
```

  </box>
  <icon name="arrow-down" color="secondary" size="lg" />
  <box background="surface" border radius="md" padding={3} width="100%" align="center">
    **4. Verify the slice**

```
<text textAlign="center" size="sm">Automated tests, security checks, UI review, and workflow verification</text>
```

  </box>
  <icon name="arrow-down" color="secondary" size="lg" />
  <box background="surface" border radius="md" padding={3} width="100%" align="center">
    **5. Integrate and accept**

```
<text textAlign="center" size="sm">Review changes, update documentation, merge, and record evidence</text>
```

  </box>
</box>

A slice must not be marked complete merely because its page renders or its API returns a response. The entire intended capability must work and satisfy its acceptance criteria.

## 4. Prerequisites Before Feature Implementation

Complete or confirm these foundations before building dependent features.

| ID    | Foundation                       | Required outcome                                                                                 |
| ----- | -------------------------------- | ------------------------------------------------------------------------------------------------ |
| VS-00 | Requirements and design baseline | Relevant requirements and design decisions are sufficiently clear for implementation.            |
| VS-01 | Repository foundation            | Frontend, backend, scripts, Git workflow, and environment configuration are established.         |
| VS-02 | Database foundation              | PostgreSQL connection, migration process, transaction handling, and initial schema are verified. |
| VS-03 | API foundation                   | Express setup, `/api/v1/`, validation, standardized errors, and health endpoint work.            |
| VS-04 | Testing foundation               | Unit and integration tests can run consistently.                                                 |
| VS-05 | Security foundation              | Session approach, authorization design, secret handling, and security controls are established.  |

**Important:** The database, API, and UI/UX documents contain decisions that still require reconciliation or approval. Before the relevant feature is implemented, resolve the affected decisions, update the authoritative document, and record the decision. Do not assume a proposed design is already approved.

---

## 5. Planned Vertical Slices

The slices below are ordered by dependencies. They form the recommended implementation sequence, not evidence of completed work.

### Slice 1 — Application Health and Database Connectivity

**ID:** `VS-001`
**Priority:** P0

**Goal:** Establish a verifiable connection between the backend and database.

**Includes**

* Express application and server startup.
* Configuration validation.
* `GET /api/v1/health` endpoint.
* PostgreSQL connectivity check.
* Centralized error handling and request logging.
* Initial automated tests.

**Acceptance criteria**

* The API starts using documented local configuration.
* The health endpoint reports application status.
* Database health is reported accurately without exposing credentials or internal secrets.
* Missing required configuration produces a clear startup failure.
* Automated tests verify healthy and unhealthy conditions.

**Dependencies:** VS-01 through VS-04.

### Slice 2 — Staff Authentication

**ID:** `VS-002`
**Priority:** P1

**Goal:** Allow authorized staff to sign in securely.

**Includes**

* Login and logout endpoints.
* Password hashing and verification.
* Server-managed sessions.
* Login page and authentication states.
* Session retrieval endpoint.
* Authentication failure handling.
* Session expiration and logout behavior.
* Tests for authentication and session security.

**Acceptance criteria**

* Valid staff credentials allow sign-in.
* Invalid credentials do not reveal whether a specific account exists.
* Session cookies use appropriate security settings for the environment.
* Logout invalidates the session.
* Passwords and session secrets are never returned to the client or written to logs.

**Dependencies:** VS-01, VS-03, VS-05.

### Slice 3 — Roles and Permissions

**ID:** `VS-003`
**Priority:** P1

**Goal:** Restrict staff operations according to approved permissions.

**Includes**

* Role and permission definitions.
* Authorization middleware.
* Staff account management foundations.
* Protected admin routes.
* Unauthorized and forbidden responses.
* Tests for allowed and denied actions.

**Acceptance criteria**

* Unauthenticated requests to protected endpoints are rejected.
* Authenticated staff without the required permission receive a forbidden response.
* Permissions are checked on the backend, not just hidden in the UI.
* Sensitive actions require explicit permissions.
* Role changes take effect according to the approved session policy.

**Dependencies:** VS-002.

**Required decision:** Finalize the role matrix for Admin, Operations Staff, Finance Staff, and any optional Auditor role.

### Slice 4 — Public Package Listing

**ID:** `VS-004`
**Priority:** P1

**Goal:** Allow visitors to discover active AMX experiences.

**Includes**

* Public package API.
* Package listing page and reusable experience card.
* Package detail page.
* Public data filtering.
* Responsive layout and loading, empty, error, and not-found states.
* Basic metadata and accessibility checks.

**Acceptance criteria**

* Visitors can browse active packages without signing in.
* Inactive, archived, or draft packages are not publicly listed.
* Package details show only approved public information.
* Invalid package identifiers produce an appropriate not-found response.
* Layouts work on supported mobile and desktop sizes.

**Dependencies:** VS-01, VS-02, VS-03, VS-04.

### Slice 5 — Provider and Package Administration

**ID:** `VS-005`
**Priority:** P1

**Goal:** Allow authorized staff to maintain experiences and their provider information.

**Includes**

* Provider creation and editing.
* Provider verification status management.
* Package creation, editing, activation, deactivation, and archiving.
* Provider-to-package relationships where required.
* Server-side validation and permissions.
* Audit records for important changes.

**Acceptance criteria**

* Authorized staff can manage provider and package records.
* Invalid or incomplete records are rejected.
* Only verified providers are represented as verified.
* Public package data is separated from private provider information.
* Sensitive changes are auditable.

**Dependencies:** VS-003, VS-004.

### Slice 6 — Public Trip Inquiry Submission

**ID:** `VS-006`
**Priority:** P1

**Goal:** Allow visitors to request a custom experience.

**Includes**

* Custom-trip form.
* Inquiry API and database persistence.
* Validation for contact information, travel dates, traveler count, budget, interests, and required fields.
* Submission confirmation.
* Duplicate-submission protection.
* Appropriate spam and abuse controls.

**Acceptance criteria**

* A valid inquiry is stored and receives a unique identifier.
* Invalid submissions receive understandable field-level errors.
* Repeated requests do not silently create unintended duplicate inquiries.
* The public response does not expose internal records or staff notes.
* Successful submission provides a clear confirmation.

**Dependencies:** VS-01 through VS-04.

### Slice 7 — Customer and Inquiry Management

**ID:** `VS-007`
**Priority:** P1

**Goal:** Let staff manage inquiries and customer records.

**Includes**

* Inquiry list, search, filtering, and detail views.
* Customer records and inquiry association.
* Contacted and provider-checking workflow.
* Internal notes and inquiry history.
* Approved inquiry status transitions.
* Audit records for important changes.

**Acceptance criteria**

* Authorized staff can locate and review inquiries.
* Inquiry and customer relationships remain consistent.
* Invalid status transitions are rejected.
* Internal notes are never returned through public endpoints.
* Important changes retain a traceable history.

**Dependencies:** VS-003, VS-006.

### Slice 8 — Follow-up Management

**ID:** `VS-008`
**Priority:** P2

**Goal:** Help staff track pending customer and booking actions.

**Includes**

* Create, view, update, and complete follow-ups.
* Due dates and responsible staff.
* Pending, in-progress, completed, and cancelled states.
* Links to the approved target records.
* Due and overdue filtering.

**Acceptance criteria**

* Staff can create and track follow-ups.
* Invalid or missing target relationships are rejected.
* Only authorized staff can view or modify follow-ups.
* Follow-up status and ownership are preserved accurately.

**Dependencies:** VS-007.

**Required decision:** Confirm the database relationship strategy for linking a follow-up to one or more supported record types.

### Slice 9 — Quotation Creation and Revisions

**ID:** `VS-009`
**Priority:** P1

**Goal:** Let staff prepare clear, traceable quotations for customer inquiries.

**Includes**

* Quotation creation and editing.
* Quotation service items.
* Price, inclusions, exclusions, and cancellation terms.
* Backend-calculated totals.
* Revision numbering and expiry.
* Quotation preview and delivery workflow.
* Quotation history.

**Acceptance criteria**

* A quotation is linked to the appropriate inquiry.
* Totals are calculated on the backend.
* Revisions are distinguishable and historical versions remain traceable.
* Expired or invalid quotations cannot be accepted.
* Only authorized staff can create or change quotations.

**Dependencies:** VS-007, VS-008.

### Slice 10 — Quotation Response and Booking Creation

**ID:** `VS-010`
**Priority:** P1

**Goal:** Convert a valid accepted quotation into a booking without losing the agreed terms.

**Includes**

* Quotation acceptance, decline, and change-request handling.
* Customer response recording through the approved process.
* Transactional booking creation.
* Booking number generation.
* Accepted quotation and service snapshots.
* Duplicate-operation and concurrency protection.

**Acceptance criteria**

* Only an eligible quotation can be accepted.
* Acceptance creates at most one booking for the quotation.
* Accepted prices, services, and terms are preserved.
* Repeated or concurrent acceptance requests cannot create duplicate bookings.
* The quotation and booking records remain consistent if an operation fails.

**Dependencies:** VS-009.

**Required decisions:** Confirm how customers accept quotations, quotation expiry behavior, and which fields must be preserved in booking snapshots.

### Slice 11 — Booking and Service Coordination

**ID:** `VS-011`
**Priority:** P1

**Goal:** Help staff coordinate the confirmed services needed for each trip.

**Includes**

* Booking list, search, and detail view.
* Booking status transitions.
* Booking service records.
* Provider assignments and confirmation tracking.
* Trip dates, traveler count, and operational notes.
* Cancellation workflow under the approved policy.

**Acceptance criteria**

* Staff can view and update bookings within their permissions.
* Service confirmation is tracked separately from quotation acceptance.
* Booking status changes follow defined business rules.
* A booking is not falsely represented as fully confirmed before required arrangements are satisfied.
* Important changes are auditable.

**Dependencies:** VS-010, VS-005.

### Slice 12 — Payment Recording and Verification

**ID:** `VS-012`
**Priority:** P1

**Goal:** Record payments and calculate accurate booking balances.

**Includes**

* Payment transaction recording.
* Payment method and reference information.
* Submission, verification, rejection, and other approved transaction states.
* Refund records linked to original payments where applicable.
* Booking payment summaries.
* Finance permissions and audit history.

**Acceptance criteria**

* Only verified transactions affect financial summaries.
* Refunds are recorded separately from the original payments.
* Net paid and outstanding balance follow the approved financial rules.
* Unauthorized staff cannot verify or alter restricted financial records.
* Duplicate and concurrent financial operations are handled safely.
* The system does not claim to process online payments automatically.

**Dependencies:** VS-010, VS-011.

**Required decisions:** Approve deposit requirements, refund rules, adjustment permissions, overpayment handling, and the authoritative booking amount due before finalizing this slice.

### Slice 13 — Trip Completion and Customer Feedback

**ID:** `VS-013`
**Priority:** P2

**Goal:** Record completed experiences and manage post-trip feedback.

**Includes**

* Trip progress and completion.
* Review submission and moderation.
* Complaint recording and resolution.
* Feedback history.
* Access and eligibility rules.

**Acceptance criteria**

* Authorized staff can record trip completion.
* Reviews follow the approved eligibility and moderation policy.
* Complaints can be tracked through resolution.
* Private customer information is not unnecessarily exposed.
* Feedback and complaint changes are auditable.

**Dependencies:** VS-011.

**Required decision:** Approve who can submit reviews, how eligibility is verified, and whether duplicate reviews are allowed.

### Slice 14 — Operational and Financial Reports

**ID:** `VS-014`
**Priority:** P2

**Goal:** Give staff a reliable view of AMX operations.

**Includes**

* Dashboard summary.
* Inquiry and quotation counts.
* Booking and completed-trip counts.
* Date-based filters.
* Revenue and payment balance summaries.
* Access-controlled audit-log views.

**Acceptance criteria**

* Report calculations use documented definitions.
* Financial totals reconcile with verified transaction records.
* Filters work consistently.
* Users see only the reports permitted by their roles.
* Reports do not expose passwords, session tokens, or unnecessary private information.

**Dependencies:** VS-007, VS-009, VS-011, VS-012.

### Slice 15 — Production Readiness

**ID:** `VS-015`
**Priority:** P1

**Goal:** Prepare the integrated MVP for controlled pilot use.

**Includes**

* End-to-end workflow tests.
* Security and permission tests.
* Error handling and operational logging.
* HTTPS and production configuration.
* Database backup and recovery verification.
* Deployment instructions and rollback procedure.
* Accessibility and responsive review.
* Defect correction and release checklist.

**Acceptance criteria**

* Critical user journeys pass their required tests.
* No known release-blocking security or data-integrity defects remain.
* Deployment and recovery procedures are documented and tested.
* Production secrets are managed securely.
* Pilot readiness is reviewed and explicitly approved.

**Dependencies:** All MVP-critical slices.

---

## 6. Cross-Slice Quality Requirements

These requirements apply to every relevant slice, not only the final release.

### Security

* Validate input on the server.
* Enforce authentication and authorization on protected operations.
* Use parameterized database access.
* Protect sessions, secrets, and private customer information.
* Apply rate limits and abuse protection to exposed public endpoints.
* Audit sensitive operational and financial actions.

### Data integrity

* Use version-controlled database migrations.
* Use database constraints for enforceable data rules.
* Use transactions for operations that must succeed or fail together.
* Avoid destructive deletion of historical business records.
* Preserve quotation and financial history.
* Define safe behavior for retries and concurrent requests.

### User experience

* Follow the established design system.
* Support mobile, tablet, and desktop layouts.
* Provide loading, empty, success, validation-error, and failure states.
* Use accessible labels, keyboard navigation, and clear error messages.
* Avoid presenting an unverified status as confirmed.

### Testing

* **Unit tests:** Business rules and individual functions.
* **Integration tests:** API, database, transactions, and permissions.
* **Workflow tests:** Multi-step business processes.
* **UI tests:** Forms, navigation, state changes, and error states.
* **Security tests:** Unauthorized access, invalid input, and sensitive actions.
* **Regression tests:** Previously working capabilities after changes.

Select the tests relevant to each slice. Not every slice needs every category, but every acceptance criterion must have a verification method.

## 7. Definition of Done

A vertical slice is complete only when all applicable items below are satisfied.

* [ ] The business purpose and scope are documented.
* [ ] Relevant SRS requirement IDs are linked.
* [ ] Required design decisions have been resolved.
* [ ] Database migrations and constraints are implemented where needed.
* [ ] Backend business logic and validation are implemented.
* [ ] Authorization and security controls are implemented.
* [ ] The required frontend workflow is integrated.
* [ ] Success, validation, empty, and error states are handled.
* [ ] Automated tests have been run and passed.
* [ ] Relevant integration and regression checks have passed.
* [ ] Code changes have been reviewed.
* [ ] Documentation is updated.
* [ ] No known release-blocking defect remains in the slice.
* [ ] Completion evidence is recorded.

Do not mark an unchecked item as complete without evidence.

## 8. Dependency and Change Management

Before starting a slice:

1. Confirm that its prerequisites are complete.
2. Review the relevant SRS, database, API, and UI/UX documents.
3. Identify unresolved rules and dependencies.
4. Break the slice into small tasks in `implementation-backlog.md`.
5. Define acceptance criteria and tests before implementation.

If a design change becomes necessary:

1. Describe the problem and reason for the change.
2. Identify affected requirements, diagrams, database tables, API contracts, and screens.
3. Update the authoritative documents.
4. Review migration and compatibility implications.
5. Obtain the required approval before implementing material business-rule changes.
6. Update tests and traceability.

## 9. Requirement Traceability

Maintain a traceability record for every slice using this format:

| Field               | Description                                              |
| ------------------- | -------------------------------------------------------- |
| Slice ID            | For example, `VS-006`                                    |
| Business objective  | The problem the slice solves                             |
| SRS requirement IDs | Exact related functional and non-functional requirements |
| Database references | Relevant tables, constraints, and migrations             |
| API references      | Relevant endpoints and contracts                         |
| UI/UX references    | Relevant screens, flows, and design rules                |
| Acceptance criteria | Verifiable expected outcomes                             |
| Test references     | Test cases and execution results                         |
| Evidence            | Review record, test results, or acceptance record        |

Use the actual requirement IDs from `docs/specification/srs.md` and related specifications. Do not invent requirement mappings or mark traceability complete based only on similar wording.

## 10. Recommended First Implementation Sequence

Start with a narrow, end-to-end path:

1. **VS-001:** Verify application health and database connectivity.
2. **VS-002:** Implement staff authentication.
3. **VS-003:** Enforce staff permissions.
4. **VS-004:** Display active packages.
5. **VS-005:** Allow staff to manage packages and providers.
6. **VS-006:** Accept public trip inquiries.
7. **VS-007:** Let staff manage submitted inquiries.
8. Continue with quotations, bookings, financial records, and remaining slices in dependency order.

This sequence establishes the technical foundation and delivers visible business value early without bypassing security or data integrity.

## 11. Completion of This Planning Document

This plan defines the intended vertical-slice strategy. It does not mean the slices have been implemented, tested, or approved for release.

Before implementation of each slice, confirm its dependencies, resolve relevant outstanding decisions, and break it into actionable backlog tasks.

## 12. Next Document

Create `docs/implementation/ai-development-workflow.md` to define how AI coding agents will work safely within the AMX repository, follow the project documentation, implement one task at a time, and verify changes without independently changing approved architecture or business rules.

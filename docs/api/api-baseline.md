# API Design Baseline

**File:** `docs/api/api-baseline.md`
**Project:** AMX — Arba Minch Experiences
**Phase:** 6 — Database & API Design
**Status:** Proposed — Pending Approval
**Version:** 0.1

## 1. Purpose

Establish the proposed baseline for AMX REST API design before implementation. All API documents must be reviewed for completeness, consistency, security, and business-rule alignment.

## 2. Baseline Documents

The API design baseline includes:

1. `api-design-plan.md`
2. `api-standards.md`
3. `endpoint-catalog.md`
4. `authentication-authorization.md`
5. `request-response-specification.md`
6. `validation-error-handling.md`
7. `business-workflow-specification.md`
8. `api-security.md`
9. `api-testing-strategy.md`
10. `api-validation.md`

## 3. Proposed Technical Standards

* **Architecture:** Modular monolith
* **Backend:** Node.js + Express
* **API style:** REST, JSON
* **Base path:** `/api/v1/`
* **Database:** PostgreSQL
* **Authentication:** Secure server-managed sessions
* **Authorization:** Role-based access control (RBAC)
* **Documentation:** OpenAPI
* **Deployment:** HTTPS on a cloud/VPS environment

## 4. Scope

The API supports authentication, users and roles, customers, providers, packages, inquiries, quotations, bookings, booking services, payment records, follow-ups, reviews, complaints, reports, and audit logs.

Online payment processing, customer/provider accounts, native mobile APIs, AI chatbot, and automated external availability integrations are outside the initial MVP scope.

## 5. Outstanding Decisions

The baseline must not be approved until the following are resolved:

* Payment transaction statuses versus booking-level payment summaries.
* Quotation acceptance method and secure customer confirmation.
* Booking confirmation and cancellation rules.
* Deposit, refund, and financial adjustment policies.
* Final role-permission matrix and sensitive-action authorization.
* Follow-up relationships and review eligibility.
* Quotation and booking data snapshots.
* Duplicate request prevention and concurrent updates.
* Public provider information and privacy requirements.
* API field validation, rate limits, and operational security requirements.

## 6. Approval Criteria

Approval requires:

* [ ] All API documents reviewed and internally consistent.
* [ ] `api-validation.md` completed with issues resolved or formally accepted.
* [ ] Database and API data models aligned.
* [ ] Business workflows and permissions confirmed.
* [ ] Security, error handling, and duplicate-operation behavior defined.
* [ ] Stakeholders approve unresolved business policies.
* [ ] Final version and approval date recorded.

## 7. Change Control

After approval, changes to endpoints, data contracts, permissions, or business workflows must be documented, reviewed for impact on the database and frontend, tested, and reflected in the relevant API documents.

## 8. Baseline Decision

**Current decision:** Proposed; not approved for implementation.

**Next action:** Resolve the outstanding decisions, complete API validation, and obtain approval before starting API implementation.

**Approved by:** Pending
**Approval date:** Pending
**Version after approval:** 1.0

# AMX API Design Baseline

**Document ID:** AMX-API-BASE-011
**Version:** 1.1
**Status:** Proposed — Pending Validation and Approval
**Project:** AMX — Arba Minch Experiences
**Location:** `docs/api/api-baseline.md`

## 1. Purpose

This document establishes the proposed API design baseline for AMX. It defines the API standards, scope, security expectations, dependencies, and approval conditions before implementation begins.

## 2. API Scope

The API supports the AMX MVP:

* Public packages and provider profiles
* Customer and inquiry management
* Provider and package administration
* Quotations and quotation services
* Bookings and booking services
* Payment transaction records
* Follow-ups
* Reviews and complaints
* Staff users and roles
* Reports and audit records

The MVP excludes online payment processing, customer/provider accounts, provider self-service dashboards, automated availability integrations, AI chatbots, and multi-city marketplace functionality.

## 3. Baseline Documents

The following documents form the proposed API design baseline under `docs/api/`:

1. `api-design-plan.md`
2. `api-standards.md`
3. `endpoint-catalog.md`
4. `authentication-authorization.md`
5. `request-response-specification.md`
6. `validation-error-handling.md`
7. `business-workflow-specification.md`
8. `api-security.md`
9. `api-testing-strategy.md`
10. `api-validation.md`

These documents must remain consistent with the approved requirements and architecture, plus the proposed database design.

## 4. Technical Standards

* **Backend:** Node.js and Express
* **API style:** REST
* **Base path:** `/api/v1/`
* **Data format:** JSON
* **Transport:** HTTPS in deployed environments
* **Database:** PostgreSQL
* **Authentication:** Secure server-managed staff sessions
* **Authorization:** Backend-enforced role-based access control
* **API documentation:** OpenAPI
* **Testing:** Unit, integration, contract, workflow, and security tests

Use consistent resource naming, response formats, validation, pagination, error codes, and date/time formats.

## 5. Security and Business Rules

The API must ensure that:

* Public users cannot access staff-only operations.
* Every protected action checks permissions on the backend.
* Request data cannot override trusted identity, role, quotation totals, or payment verification.
* Quotation acceptance and booking creation are handled transactionally.
* A quotation cannot create duplicate bookings.
* Accepted prices, services, and terms are preserved in booking records.
* Payment transactions remain separate from booking payment summaries.
* Only verified financial transactions affect payment summaries.
* Refunds and adjustments have appropriate authorization and audit controls.
* Sensitive operations are logged without exposing credentials or secrets.
* Critical operations are protected against duplicate requests and concurrency errors.

## 6. Validation Status

`api-validation.md` defines 20 validation checks.

**Current status: Pending.**

No validation check is considered passed without recorded evidence. The API must be reconciled with:

* `docs/specification/srs.md`
* `docs/specification/security-requirements.md`
* `docs/architecture/api-architecture.md`
* `docs/database/table-specification.md`
* `docs/database/relationship-specification.md`
* `docs/database/constraint-specification.md`
* `docs/database/booking-financial-rules.md`

## 7. Outstanding Decisions

The following decisions must be resolved before final approval:

1. Staff role matrix and single-role versus multiple-role assignment.
2. Customer quotation acceptance method.
3. Booking confirmation conditions.
4. Deposit, cancellation, refund, and adjustment policies.
5. Booking snapshot fields.
6. Follow-up target relationships.
7. Review eligibility and publication rules.
8. Public provider profile fields.
9. Idempotency and concurrency requirements for critical operations.
10. Privacy, retention, rate limits, and performance-test targets.

Decisions affecting business operations require owner approval. Technical decisions must be documented and consistent with the architecture.

## 8. Approval Criteria

The API baseline may be approved when:

* All validation checks have documented outcomes.
* Critical inconsistencies have been resolved.
* Permissions and financial workflows are approved.
* Every endpoint has clear request, response, authorization, and error behavior.
* Required tests are defined and critical workflows are testable.
* Remaining issues have documented owners and resolution dates.
* The project owner formally approves the baseline.

## 9. Change Control

After approval, changes must record the reason, affected endpoints and documents, compatibility impact, security and database implications, migration needs, and required tests. Significant changes require review before implementation.

## 10. Final Status

**Decision:** Proposed baseline; not approved for implementation.

**Next action:** Complete cross-document reconciliation and obtain the outstanding business decisions. Record evidence in `api-validation.md`, then submit the API and database baselines for approval together.

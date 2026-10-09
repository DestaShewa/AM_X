# Database Design Baseline

**File:** `docs/database/database-baseline.md`
**Project:** AMX — Arba Minch Experiences
**Phase:** Database & API Design
**Status:** Proposed Baseline — Pending Approval

## 1. Purpose

Establish the approved reference for AMX database design before implementation. This baseline consolidates the database structure, relationships, constraints, indexing, audit, financial, migration, and security decisions.

Changes to this baseline must be reviewed and documented to keep implementation aligned with the approved requirements and architecture.

## 2. Baseline Documents

The database design consists of:

1. `database-design-plan.md`
2. `conceptual-data-model.md`
3. `erd.md`
4. `entity-specification.md`
5. `table-specification.md`
6. `relationship-specification.md`
7. `constraint-specification.md`
8. `index-strategy.md`
9. `audit-data-design.md`
10. `financial-data-design.md`
11. `migration-strategy.md`
12. `database-security.md`
13. `database-validation.md`

All documents must be maintained under `docs/database/`.

## 3. Approved Design Direction

| Area             | Baseline decision                                                  |
| ---------------- | ------------------------------------------------------------------ |
| Database         | PostgreSQL                                                         |
| Architecture     | Modular monolith                                                   |
| Backend          | Node.js and Express                                                |
| API              | REST API under `/api/v1/`                                          |
| Primary keys     | UUID                                                               |
| Naming           | Lowercase `snake_case`, plural table names                         |
| Timestamps       | `TIMESTAMPTZ`                                                      |
| Monetary values  | `NUMERIC(12,2)` with currency                                      |
| Initial currency | ETB                                                                |
| Relationships    | Foreign keys and appropriate integrity constraints                 |
| Audit            | Structured audit records for important business actions            |
| Schema changes   | Version-controlled migrations                                      |
| Security         | Least privilege, restricted database access, backend authorization |
| Deployment       | Containerized deployment with protected configuration and backups  |

## 4. Core Tables

The initial design covers these 15 tables:

* `roles`
* `users`
* `customers`
* `providers`
* `packages`
* `inquiries`
* `quotations`
* `quotation_services`
* `bookings`
* `booking_services`
* `payments`
* `follow_ups`
* `reviews`
* `complaints`
* `audit_logs`

The design preserves important distinctions: inquiries are not bookings, quotations are not bookings, payment records are not online payment processing, and providers do not automatically require system accounts.

## 5. Core Integrity Rules

The implementation must preserve these rules:

1. Each quotation belongs to a valid inquiry and its customer.
2. An accepted quotation may create at most one booking.
3. Booking creation and quotation acceptance must be handled consistently in a transaction.
4. Booking services preserve the agreed service details, customer prices, and provider costs.
5. Only verified payments count as received funds.
6. Refunds and corrections must preserve a traceable financial history.
7. Reviews and complaints must reference the correct customer and booking.
8. Follow-ups must reference at least one valid business record.
9. Important administrative and financial changes must be auditable.
10. Important business records must not be accidentally deleted.

## 6. Implementation and Security Rules

* Backend services own critical business validation.
* PostgreSQL enforces primary keys, foreign keys, uniqueness, and applicable row-level checks.
* Cross-record business rules use transactions and, where justified, database triggers.
* Application, migration, and backup permissions must be separated.
* The database must not be publicly accessible.
* Credentials must remain outside source control.
* Database backups and restoration must be tested before production launch.
* Indexes must be finalized against expected query patterns and validated with representative data.

## 7. Outstanding Decisions

The following items must be resolved or explicitly deferred before production migrations are approved:

* Payment, refund, and adjustment data model.
* Separation of individual payment status from booking payment status.
* Deposit and cancellation policies.
* Quotation and booking snapshot requirements.
* User role cardinality and permission representation.
* Review eligibility and duplicate-review policy.
* Follow-up relationship implementation.
* Data-retention and applicable legal requirements.
* Migration tool selection.
* Production backup and recovery objectives.

These unresolved details must not be treated as approved production behavior.

## 8. Baseline Change Control

Any proposed change to the database baseline must:

1. Identify the reason and affected requirements.
2. Describe the impact on tables, relationships, constraints, and APIs.
3. Assess financial integrity, security, performance, and historical data.
4. Update the relevant design documents.
5. Receive review before implementation.
6. Include migration and test plans when the schema changes.
7. Be recorded in version control.

Do not silently modify approved database behavior or rewrite migrations already applied to shared or production environments.

## 9. Approval Checklist

* [ ] Database design documents have been reviewed together.
* [ ] ERD and table definitions are consistent.
* [ ] Critical integrity and financial rules are defined.
* [ ] Security and audit requirements are addressed.
* [ ] Outstanding decisions have owners or documented deferrals.
* [ ] Stakeholders approve the business-critical rules.
* [ ] The developer approves the technical design.
* [ ] The baseline is committed to version control.

## 10. Baseline Status

**Current status: Proposed — Pending Approval.**

The database documentation is ready for a coordinated consistency review, but unresolved financial and cross-table rules must be settled before the first production migration.

**Next phase:** API Design — define endpoint contracts, request and response schemas, validation, authorization, error handling, and business workflows under `docs/api/`.

# AMX Database Design Baseline

**Document ID:** AMX-DB-BASE-015
**Version:** 1.1
**Status:** Proposed — Pending Validation and Approval
**Project:** AMX — Arba Minch Experiences

## 1. Purpose

This document records the proposed database design for AMX. It establishes the design scope, standards, dependencies, and approval conditions before database implementation begins.

## 2. Baseline Scope

The database design includes 15 proposed tables:

1. `roles`
2. `users`
3. `customers`
4. `providers`
5. `packages`
6. `inquiries`
7. `quotations`
8. `quotation_services`
9. `bookings`
10. `booking_services`
11. `payments`
12. `follow_ups`
13. `reviews`
14. `complaints`
15. `audit_logs`

## 3. Baseline Documents

The following documents form the proposed database design baseline under `docs/database/`:

* `database-design-plan.md`
* `conceptual-data-model.md`
* `erd.md`
* `entity-specification.md`
* `table-specification.md`
* `relationship-specification.md`
* `constraint-specification.md`
* `index-strategy.md`
* `audit-data-design.md`
* `financial-data-design.md`
* `booking-financial-rules.md`
* `migration-strategy.md`
* `database-security.md`
* `database-validation.md`

All documents must be reviewed together. Changes to one document may require updates to related documents.

## 4. Proposed Technical Standards

* **Database:** PostgreSQL
* **Primary keys:** UUID
* **Naming:** `snake_case` for columns and plural `snake_case` table names
* **Date and time:** `TIMESTAMPTZ`
* **Money:** `NUMERIC(12,2)`
* **Initial currency:** ETB
* **Data access:** Through the backend application
* **Business logic:** Enforced by backend validation, database constraints, and transactions where appropriate
* **History:** Preserve important booking, quotation, payment, and audit records
* **Security:** Least-privilege database access, protected credentials, restricted network access, and backups

## 5. Critical Rules Requiring Consistency

The final design must ensure that:

* Each inquiry can have multiple quotation revisions.
* An accepted quotation creates no more than one booking.
* The accepted price, services, and terms remain available as a historical snapshot.
* Individual payment and refund transactions remain separate records.
* Only verified financial transactions affect payment summaries.
* Refunds reference the original payment where applicable.
* Booking payment summaries distinguish `UNPAID`, `PARTIALLY_PAID`, `PAID`, and `OVERPAID`.
* Follow-ups reference at least one valid target.
* Important financial and booking changes are audit logged.
* Concurrent requests cannot create duplicate bookings or corrupt financial totals.

## 6. Decisions Still Required

The following decisions must not be treated as approved until the business owner confirms them:

1. Deposit requirements and when a booking becomes confirmed.
2. Cancellation, refund, and adjustment policies.
3. Required booking confirmation conditions.
4. Whether each staff user has one role or multiple roles.
5. Whether follow-ups can target multiple records.
6. Review eligibility and duplicate-review rules.
7. Required booking and quotation snapshot fields.
8. Data retention, privacy, and deletion requirements.
9. Which rules require database enforcement versus backend enforcement.
10. Migration tooling and backup/recovery targets.

## 7. Validation Status

**Status: Pending.**

`database-validation.md` contains 20 validation checks. These must be completed with evidence before approval. Related requirements and API documents must also be checked for consistency.

No validation check is considered passed merely because the relevant document exists.

## 8. Approval Criteria

The database baseline may be approved only when:

* All validation checks have documented results.
* Critical business decisions are recorded.
* The ERD, table definitions, relationships, and constraints agree.
* Financial calculations and refund rules are consistent across database and API documents.
* Security, migration, backup, and recovery plans are reviewed.
* The project owner approves the outstanding business policies.
* The database design is consistent with the approved SRS and architecture baseline.

## 9. Change Control

Any change after approval must include:

* The reason for the change.
* The affected documents and database objects.
* Impact on existing data and migrations.
* Required tests and rollback considerations.
* Approval from the project owner.

## 10. Final Status

**Current decision:** Proposed baseline; not approved for implementation.

**Next action:** Complete the database and API cross-document validation, resolve outstanding business decisions, and record evidence before requesting formal approval.

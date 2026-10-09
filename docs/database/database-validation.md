# Database Design Validation

**File:** `docs/database/database-validation.md`
**Project:** AMX — Arba Minch Experiences
**Phase:** Database & API Design
**Status:** Draft — Pending Review

## 1. Purpose

Validate that AMX's database design is complete, consistent with approved requirements, secure, and ready for implementation.

Validation must identify design gaps before production migrations and application code are created.

## 2. Validation Scope

Review the following documents:

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
* `migration-strategy.md`
* `database-security.md`

## 3. Structural Validation

Confirm that:

* Every required entity has a defined table.
* Table and column names follow consistent naming conventions.
* Primary keys, foreign keys, and nullability are specified.
* Relationship cardinalities match the ERD and business rules.
* Required indexes and unique constraints are documented.
* Status values match the approved requirements.
* Historical business and financial records are preserved.

**Core entities:** Roles, Users, Customers, Providers, Packages, Inquiries, Quotations, Quotation Services, Bookings, Booking Services, Payments, Follow-ups, Reviews, Complaints, and Audit Logs.

## 4. Business Rule Validation

Verify the following rules:

1. An inquiry belongs to a customer and may generate multiple quotation revisions.
2. Each quotation belongs to its inquiry and must reference the same customer.
3. A booking can be created only from an accepted quotation.
4. A quotation can create at most one booking.
5. Booking services preserve agreed customer prices and provider costs.
6. Customer payments are linked to bookings and have explicit verification states.
7. Unverified payments are not treated as received funds.
8. Reviews belong to the correct customer and booking.
9. Complaints reference a booking only when the customer relationship is valid.
10. Every follow-up references at least one valid business record.
11. Important financial and administrative actions generate audit records.
12. Business records are archived or deactivated instead of being deleted when historical integrity must be preserved.

Rules involving multiple rows must be enforced through appropriate backend transactions, database constraints, or carefully designed triggers.

## 5. Financial Validation

Confirm that:

* Monetary values use `NUMERIC(12,2)` or another explicitly approved decimal type.
* Currency handling is consistent.
* Quotation line totals and overall totals reconcile.
* Discounts, deposits, and balances follow documented rules.
* Booking totals preserve accepted quotation values.
* Provider costs remain separate from customer prices.
* Payment verification, refunds, and adjustments are traceable.
* Revenue, customer receipts, provider costs, and profit are reported separately.

Unresolved deposit, refund, cancellation, commission, and accounting policies must be documented before implementation.

## 6. Security Validation

Verify that:

* Database access is restricted to authorized services and personnel.
* Application and migration accounts have separate privileges.
* Passwords are never stored in plaintext.
* Personal information is exposed only to authorized roles.
* SQL queries use parameterized statements.
* Secrets are excluded from source control.
* Audit records cannot be modified through ordinary application functions.
* Backups are protected and restoration has been tested.
* Retention and incident-response policies are defined.

## 7. Performance Validation

Review whether:

* Common inquiry and booking queries have suitable indexes.
* Upcoming trips can be retrieved efficiently.
* Provider assignments and follow-ups support operational workflows.
* Payment history and financial reports can be queried reliably.
* Indexes do not unnecessarily duplicate one another.
* Search indexes are introduced only when required.
* Expected query performance is tested with representative data.

Use `EXPLAIN ANALYZE` on representative queries after an initial schema and test dataset exist.

## 8. Migration and Recovery Validation

Confirm that:

* Schema changes are version-controlled.
* Migrations follow dependency order.
* Each migration can be tested before production deployment.
* Existing data is preserved or transformed intentionally.
* Destructive changes have a documented recovery plan.
* Backup and restoration procedures are tested.
* The target database schema matches the approved design.

## 9. Validation Checklist

* [ ] All core entities and fields are documented.
* [ ] The ERD matches the table and relationship specifications.
* [ ] Primary keys, foreign keys, and unique constraints are consistent.
* [ ] Status values and transitions are aligned with the SRS.
* [ ] Cross-table business rules have enforcement plans.
* [ ] Financial calculations and payment states are defined.
* [ ] Audit requirements are covered.
* [ ] Indexes support expected query patterns.
* [ ] Security and access controls are documented.
* [ ] Migration and backup strategies are documented.
* [ ] Outstanding business decisions are recorded.
* [ ] Stakeholders and the developer have reviewed the design.

## 10. Open Issues Requiring Resolution

Before the database baseline is approved, resolve or explicitly defer:

1. Whether quotation and booking snapshots require additional fields.
2. How payment records, refunds, and adjustments will be represented.
3. Whether reviews are limited to one per completed booking.
4. Whether follow-ups require direct foreign keys to all supported target types.
5. Whether users can have multiple roles or exactly one role.
6. Which user and business reference fields are mandatory.
7. Data-retention periods and applicable legal requirements.
8. Which constraints belong in PostgreSQL versus backend transactions.
9. Which indexes are necessary for the initial release.
10. The migration tool and production backup/recovery procedures.

## 11. Acceptance Criteria

The database design may be approved when all critical relationships, financial rules, security requirements, and migration procedures are documented; contradictions are resolved; and remaining issues have named decisions or owners.

Approval of the design does not mean the implementation has been tested. Database constraints, migration scripts, financial calculations, and security controls must be tested during implementation and QA.

## 12. Decision

**Current outcome:** Pending review. The documentation provides a structured basis for the AMX database, but unresolved business rules must be closed or formally deferred before implementation.

**Next document:** `docs/database/database-baseline.md`

# Database Design Validation

**Project:** AMX — Arba Minch Experiences
**Phase:** 6 — Database & API Design
**Status:** Pending Validation
**Version:** 1.0

## 1. Purpose

Validate the proposed PostgreSQL database against the AMX requirements, architecture, business rules, API design, and financial policies.

## 2. Validation Checklist

| ID        | Validation Item                                                | Status  |
| --------- | -------------------------------------------------------------- | ------- |
| DB-VAL-01 | Database design matches the SRS                                | Pending |
| DB-VAL-02 | All required MVP entities are included                         | Pending |
| DB-VAL-03 | ERD matches the table specification                            | Pending |
| DB-VAL-04 | Primary keys and foreign keys are defined                      | Pending |
| DB-VAL-05 | Relationship cardinalities are consistent                      | Pending |
| DB-VAL-06 | Required fields and nullable fields are justified              | Pending |
| DB-VAL-07 | Unique constraints prevent duplicate business records          | Pending |
| DB-VAL-08 | Status values match business workflows                         | Pending |
| DB-VAL-09 | Quotation revisions are preserved                              | Pending |
| DB-VAL-10 | Booking creation preserves accepted quotation details          | Pending |
| DB-VAL-11 | Payment transactions are separate from booking summaries       | Pending |
| DB-VAL-12 | Refund and adjustment rules preserve financial integrity       | Pending |
| DB-VAL-13 | Audit logs preserve important changes                          | Pending |
| DB-VAL-14 | Indexes support expected queries                               | Pending |
| DB-VAL-15 | Database security and access controls are defined              | Pending |
| DB-VAL-16 | Migration and rollback strategy is documented                  | Pending |
| DB-VAL-17 | Backup and recovery procedures are defined                     | Pending |
| DB-VAL-18 | Retention and privacy requirements are addressed               | Pending |
| DB-VAL-19 | Database constraints and API validation are aligned            | Pending |
| DB-VAL-20 | Outstanding design decisions are resolved or formally accepted | Pending |

## 3. Critical Issues

Resolve these before approval:

1. **Financial model:** Confirm transaction types, statuses, refund references, adjustment handling, and booking payment calculations.
2. **Quotation snapshots:** Define how accepted prices, services, inclusions, exclusions, and terms are preserved.
3. **Booking rules:** Confirm booking confirmation, cancellation, and status transition requirements.
4. **Follow-ups:** Finalize target relationships and integrity constraints.
5. **Authorization:** Confirm one or multiple roles per staff account and protect financial operations.
6. **Reviews:** Define eligibility and duplicate-review prevention.
7. **Retention:** Establish appropriate retention, archival, and privacy deletion rules.
8. **Concurrency:** Verify that duplicate bookings, payments, and refunds cannot be created through simultaneous requests.

## 4. Validation Procedure

1. Compare the conceptual data model and ERD with the SRS.
2. Check all 15 tables against entity and relationship specifications.
3. Verify foreign keys, uniqueness, required fields, and check constraints.
4. Compare financial tables with `financial-data-design.md` and `booking-financial-rules.md`.
5. Compare database operations with API workflows and permissions.
6. Review indexes against expected administrative and reporting queries.
7. Review security, migration, backup, and recovery documentation.
8. Record each issue, its resolution, and any accepted exceptions.
9. Repeat affected checks after corrections.

## 5. Required Evidence

Validation should be supported by:

* A consistent ERD and table specification.
* A complete relationship and constraint specification.
* Approved business and financial policies.
* Documented migration and recovery procedures.
* Database constraint and transaction test cases.
* API/database consistency checks.
* A list of resolved and accepted issues.

## 6. Exit Criteria

* [ ] All 20 validation items reviewed.
* [ ] No unresolved critical integrity or security defects.
* [ ] All required business decisions approved or formally accepted.
* [ ] Database and API specifications are consistent.
* [ ] Test cases cover important relationships and financial operations.
* [ ] Validation results are recorded.
* [ ] Database baseline approval is documented.

## 7. Current Result

**Validation outcome:** Pending. No checklist item is marked passed without evidence of review.

**Next action:** Resolve the critical issues, perform the checks, and update `database-baseline.md` to reflect the actual result.

**Validated by:** Pending
**Validation date:** Pending
**Approval status:** Not approved

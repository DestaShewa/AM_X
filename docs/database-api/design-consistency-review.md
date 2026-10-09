# AMX Database–API Design Consistency Review

**Document ID:** AMX-DESIGN-REVIEW-001
**Version:** 1.0
**Status:** Proposed — Review Pending
**Project:** AMX — Arba Minch Experiences
**Location:** `docs/database-api/design-consistency-review.md`

## 1. Purpose

Verify that the AMX database design, API design, business workflows, requirements, and security rules describe one consistent system before implementation begins.

## 2. Cross-Document Review

| ID    | Review Area      | Required Consistency                                                       | Status  |
| ----- | ---------------- | -------------------------------------------------------------------------- | ------- |
| CR-01 | Requirements     | Database and API support the MVP requirements.                             | Pending |
| CR-02 | Customers        | Customer records and inquiry workflows align.                              | Pending |
| CR-03 | Providers        | Verification status and public profile fields align.                       | Pending |
| CR-04 | Packages         | Package fields, publication status, and API operations align.              | Pending |
| CR-05 | Inquiries        | Inquiry fields, statuses, and transitions align.                           | Pending |
| CR-06 | Quotations       | Revisions, services, expiry, and acceptance rules align.                   | Pending |
| CR-07 | Bookings         | Booking creation, confirmation, cancellation, and snapshots align.         | Pending |
| CR-08 | Booking services | Service assignments and statuses align.                                    | Pending |
| CR-09 | Payments         | Individual transactions and booking summaries remain separate.             | Pending |
| CR-10 | Refunds          | Refund references, permissions, and financial calculations align.          | Pending |
| CR-11 | Follow-ups       | Target relationships and validation rules align.                           | Pending |
| CR-12 | Reviews          | Eligibility, duplicate prevention, and publication rules align.            | Pending |
| CR-13 | Complaints       | Access permissions, status changes, and audit requirements align.          | Pending |
| CR-14 | Users and roles  | Database relationships and API permissions align.                          | Pending |
| CR-15 | Audit logs       | Important actions are recorded consistently.                               | Pending |
| CR-16 | Validation       | API and database constraints do not contradict each other.                 | Pending |
| CR-17 | Concurrency      | Transactions prevent duplicate bookings and inconsistent financial totals. | Pending |
| CR-18 | Security         | Authentication, authorization, privacy, and data access align.             | Pending |
| CR-19 | Reporting        | Reports use consistent booking and financial definitions.                  | Pending |
| CR-20 | Operations       | Migration, backups, recovery, and monitoring are covered.                  | Pending |

## 3. Critical Design Decisions

The following decisions require resolution before final approval.

### 3.1 Quotation and booking

* An inquiry may have multiple quotation revisions.
* Only an eligible quotation may be accepted.
* Each quotation may create at most one booking.
* Booking creation and quotation acceptance must be atomic.
* Accepted prices, services, inclusions, exclusions, and terms must be preserved.

**Pending:** Final snapshot fields and customer acceptance evidence.

### 3.2 Payment and refund

* Each payment, refund, or adjustment is a separate transaction record.
* Only verified transactions affect financial summaries.
* Net paid equals verified payments minus verified refunds.
* Outstanding balance equals amount due minus net paid.
* Booking payment summary is derived from verified transactions and must not be confused with an individual transaction's status.

**Pending:** Deposit rules, refund policy, adjustment permissions, and final reconciliation procedures.

### 3.3 Staff permissions

* All protected operations require server-side authorization.
* Financial verification and refund actions must be restricted.
* Critical changes must be audit logged.

**Pending:** Final role matrix and whether one staff user may hold multiple roles.

### 3.4 Follow-ups and reviews

* Every follow-up must have a valid target.
* Review submission and publication must follow defined eligibility rules.

**Pending:** Target relationship design, review eligibility, and duplicate-review policy.

## 4. Required Documents

Review these documents together:

**Requirements**

* `docs/specification/srs.md`
* `docs/specification/functional-specification.md`
* `docs/specification/security-requirements.md`

**Database**

* `docs/database/erd.md`
* `docs/database/table-specification.md`
* `docs/database/relationship-specification.md`
* `docs/database/constraint-specification.md`
* `docs/database/financial-data-design.md`
* `docs/database/booking-financial-rules.md`
* `docs/database/database-validation.md`
* `docs/database/database-baseline.md`

**API and architecture**

* `docs/api/endpoint-catalog.md`
* `docs/api/authentication-authorization.md`
* `docs/api/business-workflow-specification.md`
* `docs/api/validation-error-handling.md`
* `docs/api/api-security.md`
* `docs/api/api-validation.md`
* `docs/api/api-baseline.md`
* `docs/architecture/system-architecture.md`

## 5. Review Procedure

1. Compare each database entity with the API operations that create, read, update, or manage it.
2. Compare every workflow and status transition across the requirements, database, and API documents.
3. Confirm authorization for every sensitive endpoint.
4. Verify that database constraints support the API's business rules.
5. Identify contradictions, missing rules, and duplicate definitions.
6. Update the authoritative document and its dependent documents.
7. Record evidence and revalidate affected checks.

Do not mark a review item as passed until the relevant documents have actually been compared.

## 6. Issue Register

| Issue                                      | Priority | Required Action                                           | Status |
| ------------------------------------------ | -------- | --------------------------------------------------------- | ------ |
| Quotation acceptance and booking snapshots | Critical | Define immutable accepted terms and transaction behavior. | Open   |
| Payment and refund integrity               | Critical | Approve financial rules and reconciliation behavior.      | Open   |
| Staff role matrix                          | High     | Approve permissions for every protected action.           | Open   |
| Follow-up relationships                    | Medium   | Finalize target-reference design.                         | Open   |
| Review eligibility                         | Medium   | Approve submission and publication rules.                 | Open   |
| Data retention and privacy                 | High     | Define retention, access, and deletion requirements.      | Open   |
| Concurrency and idempotency                | High     | Specify duplicate-request and transaction controls.       | Open   |
| Backup and recovery targets                | High     | Approve recovery expectations and test procedure.         | Open   |

## 7. Exit Criteria

This review is complete when:

* All 20 consistency checks have evidence-based outcomes.
* Critical contradictions are resolved.
* Business decisions are recorded and approved by the project owner.
* Database and API validation documents are updated.
* Remaining issues have owners and agreed deadlines.
* The database and API baselines are formally approved.

## 8. Current Decision

**Result: Pending review.**

The database and API designs remain proposed. This document defines the cross-checking process; it does not claim that the checks have been performed or passed.

**Next action:** Resolve the critical quotation, booking, and financial rules first. Then complete the remaining consistency checks and request approval for Phase 6.

# Database Constraint Specification

**File:** `docs/database/constraint-specification.md`
**Project:** AMX — Arba Minch Experiences
**Phase:** Database & API Design
**Status:** Draft — Requires Validation

## 1. Purpose

Define database constraints that protect AMX data integrity, enforce essential business rules, prevent invalid financial records, and maintain consistent relationships across the PostgreSQL database.

## 2. Primary Key Constraints

* Every table must have a primary key named `id`.
* Use UUID identifiers for all primary keys.
* Generate UUIDs using an approved PostgreSQL or application-level UUID strategy.
* Primary keys must never be null or changed after creation.

## 3. Foreign Key Constraints

All foreign keys must reference existing records.

| Relationship                    | Constraint                                                  |
| ------------------------------- | ----------------------------------------------------------- |
| Users → Roles                   | Every user must have a valid role.                          |
| Inquiries → Customers           | Every inquiry must belong to a customer.                    |
| Quotations → Inquiries          | Every quotation must belong to an inquiry.                  |
| Quotation Services → Quotations | Every quotation service must belong to a quotation.         |
| Bookings → Customers            | Every booking must belong to a customer.                    |
| Bookings → Quotations           | Every booking must reference one accepted quotation.        |
| Booking Services → Bookings     | Every booking service must belong to a booking.             |
| Booking Services → Providers    | Every booking service must reference a provider.            |
| Payments → Bookings             | Every payment record must belong to a booking.              |
| Reviews → Customers             | Every review must belong to a customer.                     |
| Audit Logs → Users              | The user reference may be null for system-generated events. |

Optional relationships, including package references, complaint bookings, and follow-up assignments, may be null where defined in the table specification.

**Deletion policy:** Do not cascade-delete bookings, quotations, payments, audit logs, or other important business records. Use archival or deactivation. Foreign keys should generally use `ON DELETE RESTRICT` or `NO ACTION`. Use `SET NULL` only for explicitly optional references where historical records remain valid.

## 4. Unique Constraints

The following values must be unique where applicable:

* `roles.name`
* `packages.slug`
* Business references for inquiries, quotations, and bookings
* `(inquiry_id, revision_number)` for quotation revisions
* `bookings.quotation_id`, allowing at most one booking per quotation
* User email and username when provided, using case-insensitive uniqueness where appropriate

A user must have at least one login identifier: email or username. Implement this with a database `CHECK` constraint and suitable unique indexes.

Do not assume that customer phone numbers or provider phone numbers are globally unique; shared contact numbers may be legitimate.

## 5. Check Constraints

Apply database `CHECK` constraints to enforce basic, single-row rules.

| Field or rule      | Constraint                                                                       |
| ------------------ | -------------------------------------------------------------------------------- |
| Traveler count     | Greater than zero                                                                |
| Duration in days   | Greater than zero when provided                                                  |
| Monetary amounts   | Non-negative unless a specifically approved adjustment model allows otherwise    |
| Currency           | Valid supported currency code; use `ETB` by default for AMX                      |
| Review rating      | Integer from 1 to 5                                                              |
| Quotation revision | Greater than zero                                                                |
| Package base price | Non-negative                                                                     |
| Payment amount     | Greater than zero for actual payment records                                     |
| Discount amount    | Non-negative and not greater than the applicable subtotal                        |
| Status fields      | Must contain an approved status value                                            |
| Follow-up target   | At least one customer, inquiry, quotation, or booking reference must be provided |

Use explicit constraints for nullable fields so that null values do not accidentally bypass required validation.

## 6. Status Constraints

Use controlled values for all status fields. The initial approved sets are:

* **Inquiry:** `NEW`, `CONTACTED`, `PROVIDER_CHECKING`, `QUOTATION_SENT`, `AWAITING_CONFIRMATION`, `CONVERTED`, `DECLINED`, `CANCELLED`, `CLOSED`
* **Quotation:** `DRAFT`, `SENT`, `VIEWED`, `CHANGE_REQUESTED`, `ACCEPTED`, `DECLINED`, `EXPIRED`, `CANCELLED`
* **Booking:** `PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
* **Payment:** `PENDING`, `SUBMITTED`, `VERIFIED`, `PARTIAL`, `PAID`, `FAILED`, `REFUNDED`, `CANCELLED`
* **Provider verification:** `UNVERIFIED`, `UNDER_REVIEW`, `VERIFIED`, `SUSPENDED`, `INACTIVE`
* **Follow-up:** `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
* **Review:** `SUBMITTED`, `REVIEWED`, `PUBLISHED`, `REJECTED`
* **Complaint:** `OPEN`, `INVESTIGATING`, `ACTION_REQUIRED`, `RESOLVED`, `CLOSED`
* **Customer:** `ACTIVE`, `INACTIVE`, `BLOCKED`
* **Package:** `DRAFT`, `ACTIVE`, `INACTIVE`, `ARCHIVED`
* **User:** Use the approved user lifecycle statuses defined during implementation design.

Prefer PostgreSQL `CHECK` constraints for stable status sets. If statuses must change frequently, consider lookup tables instead. Keep database and application validation synchronized.

## 7. Financial Constraints

* Use `NUMERIC(12,2)` for monetary values; never use floating-point types for money.
* Store the currency alongside each monetary amount.
* Ensure quotation line totals match quantity multiplied by unit price, using a consistent rounding policy.
* Ensure quotation totals reconcile with subtotal, discounts, and any explicitly supported fees.
* Ensure booking service prices and provider costs are stored as historical snapshots.
* Calculate outstanding customer balances from verified payment records and approved adjustments or refunds.
* Do not treat unverified payments as received revenue.
* Do not assume customer payments equal AMX revenue or profit.
* Define how partial payments, refunds, cancellations, and adjustments affect balances before implementation.

Where calculations span multiple rows, enforce them through transactional application logic or an explicitly designed database trigger; a normal row-level `CHECK` constraint is insufficient.

## 8. Cross-Table Business Rules

The following rules require application-service validation, transactional operations, or carefully designed database triggers because they involve multiple records:

1. A quotation's customer must match the customer attached to its inquiry.
2. A booking's customer must match the customer attached to its accepted quotation.
3. A booking can only be created from an accepted quotation.
4. Accepting a quotation and creating its booking must be handled atomically.
5. A review's customer must match the related booking's customer.
6. Reviews may be published only after the relevant trip is completed and moderation rules are satisfied.
7. A complaint's customer must match its booking's customer when a booking is specified.
8. A quotation cannot be sent without valid service lines and a valid total.
9. A booking cannot be confirmed until required services and providers are confirmed.
10. Provider verification, availability, and operational eligibility must be checked before confirming applicable services.
11. A follow-up must reference at least one valid business record.
12. Audit logs must record important administrative and financial changes without storing passwords or other secrets.

Database constraints protect integrity but do not replace authorization checks, workflow validation, or secure application logic.

## 9. Date and Timestamp Constraints

* Store timestamps using PostgreSQL `TIMESTAMPTZ`.
* Use Ethiopia's local timezone for user-facing scheduling and display.
* Record creation and update timestamps consistently.
* A quotation's `valid_until` must be checked before acceptance.
* Prevent invalid date combinations, such as a follow-up completion timestamp preceding its creation timestamp.
* Define travel-date and cancellation rules in business logic because exceptions may be necessary.

## 10. Deletion and Historical Integrity

* Prefer `archived`, `inactive`, or `suspended` states instead of deleting operational records.
* Preserve sent quotation revisions and the prices shown to customers.
* Preserve historical provider names, service descriptions, and agreed prices where needed for past bookings.
* Never remove payment history to correct a financial mistake; use a traceable adjustment or reversal process.
* Record important status changes and administrative actions in the audit log.

## 11. Validation Checklist

Before approving this specification, confirm that:

* [ ] All tables have UUID primary keys.
* [ ] Required foreign keys and deletion policies are defined.
* [ ] Unique business references and quotation revisions are enforced.
* [ ] All status values match the approved requirements.
* [ ] Money, discounts, quantities, and ratings have valid constraints.
* [ ] Booking creation and quotation acceptance are transactional.
* [ ] Cross-customer relationships cannot become inconsistent.
* [ ] Payment verification, refunds, and balances are clearly defined.
* [ ] Historical records cannot be accidentally deleted.
* [ ] Database and application validations agree.
* [ ] Constraints are tested with valid and invalid example records.

## 12. Acceptance Criteria

This specification is ready for approval when every proposed constraint is mapped to a database rule, transactional service rule, or documented operational rule. Production migrations must not be created until unresolved financial, workflow, and retention decisions have been reviewed.

**Next document:** `docs/database/index-strategy.md`

# Database Constraint Specification

**Project:** AMX — Arba Minch Experiences
**Phase:** 6 — Database & API Design
**Status:** Proposed — Pending Validation
**Version:** 1.0

## 1. Purpose

Define primary keys, foreign keys, unique constraints, required fields, check constraints, and deletion rules for the AMX PostgreSQL database.

## 2. Primary Key and Required Field Rules

* Every core table must have a UUID primary key.
* Required fields must use `NOT NULL`.
* Creation timestamps must be recorded consistently.
* Mutable business records must have an `updated_at` timestamp.
* Money must use `NUMERIC(12,2)`.
* Timestamps must use `TIMESTAMPTZ`.
* Status values must match approved domain values.

## 3. Unique Constraints

| Table        | Constraint                             |
| ------------ | -------------------------------------- |
| `roles`      | Unique role name                       |
| `users`      | Unique normalized email                |
| `packages`   | Unique slug                            |
| `quotations` | Unique `(inquiry_id, revision_number)` |
| `bookings`   | Unique `quotation_id`                  |
| `bookings`   | Unique booking number                  |

Email normalization must be applied consistently by the application and database strategy. Additional uniqueness rules, such as customer phone numbers, require business approval before enforcement.

## 4. Foreign Key Rules

| Table                | Relationship                        | Rule                                 |
| -------------------- | ----------------------------------- | ------------------------------------ |
| `users`              | `role_id → roles.id`                | Restrict deletion while referenced   |
| `inquiries`          | `customer_id → customers.id`        | Restrict deletion                    |
| `inquiries`          | `assigned_to → users.id`            | Allow null when unassigned           |
| `quotations`         | `inquiry_id → inquiries.id`         | Restrict deletion                    |
| `quotations`         | `created_by → users.id`             | Restrict deletion                    |
| `quotation_services` | `quotation_id → quotations.id`      | Restrict deletion after business use |
| `quotation_services` | `provider_id → providers.id`        | Allow null if not provider-specific  |
| `bookings`           | `quotation_id → quotations.id`      | Required and unique                  |
| `booking_services`   | `booking_id → bookings.id`          | Restrict deletion                    |
| `booking_services`   | `provider_id → providers.id`        | Allow null if not assigned           |
| `payments`           | `booking_id → bookings.id`          | Required; preserve history           |
| `payments`           | `original_payment_id → payments.id` | Optional self-reference for refunds  |
| `payments`           | `recorded_by → users.id`            | Required                             |
| `payments`           | `verified_by → users.id`            | Allow null before verification       |
| `follow_ups`         | Target IDs → respective tables      | At least one valid target required   |
| `reviews`            | `booking_id → bookings.id`          | Required                             |
| `reviews`            | `customer_id → customers.id`        | Required                             |
| `complaints`         | `customer_id → customers.id`        | Required                             |
| `audit_logs`         | `user_id → users.id`                | Allow null for system events         |

All foreign keys must reference existing records. Exact `ON DELETE` behavior must be configured deliberately; historical business and financial records must not be cascade-deleted.

## 5. Check Constraints

### General

* Traveler count and duration must be greater than zero.
* Package duration must be greater than zero.
* Ratings must be between 1 and 5.
* Quotation revision numbers must be positive.
* Service quantities must be positive.
* Monetary totals and prices must be non-negative.
* Individual financial transaction amounts must be greater than zero.
* Valid status and transaction-type values must be enforced.

### Financial

* `transaction_type` must be an approved value: `PAYMENT`, `REFUND`, or `ADJUSTMENT`.
* A refund must reference its original payment where required by the approved policy.
* A refund cannot reference itself as the original payment.
* A refund must not exceed the remaining refundable amount.
* Only verified transactions contribute to payment summaries.
* Concurrent refund operations must be protected through transactional backend logic and suitable database locking or equivalent concurrency controls.

A simple row-level `CHECK` constraint cannot reliably enforce a refund limit across multiple rows. That rule requires transactional application logic, with stronger database enforcement if justified.

### Follow-ups

At least one of `customer_id`, `inquiry_id`, or `booking_id` must be populated. Foreign keys validate each populated target. Whether multiple targets may be populated simultaneously must be decided explicitly.

## 6. Status Transition Constraints

Database values must use the approved status vocabulary for:

* Inquiries
* Quotations
* Bookings
* Booking services
* Payments
* Provider verification
* Follow-ups
* Reviews
* Complaints
* Packages

Allowed transitions must be enforced by backend business logic. A valid status value alone does not make a transition valid.

## 7. Historical Data Protection

* Do not permanently delete financial transactions through ordinary application operations.
* Preserve accepted quotation terms and booking price snapshots.
* Record important changes in `audit_logs`.
* Avoid cascading deletion of bookings, payments, quotations, and audit records.
* Use explicit archival or deactivation for packages, providers, and staff accounts where appropriate.
* Define retention and privacy deletion procedures before launch.

## 8. Implementation and Validation

Before database migration creation:

* [ ] Confirm constraints against `erd.md`.
* [ ] Confirm foreign keys against `relationship-specification.md`.
* [ ] Confirm payment rules against `financial-data-design.md`.
* [ ] Confirm business policies against `booking-financial-rules.md`.
* [ ] Confirm status values against the SRS and API specification.
* [ ] Review unique constraints and nullable fields.
* [ ] Test invalid foreign keys, duplicate records, invalid statuses, and negative amounts.
* [ ] Test concurrent booking creation and refund operations.
* [ ] Document approved exceptions and retention rules.

## 9. Decision

**Recommendation:** Use this specification as the proposed foundation for PostgreSQL integrity rules.

**Status:** Pending validation and business-policy approval. Do not mark the database baseline approved until the outstanding relationship and financial decisions are resolved.

**Approved by:** Pending
**Approval date:** Pending

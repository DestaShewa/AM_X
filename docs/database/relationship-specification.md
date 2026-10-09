# AMX — Relationship Specification

**File:** `docs/database/relationship-specification.md`
**Phase:** 6 — Database & API Design
**Status:** Draft for Validation

## 1. Purpose

Define the cardinality, optionality, referential integrity, and deletion behavior of relationships between AMX database tables.

## 2. Relationship Notation

| Notation | Meaning                      |
| -------- | ---------------------------- |
| `1 : 1`  | One-to-one                   |
| `1 : N`  | One-to-many                  |
| `0..1`   | Optional single relationship |
| `0..N`   | Zero or many related records |
| `1..N`   | One or more related records  |

## 3. Core Relationship Matrix

| Parent    | Child             | Cardinality | Child Requirement                                                                 |
| --------- | ----------------- | ----------- | --------------------------------------------------------------------------------- |
| Role      | User              | 1 : N       | Every user has one role                                                           |
| User      | Audit Log         | 1 : N       | Audit actor may be null for system events                                         |
| Customer  | Inquiry           | 1 : N       | Every inquiry has one customer                                                    |
| Customer  | Booking           | 1 : N       | Every booking has one customer                                                    |
| Package   | Inquiry           | 1 : N       | Package reference is optional                                                     |
| Inquiry   | Quotation         | 1 : N       | Every quotation belongs to one inquiry                                            |
| Package   | Quotation         | 1 : N       | Package reference is optional                                                     |
| Quotation | Quotation Service | 1 : N       | Every quotation service belongs to one quotation                                  |
| Provider  | Quotation Service | 1 : N       | Provider assignment is optional                                                   |
| Quotation | Booking           | 1 : 0..1    | Booking references at most one quotation; a quotation creates at most one booking |
| Booking   | Booking Service   | 1 : N       | Every booking service belongs to one booking                                      |
| Provider  | Booking Service   | 1 : N       | Every booking service has one assigned provider                                   |
| Booking   | Payment           | 1 : N       | Every payment belongs to one booking                                              |
| Customer  | Review            | 1 : N       | Every review belongs to one customer                                              |
| Booking   | Review            | 1 : N       | Every review references one booking                                               |
| Customer  | Complaint         | 1 : N       | Every complaint belongs to one customer                                           |
| Booking   | Complaint         | 1 : N       | Booking reference is optional                                                     |
| User      | Follow-Up         | 1 : N       | Follow-up assignment is optional                                                  |
| Customer  | Follow-Up         | 1 : N       | Customer reference is optional                                                    |
| Inquiry   | Follow-Up         | 1 : N       | Inquiry reference is optional                                                     |
| Quotation | Follow-Up         | 1 : N       | Quotation reference is optional                                                   |
| Booking   | Follow-Up         | 1 : N       | Booking reference is optional                                                     |
| User      | Complaint         | 1 : N       | Complaint assignment is optional                                                  |
| User      | Payment           | 1 : N       | Every payment has one recording user                                              |

## 4. Relationship Rules

### 4.1 Customer Relationships

* A customer may have zero or many inquiries.
* A customer may have zero or many bookings.
* A customer may have zero or many reviews and complaints.
* Customer history must remain traceable across inquiries, quotations, bookings, and payments.
* Deleting a customer must not automatically delete financial or booking history.

### 4.2 Inquiry and Quotation

* Every quotation must reference one valid inquiry.
* An inquiry may have multiple quotations, including revisions.
* A quotation's customer must match the inquiry's customer.
* A quotation may reference a package or be created as a custom proposal.
* Each quotation must contain one or more quotation service records before it is sent.
* Sent quotations must preserve their offered terms.

### 4.3 Quotation and Booking

* A booking must reference the accepted quotation that generated it.
* One quotation may generate at most one booking.
* The quotation and booking must belong to the same customer.
* Booking creation and quotation acceptance must be processed consistently.
* A declined, expired, or cancelled quotation must not produce a normal confirmed booking.

**Implementation note:** Use a unique constraint on `bookings.quotation_id` and a database transaction for booking creation and quotation acceptance.

### 4.4 Booking and Booking Services

* Every booking must contain at least one booking service before confirmation.
* Every booking service belongs to one booking.
* Every booking service references one provider.
* A provider may serve multiple bookings.
* A booking may include multiple providers and service types.
* Agreed prices and service descriptions must be preserved as historical snapshots.

### 4.5 Booking and Payments

* Every payment belongs to one booking.
* A booking may have zero or many payment records.
* Payment records must distinguish submitted, verified, failed, refunded, or other approved statuses.
* Outstanding balances must be calculated using verified payments and applicable adjustments.
* Payment deletion must not silently change financial history.

### 4.6 Booking and Reviews

* Every review references one customer and one booking.
* The customer must match the customer associated with the booking.
* Reviews should only be accepted after the relevant trip is completed.
* A booking may have multiple reviews only if the approved review policy permits them; otherwise, enforce one review per booking/customer.

### 4.7 Booking and Complaints

* Every complaint belongs to a customer.
* A complaint may reference a booking or exist without one.
* If a booking is provided, its customer must match the complaint's customer.
* Complaint resolution history must remain traceable.

### 4.8 Follow-Up Relationships

* A follow-up may reference a customer, inquiry, quotation, or booking.
* Each follow-up must reference at least one valid business record.
* A follow-up may be assigned to a user.
* Completion should preserve the task outcome and completion timestamp.

### 4.9 User and Role

* Each user has one role in the initial MVP model.
* A role may be assigned to multiple users.
* Role changes must be authorized and audited.
* User deletion or deactivation must not remove audit history.

## 5. Referential Integrity

Use PostgreSQL foreign keys to enforce valid relationships.

| Relationship Type          | Recommended Behavior                            |
| -------------------------- | ----------------------------------------------- |
| Customer → Inquiry         | `RESTRICT` or soft deletion                     |
| Customer → Booking         | `RESTRICT` or soft deletion                     |
| Inquiry → Quotation        | `RESTRICT`                                      |
| Quotation → Booking        | `RESTRICT`                                      |
| Booking → Payment          | `RESTRICT`                                      |
| Booking → Booking Service  | `RESTRICT` for historical records               |
| Provider → Booking Service | `RESTRICT` or provider deactivation             |
| User → Audit Log           | `SET NULL` if user removal is legally permitted |
| Role → User                | `RESTRICT` while assigned                       |
| Booking → Review           | `RESTRICT` or controlled archival               |

**Default policy:** Avoid cascading deletion of business, financial, and audit records. Prefer deactivation or archival where appropriate.

## 6. Update and Delete Rules

* Primary keys must not change after record creation.
* Foreign keys must always reference valid records.
* Important historical records must be preserved.
* Provider deactivation must not remove past service assignments.
* Package updates must not rewrite historical quotation or booking terms.
* User deactivation must not delete actions previously recorded in audit logs.
* Financial corrections should be traceable rather than silently overwriting verified payments.
* Cascading operations should be used only for dependent data that has no independent historical value.

## 7. Data Integrity Constraints

The detailed schema must enforce, where appropriate:

* Unique business references.
* Valid foreign keys.
* Positive traveler counts and service durations.
* Non-negative monetary values where applicable.
* Valid status values.
* Valid quotation revision numbers.
* Unique quotation revision numbers within an inquiry.
* Unique booking source quotation.
* Consistent customer ownership across related records.
* Valid payment-to-booking relationships.
* Valid review-to-booking relationships.
* At least one linked business record per follow-up.
* Valid monetary totals and rounding.

Cross-table rules that cannot be safely expressed as simple constraints must be enforced by backend business logic and transactions.

## 8. Relationship Validation Checklist

* [x] Main entities connected
* [x] Cardinalities proposed
* [x] Optional relationships identified
* [x] Quotation-to-booking rule defined
* [x] Multiple-provider bookings supported
* [x] Payment relationships defined
* [x] Customer ownership consistency addressed
* [x] Historical data protection addressed
* [ ] All referential actions approved
* [ ] Constraints mapped to PostgreSQL
* [ ] Relationship specification approved

**Current result:** Draft for validation.

## 9. Next Artifact

`docs/database/constraint-specification.md` — define primary keys, foreign keys, uniqueness, check constraints, and business integrity constraints in detail.

# Database Relationship Specification

**Project:** AMX — Arba Minch Experiences
**Phase:** 6 — Database & API Design
**Status:** Proposed — Pending Validation
**Version:** 1.0

## 1. Purpose

Define the cardinality, foreign keys, and integrity rules between AMX database entities.

## 2. Relationship Specifications

| Parent       | Child                | Relationship       | Rule                                                             |
| ------------ | -------------------- | ------------------ | ---------------------------------------------------------------- |
| `roles`      | `users`              | One-to-many        | Each user has one role in the initial design                     |
| `customers`  | `inquiries`          | One-to-many        | Each inquiry belongs to one customer                             |
| `users`      | `inquiries`          | One-to-many        | A staff member may handle many inquiries                         |
| `inquiries`  | `quotations`         | One-to-many        | Each inquiry may have multiple revisions                         |
| `users`      | `quotations`         | One-to-many        | Each quotation records its creator                               |
| `quotations` | `quotation_services` | One-to-many        | Each quotation contains one or more service lines                |
| `providers`  | `quotation_services` | One-to-many        | A provider may appear in many quotation lines                    |
| `quotations` | `bookings`           | One-to-zero-or-one | A quotation creates at most one booking                          |
| `bookings`   | `booking_services`   | One-to-many        | A booking contains service records                               |
| `providers`  | `booking_services`   | One-to-many        | A provider may deliver many booked services                      |
| `bookings`   | `payments`           | One-to-many        | A booking may have multiple financial transactions               |
| `payments`   | `payments`           | One-to-many        | An original payment may be referenced by refund records          |
| `customers`  | `follow_ups`         | One-to-many        | A customer may have multiple follow-ups                          |
| `inquiries`  | `follow_ups`         | One-to-many        | An inquiry may have multiple follow-ups                          |
| `bookings`   | `follow_ups`         | One-to-many        | A booking may have multiple follow-ups                           |
| `customers`  | `reviews`            | One-to-many        | A customer may submit reviews, subject to eligibility rules      |
| `bookings`   | `reviews`            | One-to-many        | A booking may have reviews subject to the approved review policy |
| `customers`  | `complaints`         | One-to-many        | A customer may submit multiple complaints                        |
| `bookings`   | `complaints`         | One-to-many        | A booking may have multiple associated complaints                |
| `users`      | `follow_ups`         | One-to-many        | A staff member may own many follow-ups                           |
| `users`      | `payments`           | One-to-many        | Staff record and verify transactions                             |
| `users`      | `complaints`         | One-to-many        | A staff member may handle many complaints                        |
| `users`      | `audit_logs`         | One-to-many        | A staff member may generate many audit events                    |

A relationship marked one-to-many means each child record references at most one parent through the specified foreign key.

## 3. Important Relationship Rules

### Inquiry and quotation

* Every quotation belongs to exactly one inquiry.
* Each inquiry may have multiple quotation revisions.
* Revision numbers must be unique within the inquiry.
* A quotation must preserve its agreed service and pricing details.

### Quotation and booking

* An accepted quotation may create at most one booking.
* The booking creation operation must be transactional.
* The booking must preserve the agreed quotation price, services, and terms.
* A quotation's acceptance and booking creation must be protected against concurrent duplicate requests.

### Booking and services

* A booking may have multiple service records.
* Each service records its agreed price and operational status.
* Provider information may be optional until assignment, where the business process permits it.
* Historical service information must remain available if a provider becomes inactive.

### Booking and payments

* A booking may have multiple payment and refund transactions.
* Every transaction belongs to one booking.
* Refund records must reference the original payment where required by the financial policy.
* Financial summaries must be calculated from verified transactions.
* Deleting a booking must not cascade-delete financial history.

### Follow-ups

* A follow-up must reference at least one target: customer, inquiry, or booking.
* Each populated foreign key must reference a valid record.
* The system must define whether a follow-up can target more than one entity simultaneously.
* Follow-ups must be assigned to an authorized staff member.

### Reviews and complaints

* Reviews must reference a valid customer and booking.
* Review eligibility and duplicate-review rules must be defined before implementation.
* Complaints must reference a valid customer; booking association may be optional.
* Publication, assignment, and resolution must follow authorization rules.

### Audit logs

* Audit records may reference a staff user or represent a system event.
* Audit records must not be cascade-deleted with the referenced business record.
* Sensitive secrets must never be stored in audit data.

## 4. Referential Integrity Rules

* Use explicit foreign-key constraints for all defined relationships.
* Use `ON DELETE RESTRICT` or `ON DELETE NO ACTION` for historical business and financial data unless a documented exception is approved.
* Use nullable foreign keys only where the business process allows missing associations.
* Avoid relying exclusively on application checks for referential integrity.
* Use database transactions for operations that update multiple related records.
* Define a retention and archival policy before production deployment.

## 5. Decisions Pending

* [ ] Confirm whether users can have multiple roles.
* [ ] Confirm whether follow-ups can target multiple entities simultaneously.
* [ ] Define review eligibility and duplicate-review constraints.
* [ ] Finalize refund-to-original-payment relationship rules.
* [ ] Confirm which provider relationships may be null.
* [ ] Define retention and deletion requirements.
* [ ] Reconcile all relationships with the final ERD and table specification.

## 6. Validation Checklist

* [ ] Every foreign key exists in the table specification.
* [ ] Cardinalities match `erd.md`.
* [ ] Optional relationships have clear business justifications.
* [ ] Unique constraints enforce one booking per quotation.
* [ ] Refund references preserve financial integrity.
* [ ] Historical records are protected from accidental deletion.
* [ ] Related documents use consistent entity and field names.

## 7. Decision

**Recommendation:** Use this relationship model as the proposed database design foundation.

**Status:** Pending validation and resolution of the outstanding decisions.

**Approved by:** Pending
**Approval date:** Pending

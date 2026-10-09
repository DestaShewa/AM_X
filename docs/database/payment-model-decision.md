# Payment Data Model Decision

**File:** `docs/database/payment-model-decision.md`
**Project:** AMX — Arba Minch Experiences
**Phase:** 6 — Database & API Design
**Status:** Proposed — Pending Approval
**Version:** 0.1

## 1. Purpose

Define how AMX records customer payments, verifies transactions, tracks refunds, and calculates booking payment summaries without processing online payments.

## 2. Design Decision

Use the existing `payments` table to record **individual financial transactions**. Calculate each booking's overall payment position separately from those records.

AMX records payments made through external methods, such as bank transfers or other agreed payment channels. Staff verify payments manually.

## 3. Payment Record Model

Each payment record should contain:

| Field              | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `id`               | Unique payment record ID                    |
| `booking_id`       | Associated booking                          |
| `transaction_type` | PAYMENT, REFUND, or ADJUSTMENT              |
| `amount`           | Positive transaction amount                 |
| `status`           | Current transaction status                  |
| `payment_method`   | Recorded payment channel                    |
| `reference_number` | Optional external transaction reference     |
| `recorded_by`      | Staff member who recorded it                |
| `verified_by`      | Staff member who verified it, if applicable |
| `transaction_date` | Date of the transaction                     |
| `notes`            | Supporting explanation                      |
| `created_at`       | Record creation time                        |
| `updated_at`       | Last update time                            |

Amounts use `NUMERIC(12,2)`. Store currency as ETB for the initial MVP, or define the currency at the transaction level if multi-currency support becomes necessary.

## 4. Transaction Statuses

| Status      | Meaning                                                        |
| ----------- | -------------------------------------------------------------- |
| `PENDING`   | Payment record created but not submitted or confirmed          |
| `SUBMITTED` | Customer claims payment has been made; verification is pending |
| `VERIFIED`  | Transaction has been checked and confirmed                     |
| `REJECTED`  | Submitted transaction could not be verified                    |
| `FAILED`    | Transaction failed                                             |
| `CANCELLED` | Transaction record was cancelled under an authorized process   |

A refund is recorded as a separate `REFUND` transaction. Do not use `REFUNDED` as an individual payment status. Preserve the original payment record.

## 5. Booking Payment Summary

Calculate the booking's financial summary using verified transactions:

* **Verified payments:** Sum of verified `PAYMENT` transactions.
* **Verified refunds:** Sum of verified `REFUND` transactions.
* **Net paid:** Verified payments minus verified refunds.
* **Outstanding balance:** Booking amount due minus net paid, subject to approved adjustment rules.

The booking's payment summary is not the status of any single payment record.

The API may return a derived summary such as `UNPAID`, `PARTIALLY_PAID`, `PAID`, or `OVERPAID`. These are summary states, not transaction statuses.

## 6. Business Rules

1. A payment must belong to an existing booking.
2. Only authorized staff may verify or reject payment records.
3. Only verified transactions affect the financial summary.
4. Refunds must reference the original payment or another explicitly defined source transaction.
5. A refund cannot exceed the refundable amount under the approved policy.
6. Financial records must not be silently deleted or overwritten.
7. Corrections must be recorded through authorized adjustments or reversal transactions and audit logs.
8. Financial calculations must use decimal database types, not floating-point arithmetic.
9. Booking totals and payment summaries must be recalculated consistently after financial changes.
10. A booking must not be marked paid merely because a payment record was submitted.

## 7. Database and API Impact

**Database**

* Update `payments` field specifications and constraints.
* Define how refunds and adjustments reference original transactions.
* Add indexes for booking, status, type, and transaction date where justified.
* Define the authoritative source for the booking amount due.
* Update financial-data-design and database-validation documents.

**API**

* Separate payment recording, verification, rejection, refund, and summary operations.
* Enforce finance permissions and audit logging.
* Prevent duplicate financial operations.
* Return the transaction history and booking payment summary separately.

## 8. Decisions Still Required

* [ ] Approve transaction types and statuses.
* [ ] Define refund authorization and cancellation policies.
* [ ] Decide whether adjustments require a separate approval.
* [ ] Define payment evidence and reference-number requirements.
* [ ] Define who can verify payments and authorize refunds.
* [ ] Confirm how booking price changes affect the amount due.

## 9. Decision Status

**Recommendation:** Adopt this transaction-based model for the AMX MVP, subject to approval of the outstanding financial policies.

**Implementation status:** Not approved for implementation until the database and API specifications are updated and validated.

**Approved by:** Pending
**Approval date:** Pending

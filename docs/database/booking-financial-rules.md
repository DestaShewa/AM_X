# AMX Booking and Financial Rules

**File:** `docs/database/booking-financial-rules.md`
**Phase:** 6 — Database & API Design
**Status:** Proposed — Pending Business Approval
**Version:** 1.0

## 1. Purpose

Define consistent rules for quotations, bookings, payments, refunds, cancellations, and financial records for the AMX MVP.

## 2. Quotation Rules

1. Every quotation belongs to one inquiry.
2. Each quotation revision has a unique revision number within its inquiry.
3. A quotation must include services, agreed prices, inclusions, exclusions, validity, and cancellation terms.
4. Only a valid, unexpired quotation may be accepted.
5. Once accepted, its agreed price and terms must be preserved.
6. Each accepted quotation may create **at most one booking**.
7. Changes after acceptance require an authorized amendment process; the original agreement must remain traceable.

## 3. Booking Rules

1. A booking must reference an accepted quotation.
2. Booking creation and quotation acceptance must be protected against duplicate and concurrent requests.
3. A booking is `PENDING` until the required confirmation conditions are satisfied.
4. A booking becomes `CONFIRMED` only after authorized staff confirm the required arrangements with the relevant providers and customer.
5. A booking may become `IN_PROGRESS` when the trip begins.
6. A booking may become `COMPLETED` after the trip has finished.
7. A cancelled booking cannot be restarted; a new arrangement requires an explicitly defined process.
8. Booking status changes must be authorized and audit logged.

## 4. Payment Rules

Each payment record represents an individual financial transaction. It is not the overall payment status of a booking.

Approved design recommendation:

* Transaction types: `PAYMENT`, `REFUND`, `ADJUSTMENT`.
* Transaction statuses: `PENDING`, `SUBMITTED`, `VERIFIED`, `REJECTED`, `FAILED`, `CANCELLED`.
* Only verified transactions affect the financial summary.
* A refund is a separate transaction linked to its original payment where applicable.
* Financial records must not be silently deleted.
* Only authorized staff may verify transactions or record approved financial adjustments.

### Booking payment summary

* `UNPAID`: no net amount has been paid toward a positive amount due.
* `PARTIALLY_PAID`: net paid is greater than zero but less than the amount due.
* `PAID`: net paid equals the amount due.
* `OVERPAID`: net paid exceeds the amount due.

**Net paid** = verified payments − verified refunds.

**Outstanding balance** = amount due − net paid.

These are calculated summaries, not individual transaction statuses.

## 5. Deposits and Payment Deadlines

Recommended initial policy:

* Do not hard-code a deposit percentage.
* Each quotation must state the required deposit, payment deadline, balance deadline, and accepted payment methods when applicable.
* Staff must communicate payment instructions directly.
* A booking must not be marked paid based on an unverified customer claim.
* Payment requirements must be agreed with the customer before confirmation.

**Pending business decision:** Determine deposit requirements and deadlines based on provider agreements and actual operating practices.

## 6. Cancellation and Refund Rules

1. Record the cancellation request, reason, date, and responsible staff member.
2. Apply the cancellation terms agreed in the accepted quotation.
3. Determine refundable amounts using verified payments, applicable provider charges, and the approved policy.
4. Record each refund separately and preserve the original payment.
5. Prevent duplicate refunds and refunds exceeding the approved refundable amount.
6. Record the refund decision, amount, reason, authorizing staff member, and transaction reference where available.
7. Update booking and payment summaries consistently.
8. Do not automatically assume that cancelling a booking means a full refund.

**Pending business decision:** Approve cancellation deadlines, refund percentages, provider cancellation charges, and refund authorization requirements before launch.

## 7. Database Integrity Rules

* All financial transactions must reference valid bookings.
* Refunds must reference their source payment where applicable.
* Monetary values must use `NUMERIC(12,2)`, not floating-point types.
* Amounts must be non-negative where zero is permitted; actual transaction amounts must be positive.
* Foreign keys must protect historical records from accidental deletion.
* Related booking and financial changes must use database transactions.
* Critical business rules must be enforced on the backend and supported by database constraints.
* Every financial verification, refund, adjustment, and material booking change must be audit logged.

## 8. Required API Behavior

The API must:

* Reject acceptance of expired or otherwise invalid quotations.
* Prevent duplicate booking creation from the same quotation.
* Enforce permissions for confirmation, cancellation, payment verification, refunds, and adjustments.
* Validate status transitions.
* Prevent duplicate financial operations.
* Return the booking status and payment summary separately.
* Avoid exposing internal notes, sensitive customer information, or financial records to unauthorized users.

## 9. Decisions Required Before Approval

* [ ] Approve deposit and balance payment rules.
* [ ] Approve booking confirmation conditions.
* [ ] Approve cancellation and refund policy.
* [ ] Define who may authorize refunds and financial adjustments.
* [ ] Define how accepted quotations may be amended.
* [ ] Confirm provider cancellation charges and customer liability terms.
* [ ] Confirm required payment evidence and verification procedures.

## 10. Approval Status

**Technical recommendation:** Use these rules as the shared foundation for database constraints and API validation.

**Business status:** Pending approval of the outstanding policies.

**Implementation status:** Do not finalize implementation until the critical decisions are approved and reflected in the database and API specifications.

**Approved by:** Pending
**Approval date:** Pending

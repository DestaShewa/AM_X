# Financial Data Design

**File:** `docs/database/financial-data-design.md`
**Project:** AMX — Arba Minch Experiences
**Phase:** Database & API Design
**Status:** Draft — Requires Business Validation

## 1. Purpose

Define how AMX stores and calculates quotation amounts, customer payments, provider costs, refunds, and business revenue while maintaining accurate financial records.

The MVP records payments and financial outcomes; it does not process online payments directly.

## 2. Financial Design Principles

* Use PostgreSQL `NUMERIC(12,2)` for monetary amounts.
* Store a currency code with every financial transaction or amount group.
* Use `ETB` as the default currency for the initial Arba Minch operation.
* Keep customer prices separate from provider costs and AMX earnings.
* Preserve historical prices after quotations are sent or bookings are confirmed.
* Record financial corrections as traceable adjustments rather than silently overwriting history.
* Calculate totals on the backend and validate them before saving.
* Treat payment verification as an authorized, auditable action.

## 3. Financial Data Ownership

| Entity               | Financial responsibility                                    |
| -------------------- | ----------------------------------------------------------- |
| `quotation_services` | Proposed customer price for each quoted service             |
| `quotations`         | Quoted subtotal, discount, total, deposit, and balance      |
| `bookings`           | Accepted booking amount and financial status                |
| `booking_services`   | Agreed customer price and provider cost for each service    |
| `payments`           | Individual customer payment records and verification status |
| `audit_logs`         | History of important financial changes                      |

Financial data must not be duplicated unnecessarily. When a booking is created, preserve the accepted quotation amounts and service details as historical records.

## 4. Quotation Calculations

The backend must calculate quotation totals using the following rules:

* **Line total** = quantity × unit price, rounded according to the approved currency policy.
* **Subtotal** = sum of quotation service line totals.
* **Total** = subtotal − discount + any explicitly supported additional fees.
* **Deposit** = agreed deposit amount, not exceeding the total.
* **Balance** = total − deposit, before later payment and adjustment activity.

The MVP must not introduce additional fees unless they are explicitly defined in the quotation.

Validate that:

* Quantities and unit prices are valid.
* Discounts are non-negative and do not exceed the applicable subtotal.
* Totals reconcile with line items.
* Deposit and balance are consistent with the accepted quotation.
* All amounts in one calculation use the same currency.

## 5. Customer Payment Records

The `payments` table records individual payments associated with a booking.

Required financial information includes:

* Booking reference.
* Amount and currency.
* Payment date, where known.
* Payment method.
* External receipt or transaction reference, where available.
* Verification status.
* User who recorded or verified the payment.
* Notes when needed.

Payment workflow:

`PENDING → SUBMITTED → VERIFIED`

Other outcomes may include `PARTIAL`, `PAID`, `FAILED`, `REFUNDED`, or `CANCELLED`, according to the approved payment workflow.

These values describe different concepts: for example, `PARTIAL` and `PAID` are generally booking-level payment states, while `VERIFIED` and `FAILED` describe individual payment attempts or records. Before implementation, separate these into appropriate payment-record and booking-payment status fields rather than mixing them in one status column.

A recorded payment is not automatically a received payment. Only verified payments should contribute to confirmed customer receipts.

## 6. Outstanding Balance

Calculate the customer's outstanding balance from the accepted booking amount, verified payments, and approved financial adjustments.

**Initial calculation:**

Outstanding balance = booking total − verified payments + applicable debit adjustments − applicable credit adjustments.

The implementation must define the treatment of refunds carefully to avoid counting a refund twice.

Do not calculate the outstanding balance from unverified payment submissions. Do not permit a payment or adjustment in a different currency to be included without an explicit conversion policy.

## 7. Provider Costs and AMX Earnings

For each confirmed booking service, preserve:

* Customer price.
* Provider cost or agreed provider payment.
* Currency.
* Provider identity.
* Agreed service description.

For completed services, the system can calculate the preliminary service margin:

**Service margin = customer price − provider cost**

However, service margin is not the same as net profit. Net profit must also account for other business expenses, refunds, taxes, coordination costs, and other applicable charges.

AMX may earn money through:

* Coordination fees.
* Package margins.
* Provider commissions or referral fees.
* Other explicitly agreed service fees.

The system must record the actual applicable revenue basis for each arrangement. Do not count the full customer booking amount as AMX revenue when part of it belongs to providers.

## 8. Refunds and Financial Adjustments

Refunds, cancellations, and corrections must be traceable.

Before implementation, define whether refunds will be represented by:

* A dedicated refund or adjustment table, or
* A separate, linked financial transaction model.

Do not overwrite the original verified payment to represent a refund. Record the amount, reason, date, reference, responsible user, and verification state where applicable.

A refund must not exceed the remaining refundable amount under the approved business rules. Cancellation terms and refund eligibility must be agreed before production use.

## 9. Financial Integrity and Permissions

* Calculate all financial totals on the backend.
* Validate submitted values before database writes.
* Use database transactions for related changes, such as accepting a quotation and creating a booking.
* Restrict payment verification, refunds, discounts, and financial corrections to authorized users.
* Audit important financial changes.
* Prevent unauthorized editing or deletion of verified financial history.
* Use consistent rounding rules and avoid floating-point arithmetic for money.
* Reconcile stored booking totals with accepted quotation snapshots.

## 10. Financial Reporting

The MVP should support reports for:

* Quotation totals and conversion to bookings.
* Confirmed booking values.
* Verified customer receipts.
* Outstanding customer balances.
* Refunds and adjustments.
* Provider costs.
* Preliminary service margins.
* AMX revenue by income type.
* Operating expenses and net profit, once expense tracking is defined.

Reports must clearly distinguish quoted amounts, booked amounts, verified receipts, and earned revenue. These figures are not interchangeable.

## 11. Acceptance Checklist

* [ ] All monetary fields use an appropriate decimal type.
* [ ] Currency is stored and validated consistently.
* [ ] Quotation totals are calculated and validated by the backend.
* [ ] Accepted prices are preserved as historical snapshots.
* [ ] Verified and unverified payments are distinguished.
* [ ] Booking payment status is separated from individual payment status.
* [ ] Outstanding balances account for approved adjustments and refunds.
* [ ] Provider costs are separate from customer prices.
* [ ] Financial permissions and audit records are defined.
* [ ] Refund, cancellation, and revenue rules are approved.
* [ ] Financial reports use clearly defined calculations.

## 12. Open Business Decisions

Before implementation, AMX must confirm:

1. Deposit percentage or fixed-deposit rules.
2. Accepted payment methods and evidence requirements.
3. Who can record and verify payments.
4. Refund and cancellation policies.
5. How provider costs and commissions are agreed and recorded.
6. Whether expense tracking is included in the MVP.
7. Whether multiple currencies are needed at launch.
8. Applicable accounting, tax, licensing, and legal requirements.

## 13. Decision

AMX will use a transaction-based financial record model with decimal monetary values, historical quotation and booking snapshots, verified payment tracking, separate provider costs, and auditable adjustments. Finalize unresolved business rules before creating production database migrations.

**Next document:** `docs/database/migration-strategy.md`

# Financial Data Design

**Project:** AMX — Arba Minch Experiences
**Phase:** 6 — Database & API Design
**Status:** Proposed — Pending Approval
**Version:** 0.2

## 1. Purpose

Define how AMX stores and calculates booking amounts, payments, refunds, and outstanding balances accurately and transparently.

## 2. Financial Data

| Data                 | Description                                 |
| -------------------- | ------------------------------------------- |
| Booking total        | Agreed price for the booking                |
| Amount due           | Total amount currently payable              |
| Payment transactions | Individual payment records                  |
| Refund transactions  | Recorded returns of verified payments       |
| Adjustments          | Authorized corrections to financial amounts |
| Net paid             | Verified payments minus verified refunds    |
| Outstanding balance  | Amount due minus net paid                   |

All monetary amounts use PostgreSQL `NUMERIC(12,2)`. The initial currency is ETB.

## 3. Financial Rules

1. Every financial transaction must be linked to a valid booking.
2. Only verified payments count toward the amount paid.
3. Refunds must be recorded separately from original payments.
4. Refunds must not exceed the refundable amount.
5. Financial corrections must preserve the original transaction history.
6. Booking totals may change only through an authorized, audited process.
7. The backend must calculate financial totals; clients must never submit trusted calculated balances.
8. Financial changes must be recorded in the audit log.
9. Payment summaries must be calculated consistently from verified transactions and approved adjustments.
10. Financial records must not be permanently deleted through ordinary application operations.

## 4. Core Calculations

**Net paid**

`Verified payments − Verified refunds`

**Outstanding balance**

`Amount due − Net paid`

**Payment summary**

* `UNPAID`: Net paid is zero and amount due is positive.
* `PARTIALLY_PAID`: Net paid is greater than zero but less than amount due.
* `PAID`: Net paid equals amount due.
* `OVERPAID`: Net paid exceeds amount due.

If a booking has a zero amount due, its payment summary must be handled explicitly rather than automatically classified as unpaid.

## 5. Refund and Adjustment Controls

* Refunds require an authorized staff member and a documented reason.
* Refund approval and execution must follow the approved cancellation and refund policy.
* Adjustments require a reason, actor, timestamp, and audit entry.
* Duplicate payment verification, refund, or adjustment requests must be prevented.
* Where supported by the payment channel, retain an external transaction reference.
* AMX records and coordinates payments; this design does not introduce online payment processing.

## 6. Data Integrity

* Use database constraints for valid amounts, required fields, and foreign-key relationships.
* Use database transactions for financial changes and related audit records.
* Prevent concurrent operations from causing duplicate refunds or inconsistent balances.
* Do not rely solely on frontend validation.
* Restrict financial records and reports to authorized roles.

## 7. Required Updates

Align these documents with this design:

* `table-specification.md`
* `constraint-specification.md`
* `index-strategy.md`
* `audit-data-design.md`
* `database-validation.md`
* `api/endpoint-catalog.md`
* `api/business-workflow-specification.md`
* `api/validation-error-handling.md`

## 8. Pending Decisions

* [ ] Approve deposit and payment deadlines.
* [ ] Define cancellation and refund policies.
* [ ] Define financial adjustment approval permissions.
* [ ] Define the authoritative source for booking amount due.
* [ ] Confirm whether a refund requires approval by a second staff member.
* [ ] Define financial record retention requirements.

## 9. Decision

**Recommendation:** Use this model as the financial-data design baseline after business policies are approved.

**Status:** Proposed; not approved for implementation.

**Approved by:** Pending
**Approval date:** Pending

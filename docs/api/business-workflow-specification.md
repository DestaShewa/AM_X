# AMX API Business Workflow Specification

**File:** `docs/api/business-workflow-specification.md`
**Project:** AMX — Arba Minch Experiences
**Status:** Proposed — Pending Validation
**API Version:** `/api/v1`

## 1. Purpose

Define the business workflows that AMX API endpoints must enforce to ensure consistent inquiry handling, provider coordination, quotations, bookings, payments, and trip completion.

The backend is the authority for all business rules and status transitions. Frontend actions alone must never determine whether an operation is valid.

## 2. Core Business Workflow

```text
Customer Inquiry
       ↓
Contact Customer
       ↓
Check Provider Availability
       ↓
Prepare Quotation
       ↓
Send Quotation
       ↓
Customer Accepts
       ↓
Create Booking
       ↓
Confirm Providers and Services
       ↓
Record and Verify Payments
       ↓
Coordinate Trip
       ↓
Complete Trip
       ↓
Collect Feedback and Review Results
```

At any applicable stage, the workflow may branch into a decline, cancellation, complaint, or service-failure process.

## 3. Inquiry Workflow

### Initial status

`NEW`

### Allowed transitions

| Current Status           | Action                                          | Next Status           |
| ------------------------ | ----------------------------------------------- | --------------------- |
| NEW                      | Record customer contact                         | CONTACTED             |
| CONTACTED                | Start provider checks                           | PROVIDER_CHECKING     |
| PROVIDER_CHECKING        | Send a quotation                                | QUOTATION_SENT        |
| QUOTATION_SENT           | Await customer decision                         | AWAITING_CONFIRMATION |
| AWAITING_CONFIRMATION    | Record accepted quotation and resulting booking | CONVERTED             |
| Any eligible open status | Record customer decline                         | DECLINED              |
| Any eligible open status | Cancel the inquiry                              | CANCELLED             |
| Any eligible open status | Close with a reason                             | CLOSED                |

The exact transition rules must be reconciled with the approved inquiry state model. For example, sending a quotation and awaiting confirmation may be separate recorded events or distinct status transitions depending on the finalized workflow.

### API operations

* `POST /api/v1/inquiries`
* `GET /api/v1/inquiries`
* `GET /api/v1/inquiries/{inquiry_id}`
* `PATCH /api/v1/inquiries/{inquiry_id}`
* `POST /api/v1/inquiries/{inquiry_id}/contact`
* `POST /api/v1/inquiries/{inquiry_id}/provider-checks`
* `POST /api/v1/inquiries/{inquiry_id}/close`

### Business rules

* Public inquiry submission creates an inquiry in `NEW` status.
* Validate required contact information, travel dates, and traveler count.
* Match or create the customer record without unnecessarily duplicating customers.
* Record provider availability checks and operational notes.
* Prevent inappropriate status changes and retain inquiry history.
* An inquiry is not a confirmed booking.

## 4. Provider Coordination Workflow

### Workflow

1. Select suitable providers for the requested experience.
2. Check availability, service coverage, prices, and relevant restrictions.
3. Record responses and any agreed conditions.
4. Include only suitable, sufficiently verified providers in a quotation.
5. Confirm provider arrangements after the customer accepts and according to the agreed operational process.

### API operations

* `GET /api/v1/providers`
* `POST /api/v1/providers`
* `PATCH /api/v1/providers/{provider_id}`
* `PATCH /api/v1/providers/{provider_id}/verification`
* `POST /api/v1/inquiries/{inquiry_id}/provider-checks`
* `GET /api/v1/bookings/{booking_id}/services`

### Business rules

* Only authorized staff may register or modify providers.
* Provider verification must be based on actual checks.
* Availability must not be assumed from an active provider profile.
* Record provider confirmations and relevant cancellation conditions.
* Provider self-service accounts and automated availability integrations are outside the MVP.

## 5. Quotation Workflow

### Statuses

`DRAFT → SENT → VIEWED → ACCEPTED`

Other permitted outcomes include `CHANGE_REQUESTED`, `DECLINED`, `EXPIRED`, and `CANCELLED`, according to the approved state-transition rules.

### API operations

* `POST /api/v1/inquiries/{inquiry_id}/quotations`
* `GET /api/v1/inquiries/{inquiry_id}/quotations`
* `GET /api/v1/quotations/{quotation_id}`
* `PATCH /api/v1/quotations/{quotation_id}`
* `POST /api/v1/quotations/{quotation_id}/send`
* `POST /api/v1/quotations/{quotation_id}/accept`
* `POST /api/v1/quotations/{quotation_id}/decline`
* `POST /api/v1/quotations/{quotation_id}/cancel`
* `POST /api/v1/quotations/{quotation_id}/revisions`

### Business rules

* Only eligible draft quotations may be edited.
* A sent quotation must preserve its issued version and agreed terms.
* Changes after sending should create a revision rather than silently overwrite the issued quotation.
* Each quotation must include the services, prices, inclusions, exclusions, validity period, and applicable payment and cancellation terms.
* Acceptance must be recorded with the accepted quotation version and timestamp.
* Only one booking may be created from a given quotation.
* Customer acceptance is initially recorded by authorized staff after confirmation through the agreed communication channel.
* Secure customer-action links are a future option, pending approval.

## 6. Booking Creation and Confirmation

### Workflow

1. Validate that the quotation is accepted.
2. Confirm no booking already exists for that quotation.
3. Create the booking and its service records in a database transaction.
4. Preserve the accepted quotation's prices, services, and relevant terms.
5. Confirm the required providers and services.
6. Confirm the booking when the approved confirmation conditions are met.
7. Record the booking reference and communicate the confirmation to the customer.

### Booking statuses

`PENDING → CONFIRMED → IN_PROGRESS → COMPLETED`

`CANCELLED` is an alternative outcome where cancellation is permitted.

### API operations

* `POST /api/v1/quotations/{quotation_id}/booking`
* `GET /api/v1/bookings`
* `GET /api/v1/bookings/{booking_id}`
* `PATCH /api/v1/bookings/{booking_id}`
* `POST /api/v1/bookings/{booking_id}/confirm`
* `POST /api/v1/bookings/{booking_id}/start`
* `POST /api/v1/bookings/{booking_id}/complete`
* `POST /api/v1/bookings/{booking_id}/cancel`

### Business rules

* Booking creation requires an accepted quotation.
* The database must enforce the one-booking-per-quotation rule.
* Booking creation must be atomic and safe against duplicate requests.
* A booking is not confirmed merely because it exists.
* Confirmation must follow the approved provider, customer, and payment requirements.
* Completed bookings cannot be reopened or cancelled through ordinary status actions; any exceptional correction requires an explicitly authorized procedure and audit history.

## 7. Booking Service Workflow

Each booking may contain multiple services, such as guiding, transport, accommodation, or boat activities.

### Service statuses

`PENDING → CONFIRMED → IN_PROGRESS → COMPLETED`

Alternative outcomes: `CANCELLED` or `FAILED`.

### API operations

* `GET /api/v1/bookings/{booking_id}/services`
* `POST /api/v1/bookings/{booking_id}/services`
* `PATCH /api/v1/booking-services/{service_id}`
* `POST /api/v1/booking-services/{service_id}/confirm`
* `POST /api/v1/booking-services/{service_id}/complete`
* `POST /api/v1/booking-services/{service_id}/cancel`
* `POST /api/v1/booking-services/{service_id}/fail`

### Business rules

* A service must belong to a valid booking.
* Provider assignment, agreed price, and confirmation details must be recorded.
* Changes affecting the accepted customer agreement require authorization and appropriate customer communication.
* A failed service must be recorded and escalated for resolution.
* Service status must not incorrectly imply that the entire booking is completed.

## 8. Payment and Refund Workflow

### Payment statuses

The approved data model must distinguish an individual payment record from the booking's overall payment position.

Individual payment records may use:

`PENDING`, `SUBMITTED`, `VERIFIED`, `PARTIAL`, `PAID`, `FAILED`, `REFUNDED`, `CANCELLED`

These values require validation before implementation because some describe an individual transaction while others describe an aggregate payment position. The final model should use separate, clearly defined statuses where appropriate.

### API operations

* `POST /api/v1/bookings/{booking_id}/payments`
* `GET /api/v1/bookings/{booking_id}/payments`
* `GET /api/v1/payments/{payment_id}`
* `POST /api/v1/payments/{payment_id}/verify`
* `POST /api/v1/payments/{payment_id}/reject`
* `POST /api/v1/payments/{payment_id}/refunds`
* `GET /api/v1/bookings/{booking_id}/payment-summary`

### Business rules

* Record actual payment submissions or receipts with amount, currency, date, method, and reference where available.
* Only authorized staff may verify payments or approve and record refunds.
* A payment must belong to a valid booking.
* Prevent duplicate payment records when the same submission is retried.
* Never mark a payment verified solely because a customer submitted a claim.
* Calculate the booking's paid amount and outstanding balance from valid payment and refund records.
* Do not assume payment collection, deposit requirements, or refund eligibility until the financial policy is approved.
* The MVP records payments; it does not process online payments.

## 9. Follow-Up Workflow

### Statuses

`PENDING → IN_PROGRESS → COMPLETED`

`CANCELLED` is an alternative outcome.

### API operations

* `POST /api/v1/follow-ups`
* `GET /api/v1/follow-ups`
* `GET /api/v1/follow-ups/{follow_up_id}`
* `PATCH /api/v1/follow-ups/{follow_up_id}`
* `POST /api/v1/follow-ups/{follow_up_id}/complete`
* `POST /api/v1/follow-ups/{follow_up_id}/cancel`

### Business rules

* Each follow-up must reference a valid inquiry, quotation, booking, customer, or other approved target.
* Assign a responsible staff member when required.
* Record due date, task details, status, and completion information.
* Support reminders for unanswered inquiries, pending quotations, upcoming trips, and customer feedback.
* Prevent unauthorized users from modifying another user's restricted tasks.

## 10. Trip Completion and Feedback

After a trip:

1. Authorized staff marks the booking completed.
2. Record unresolved provider issues, complaints, or service failures.
3. Contact the customer for feedback.
4. Accept eligible reviews through the approved submission process.
5. Moderate reviews before publication.
6. Record business outcomes and lessons learned.

### API operations

* `POST /api/v1/bookings/{booking_id}/complete`
* `POST /api/v1/reviews`
* `GET /api/v1/reviews`
* `POST /api/v1/reviews/{review_id}/publish`
* `POST /api/v1/reviews/{review_id}/reject`
* `POST /api/v1/complaints`
* `POST /api/v1/complaints/{complaint_id}/resolve`

### Business rules

* A review must satisfy the approved eligibility and duplicate-submission rules.
* Do not publish unmoderated reviews automatically.
* Complaints must be tracked until resolved or formally closed.
* Preserve complaint history and record resolution actions.
* Use completed trips, customer satisfaction, and financial results as operational performance measures.

## 11. Transaction and Audit Requirements

Use database transactions for operations that must succeed or fail together, including:

* Accepting a quotation and creating the associated booking when these actions are combined.
* Creating a booking and its initial service records.
* Recording financial changes and updating derived summaries when required.
* Applying critical multi-record status changes.

The system must:

* Prevent duplicate bookings from the same quotation.
* Preserve accepted quotation and booking snapshots.
* Validate state transitions inside the backend.
* Audit important changes to quotations, bookings, payments, refunds, users, and provider verification.
* Roll back incomplete transactions.
* Use idempotency protection where retries could create duplicate effects.

## 12. Acceptance Criteria

This specification is ready for baseline approval when:

* Inquiry-to-booking workflows are clearly defined.
* Every business action has authorization and validation rules.
* Quotation acceptance and booking creation are safe against duplication.
* Booking and service statuses remain consistent.
* Payment records are separate from booking-level payment summaries.
* Cancellation, refund, and service-failure handling are documented.
* Important changes are auditable.
* Automated tests cover normal, invalid, duplicate, and concurrent operations.

## 13. Decisions Required Before Approval

1. Finalize the exact inquiry and quotation status transitions.
2. Define conditions for booking confirmation and cancellation.
3. Resolve the payment status model and booking payment-summary calculation.
4. Approve deposit, refund, and cancellation policies.
5. Define how provider confirmations affect booking status.
6. Finalize review eligibility and complaint-handling rules.
7. Validate all workflows against the database design, endpoint catalog, and SRS.

**Next document:** `docs/api/api-security.md`.

# 3.12 — State & Status Model

## 1. Purpose

This document defines the lifecycle of major AMX business objects and the valid transitions between their statuses.

The model ensures that:

* Records move through a controlled lifecycle.
* Invalid business actions are prevented.
* Admin users understand what action comes next.
* Statuses are consistent across the system.
* Later API, database, and testing decisions have a clear foundation.

---

# 2. Core Lifecycle

The central AMX lifecycle is:

```text
Inquiry
   ↓
Provider Checking
   ↓
Quotation
   ↓
Customer Decision
   ↓
Booking
   ↓
Payment
   ↓
Trip Coordination
   ↓
Completed
   ↓
Review / Feedback
```

With cancellation possible at appropriate stages.

---

# 3. Inquiry Status Model

## 3.1 Statuses

| Status                  | Meaning                                         |
| ----------------------- | ----------------------------------------------- |
| `NEW`                   | New inquiry has been received                   |
| `CONTACTED`             | AMX has contacted/communicated with customer    |
| `PROVIDER_CHECKING`     | AMX is checking providers                       |
| `QUOTATION_SENT`        | Quotation has been sent                         |
| `AWAITING_CONFIRMATION` | Waiting for customer decision                   |
| `CONVERTED`             | Inquiry resulted in a booking                   |
| `DECLINED`              | Customer declined the quotation                 |
| `CANCELLED`             | Inquiry was cancelled                           |
| `CLOSED`                | Inquiry completed/closed without further action |

## 3.2 Flow

```text
NEW
 │
 ↓
CONTACTED
 │
 ↓
PROVIDER_CHECKING
 │
 ↓
QUOTATION_SENT
 │
 ↓
AWAITING_CONFIRMATION
 │
 ├──────────────→ DECLINED
 │
 ├──────────────→ CANCELLED
 │
 ↓
CONVERTED
 │
 ↓
CLOSED
```

### Important Rule

`CONVERTED` means the inquiry successfully resulted in a booking.

It does **not** mean the trip itself is completed.

---

# 4. Inquiry Transition Rules

| Current               | Allowed Next Status                  |
| --------------------- | ------------------------------------ |
| NEW                   | CONTACTED, CANCELLED                 |
| CONTACTED             | PROVIDER_CHECKING, CANCELLED, CLOSED |
| PROVIDER_CHECKING     | QUOTATION_SENT, CONTACTED, CANCELLED |
| QUOTATION_SENT        | AWAITING_CONFIRMATION, CANCELLED     |
| AWAITING_CONFIRMATION | CONVERTED, DECLINED, CANCELLED       |
| CONVERTED             | CLOSED                               |
| DECLINED              | CLOSED                               |
| CANCELLED             | CLOSED                               |
| CLOSED                | None                                 |

A closed inquiry should normally not be reopened directly. A new inquiry may be created if the customer makes a new request.

---

# 5. Quotation Status Model

## 5.1 Statuses

| Status             | Meaning                                                     |
| ------------------ | ----------------------------------------------------------- |
| `DRAFT`            | Quotation is being prepared                                 |
| `SENT`             | Quotation has been sent                                     |
| `VIEWED`           | Customer has received/viewed it where tracking is available |
| `CHANGE_REQUESTED` | Customer requested changes                                  |
| `ACCEPTED`         | Customer accepted quotation                                 |
| `DECLINED`         | Customer rejected quotation                                 |
| `EXPIRED`          | Quotation validity period ended                             |
| `CANCELLED`        | Quotation was cancelled/replaced                            |

## 5.2 Flow

```text
DRAFT
  │
  ↓
SENT
  │
  ├────────→ VIEWED
  │             │
  │             ↓
  │       CHANGE_REQUESTED
  │             │
  │             ↓
  │           DRAFT
  │
  ├────────→ ACCEPTED
  │
  ├────────→ DECLINED
  │
  ├────────→ EXPIRED
  │
  └────────→ CANCELLED
```

### Important Rule

A quotation may be revised when the customer requests changes.

The old quotation should remain traceable rather than being silently overwritten.

---

# 6. Booking Status Model

## 6.1 Statuses

| Status        | Meaning                                          |
| ------------- | ------------------------------------------------ |
| `PENDING`     | Booking record is being prepared                 |
| `CONFIRMED`   | Customer and required arrangements are confirmed |
| `IN_PROGRESS` | Trip/service is currently taking place           |
| `COMPLETED`   | Trip/service has successfully finished           |
| `CANCELLED`   | Booking has been cancelled                       |

## 6.2 Flow

```text
PENDING
   │
   ↓
CONFIRMED
   │
   ↓
IN_PROGRESS
   │
   ↓
COMPLETED

PENDING ─────→ CANCELLED
CONFIRMED ───→ CANCELLED
```

### Important Rule

A booking cannot become `COMPLETED` unless it was previously `CONFIRMED` and the trip/service actually occurred.

---

# 7. Booking Service Status

Because one booking may contain multiple services, each service needs its own status.

Examples:

```text
Guide Service
Driver Service
Hotel Service
Boat Service
Activity Service
```

## Statuses

| Status        | Meaning                                 |
| ------------- | --------------------------------------- |
| `PENDING`     | Service arrangement not yet finalized   |
| `CONFIRMED`   | Provider confirmed                      |
| `IN_PROGRESS` | Service is being delivered              |
| `COMPLETED`   | Service delivered                       |
| `CANCELLED`   | Service cancelled                       |
| `FAILED`      | Provider/service could not be delivered |

### Example

```text
Booking: AMX-2026-0015

├── Driver     → COMPLETED
├── Hotel      → COMPLETED
├── Boat Trip  → COMPLETED
└── Guide      → COMPLETED
```

This allows AMX to understand problems at the individual-service level.

---

# 8. Payment Status Model

Payment status should be separate from booking status.

## 8.1 Payment Statuses

| Status      | Meaning                                    |
| ----------- | ------------------------------------------ |
| `PENDING`   | Payment expected but not received/verified |
| `SUBMITTED` | Customer claims payment was made           |
| `VERIFIED`  | AMX has verified payment                   |
| `PARTIAL`   | Part of required amount has been paid      |
| `PAID`      | Required amount has been fully paid        |
| `FAILED`    | Payment attempt failed                     |
| `REFUNDED`  | Payment was refunded                       |
| `CANCELLED` | Payment record cancelled                   |

## 8.2 Payment Flow

```text
PENDING
   │
   ↓
SUBMITTED
   │
   ├──→ FAILED
   │
   ↓
VERIFIED
   │
   ├──→ PARTIAL
   │      │
   │      ↓
   │     PAID
   │
   └──→ PAID
```

Refund:

```text
PAID
  │
  ↓
REFUNDED
```

### Important Rule

Payment status must not automatically determine booking status.

For example:

```text
Booking = CONFIRMED
Payment = PARTIAL
```

can be valid if AMX's business rules allow a deposit.

---

# 9. Provider Verification Status

Provider verification is important because AMX may publicly describe providers as verified.

## Statuses

| Status         | Meaning                                        |
| -------------- | ---------------------------------------------- |
| `UNVERIFIED`   | Provider information has not yet been verified |
| `UNDER_REVIEW` | Verification is in progress                    |
| `VERIFIED`     | AMX has completed required verification        |
| `SUSPENDED`    | Provider temporarily cannot be used            |
| `INACTIVE`     | Provider is no longer active                   |

```text
UNVERIFIED
     │
     ↓
UNDER_REVIEW
     │
     ├────→ VERIFIED
     │
     └────→ INACTIVE

VERIFIED
     │
     └────→ SUSPENDED
                │
                ├──→ VERIFIED
                └──→ INACTIVE
```

### Rule

Only a provider with `VERIFIED` status should be presented as **verified** by AMX.

---

# 10. Follow-Up Status Model

## Statuses

| Status        | Meaning                              |
| ------------- | ------------------------------------ |
| `PENDING`     | Follow-up needs to happen            |
| `IN_PROGRESS` | Follow-up is currently being handled |
| `COMPLETED`   | Follow-up completed                  |
| `CANCELLED`   | Follow-up no longer required         |

```text
PENDING
   ↓
IN_PROGRESS
   ↓
COMPLETED

PENDING ──→ CANCELLED
```

Examples:

* Contact customer tomorrow
* Confirm boat availability
* Request remaining payment
* Ask for review
* Resolve complaint

---

# 11. Review Status Model

Reviews may require moderation before being treated as public content.

| Status      | Meaning                      |
| ----------- | ---------------------------- |
| `SUBMITTED` | Customer submitted review    |
| `REVIEWED`  | AMX reviewed it              |
| `PUBLISHED` | Approved for public display  |
| `REJECTED`  | Not approved for publication |

```text
SUBMITTED
    ↓
REVIEWED
   ├──→ PUBLISHED
   └──→ REJECTED
```

For the MVP, reviews do not necessarily need to be publicly displayed.

---

# 12. Complaint Status Model

| Status            | Meaning                       |
| ----------------- | ----------------------------- |
| `OPEN`            | Complaint received            |
| `INVESTIGATING`   | AMX is investigating          |
| `ACTION_REQUIRED` | Corrective action is required |
| `RESOLVED`        | Complaint resolved            |
| `CLOSED`          | Case formally closed          |

```text
OPEN
 ↓
INVESTIGATING
 ↓
ACTION_REQUIRED
 ↓
RESOLVED
 ↓
CLOSED
```

A complaint may move directly from `INVESTIGATING` to `RESOLVED` when no corrective action is required.

---

# 13. Customer Status

Customer status is intentionally simple.

| Status     | Meaning                                        |
| ---------- | ---------------------------------------------- |
| `ACTIVE`   | Customer can continue interacting with AMX     |
| `INACTIVE` | No active relationship/interaction             |
| `BLOCKED`  | Customer is restricted from system interaction |

```text
ACTIVE
  │
  ├──→ INACTIVE
  │
  └──→ BLOCKED
```

Customer status should not be confused with booking status.

---

# 14. Package Status

| Status     | Meaning                   |
| ---------- | ------------------------- |
| `DRAFT`    | Package is being prepared |
| `ACTIVE`   | Available to customers    |
| `INACTIVE` | Temporarily unavailable   |
| `ARCHIVED` | No longer offered         |

```text
DRAFT
  ↓
ACTIVE
  ↓
INACTIVE
  ↓
ACTIVE

ACTIVE → ARCHIVED
```

Only `ACTIVE` packages should normally appear publicly.

---

# 15. Global Cancellation Principle

Cancellation is not one universal status.

Different objects have different cancellation meanings:

```text
Inquiry       → CANCELLED
Quotation     → CANCELLED
Booking       → CANCELLED
BookingService → CANCELLED
Payment       → CANCELLED / REFUNDED
Follow-Up     → CANCELLED
```

Cancellation must record:

* Who cancelled
* Date/time
* Reason
* Related record
* Financial impact where applicable
* Notes

---

# 16. Core Business State Machine

The most important AMX state model is:

```text
                    ┌──────────────┐
                    │ NEW INQUIRY  │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │  CONTACTED   │
                    └──────┬───────┘
                           ↓
                 ┌─────────────────────┐
                 │ PROVIDER CHECKING   │
                 └──────────┬──────────┘
                            ↓
                    ┌──────────────┐
                    │  QUOTATION   │
                    │     SENT     │
                    └──────┬───────┘
                           ↓
                 ┌────────────────────┐
                 │ AWAITING CUSTOMER  │
                 │    CONFIRMATION    │
                 └──────┬─────────────┘
                        / \
                       /   \
                  Decline  Accept
                    ↓        ↓
                 CLOSED    BOOKING
                              │
                              ↓
                         CONFIRMED
                              │
                              ↓
                         IN PROGRESS
                              │
                              ↓
                          COMPLETED
                              │
                              ↓
                       REVIEW / FEEDBACK
```

---

# 17. Invalid State Transitions

The system should prevent transitions such as:

```text
NEW INQUIRY
      ↓
COMPLETED BOOKING       ✗
```

```text
QUOTATION DRAFT
      ↓
TRIP COMPLETED          ✗
```

```text
BOOKING PENDING
      ↓
COMPLETED               ✗
```

```text
UNVERIFIED PROVIDER
      ↓
PUBLICLY "VERIFIED"     ✗
```

```text
NO BOOKING
      ↓
PAYMENT RECORD          ✗
```

These rules will later become application validation and test cases.

---

# 18. Status vs Business State

A status describes the **current state of a record**.

A business state describes the **overall situation**.

Example:

```text
Booking Status: CONFIRMED
Payment Status: PARTIAL
Provider Service: CONFIRMED
Follow-Up: PENDING
```

These statuses can exist simultaneously because they represent different dimensions of the same booking.

---

# 19. Status History

For important objects, AMX should maintain status-change history.

Example:

```text
Booking AMX-2026-0015

PENDING
   │
   ├─ 09:10 — Created by Admin
   ↓
CONFIRMED
   │
   ├─ 11:25 — Customer accepted
   ↓
IN_PROGRESS
   │
   ├─ 08:00 — Trip started
   ↓
COMPLETED
   │
   └─ 17:30 — Trip completed
```

The system should record:

* Previous status
* New status
* User
* Date/time
* Reason/notes where necessary

---

# 20. Status Design Principles

### Principle 1 — One Meaning Per Status

A status should have one clear business meaning.

### Principle 2 — No Uncontrolled Transitions

Users should only move records through valid transitions.

### Principle 3 — Separate Related Lifecycles

Inquiry, quotation, booking, payment, and provider status should not be combined into one status field.

### Principle 4 — Preserve History

Important status changes should be traceable.

### Principle 5 — Human Decisions Remain Human

The system records decisions but does not automatically accept quotations, confirm providers, or declare trips completed without appropriate confirmation.

---

# 21. Validation Checklist

Before completing the state/status analysis:

* [ ] Inquiry lifecycle is clear.
* [ ] Quotation lifecycle is clear.
* [ ] Booking lifecycle is clear.
* [ ] Booking-service lifecycle is clear.
* [ ] Payment lifecycle is separate from booking.
* [ ] Provider verification lifecycle is defined.
* [ ] Follow-up lifecycle is defined.
* [ ] Review lifecycle is defined.
* [ ] Complaint lifecycle is defined.
* [ ] Package lifecycle is defined.
* [ ] Invalid transitions are identified.
* [ ] Cancellation rules are clear.
* [ ] Status history requirements are clear.

---

# 22. Final State Model Decision

The AMX system will use **separate state machines for separate business objects**, rather than one large status field.

The most important lifecycle is:

> **Inquiry → Quotation → Booking → Payment → Trip Completion → Feedback**

Each stage has its own controlled status and rules.

**Status:** Draft — pending validation.

---

## Next Artifact

**3.13 — Business Rules Analysis**

This will consolidate the AMX business rules discovered during requirements and analysis, identify their source, affected processes/entities, and determine which rules must be enforced by the system versus handled operationally by AMX staff.

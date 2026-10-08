# AMX — Module Architecture

**File:** `docs/architecture/module-architecture.md`
**Phase:** 5 — System Architecture & Design
**Status:** Draft for Validation

## 1. Purpose

Define the AMX backend business modules, their responsibilities, boundaries, dependencies, and ownership.

The goal is to keep the modular monolith organized so each module has a clear purpose without creating unnecessary complexity.

---

## 2. Module Architecture

```text
                         AMX APPLICATION
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
   Access & Security      Core Operations        Supporting
        │                      │                      │
   ┌────┴────┐        ┌────────┼────────┐       ┌─────┴─────┐
   │  Auth   │        │ Inquiry│Customer│       │ Follow-Up │
   │  Roles  │        │ Quote  │Provider│       │ Reviews   │
   │  Audit  │        │Booking │Package │       │Complaints │
   └─────────┘        │Payment │        │       │ Reports   │
                      └────────┴────────┘       └───────────┘
                               │
                           PostgreSQL
```

---

## 3. Module List

| ID     | Module                  | Responsibility                          |
| ------ | ----------------------- | --------------------------------------- |
| MOD-01 | Authentication & Access | Login, sessions, roles, permissions     |
| MOD-02 | Customers               | Customer profiles and history           |
| MOD-03 | Inquiries               | Customer requests and inquiry lifecycle |
| MOD-04 | Providers               | Provider records and verification       |
| MOD-05 | Packages                | Tourism package management              |
| MOD-06 | Quotations              | Quotes, pricing, acceptance             |
| MOD-07 | Bookings                | Confirmed trip management               |
| MOD-08 | Payments                | Payment recording and verification      |
| MOD-09 | Follow-Ups              | Operational reminders and tasks         |
| MOD-10 | Reviews                 | Customer feedback                       |
| MOD-11 | Complaints              | Complaint management                    |
| MOD-12 | Reports                 | Operational and financial reporting     |
| MOD-13 | Audit                   | System activity and accountability      |

---

## 4. MOD-01 — Authentication & Access

### Responsibilities

* Admin login
* Authentication
* Session/token management
* Role management
* Permission checks
* Password management
* Account status

### Must Not Own

Business operations such as bookings or quotations.

---

## 5. MOD-02 — Customers

### Responsibilities

* Customer profiles
* Contact information
* Customer history
* Customer search
* Customer status

### Relationships

```text
Customer
 ├── Inquiries
 ├── Quotations
 ├── Bookings
 ├── Reviews
 └── Complaints
```

---

## 6. MOD-03 — Inquiries

### Responsibilities

* Receive inquiries
* Validate inquiry information
* Track inquiry status
* Assign/manage follow-up
* Connect inquiries to customers
* Start quotation workflow

### Key Dependency

**Customer**

---

## 7. MOD-04 — Providers

### Responsibilities

* Provider records
* Provider type
* Services
* Contact information
* Pricing information
* Availability information
* Verification status
* Qualifications/licenses where applicable
* Performance notes

### Key Rule

The provider module records provider information; it does not control the provider's real-world operations.

---

## 8. MOD-05 — Packages

### Responsibilities

* Package creation
* Package details
* Services
* Pricing information
* Inclusions/exclusions
* Package status
* Public package information

### Key Rule

Changes to active package information must not silently alter already confirmed bookings.

---

## 9. MOD-06 — Quotations

### Responsibilities

* Create quotations
* Add services
* Add providers
* Calculate pricing
* Record inclusions/exclusions
* Record deposit/balance
* Set validity
* Record customer decision
* Track quotation status

### Dependencies

```text
Inquiry
Customer
Provider
Package
```

---

## 10. MOD-07 — Bookings

### Responsibilities

* Create bookings
* Manage booking services
* Assign providers
* Track booking status
* Manage changes
* Record cancellations
* Track trip completion

### Key Rule

A normal confirmed booking originates from an accepted quotation.

---

## 11. MOD-08 — Payments

### Responsibilities

* Record external payments
* Verify payment records
* Track booking balance
* Record payment references
* Support payment reporting

### Important Boundary

The module **does not process online payments** in the MVP.

---

## 12. MOD-09 — Follow-Ups

### Responsibilities

* Create follow-up tasks
* Assign responsible user
* Set due dates
* Track status
* Record outcomes

Examples:

* Contact customer
* Check provider availability
* Follow up quotation
* Confirm trip
* Follow up payment
* Follow up complaint

---

## 13. MOD-10 — Reviews

### Responsibilities

* Receive reviews
* Link reviews to completed bookings
* Review submissions
* Publish/reject reviews
* Track ratings

### Rule

Reviews should normally be associated with completed experiences.

---

## 14. MOD-11 — Complaints

### Responsibilities

* Record complaints
* Track investigation
* Record actions
* Track resolution
* Close complaints

Complaint handling remains human-controlled.

---

## 15. MOD-12 — Reports

### Responsibilities

Provide:

* Inquiry reports
* Quotation reports
* Booking reports
* Payment reports
* Revenue/cost reports
* Provider reports
* Customer reports
* Review/complaint reports
* Operational reports

Reports should read authoritative data from operational modules rather than creating competing business records.

---

## 16. MOD-13 — Audit

### Responsibilities

Record important system actions such as:

* Login/security events
* User changes
* Provider verification
* Quotation changes
* Booking changes
* Payment changes
* Cancellation
* Administrative changes

Audit records should be append-oriented and protected from normal modification.

---

## 17. Module Dependency Model

```text
Authentication
      │
      ▼
All Protected Modules

Customer
   │
   └── Inquiry
          │
          └── Quotation
                 │
                 └── Booking
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
          Provider   Payment   Follow-Up

Package ───────────────► Quotation

Booking ───────────────► Reviews
Booking ───────────────► Complaints

All Business Modules ──► Audit

Operational Modules ───► Reports
```

---

## 18. Dependency Rules

### Rule 1 — No Circular Dependencies

Modules must not depend on each other in uncontrolled cycles.

### Rule 2 — Business Logic Stays in Its Module

Example:

* Booking rules → Booking module
* Payment rules → Payment module
* Provider verification → Provider module

### Rule 3 — Shared Infrastructure Is Not Business Logic

Common utilities may be shared for:

* Logging
* Configuration
* Errors
* Validation infrastructure
* Database connection

### Rule 4 — Cross-Module Operations Use Clear Interfaces

Modules should communicate through defined service/API boundaries rather than directly manipulating another module's internal logic.

---

## 19. Shared Infrastructure

Separate from business modules:

```text
Shared Infrastructure
├── Database
├── Configuration
├── Logging
├── Error Handling
├── Validation
├── Security Utilities
├── File Storage
└── Common Utilities
```

---

## 20. Module Design Principle

Each module should answer:

> **What business responsibility does this module own?**

If a module cannot answer this clearly, its boundary should be reconsidered.

---

## 21. MVP Module Priority

### Core

`Auth → Customer → Inquiry → Provider → Package → Quotation → Booking → Payment`

### Operational

`Follow-Up → Reviews → Complaints`

### Management

`Reports → Audit`

All are part of the approved MVP, but implementation priority follows the core business workflow.

---

## 22. Architecture Status

**Module Style:** Business-domain modular monolith
**Circular Dependencies:** Not permitted
**Business Ownership:** Module-based
**Database:** Shared PostgreSQL with controlled module ownership

**Status:** Draft for Validation

**Next Artifact:**
`docs/architecture/application-architecture.md`

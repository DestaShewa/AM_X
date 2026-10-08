# AMX — Requirements Baseline

**File:** `docs/specification/requirements-baseline.md`
**Phase:** 4 — Requirements Specification
**Status:** Baseline for Validation

## 1. Purpose

This document establishes the approved baseline for AMX requirements before system architecture and design.

It defines:

* What the MVP must support
* Which requirements are mandatory
* Requirement sources and identifiers
* Scope boundaries
* Change-control rules

---

## 2. Baseline Scope

The AMX MVP shall support:

1. Public tourism website
2. Customer inquiries
3. Customer management
4. Provider management and verification
5. Package management
6. Quotation management
7. Booking management
8. Payment recording
9. Follow-up management
10. Reviews and complaints
11. Admin authentication and authorization
12. Reporting
13. Audit logging
14. Security, backup, and recovery
15. Mobile-responsive access
16. English language and Ethiopian Birr (ETB)

---

## 3. Core Business Workflow

The baseline business workflow is:

**Inquiry → Review → Provider Check → Quotation → Customer Decision → Booking → Payment Recording → Trip Coordination → Completion → Feedback**

The system shall support this workflow while keeping important operational decisions under AMX human control.

---

## 4. Requirement Categories

| Category                    | Identifier | Purpose                              |
| --------------------------- | ---------- | ------------------------------------ |
| Business Requirements       | BR-xx      | Business goals and outcomes          |
| User Requirements           | UR-xx      | User needs                           |
| Functional Requirements     | FR-xx      | Required system functions            |
| Non-Functional Requirements | NFR-xx     | Quality and operational requirements |
| Business Rules              | BRL-xx     | Rules and constraints                |
| Use Cases                   | UC-xx      | Actor-system interactions            |
| User Stories                | US-xx      | User-centered requirements           |

---

## 5. Functional Baseline

The functional baseline is defined by:

* `functional-specification.md`
* `srs.md`
* `business-rules-specification.md`
* `data-requirements.md`
* `interface-requirements.md`
* `security-requirements.md`
* `reporting-requirements.md`
* `localization-requirements.md`

Core functional areas:

**FS-01 → FS-13**

Public Website → Inquiry → Customer → Provider → Package → Quotation → Booking → Payment → Follow-Up → Reviews/Complaints → Authentication → Reporting → Audit.

---

## 6. Non-Functional Baseline

The system shall prioritize:

1. Security
2. Data integrity
3. Reliability
4. Usability
5. Performance
6. Maintainability
7. Scalability

Key baseline expectations include:

* Secure authentication and authorization
* HTTPS
* Input validation
* Auditability
* Regular backups
* Recovery capability
* Responsive design
* Maintainable modular architecture
* Appropriate performance for normal operations
* Protection of customer and provider information

---

## 7. Data Baseline

The MVP shall maintain controlled records for:

* Customer
* Inquiry
* Provider
* Package
* Quotation
* Booking
* Booking Service
* Payment
* Follow-Up
* Review
* Complaint
* User
* Role
* Audit Log

Important relationship:

**Customer → Inquiry → Quotation → Booking → Booking Service → Provider**

Payments are linked to bookings.

---

## 8. Status Baseline

Core lifecycle statuses are fixed unless formally changed.

### Inquiry

`NEW → CONTACTED → PROVIDER_CHECKING → QUOTATION_SENT → AWAITING_CONFIRMATION → CONVERTED / DECLINED / CANCELLED / CLOSED`

### Quotation

`DRAFT → SENT → VIEWED → ACCEPTED / DECLINED / EXPIRED / CANCELLED`

### Booking

`PENDING → CONFIRMED → IN_PROGRESS → COMPLETED / CANCELLED`

### Payment

`PENDING → SUBMITTED → VERIFIED → PARTIAL / PAID / FAILED / REFUNDED / CANCELLED`

### Provider Verification

`UNVERIFIED → UNDER_REVIEW → VERIFIED / SUSPENDED / INACTIVE`

---

## 9. MVP Exclusions Baseline

The following are **not part of the MVP baseline**:

* Provider self-service accounts
* Native mobile applications
* Online payment processing
* Automatic hotel availability
* AI chatbot
* Live vehicle tracking
* Multi-city marketplace
* Automatic commission splitting
* Complex payment integrations
* Large public tourism directory

These require separate approval if introduced later.

---

## 10. Technology Baseline

Current technology direction:

* **Frontend:** Next.js / React
* **Backend:** Node.js / Express
* **Database:** PostgreSQL
* **Architecture:** Modular monolith
* **Deployment:** Cloud/VPS
* **Containerization:** Docker
* **Version Control:** Git/GitHub

Final architecture decisions are deferred to **Phase 5**.

---

## 11. Requirements Traceability

Every implementation and test requirement shall be traceable to an approved requirement.

Minimum chain:

**Business Requirement → User Requirement → Functional/NFR → Use Case/User Story → Design → Implementation → Test**

Untraceable features should not enter the MVP without approval.

---

## 12. Baseline Change Control

After approval:

1. New requirements require a change request.
2. Requirement changes must include a reason.
3. Impact on scope, cost, schedule, security, data, and architecture must be reviewed.
4. Approved changes receive an updated identifier/version where necessary.
5. Traceability documents must be updated.
6. Development shall use only the current approved baseline.

---

## 13. Baseline Acceptance Criteria

The requirements baseline is ready for approval when:

* Requirements are clear and testable.
* Functional and non-functional requirements are consistent.
* Business rules are defined.
* Data requirements are identified.
* Interfaces are defined.
* Security requirements are defined.
* Reporting requirements are defined.
* Localization requirements are defined.
* MVP boundaries are clear.
* Requirements are traceable.
* Major legal/business open issues are identified.

---

## 14. Baseline Status

**Current Status:** Ready for Final Validation

**Next Artifact:** `specification-validation.md`

**Next Phase After Approval:**
**Phase 5 — System Architecture & Design**

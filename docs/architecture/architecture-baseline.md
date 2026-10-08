# AMX — Architecture Baseline

**File:** `docs/architecture/architecture-baseline.md`
**Phase:** 5 — System Architecture & Design
**Status:** Approved Baseline

## 1. Purpose

Establish the approved AMX technical architecture before detailed database and API design.

This baseline becomes the architectural reference for Phase 6 and later implementation.

---

## 2. Approved Architecture

| Area               | Decision                                          |
| ------------------ | ------------------------------------------------- |
| Architecture style | Modular Monolith                                  |
| Frontend           | Next.js + React                                   |
| Backend            | Node.js + Express                                 |
| API                | REST API                                          |
| Database           | PostgreSQL                                        |
| Authentication     | Secure Admin Authentication + RBAC                |
| Deployment         | Cloud/VPS                                         |
| Containerization   | Docker                                            |
| Public application | Next.js                                           |
| Admin application  | Next.js                                           |
| Communication      | WhatsApp / Phone / Email                          |
| Payment            | External payment + internal payment recording     |
| File storage       | External/object storage when required             |
| Monitoring         | Application + infrastructure monitoring           |
| Backup             | Automated PostgreSQL backups + recovery procedure |
| Version control    | Git/GitHub                                        |

---

## 3. System Structure

```text id="f7o6y4"
                    AMX SYSTEM
                        │
        ┌───────────────┴────────────────┐
        │                                │
   Public Web                         Admin Web
   Next.js/React                      Next.js/React
        │                                │
        └───────────────┬────────────────┘
                        │
                     REST API
                        │
                Node.js / Express
                        │
        ┌───────────────┴────────────────┐
        │        Business Modules        │
        │                                │
        │ Auth • Customers • Inquiries   │
        │ Providers • Packages           │
        │ Quotations • Bookings          │
        │ Payments • Follow-Ups          │
        │ Reviews • Complaints           │
        │ Reports • Audit                │
        └───────────────┬────────────────┘
                        │
                    Data Access
                        │
                    PostgreSQL
```

---

## 4. Core Business Flow

The architecture must support:

```text id="31zq0c"
Inquiry
   ↓
Review
   ↓
Provider Check
   ↓
Quotation
   ↓
Customer Decision
   ↓
Booking
   ↓
Payment Recording
   ↓
Trip Coordination
   ↓
Completion
   ↓
Feedback
```

This workflow is the primary architectural driver.

---

## 5. Module Baseline

### Core Modules

1. Auth & Access
2. Customers
3. Inquiries
4. Providers
5. Packages
6. Quotations
7. Bookings
8. Payments

### Operational Modules

9. Follow-Ups
10. Reviews
11. Complaints

### Management Modules

12. Reports
13. Audit

Modules must maintain clear responsibilities and avoid unnecessary circular dependencies.

---

## 6. Architectural Rules

The following rules are baselined:

* Backend owns critical business rules.
* Frontend must not independently determine booking/payment authorization.
* Database is not publicly accessible.
* Authentication and authorization are enforced server-side.
* Financial records require traceability.
* Important state transitions are controlled.
* External services remain integration boundaries.
* Provider operations remain human-controlled in MVP.
* Payment processing remains external in MVP.
* Secrets must not be stored in source code.
* Production data must be backed up.
* Important administrative actions must be auditable.
* Architecture must remain simple unless real requirements justify additional complexity.

---

## 7. Security Baseline

Required:

* HTTPS/TLS
* Secure password hashing
* Authentication
* RBAC
* Least privilege
* Input validation
* Rate limiting
* Secure API handling
* Protected database
* Secret management
* Audit logging
* Backup protection
* Recovery procedures
* Secure file handling where applicable

Sensitive payment credentials are **not stored by AMX**.

---

## 8. Deployment Baseline

```text id="j55m40"
Internet
   ↓
HTTPS
   ↓
Reverse Proxy
   ↓
Frontend / API
   ↓
Internal Network
   ↓
PostgreSQL

          └──► Backup Storage
          └──► File Storage
          └──► Monitoring
```

Environment separation:

```text id="w40vlc"
Development
     ↓
Testing / Staging
     ↓
Production
```

---

## 9. Integration Baseline

### MVP

| External Service | Integration                   |
| ---------------- | ----------------------------- |
| WhatsApp         | Manual communication          |
| Phone            | Manual communication          |
| Email            | Manual/basic                  |
| Payment services | External payment + AMX record |
| File storage     | External storage when needed  |
| Hosting          | Cloud/VPS                     |

Automated integrations are not required for MVP.

---

## 10. Data Architecture Baseline

The architecture recognizes these core entities:

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

Detailed tables, relationships, constraints, indexes, and migrations belong to **Phase 6**.

---

## 11. Scalability Baseline

AMX will begin as a modular monolith.

Future evolution is permitted only when justified:

```text id="80c7fa"
Modular Monolith
       ↓
Infrastructure Scaling
       ↓
Database Optimization
       ↓
Caching if Required
       ↓
Service Extraction if Justified
```

Microservices are **not part of the MVP architecture**.

---

## 12. Explicitly Excluded from Architecture Baseline

The following are not required for MVP:

* Provider self-service dashboard
* Customer account system
* Native mobile application
* Online payment gateway
* AI chatbot
* Live vehicle tracking
* Automatic hotel availability
* Multi-city marketplace
* Automatic commission splitting
* Complex third-party integrations

They may be considered through formal change control later.

---

## 13. Traceability

```text id="e5x3a8"
Business Requirements
        ↓
User Requirements
        ↓
Functional / Non-Functional Requirements
        ↓
System Analysis
        ↓
SRS
        ↓
Architecture
        ↓
Database & API Design
        ↓
Implementation
        ↓
Testing
        ↓
Deployment
```

Every major technical decision should remain traceable to a business or system requirement.

---

## 14. Change Control

After baseline approval:

* Changes must have a documented reason.
* Impact on scope, security, cost, timeline, and architecture must be considered.
* Major architectural changes require review.
* Requirements and architecture documentation must remain synchronized.
* No technology should be added merely because it is popular or available.

---

## 15. Phase 5 Gate

### Validation Result

**Architecture:** PASS
**Requirements alignment:** PASS
**Security:** PASS
**Data integrity:** PASS
**Deployment:** PASS
**Integration:** PASS
**MVP feasibility:** PASS
**Maintainability:** PASS
**Future extensibility:** PASS

### Decision

> **PHASE 5 — SYSTEM ARCHITECTURE & DESIGN: APPROVED**

The AMX architecture is now **baselined** and ready for detailed database and API design.

---

## 16. Phase 5 Deliverables

* [x] architecture-plan.md
* [x] architecture-principles.md
* [x] architecture-decision-record.md
* [x] system-architecture.md
* [x] module-architecture.md
* [x] application-architecture.md
* [x] api-architecture.md
* [x] security-architecture.md
* [x] deployment-architecture.md
* [x] integration-architecture.md
* [x] architecture-diagrams.md
* [x] architecture-validation.md
* [x] architecture-baseline.md

---

# Phase 5 Complete

**Next:** Phase 6 — **Database & API Design**

Recommended first artifact:

`docs/database/database-design-plan.md`

# AMX — Architecture Diagrams

**File:** `docs/architecture/architecture-diagrams.md`
**Phase:** 5 — System Architecture & Design
**Status:** Draft for Validation

## 1. Purpose

Provide the main architecture diagrams needed to understand AMX structure, boundaries, modules, data flow, security, and deployment.

---

## 2. System Context Diagram

```text
                    ┌──────────────────┐
                    │     Customer     │
                    │     / Visitor    │
                    └────────┬─────────┘
                             │
                       Inquiry / Booking
                             │
                             ▼
┌──────────────┐      ┌───────────────┐      ┌─────────────────┐
│    Guide     │◄────►│      AMX      │◄────►│ Hotel / Lodge   │
│   Driver     │      │    System     │      │ Boat / Operator │
│    Boat      │      └───────┬───────┘      └─────────────────┘
└──────────────┘              │
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
            WhatsApp       Payment       Email/Phone
```

---

## 3. High-Level System Architecture

```text
                         INTERNET
                             │
                         HTTPS/TLS
                             │
                  ┌──────────▼──────────┐
                  │    Reverse Proxy    │
                  └──────────┬──────────┘
                             │
             ┌───────────────┴────────────────┐
             │                                │
      ┌──────▼───────┐                 ┌──────▼───────┐
      │ Public Web   │                 │  Admin Web   │
      │ Next.js      │                 │  Next.js     │
      │ React        │                 │  React       │
      └──────┬───────┘                 └──────┬───────┘
             │                                │
             └──────────────┬─────────────────┘
                            │
                       REST API
                            │
                  ┌─────────▼─────────┐
                  │   Node / Express  │
                  │   Modular Monolith│
                  └─────────┬─────────┘
                            │
                  ┌─────────▼─────────┐
                  │ Business Modules  │
                  └─────────┬─────────┘
                            │
                       Data Access
                            │
                  ┌─────────▼─────────┐
                  │    PostgreSQL     │
                  └─────────┬─────────┘
                            │
                      Backup Storage
```

---

## 4. Module Architecture

```text
┌──────────────────────── AMX Backend ────────────────────────┐
│                                                             │
│  Auth & Access                                              │
│                                                             │
│  Customers ──► Inquiries ──► Quotations ──► Bookings       │
│       │              │              │            │           │
│       │              │              │            ├─ Payments│
│       │              │              │            ├─ Followup│
│       │              │              │            ├─ Reviews │
│       │              │              │            └─ Complaints
│       │              │              │                        │
│       └──────────────┴──── Packages ─┴──── Providers         │
│                                                             │
│  Reports ◄──────── Operational Data ────────► Audit         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Core Business Workflow

```text
Customer Inquiry
       │
       ▼
Review Inquiry
       │
       ▼
Check Providers
       │
       ▼
Prepare Quotation
       │
       ▼
Customer Decision
    ┌──┴──┐
    │     │
 Decline Accept
    │     │
    ▼     ▼
 Closed  Booking
             │
             ▼
      Payment Recording
             │
             ▼
      Trip Coordination
             │
             ▼
          Completed
             │
             ▼
      Feedback / Review
```

---

## 6. Application Request Flow

```text
User
 │
 ▼
Frontend
 │
 ▼
HTTPS Request
 │
 ▼
API Route
 │
 ▼
Middleware
 │
 ├── Authentication
 ├── Authorization
 ├── Validation
 └── Rate Limiting
 │
 ▼
Controller
 │
 ▼
Service / Business Logic
 │
 ▼
Data Access
 │
 ▼
PostgreSQL
 │
 ▼
Response
 │
 ▼
Frontend
```

---

## 7. Security Architecture

```text
Internet
   │
   ▼
HTTPS / TLS
   │
   ▼
Frontend
   │
   ▼
Authentication
   │
   ▼
Authorization / RBAC
   │
   ▼
Input Validation
   │
   ▼
Business Rules
   │
   ▼
Controlled Data Access
   │
   ▼
PostgreSQL
   │
   ├── Audit Logs
   └── Backups
```

Security is applied across all layers rather than being handled by a single component.

---

## 8. Deployment Architecture

```text
                         INTERNET
                            │
                         HTTPS :443
                            │
                    ┌───────▼───────┐
                    │ Reverse Proxy │
                    └───────┬───────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
           Public Web              Admin Web
                 │                     │
                 └──────────┬──────────┘
                            │
                         REST API
                            │
                       Node/Express
                            │
                       Internal Network
                            │
                       PostgreSQL
                            │
                     ┌──────┴──────┐
                     │             │
                  Backups      File Storage
```

The PostgreSQL database must **not be publicly accessible**.

---

## 9. External Integration Diagram

```text
                         AMX
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
          WhatsApp      Email        Phone
             │
             │
             ▼
        Customer / Provider


                         AMX
                          │
                          ▼
                External Payment
                          │
                          ▼
                 Payment Completed
                          │
                          ▼
                  AMX Payment Record
```

External systems support AMX operations but do not own AMX's core business workflow.

---

## 10. Data Relationship Overview

```text
Customer
   │
   ├── Inquiry
   │      │
   │      └── Quotation
   │             │
   │             └── Booking
   │                    │
   │                    ├── Booking Services ──► Provider
   │                    ├── Payments
   │                    ├── Follow-Ups
   │                    ├── Reviews
   │                    └── Complaints
   │
   └── Booking

Package ─────────────► Quotation

User ──► Role
User ──► Audit Log
```

Detailed database design will be completed in **Phase 6**.

---

## 11. Architecture Boundary

```text
┌──────────────────────── AMX SYSTEM ────────────────────────┐
│                                                            │
│ Public Website                                             │
│ Admin Application                                          │
│ REST API                                                   │
│ Business Modules                                           │
│ Customer / Inquiry / Provider / Package                    │
│ Quotation / Booking / Payment Records                      │
│ Follow-Up / Reviews / Complaints                           │
│ Reports / Audit / Authentication                           │
│ PostgreSQL                                                 │
│                                                            │
└──────────────────────────┬─────────────────────────────────┘
                           │
                    EXTERNAL BOUNDARY
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
      Providers       Communication      Payment
      Services        WhatsApp/Phone     Methods
                      /Email
                           │
                      File Storage
                      / Hosting
```

---

## 12. Architecture Principles Reflected

The diagrams represent the approved architecture principles:

* Modular monolith
* Clear system boundaries
* API separation
* Backend-controlled business rules
* Security by design
* Single source of truth
* Human-controlled tourism operations
* External-service boundaries
* Data integrity
* Backup and recovery
* Controlled future scalability

---

## 13. Diagram Usage

These diagrams support:

| Diagram                 | Primary Use                 |
| ----------------------- | --------------------------- |
| System Context          | System boundary & actors    |
| High-Level Architecture | Overall technical structure |
| Module Architecture     | Backend organization        |
| Business Workflow       | Operational process         |
| Request Flow            | Application processing      |
| Security Architecture   | Security layers             |
| Deployment Architecture | Production infrastructure   |
| Integration Diagram     | External services           |
| Data Relationship       | Core data structure         |
| Boundary Diagram        | Inside/outside system       |

---

## 14. Status

**Architecture Style:** Modular Monolith
**Frontend:** Next.js / React
**Backend:** Node.js / Express
**API:** REST
**Database:** PostgreSQL
**Deployment:** Cloud/VPS + Docker
**External Communication:** WhatsApp / Phone / Email
**Payment:** External payment + internal payment recording

**Status:** Draft for Validation

**Next Artifact:**
`docs/architecture/architecture-validation.md`

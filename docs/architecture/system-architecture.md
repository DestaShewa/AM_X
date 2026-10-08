# AMX — System Architecture

**File:** `docs/architecture/system-architecture.md`
**Phase:** 5 — System Architecture & Design
**Status:** Draft for Validation

## 1. Purpose

Define the overall technical structure of AMX and how its major components communicate.

The architecture must support the approved requirements while remaining simple, secure, maintainable, and suitable for MVP operation.

---

## 2. Architecture Style

AMX uses a **Modular Monolith** architecture.

```text
                    AMX SYSTEM
                         │
        ┌────────────────┴────────────────┐
        │                                 │
 Public Web                         Admin Dashboard
  Next.js                              Next.js
        │                                 │
        └────────────────┬────────────────┘
                         │
                      REST API
                         │
              ┌──────────┴──────────┐
              │   Express Backend   │
              │                     │
              │  Business Modules   │
              └──────────┬──────────┘
                         │
                    Data Access
                         │
                    PostgreSQL
                         │
              ┌──────────┴──────────┐
              │                     │
           Backups              Audit Logs
```

---

## 3. Major System Components

### 3.1 Public Web Application

Responsible for customer-facing functionality:

* Home
* About
* Packages
* Package details
* Custom trip request
* How it works
* Contact
* Terms
* Privacy

Technology direction: **Next.js / React**

---

### 3.2 Admin Application

Used by authorized AMX staff.

Main areas:

* Dashboard
* Inquiries
* Customers
* Providers
* Packages
* Quotations
* Bookings
* Payments
* Follow-Ups
* Reviews & Complaints
* Reports
* Users & Roles
* Audit Logs

Technology direction: **Next.js / React**

---

### 3.3 Backend API

The backend is the central business layer.

Responsibilities:

* Authentication
* Authorization
* Business rules
* Validation
* Workflow management
* Data access
* Reporting
* Audit logging
* API security

Technology direction: **Node.js / Express**

---

### 3.4 PostgreSQL Database

Stores authoritative AMX business records.

Primary domains:

```text
Customers
    ↓
Inquiries
    ↓
Quotations
    ↓
Bookings
    ↓
Booking Services
    ↓
Providers

Bookings
    ↓
Payments

Customers
    ↓
Reviews / Complaints
```

---

## 4. Backend Module Structure

The backend shall be organized around business responsibilities rather than one large collection of controllers.

```text
Backend
├── Auth
├── Customers
├── Inquiries
├── Providers
├── Packages
├── Quotations
├── Bookings
├── Payments
├── Follow-Ups
├── Reviews
├── Complaints
├── Reports
└── Audit
```

Each module should contain its own:

* Routes
* Controllers
* Services
* Validation
* Business logic
* Data access where appropriate

Shared infrastructure should remain separate.

---

## 5. Application Layers

AMX shall use clear application layers:

```text
Presentation
     ↓
API / Routes
     ↓
Controllers
     ↓
Services / Business Logic
     ↓
Data Access
     ↓
PostgreSQL
```

### Presentation

Responsible for user interfaces.

### API / Routes

Defines API endpoints and request boundaries.

### Controllers

Handle HTTP requests and responses.

### Services

Contain business rules and workflow logic.

### Data Access

Handles database interaction.

### Database

Stores persistent data.

---

## 6. Core Business Flow

```text
Visitor
   │
   ▼
Public Website
   │
   ▼
Inquiry
   │
   ▼
AMX Admin
   │
   ▼
Provider Availability Check
   │
   ▼
Quotation
   │
   ▼
Customer Decision
   │
   ├── Decline
   │
   └── Accept
          │
          ▼
       Booking
          │
          ▼
   Payment Recording
          │
          ▼
   Trip Coordination
          │
          ▼
      Completion
          │
          ▼
       Feedback
```

---

## 7. External Boundaries

AMX interacts with external systems/services through controlled boundaries:

```text
AMX
 │
 ├── WhatsApp
 ├── Phone
 ├── Email
 ├── External Payment Methods
 ├── Cloud/Object Storage
 └── Hosting/VPS Infrastructure
```

External systems must not become tightly coupled to core business logic.

---

## 8. Security Architecture Position

Security controls exist at multiple layers:

```text
User
 ↓
HTTPS
 ↓
Authentication
 ↓
Authorization
 ↓
API Validation
 ↓
Business Rules
 ↓
Database Access
```

Important operations must also generate appropriate audit records.

---

## 9. Data Ownership

The backend is the authoritative business layer.

The frontend must not independently determine critical business rules such as:

* Booking confirmation
* Payment verification
* Provider verification
* Financial calculations
* Permission decisions
* Status transitions

These decisions must be enforced by the backend.

---

## 10. Transaction Boundaries

Database transactions shall be used where multiple related operations must succeed or fail together.

Examples:

* Creating a confirmed booking
* Updating booking/payment state
* Important financial changes
* Critical multi-record updates

This protects data integrity.

---

## 11. Scalability Strategy

The initial architecture does not require microservices.

Growth path:

```text
MVP
 │
 ▼
Modular Monolith
 │
 ▼
Vertical/Infrastructure Scaling
 │
 ▼
Module Optimization
 │
 ▼
Service Extraction Only If Justified
```

A module should only become a separate service when there is a clear operational or technical reason.

---

## 12. Reliability Strategy

The architecture shall include:

* Database backups
* Error handling
* Transaction integrity
* Audit logging
* Monitoring
* Recovery procedures
* Controlled deployments

---

## 13. Architecture Boundaries

### Inside AMX

* Customer records
* Inquiry management
* Provider records
* Packages
* Quotations
* Bookings
* Payment records
* Follow-ups
* Reviews
* Complaints
* Reports
* Authentication
* Audit

### Outside AMX

* Physical tours
* Guide operations
* Driver operations
* Hotel operations
* Boat operations
* External payment processing
* WhatsApp/phone/email communication infrastructure
* Government/regulatory systems

---

## 14. Architectural Quality Goals

The system architecture shall achieve:

**Security**
Protect users and business data.

**Integrity**
Keep bookings and financial records accurate.

**Simplicity**
Avoid unnecessary infrastructure.

**Maintainability**
Keep modules understandable and testable.

**Reliability**
Recover from failures without unacceptable data loss.

**Extensibility**
Allow future AMX capabilities without redesigning the entire system.

---

## 15. Architecture Status

**Architecture Style:** Modular Monolith
**Frontend:** Next.js / React
**Backend:** Node.js / Express
**Database:** PostgreSQL
**API:** REST
**Deployment Direction:** Docker + Cloud/VPS

**Status:** Draft for Validation

**Next Artifact:**
`docs/architecture/module-architecture.md`

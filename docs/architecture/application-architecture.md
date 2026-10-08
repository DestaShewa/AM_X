# AMX — Application Architecture

**File:** `docs/architecture/application-architecture.md`
**Phase:** 5 — System Architecture & Design
**Status:** Draft for Validation

## 1. Purpose

Define how the AMX frontend, backend, business modules, shared services, and database interact inside the application.

---

## 2. Application Structure

AMX consists of two main applications supported by one backend:

```text
                    AMX
                     │
        ┌────────────┴────────────┐
        │                         │
   Public Web                Admin Web
   Next.js/React             Next.js/React
        │                         │
        └────────────┬────────────┘
                     │
                  REST API
                     │
              Node.js / Express
                     │
        ┌────────────┴────────────┐
        │                         │
 Business Modules          Shared Services
        │                         │
        └────────────┬────────────┘
                     │
                 PostgreSQL
```

---

## 3. Frontend Architecture

### 3.1 Public Application

Responsibilities:

* Display AMX information
* Display packages
* Receive customer inquiries
* Provide contact options
* Provide terms/privacy information
* Support SEO
* Provide responsive mobile experience

The public application must not contain authoritative business rules.

---

### 3.2 Admin Application

Responsibilities:

* Secure admin access
* Manage customers
* Manage inquiries
* Manage providers
* Manage packages
* Create quotations
* Manage bookings
* Record payments
* Manage follow-ups
* Manage reviews/complaints
* View reports
* View audit information

Sensitive operations must be authorized by the backend.

---

## 4. Backend Architecture

The backend is responsible for:

```text
HTTP Request
     ↓
Route
     ↓
Middleware
     ↓
Controller
     ↓
Service
     ↓
Data Access
     ↓
PostgreSQL
```

### Responsibilities

**Routes**

* Define API endpoints.

**Middleware**

* Authentication
* Authorization
* Validation
* Rate limiting
* Request processing

**Controllers**

* Translate HTTP requests into application operations.
* Return appropriate responses.

**Services**

* Implement business workflows and rules.

**Data Access**

* Query and modify persistent data.

---

## 5. Business Logic Layer

Business rules shall primarily live in services rather than frontend code or controllers.

Examples:

### Inquiry Service

* Validate inquiry
* Manage inquiry status
* Prepare quotation workflow

### Quotation Service

* Build quotation
* Calculate totals
* Validate provider availability
* Manage acceptance/decline

### Booking Service

* Create booking
* Validate quotation acceptance
* Manage booking status
* Manage cancellation

### Payment Service

* Record payment
* Verify payment
* Calculate outstanding balance

---

## 6. Cross-Module Operations

Some workflows involve multiple modules.

Example:

```text
Accepted Quotation
       ↓
Booking Service
       ↓
Booking Created
       ↓
Payment Record
       ↓
Follow-Up Task
       ↓
Audit Event
```

Cross-module operations must use clear service boundaries and database transactions where required.

---

## 7. API Layer

The backend exposes REST APIs to:

* Public web application
* Admin application
* Future clients if approved

The API shall enforce:

* Authentication
* Authorization
* Validation
* Business rules
* Error handling
* Rate limiting where appropriate
* Audit requirements

---

## 8. Database Access

Application modules use PostgreSQL through a controlled data-access layer.

```text
Business Module
      ↓
Service
      ↓
Repository / Data Access
      ↓
PostgreSQL
```

Modules should not bypass the application layer to directly manipulate another module's data without a defined reason.

---

## 9. Shared Services

Common application services include:

```text
Shared
├── Authentication
├── Authorization
├── Validation
├── Error Handling
├── Logging
├── Audit
├── Configuration
├── File Storage
├── Notifications
└── Database
```

Shared services must remain generic and must not become a place for unrelated business logic.

---

## 10. Request Processing

### Public Inquiry Example

```text
Customer
   ↓
Inquiry Form
   ↓
Next.js
   ↓
POST /api/inquiries
   ↓
Validation
   ↓
Inquiry Service
   ↓
Customer + Inquiry Records
   ↓
Audit/Log
   ↓
Confirmation Response
```

### Admin Booking Example

```text
Admin
  ↓
Admin UI
  ↓
Booking API
  ↓
Authentication
  ↓
Authorization
  ↓
Booking Service
  ↓
Business Rule Validation
  ↓
Database Transaction
  ↓
Booking Created
  ↓
Audit Event
  ↓
Response
```

---

## 11. Error Handling

Errors shall be handled consistently.

### Categories

* Validation errors
* Authentication errors
* Authorization errors
* Business-rule errors
* Resource-not-found errors
* Database errors
* External-service errors
* Unexpected system errors

Users receive clear messages without exposing internal technical details.

---

## 12. Configuration Management

Environment-specific configuration shall be externalized.

Examples:

* Database connection
* API configuration
* Authentication secrets
* Storage configuration
* Email configuration
* External service credentials

Secrets must not be stored in source control.

---

## 13. Transaction Management

Database transactions shall be used for operations requiring atomicity.

Examples:

* Creating a booking and related booking services
* Recording critical payment changes
* Important financial updates
* Multi-record status changes

The system must avoid partial updates that create invalid business states.

---

## 14. Application Security Boundaries

```text
Internet
   ↓
HTTPS
   ↓
Frontend
   ↓
Authenticated API
   ↓
Authorization
   ↓
Business Logic
   ↓
Controlled Database Access
```

The database must not be directly accessible from the public internet.

---

## 15. Performance Approach

The application should prioritize:

* Efficient database queries
* Appropriate indexes
* Pagination
* Optimized public pages
* Controlled API payloads
* Caching where justified
* Optimized images/assets

Optimization should be based on actual bottlenecks rather than premature complexity.

---

## 16. Maintainability

The application should maintain:

* Consistent naming
* Consistent module structure
* Clear API conventions
* Centralized error handling
* Centralized configuration
* Reusable UI components
* Testable services
* Documentation for important decisions

---

## 17. Future Extension

The application architecture should allow future additions without changing the core architecture unnecessarily:

* Customer accounts
* Provider portal
* Online payments
* Automated notifications
* Amharic localization
* PWA/mobile clients
* AI-assisted operations
* Additional destinations

These remain outside the MVP implementation.

---

## 18. Architecture Status

**Frontend:** Next.js / React
**Backend:** Node.js / Express
**API:** REST
**Business Architecture:** Modular services within monolith
**Database:** PostgreSQL
**Primary Rule Location:** Backend services
**Database Access:** Controlled application layer

**Status:** Draft for Validation

**Next Artifact:**
`docs/architecture/api-architecture.md`

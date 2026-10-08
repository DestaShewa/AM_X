# AMX — Database Design Plan

**File:** `docs/database/database-design-plan.md`
**Phase:** 6 — Database & API Design
**Status:** Draft for Validation

## 1. Purpose

Define the process for designing the AMX PostgreSQL database before implementation.

The database must accurately support the approved AMX business workflow while protecting data integrity, security, traceability, and future maintainability.

---

## 2. Objectives

The database design shall:

1. Support the approved AMX requirements.
2. Represent core business entities and relationships correctly.
3. Preserve data integrity.
4. Support quotation and booking workflows.
5. Maintain accurate payment records.
6. Support reporting and auditability.
7. Enforce important business constraints.
8. Minimize unnecessary data duplication.
9. Support secure access through the backend API.
10. Provide a clear foundation for implementation and testing.

---

## 3. Database Technology

**Database:** PostgreSQL

The database will be accessed only through the AMX backend.

```text
Public/Admin Web
       ↓
    REST API
       ↓
 Node/Express
       ↓
 Data Access Layer
       ↓
 PostgreSQL
```

The frontend must never connect directly to PostgreSQL.

---

## 4. Database Design Scope

The design will cover:

* Conceptual data model
* Logical data model
* Entity definitions
* Table structure
* Primary keys
* Foreign keys
* Relationships
* Constraints
* Required/optional fields
* Data types
* Status fields
* Indexes
* Unique constraints
* Audit requirements
* Financial data integrity
* Data retention considerations
* Migration strategy
* Backup/recovery considerations
* API-to-database mapping

---

## 5. Core Entities

The initial database model contains:

1. Customer
2. Inquiry
3. Provider
4. Package
5. Quotation
6. Quotation Service
7. Booking
8. Booking Service
9. Payment
10. Follow-Up
11. Review
12. Complaint
13. User
14. Role
15. Audit Log

Additional supporting tables may be introduced only when justified by requirements.

---

## 6. Core Relationships

```text
Customer
   │
   ├── Inquiry
   │      │
   │      └── Quotation
   │             │
   │             └── Booking
   │                    │
   │                    ├── Booking Service ──► Provider
   │                    ├── Payment
   │                    ├── Follow-Up
   │                    ├── Review
   │                    └── Complaint
   │
   └── Booking

Package ───────► Quotation

User ──────────► Role
User ──────────► Audit Log
```

Detailed cardinalities will be finalized during ERD design.

---

## 7. Design Principles

### DB-01 — Integrity First

Invalid relationships and inconsistent records must be prevented.

### DB-02 — Single Source of Truth

Important business facts should have one authoritative location.

### DB-03 — Appropriate Normalization

Avoid unnecessary duplication while keeping practical query performance.

### DB-04 — Explicit Relationships

Business relationships must be represented through clear foreign keys.

### DB-05 — Financial Accuracy

Money-related records must use appropriate numeric types and controlled calculations.

### DB-06 — Auditability

Important administrative and business changes must remain traceable.

### DB-07 — Security

Sensitive data must be protected and accessed only through authorized backend operations.

### DB-08 — Simplicity

Do not create unnecessary tables or abstractions for the MVP.

### DB-09 — Extensibility

The model should allow future features without redesigning the entire database.

---

## 8. Key Database Rules

The design must enforce, where appropriate:

* Unique customer/provider/user identifiers.
* Unique inquiry references.
* Unique quotation references.
* Unique booking references.
* Valid foreign-key relationships.
* Valid status values.
* Required fields.
* Non-negative financial amounts where applicable.
* Valid dates.
* Valid booking/payment relationships.
* Controlled deletion of important records.
* Appropriate timestamps.

Critical business rules remain enforced by the backend, with database constraints providing an additional integrity layer.

---

## 9. Status Modeling

The database must support approved lifecycle states.

Examples:

**Inquiry**

`NEW → CONTACTED → PROVIDER_CHECKING → QUOTATION_SENT → AWAITING_CONFIRMATION → CONVERTED`

**Quotation**

`DRAFT → SENT → ACCEPTED / DECLINED / EXPIRED`

**Booking**

`PENDING → CONFIRMED → IN_PROGRESS → COMPLETED`

**Payment**

`PENDING → SUBMITTED → VERIFIED → PARTIAL / PAID`

Exact transition rules will be finalized during detailed schema design.

---

## 10. Financial Data Design

Financial records must distinguish:

* Booking total
* Customer payment
* Verified payment
* Outstanding balance
* Provider/business cost
* Revenue
* Gross margin
* Refunds where applicable

MVP payment records represent **external payments**, not online payment processing.

No card numbers, PINs, banking passwords, or payment credentials will be stored.

---

## 11. Audit & History

Important operations should be traceable, including:

* User changes
* Provider verification
* Quotation changes
* Booking changes
* Payment verification
* Cancellations
* Important administrative actions

The design will determine which information belongs in the audit log versus normal business records.

---

## 12. Index Strategy

Indexes will be designed for frequently used operations such as:

* Inquiry status/date
* Booking status/date
* Customer phone
* Provider type/status
* Quotation status
* Payment booking/date
* Follow-up due date
* Audit user/date

Indexes must be based on actual query requirements rather than added unnecessarily.

---

## 13. Data Security

The database design will support:

* Restricted database access
* Application-only access
* Least-privilege credentials
* Secure password representation
* Controlled sensitive-data access
* Database constraints
* Backups
* Recovery procedures
* Auditability

Production PostgreSQL must not be publicly exposed.

---

## 14. Migration Strategy

Database changes will use version-controlled migrations.

```text
Schema Change
     ↓
Migration File
     ↓
Development
     ↓
Testing
     ↓
Staging
     ↓
Production
```

Manual production schema changes should be avoided.

---

## 15. Planned Database Artifacts

Phase 6 will produce:

```text
docs/database/
├── database-design-plan.md
├── conceptual-data-model.md
├── erd.md
├── entity-specification.md
├── table-specification.md
├── relationship-specification.md
├── constraint-specification.md
├── index-strategy.md
├── audit-data-design.md
├── financial-data-design.md
├── migration-strategy.md
├── database-security.md
├── database-validation.md
└── database-baseline.md
```

---

## 16. Validation Questions

Before database implementation begins, confirm:

* Does every approved business entity have appropriate representation?
* Are relationships correct?
* Are cardinalities clear?
* Are required fields defined?
* Are important constraints identified?
* Are financial records accurate?
* Are statuses controlled?
* Is auditability sufficient?
* Is the model secure?
* Are indexes justified?
* Can the database support required reports?
* Can the schema evolve without unnecessary complexity?

---

## 17. Phase 6 Database Design Gate

Database design is complete only when:

* ERD is approved.
* Entities and relationships are validated.
* Tables and fields are specified.
* Constraints are defined.
* Index strategy is approved.
* Financial and audit data are validated.
* Security requirements are covered.
* Migration strategy is defined.
* Database design is traceable to the SRS and architecture.
* Database baseline is approved.

**No database implementation should begin before this gate is passed.**

---

## 18. Next Artifact

`docs/database/conceptual-data-model.md`

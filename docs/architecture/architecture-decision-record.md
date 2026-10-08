# AMX — Architecture Decision Record

**File:** `docs/architecture/architecture-decision-record.md`
**Phase:** 5 — System Architecture & Design
**Status:** Proposed Decisions

## 1. Purpose

Record the major architectural decisions for AMX, including the selected approach, alternatives considered, and reasons for each decision.

---

## 2. Decision Summary

| ID     | Decision               | Selected Approach                                         |
| ------ | ---------------------- | --------------------------------------------------------- |
| ADR-01 | Architecture Style     | Modular Monolith                                          |
| ADR-02 | Frontend               | Next.js / React                                           |
| ADR-03 | Backend                | Node.js / Express                                         |
| ADR-04 | API Style              | REST API                                                  |
| ADR-05 | Database               | PostgreSQL                                                |
| ADR-06 | Authentication         | Secure session/token-based admin authentication           |
| ADR-07 | Deployment             | Cloud/VPS                                                 |
| ADR-08 | Containerization       | Docker                                                    |
| ADR-09 | File Storage           | External/cloud storage when required                      |
| ADR-10 | Payments               | External payment + internal payment recording             |
| ADR-11 | Provider Access        | Manual communication in MVP                               |
| ADR-12 | External Communication | WhatsApp / Phone / Email                                  |
| ADR-13 | Monitoring             | Application logs + audit logs + infrastructure monitoring |
| ADR-14 | Backup                 | Automated database backups + recovery procedure           |

---

## 3. ADR-01 — Modular Monolith

**Decision:** Use a modular monolith.

### Reason

AMX is initially a small system with a limited development team and controlled operational scope.

A modular monolith provides:

* Simple deployment
* Lower infrastructure cost
* Easier development
* Easier debugging
* Clear business modules
* Strong database consistency
* Future extraction of modules if genuinely required

### Alternatives Rejected

**Microservices:** Too complex for the current scale.

**Serverless-only architecture:** Adds unnecessary distributed complexity for the core MVP.

---

## 4. ADR-02 — Next.js / React Frontend

**Decision:** Use Next.js with React.

### Reason

Supports:

* Public website
* Responsive interfaces
* SEO-friendly pages
* Admin dashboard
* Component reuse
* Future expansion

---

## 5. ADR-03 — Node.js / Express Backend

**Decision:** Use Node.js with Express.

### Reason

Provides:

* REST API development
* Clear middleware architecture
* Mature ecosystem
* Good fit with JavaScript frontend development
* Suitable MVP performance
* Straightforward deployment

---

## 6. ADR-04 — REST API

**Decision:** Use REST for frontend-backend communication.

### Reason

REST is:

* Simple
* Well understood
* Easy to test
* Suitable for AMX CRUD and workflow operations
* Appropriate for future integrations

GraphQL is not required for the MVP.

---

## 7. ADR-05 — PostgreSQL

**Decision:** Use PostgreSQL as the primary database.

### Reason

AMX contains strongly related transactional data:

**Customer → Inquiry → Quotation → Booking → Payment**

PostgreSQL provides:

* Relational integrity
* Transactions
* Constraints
* Strong querying
* Reliable financial data handling
* Good reporting capability

A document database is not necessary for the core domain.

---

## 8. ADR-06 — Admin Authentication

**Decision:** Implement secure authentication for AMX staff/admin users.

Requirements include:

* Password hashing
* Secure sessions/tokens
* Authorization
* Session expiry
* Password reset
* Failed-login protection
* Audit logging

Exact implementation will be finalized during application/security design.

---

## 9. ADR-07 — Cloud/VPS Deployment

**Decision:** Deploy the initial system on a managed cloud/VPS environment.

### Reason

Provides:

* Affordable operation
* Full application control
* PostgreSQL support
* Docker compatibility
* Practical deployment for an MVP

The final provider will be selected during deployment design.

---

## 10. ADR-08 — Docker

**Decision:** Use Docker for application and infrastructure consistency.

### Reason

Docker provides:

* Reproducible environments
* Easier deployment
* Consistent development/production environments
* Easier service management

Docker Compose may be used for the initial deployment where appropriate.

---

## 11. ADR-09 — External File Storage

**Decision:** Store uploaded files outside the main PostgreSQL database when appropriate.

Examples:

* Provider documents
* Package images
* Future customer documents

The database stores metadata and references rather than large binary files.

---

## 12. ADR-10 — Payment Architecture

**Decision:** AMX will record external payments but will not process online payments in MVP.

The system records:

* Amount
* Date
* Payment method
* Reference
* Verification status
* Notes

### Reason

This reduces:

* Security risk
* Integration complexity
* Regulatory exposure
* MVP development cost

---

## 13. ADR-11 — Provider Access

**Decision:** Providers will not have system accounts in the MVP.

AMX staff will communicate with providers using:

* Phone
* WhatsApp
* Email

Provider information and availability will be maintained by AMX staff.

### Reason

The MVP validates the coordination business model before introducing provider self-service.

---

## 14. ADR-12 — External Communication

**Decision:** Use existing communication channels rather than building a communication platform.

Primary channels:

* WhatsApp
* Phone
* Email

The AMX system records relevant communication outcomes where operationally necessary.

---

## 15. ADR-13 — Monitoring and Logging

**Decision:** Use application logs, security logs, audit logs, and infrastructure monitoring.

Monitor:

* Application errors
* Authentication failures
* Important business actions
* API failures
* Infrastructure health
* Backup failures

Sensitive information must not be unnecessarily logged.

---

## 16. ADR-14 — Backup and Recovery

**Decision:** Implement automated database backups and documented recovery procedures.

Minimum approach:

* Scheduled backups
* Restricted backup access
* Backup retention policy
* Recovery procedure
* Periodic recovery testing

Backups are part of the production architecture, not an optional feature.

---

## 17. Architecture Trade-Off

The selected architecture deliberately prioritizes:

**Simplicity + Reliability + Security + Maintainability**

over:

**Premature Scalability + Distributed Complexity**

If AMX later reaches significantly higher operational scale, architecture can evolve based on measured requirements.

---

## 18. Decision Status

**Overall Decision:** APPROVED AS ARCHITECTURAL DIRECTION

Detailed implementation choices remain subject to the following design artifacts:

* System architecture
* Module architecture
* Application architecture
* API architecture
* Security architecture
* Deployment architecture

**Next Artifact:**
`docs/architecture/system-architecture.md`

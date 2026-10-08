# AMX — Security Architecture

**File:** `docs/architecture/security-architecture.md`
**Phase:** 5 — System Architecture & Design
**Status:** Draft for Validation

## 1. Purpose

Define the security architecture required to protect AMX users, customer information, provider information, bookings, financial records, and system infrastructure.

Security must be enforced across the entire system, not only at the login page.

---

## 2. Security Architecture

```text id="p7m1xw"
                    Internet
                       │
                    HTTPS/TLS
                       │
                 Public / Admin UI
                       │
                Authentication
                       │
                Authorization
                       │
                API Security
                       │
              Business Rule Layer
                       │
              Controlled Data Access
                       │
                   PostgreSQL
                       │
              Backup / Recovery
```

---

## 3. Security Objectives

AMX shall protect:

1. Confidentiality of sensitive information
2. Integrity of business and financial records
3. Availability of the system
4. User accounts
5. Customer privacy
6. Provider information
7. Booking information
8. Auditability of important actions

---

## 4. Authentication Architecture

Protected AMX operations require authenticated users.

### Requirements

* Secure password hashing
* Secure login
* Session/token protection
* Session expiration
* Logout
* Password reset
* Failed-login protection
* Account status management
* Secure authentication cookies/tokens where applicable

Passwords must never be stored in plain text.

---

## 5. Authorization Architecture

AMX uses **Role-Based Access Control (RBAC)**.

```text id="d6k0xz"
User
  ↓
Role
  ↓
Permissions
  ↓
Allowed Operations
```

Authorization must be checked on the backend for every protected operation.

Frontend restrictions alone are not security controls.

---

## 6. Least Privilege

Users should receive only the permissions required for their responsibilities.

Example:

```text id="0a6b4e"
Administrator
   → Broad system management

Operations Staff
   → Customers, inquiries, providers, quotations, bookings

Finance Staff
   → Payment and financial records
```

The final role matrix remains governed by `role-permissions.md`.

---

## 7. API Security

All protected API endpoints shall enforce:

* Authentication
* Authorization
* Input validation
* Rate limiting where appropriate
* Request size limits
* Secure error handling
* CORS controls
* Secure HTTP headers

Public endpoints must expose only the minimum required functionality.

---

## 8. Input Security

All external input is untrusted.

The backend shall validate:

* Text
* Numbers
* Dates
* IDs
* URLs
* File uploads
* Query parameters
* Request bodies

Protection shall address common application risks including:

* SQL injection
* Cross-site scripting (XSS)
* Broken authentication
* Broken authorization
* Malicious file uploads
* Request abuse

---

## 9. Database Security

PostgreSQL shall:

* Remain inaccessible directly from the public internet.
* Use dedicated credentials.
* Use least-privilege database access.
* Protect connection credentials.
* Enforce appropriate constraints.
* Support transaction integrity.
* Be backed up regularly.

Database credentials must remain server-side.

---

## 10. Data Protection

Sensitive information shall be protected:

### In Transit

Use HTTPS/TLS for communication.

### At Rest

Protect databases, backups, and stored files through appropriate infrastructure controls.

### Access

Only authorized users/services may access protected information.

---

## 11. Payment Security

AMX MVP does **not** process online card/banking transactions.

The system may record:

* Amount
* Date
* Payment method
* Reference
* Verification status
* Notes

AMX shall not store:

* Bank passwords
* Card PINs
* Payment passwords
* Unnecessary payment credentials

---

## 12. Customer Privacy

AMX shall follow data minimization.

Collect only information necessary for:

* Inquiry handling
* Trip coordination
* Customer support
* Booking
* Financial records
* Legal/accounting requirements

Customer information must not be unnecessarily exposed to other customers or providers.

---

## 13. Provider Data Protection

Provider information may include operational and verification information.

Access must be controlled.

Only information necessary for coordination should be shared with customers or other providers.

---

## 14. Audit Security

Important operations must be auditable.

Examples:

* Login/security events
* User changes
* Role/permission changes
* Provider verification
* Quotation changes
* Booking changes
* Payment verification
* Cancellation
* Administrative actions

Audit records should contain:

* User
* Action
* Record
* Timestamp
* Relevant change information

Normal users should not be able to modify audit history.

---

## 15. File Upload Security

If files are supported, the system shall:

* Validate file type
* Validate file size
* Restrict allowed formats
* Generate safe filenames
* Prevent executable uploads
* Store files outside the application source
* Restrict access
* Scan files where appropriate

---

## 16. Secrets Management

Secrets must never be committed to Git.

Examples:

* Database passwords
* Authentication secrets
* API keys
* Storage credentials
* Email credentials

Use environment variables or an appropriate secret-management mechanism.

---

## 17. Infrastructure Security

Production infrastructure should include:

* HTTPS
* Firewall/network restrictions
* Restricted database access
* Secure SSH/administrative access
* Regular OS updates
* Dependency updates
* Secure Docker configuration
* Monitoring
* Backup protection

---

## 18. Backup & Recovery Security

Backups must be:

* Automated
* Access-controlled
* Protected from unauthorized modification
* Retained according to policy
* Tested periodically

Recovery procedures must be documented.

---

## 19. Logging & Monitoring

Monitor:

* Failed logins
* Authentication anomalies
* Authorization failures
* Application errors
* Suspicious requests
* Important administrative actions
* Backup failures
* Infrastructure problems

Logs must avoid unnecessary sensitive information.

---

## 20. Security Incident Response

If a security incident occurs:

```text id="4i5j89"
Detect
  ↓
Contain
  ↓
Assess
  ↓
Recover
  ↓
Document
  ↓
Prevent Recurrence
```

Critical incidents should be recorded and reviewed.

---

## 21. Security Boundaries

```text id="4wz8ak"
Public Internet
      │
      ▼
 HTTPS
      │
      ▼
Frontend
      │
      ▼
API Security
      │
 ┌────┴────┐
Auth     Validation
 │          │
 └────┬─────┘
      ▼
Authorization
      ▼
Business Logic
      ▼
Database
```

---

## 22. Security Priorities

AMX security priorities are:

1. Authentication
2. Authorization
3. Data protection
4. Input/API security
5. Database security
6. Auditability
7. Backup/recovery
8. Monitoring
9. Infrastructure hardening

---

## 23. Security Principle

> **Never trust the client. Protect the data. Enforce rules on the server. Record important actions.**

Security controls shall be applied consistently across public, admin, API, database, and deployment layers.

---

## 24. Status

**Authentication:** Defined
**Authorization:** RBAC
**API Security:** Defined
**Database Security:** Defined
**Data Protection:** Defined
**Payment Security:** Defined
**Audit:** Defined
**Backup/Recovery:** Defined
**Infrastructure Security:** Defined

**Status:** Draft for Validation

**Next Artifact:**
`docs/architecture/deployment-architecture.md`

# Database Security Specification

**File:** `docs/database/database-security.md`
**Project:** AMX — Arba Minch Experiences
**Phase:** Database & API Design
**Status:** Draft — Requires Validation

## 1. Purpose

Define how AMX protects database access, customer information, provider records, bookings, quotations, payment records, and audit history from unauthorized access, modification, disclosure, or loss.

## 2. Security Principles

* Apply least-privilege access.
* Keep the PostgreSQL database inaccessible directly from the public internet.
* Enforce authentication and authorization through the backend.
* Validate input before database operations.
* Protect sensitive information in transit and at rest.
* Preserve financial and audit history.
* Store credentials and secrets outside source code.
* Maintain tested backups and a documented recovery process.

## 3. Database Access Architecture

The approved architecture uses a Next.js frontend, an Express backend, and PostgreSQL.

```text
Public / Admin Users
        |
      HTTPS
        |
 Next.js Frontend
        |
    REST API
        |
 Express Backend
        |
 Restricted DB Connection
        |
    PostgreSQL
```

Security requirements:

* Only the backend may connect to PostgreSQL during normal application operation.
* Do not expose the database port publicly.
* Restrict database access using network rules, firewall configuration, and private networking where available.
* Permit administrative database access only through approved, secured channels.
* Do not place database credentials in frontend code.

## 4. Database Accounts and Permissions

Use separate database accounts for different responsibilities.

| Account             | Required access                                               |
| ------------------- | ------------------------------------------------------------- |
| Application account | Only the database operations required by the running backend  |
| Migration account   | Required schema-change permissions during deployments         |
| Backup account      | Only the privileges necessary to perform and validate backups |
| Administrator       | Restricted, authorized maintenance access                     |

Do not run the application as a PostgreSQL superuser.

Review database privileges whenever modules or operational responsibilities change. Remove unnecessary permissions promptly.

## 5. Authentication and Authorization

* Authenticate administrative users through the backend's approved authentication mechanism.
* Use secure password hashing; never store plaintext passwords.
* Enforce role-based access control (RBAC).
* Check permissions on every protected backend operation.
* Do not trust roles or permissions supplied by the browser.
* Restrict payment verification, refunds, provider verification, user management, and audit access to authorized personnel.
* Invalidate or revoke access when an account is disabled or compromised.

The database must not be the only security boundary. The backend is responsible for enforcing business permissions before executing sensitive queries.

## 6. Protection of Customer and Provider Data

AMX may store names, phone numbers, WhatsApp numbers, email addresses, travel dates, locations, special requests, and provider contact details.

Required controls:

* Collect only information necessary for coordination and service delivery.
* Restrict access to personal and operational notes.
* Avoid exposing internal provider costs, commission terms, or customer notes through public APIs.
* Exclude unnecessary personal data from logs and audit summaries.
* Define retention and deletion procedures before production use.
* Review applicable privacy and data-protection obligations.

Public endpoints must return only approved public information, not complete database records.

## 7. Financial Data Security

* Use decimal database types for monetary values.
* Validate all financial calculations on the backend.
* Restrict payment recording, verification, refunds, and adjustments.
* Record important financial changes in the audit log.
* Preserve original payment records and maintain traceable corrections.
* Prevent ordinary users from editing or deleting verified financial history.
* Separate customer payment records from provider costs and AMX revenue.
* Never store payment-card details or banking credentials unless a separately approved and compliant integration requires them.

AMX's MVP records payment information; it does not directly process online payments.

## 8. Query and Input Security

* Use parameterized SQL queries or a database library that safely parameterizes inputs.
* Never concatenate untrusted input into SQL statements.
* Validate IDs, data types, ranges, status values, and relationships.
* Apply database constraints in addition to application validation.
* Restrict sorting, filtering, and dynamic query fields to approved options.
* Use transactions for related business operations, including quotation acceptance and booking creation.

## 9. Secrets and Configuration

* Store credentials in protected environment variables or an approved secrets-management system.
* Keep `.env` files containing secrets out of Git.
* Provide a safe `.env.example` with placeholder values only.
* Use separate credentials for development, staging, and production.
* Rotate credentials after suspected exposure or unauthorized access.
* Do not include secrets in logs, screenshots, documentation, or error responses.

## 10. Encryption and Network Protection

* Use HTTPS for all public application traffic.
* Use encrypted database connections where connections cross untrusted networks.
* Protect database files, disks, and backups using available encryption controls.
* Restrict inbound network traffic to required services.
* Disable unused ports and services.
* Apply security updates to PostgreSQL, the operating system, Docker, and application dependencies.

Encryption at rest and backup encryption must be confirmed against the selected hosting environment before launch.

## 11. Backup and Recovery Security

* Perform automated database backups according to an approved schedule.
* Restrict backup access to authorized personnel and services.
* Protect backup files from unauthorized reading, modification, or deletion.
* Store backups separately from the primary database where practical.
* Define recovery objectives and test restoration regularly.
* Ensure backup copies do not expose unnecessary customer information.
* Document who can initiate and approve a production restore.

A backup is not considered reliable until restoration has been tested.

## 12. Audit and Monitoring

Monitor and record important events, including:

* Successful and failed administrative login attempts.
* User creation, deactivation, and role changes.
* Provider verification changes.
* Quotation and booking status changes.
* Payment verification, refunds, and financial adjustments.
* Database migration execution and important administrative operations.
* Unexpected database errors and access failures.

Audit logs must be protected against unauthorized modification. Application logs must not expose passwords, access tokens, or other secrets.

## 13. Retention and Deletion

* Define retention periods for customer, provider, financial, and audit records.
* Prefer deactivation or archival for business records that must be preserved.
* Apply approved deletion or anonymization procedures when required.
* Avoid cascading deletion of important bookings, quotations, payments, and audit history.
* Ensure database cleanup jobs cannot unintentionally remove required records.

Retention periods must be validated against applicable legal, accounting, contractual, and operational requirements.

## 14. Security Validation Checklist

* [ ] PostgreSQL is not publicly accessible.
* [ ] Application, migration, backup, and administrator privileges are separated.
* [ ] Protected backend endpoints enforce authentication and authorization.
* [ ] Passwords are securely hashed.
* [ ] SQL queries are parameterized.
* [ ] Personal and financial data are restricted appropriately.
* [ ] Secrets are excluded from source control.
* [ ] HTTPS and database network protections are configured.
* [ ] Backups are protected and restoration is tested.
* [ ] Audit records are access-controlled.
* [ ] Dependency and operating-system updates are managed.
* [ ] Retention and incident-response procedures are documented.

## 15. Decision

AMX will use layered database security: restricted network access, least-privilege database accounts, backend authorization, safe queries, protected secrets, financial auditability, and tested backups. All controls must be verified in the actual deployment environment before launch.

**Next document:** `docs/database/database-validation.md`

# AMX API Security Specification

**File:** `docs/api/api-security.md`
**Project:** AMX — Arba Minch Experiences
**Status:** Proposed — Pending Validation
**API Version:** `/api/v1`

## 1. Purpose

Define the security controls required to protect AMX APIs, customer information, provider records, bookings, financial data, and administrative operations.

Security must be enforced by the backend and database, not merely by the frontend.

## 2. Security Principles

* **Least privilege:** Users receive only the permissions required for their work.
* **Defense in depth:** Apply multiple independent security controls.
* **Secure by default:** Deny access unless explicitly authorized.
* **Data minimization:** Collect and expose only necessary information.
* **Accountability:** Audit important actions and security events.
* **Fail securely:** Unexpected failures must not expose data or bypass authorization.

## 3. Authentication and Session Security

* Require authentication for all administrative endpoints.
* Use secure server-managed sessions for staff accounts.
* Store passwords using Argon2id or appropriately configured bcrypt.
* Set session cookies with `HttpOnly`, `Secure` in production, and suitable `SameSite` settings.
* Protect cookie-authenticated state-changing requests against CSRF.
* Expire inactive sessions and invalidate sessions after logout or account deactivation.
* Apply rate limits to login attempts.
* Return generic authentication errors that do not reveal account existence.
* Never store passwords, session secrets, or authentication tokens in application logs.

Detailed authentication requirements are defined in `authentication-authorization.md`.

## 4. Authorization and Access Control

* Enforce role-based access control on every protected endpoint.
* Validate permissions for each requested operation.
* Check resource access before returning customer, provider, booking, or payment information.
* Restrict financial operations, user management, and audit-log access.
* Prevent users from accessing or modifying records by changing UUIDs in requests.
* Do not trust roles, user IDs, prices, payment statuses, or permissions supplied by the client.
* Recheck authorization for sensitive operations, including payment verification, refunds, and provider verification changes.

The final role-permission matrix must be approved before implementation.

## 5. Input Validation and Injection Prevention

* Validate request bodies, query parameters, route parameters, and uploaded files.
* Use schema-based validation and explicit allowlists for accepted fields.
* Use parameterized database queries or safe ORM query methods.
* Never concatenate untrusted input into SQL statements.
* Prevent mass assignment by mapping allowed fields explicitly.
* Encode user-generated content appropriately when rendering it.
* Enforce request-size limits and reject malformed or unsupported input.
* Validate dates, currency amounts, UUIDs, and status values on the backend.

## 6. Transport and Browser Security

* Enforce HTTPS for all production API traffic.
* Redirect HTTP requests to HTTPS where appropriate.
* Configure trusted frontend origins using a restrictive CORS allowlist.
* Never combine credentialed cross-origin requests with unrestricted origins.
* Configure secure cookies and CSRF protections consistently.
* Apply suitable security headers through the application or reverse proxy.
* Avoid exposing internal services, database ports, or administrative interfaces publicly.

CORS is not authentication or authorization and must not be used as a replacement for either.

## 7. Data Protection and Privacy

* Restrict access to customer contact information and travel details.
* Keep internal provider notes and private contact information out of public responses.
* Never expose password hashes, session data, secrets, or unnecessary personal information.
* Use HTTPS for data in transit.
* Protect database backups and stored files with appropriate access controls.
* Encrypt sensitive stored data where justified by the threat model and operational requirements.
* Establish data-retention, deletion, and privacy procedures before production launch.
* Collect only information needed to coordinate trips and operate the service.

Applicable Ethiopian legal and regulatory requirements must be reviewed before launch.

## 8. Payment and Financial Security

The MVP records payments and does not process online payments.

* Verify payment claims against appropriate evidence before marking them verified.
* Restrict payment verification and refund operations to authorized personnel.
* Validate payment amount, currency, booking association, and reference.
* Calculate balances on the backend using reliable decimal arithmetic.
* Prevent duplicate payment and refund records caused by retries.
* Preserve an audit trail for financial changes.
* Never treat a customer-submitted payment claim as proof of receipt.
* Do not store payment-card details or banking credentials unnecessarily.

If online payment processing is introduced later, conduct a separate payment-security and provider-integration review.

## 9. API Abuse Prevention

Apply appropriate rate limits and abuse controls to:

* Login and authentication endpoints.
* Public inquiry submission.
* Review and complaint submission.
* Public package and provider endpoints.
* Expensive reporting or export operations.

Additional controls should include:

* Request-size limits.
* Pagination limits.
* Timeouts for external service calls.
* Input validation and safe error handling.
* Monitoring for repeated failures and unusual traffic.
* CAPTCHA or other friction only if evidence shows it is necessary.

Use `429 Too Many Requests` when rate limits are exceeded. Configure actual limits based on testing and expected traffic.

## 10. Secrets and Configuration

* Keep credentials and secrets out of source code and Git.
* Use environment variables or an appropriate secrets-management mechanism.
* Maintain separate development and production credentials.
* Restrict access to production secrets.
* Rotate compromised or exposed credentials promptly.
* Avoid placing secrets in frontend environment variables or public build artifacts.
* Disable debug mode and verbose error output in production.
* Use a least-privilege database account for the application.

Example environment variables:

```text
DATABASE_URL
SESSION_SECRET
APP_BASE_URL
FRONTEND_ORIGIN
```

These names are illustrative. Real secret values must never be committed to the repository or included in documentation examples.

## 11. Logging, Auditing, and Monitoring

Record security-relevant events, including:

* Successful and failed login attempts.
* Account creation, deactivation, and role changes.
* Unauthorized access attempts.
* Provider verification changes.
* Booking cancellations and sensitive status changes.
* Payment verification and refunds.
* Unexpected application and database errors.

Logs must:

* Include a request identifier and timestamp where appropriate.
* Exclude passwords, session cookies, secrets, and unnecessary personal data.
* Be accessible only to authorized personnel.
* Be protected against unauthorized modification.
* Support investigation of suspicious activity.

Define log retention, alert thresholds, and incident-response responsibilities before production.

## 12. File and External-Service Security

If file uploads or external integrations are enabled:

* Allow only necessary file types and enforce file-size limits.
* Validate file content rather than trusting extensions alone.
* Store files outside executable application directories.
* Use private storage for sensitive documents.
* Restrict file access through authorization checks or short-lived signed URLs.
* Set timeouts and handle integration failures safely.
* Validate and sanitize data received from external services.
* Never expose provider credentials or integration secrets to the browser.

Only integrations approved for the MVP should be enabled.

## 13. Database and Deployment Security

* Keep PostgreSQL inaccessible from the public internet.
* Allow database access only from authorized application and administrative hosts.
* Use restricted database credentials and least-privilege permissions.
* Secure SSH and server administration.
* Apply operating-system, runtime, dependency, and database security updates.
* Use firewall rules to expose only required services.
* Protect backups and periodically test restoration.
* Separate development and production environments.
* Monitor application availability, resource usage, and errors.
* Maintain a documented recovery and incident-response procedure.

## 14. Security Testing

Before production release, test:

* Authentication bypass and session invalidation.
* Role and permission enforcement.
* Unauthorized record access and ID manipulation.
* SQL injection and mass-assignment vulnerabilities.
* CSRF and CORS configuration.
* Rate limiting and malformed requests.
* Duplicate booking, payment, and refund operations.
* Sensitive-data exposure in API responses and logs.
* Dependency vulnerabilities and production configuration.
* Backup restoration and recovery procedures.

Fix critical and high-severity findings before launch. Document accepted residual risks and their mitigations.

## 15. Acceptance Criteria

The API security design is ready for baseline approval when:

* All protected endpoints enforce authentication and authorization.
* Public endpoints expose only approved information.
* Sessions, cookies, and CSRF protections are configured securely.
* Inputs are validated and database queries are protected against injection.
* Financial operations are restricted and auditable.
* Secrets are excluded from source control and public builds.
* Database and deployment access are restricted.
* Logging, monitoring, backups, and incident-response procedures are defined.
* Security tests cover the principal threats to the MVP.

## 16. Decisions Required Before Approval

1. Approve the final role-permission matrix.
2. Finalize session, CSRF, and CORS configuration.
3. Define personal-data retention and applicable legal requirements.
4. Establish production secret management and credential-rotation procedures.
5. Confirm backup protection, retention, and recovery targets.
6. Define monitoring, incident response, and security-update responsibilities.
7. Validate security controls against the deployment architecture.

**Next document:** `docs/api/api-testing-strategy.md`.

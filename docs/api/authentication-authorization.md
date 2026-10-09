# AMX Authentication and Authorization Specification

**File:** `docs/api/authentication-authorization.md`
**Project:** AMX — Arba Minch Experiences
**Status:** Proposed — Pending Validation
**API Version:** `/api/v1`

## 1. Purpose

Define how AMX authenticates staff users, controls access to API resources, and protects customer, provider, booking, and financial information.

The MVP uses staff-managed accounts. Customers and providers do not need login accounts.

## 2. Authentication Strategy

* Staff authenticate using a registered email address and password.
* Only administrators can create staff accounts.
* Passwords must be securely hashed using Argon2id or an appropriately configured bcrypt implementation.
* Use secure, HTTP-only session cookies for browser authentication.
* Cookies must use `Secure` in production and an appropriate `SameSite` setting.
* Protect cookie-authenticated state-changing requests against CSRF.
* Enforce HTTPS in production.
* Never store plaintext passwords or authentication secrets in the database.
* Provide logout and session invalidation.
* Require reauthentication for sensitive account or permission changes.

**MVP decision:** Use server-managed sessions rather than storing authentication tokens in browser local storage. The final cookie and session configuration must match the deployment architecture.

## 3. Authentication Endpoints

| Method | Endpoint              | Purpose                                                   |
| ------ | --------------------- | --------------------------------------------------------- |
| POST   | `/api/v1/auth/login`  | Authenticate a staff user                                 |
| POST   | `/api/v1/auth/logout` | End the current session                                   |
| GET    | `/api/v1/auth/me`     | Retrieve the authenticated user's profile and permissions |

No public registration, password-reset, or customer-login endpoint is included in the initial MVP. If password recovery is needed, implement a secure recovery workflow before production launch.

## 4. User Roles

| Role               | Main Responsibilities                                                                  |
| ------------------ | -------------------------------------------------------------------------------------- |
| Admin              | Manage staff accounts, permissions, configuration, and all authorized operations       |
| Operations Staff   | Manage inquiries, customers, providers, packages, quotations, bookings, and follow-ups |
| Finance Staff      | Manage authorized payment records, refunds, and financial reports                      |
| Auditor (optional) | Read authorized audit logs and reports without changing business records               |

Roles should follow the principle of least privilege. The Auditor role is optional and should be introduced only if operational needs justify it.

## 5. Authorization Rules

Authorization must be enforced by the backend on every protected request.

| Resource / Action                      | Admin         | Operations               | Finance                   | Auditor                 |
| -------------------------------------- | ------------- | ------------------------ | ------------------------- | ----------------------- |
| Public packages and inquiry submission | Public access | Public access            | Public access             | Public access           |
| Customer and inquiry management        | Full          | Manage                   | Read only if required     | Read only if authorized |
| Provider and package management        | Full          | Manage                   | Read only if required     | Read only if authorized |
| Quotations and bookings                | Full          | Manage                   | Read as required          | Read only if authorized |
| Payment records and refunds            | Full          | No access by default     | Manage within permissions | Read only if authorized |
| Staff users and role assignments       | Full          | No                       | No                        | No                      |
| Audit logs                             | Read          | No by default            | No by default             | Read if authorized      |
| Financial reports                      | Full          | Limited operational view | Authorized financial view | Read if authorized      |

These permissions are a starting point. Before implementation, approve a detailed role-permission matrix, including who can confirm bookings, verify payments, approve refunds, and change provider verification status.

## 6. Request Authorization Flow

1. Receive the API request.
2. Validate the session or authentication credentials.
3. Load the active user and assigned permissions.
4. Reject unauthenticated requests with `401 Unauthorized`.
5. Check the required permission for the requested resource and action.
6. Reject insufficient permissions with `403 Forbidden`.
7. Validate input and business rules.
8. Execute the operation and record relevant audit events.
9. Return the standard API response.

Never trust a user ID, role, payment status, or permission supplied by the frontend.

## 7. Password and Session Security

* Enforce a reasonable minimum password length and block commonly compromised passwords where practical.
* Rate-limit login attempts and use increasing delays or temporary throttling against repeated failures.
* Return generic login errors that do not reveal whether an email address exists.
* Rotate the session identifier after successful authentication and privilege changes.
* Expire inactive sessions and impose a defined maximum session lifetime.
* Invalidate sessions after logout, account deactivation, or relevant security events.
* Avoid logging passwords, session IDs, cookies, reset tokens, or other secrets.
* Do not expose session identifiers to JavaScript.
* Configure trusted origins and cookie settings correctly for the frontend and backend deployment.

Exact session lifetimes, password recovery procedures, and rate limits must be selected and documented before production release.

## 8. Public Endpoint Protection

Public endpoints include package browsing and inquiry submission.

* Accept only required inquiry fields.
* Validate and limit request sizes.
* Apply rate limiting and abuse prevention.
* Sanitize or safely encode user-provided content when displaying it.
* Avoid exposing customer records or inquiry details through public APIs.
* Use a secure, non-enumerable mechanism for any future customer-facing quotation links.
* Do not expose private provider contact details or internal verification notes.

## 9. Sensitive Operations

The following actions require explicit permissions and audit logging:

* Creating, deactivating, or changing staff accounts.
* Assigning or removing roles.
* Changing provider verification status.
* Confirming or cancelling bookings.
* Verifying payments and recording refunds.
* Changing quotation totals or agreed booking services.
* Accessing or exporting sensitive financial information.

Where practical, require confirmation of the action and reauthentication for especially sensitive account or security changes.

## 10. Audit and Monitoring

Record security-relevant events, including:

* Successful and failed login attempts.
* Logout and session-related security events.
* Account creation, deactivation, and role changes.
* Unauthorized access attempts.
* Sensitive financial and booking changes.

Audit records should include the actor, action, target record, timestamp, outcome, and request identifier where appropriate. Do not store passwords, session secrets, or unnecessary personal information in audit logs.

Restrict audit-log modification and deletion, and monitor repeated failures or suspicious access patterns.

## 11. Error Responses

| HTTP Status | Meaning                                    |
| ----------- | ------------------------------------------ |
| `400`       | Malformed request                          |
| `401`       | Authentication required or session invalid |
| `403`       | Authenticated user lacks permission        |
| `404`       | Resource not found                         |
| `409`       | Business-state conflict                    |
| `422`       | Input or business-rule validation failure  |
| `429`       | Rate limit exceeded                        |
| `500`       | Unexpected server error                    |

Responses must not reveal stack traces, database details, credentials, or other sensitive implementation information.

## 12. Acceptance Criteria

Authentication and authorization are ready for baseline approval when:

* Staff can log in, access their profile, and log out securely.
* Unauthenticated requests cannot access protected endpoints.
* Each role is restricted to its approved operations.
* Disabled accounts and invalid sessions are rejected.
* Repeated login attempts are rate-limited.
* Session cookies and CSRF protections are configured correctly.
* Sensitive actions generate appropriate audit records.
* Public endpoints do not expose confidential data.
* Automated tests cover authentication failures, permission boundaries, and session invalidation.

## 13. Decisions Required Before Approval

1. Approve the final role-permission matrix.
2. Select session expiration and password recovery rules.
3. Confirm frontend/backend origins and production cookie settings.
4. Define permissions for payment verification, refunds, and booking cancellation.
5. Decide whether an Auditor role is required.
6. Validate security controls against the deployment and threat model.

**Next document:** `docs/api/request-response-specification.md`.

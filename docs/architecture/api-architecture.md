# AMX — API Architecture

**File:** `docs/architecture/api-architecture.md`
**Phase:** 5 — System Architecture & Design
**Status:** Draft for Validation

## 1. Purpose

Define the structure, conventions, security, and responsibilities of the AMX REST API.

The API provides a controlled boundary between the frontend applications and AMX business logic.

---

## 2. API Architecture

```text
Public Web ────────┐
                   │
Admin Web ─────────┤
                   ▼
              REST API
                   │
          ┌────────┴────────┐
          │                 │
     Middleware        Business Services
          │                 │
          └────────┬────────┘
                   ▼
              Data Access
                   │
                   ▼
              PostgreSQL
```

---

## 3. API Base Structure

The API shall use versioned endpoints.

Example:

```text
/api/v1/
```

Resource-oriented endpoints shall be preferred.

Examples:

```text
/api/v1/customers
/api/v1/inquiries
/api/v1/providers
/api/v1/packages
/api/v1/quotations
/api/v1/bookings
/api/v1/payments
```

---

## 4. API Resource Groups

| Resource      | Purpose               |
| ------------- | --------------------- |
| `/auth`       | Authentication        |
| `/users`      | Admin users           |
| `/roles`      | Roles and permissions |
| `/customers`  | Customer records      |
| `/inquiries`  | Customer inquiries    |
| `/providers`  | Provider records      |
| `/packages`   | Tourism packages      |
| `/quotations` | Quotations            |
| `/bookings`   | Bookings              |
| `/payments`   | Payment records       |
| `/follow-ups` | Follow-up tasks       |
| `/reviews`    | Reviews               |
| `/complaints` | Complaints            |
| `/reports`    | Reports               |
| `/audit-logs` | Audit records         |

---

## 5. HTTP Methods

Use standard HTTP methods:

| Method | Purpose                            |
| ------ | ---------------------------------- |
| GET    | Retrieve data                      |
| POST   | Create resource/action             |
| PATCH  | Partial update                     |
| PUT    | Full replacement where appropriate |
| DELETE | Delete where business rules permit |

Critical business operations may use explicit action endpoints where they are clearer.

Example:

```text
POST /api/v1/quotations/:id/accept
POST /api/v1/bookings/:id/cancel
POST /api/v1/payments/:id/verify
POST /api/v1/providers/:id/verify
```

---

## 6. Authentication

Protected APIs require authenticated users.

Authentication shall support:

* Secure login
* Session/token validation
* Logout
* Password management
* Session expiration
* Failed-login protection

Public endpoints shall be limited to operations that genuinely need public access.

---

## 7. Authorization

Authentication alone is insufficient.

The API must verify whether the authenticated user has permission to perform the requested operation.

```text
Request
  ↓
Authenticated?
  ↓
Authorized?
  ↓
Valid Request?
  ↓
Business Rules
  ↓
Operation
```

Authorization must be enforced on the backend.

---

## 8. Input Validation

All API input must be validated server-side.

Validate:

* Required fields
* Data types
* Length
* Formats
* Allowed values
* IDs/references
* Dates
* Numbers and monetary values
* Status transitions

Never trust frontend validation alone.

---

## 9. Business Rule Enforcement

The API shall enforce approved AMX business rules.

Examples:

* A booking normally requires an accepted quotation.
* A provider must meet verification requirements before appropriate use.
* Payments must belong to a valid booking.
* Reviews normally require completed experiences.
* Unauthorized users cannot modify protected records.

---

## 10. Status Transition Control

Status changes must be controlled by the backend.

Example:

```text
NEW
 ↓
CONTACTED
 ↓
PROVIDER_CHECKING
 ↓
QUOTATION_SENT
 ↓
AWAITING_CONFIRMATION
 ↓
CONVERTED
```

The API must reject invalid transitions rather than allowing clients to set arbitrary statuses.

---

## 11. Response Structure

Responses should use consistent structures.

### Success

```text
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

### Error

```text
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": []
  }
}
```

Exact response schema will be finalized during API specification/design.

---

## 12. HTTP Status Codes

Use appropriate HTTP status codes.

| Status | Meaning                                             |
| ------ | --------------------------------------------------- |
| 200    | Successful request                                  |
| 201    | Resource created                                    |
| 204    | Successful request with no response body            |
| 400    | Invalid request                                     |
| 401    | Authentication required/failed                      |
| 403    | Insufficient permission                             |
| 404    | Resource not found                                  |
| 409    | Business/state conflict                             |
| 422    | Validation/business input failure where appropriate |
| 429    | Too many requests                                   |
| 500    | Unexpected server error                             |

---

## 13. Pagination

Large collections shall support pagination.

Examples:

```text
GET /api/v1/inquiries?page=1&limit=20
GET /api/v1/bookings?page=2&limit=20
```

The API should also support appropriate:

* Sorting
* Filtering
* Searching

---

## 14. Filtering

Common filters include:

```text
status
date
package
provider
customer
booking
```

Example:

```text
GET /api/v1/bookings?status=CONFIRMED
```

Filtering rules must be validated and authorized.

---

## 15. Financial API Rules

Payment-related APIs must:

* Validate monetary values.
* Prevent invalid negative amounts.
* Maintain booking relationships.
* Record payment references.
* Record verification status.
* Protect financial records.
* Maintain an audit trail for important changes.

The API must **not** receive or store card PINs, banking passwords, or unnecessary payment credentials.

---

## 16. Public Inquiry API

The public inquiry endpoint must provide additional protection against abuse.

Controls may include:

* Rate limiting
* Input validation
* Spam protection
* Request size limits
* Safe error messages
* Controlled data exposure

Example:

```text
POST /api/v1/public/inquiries
```

The public API must not expose internal customer or provider information.

---

## 17. API Security

The API shall implement:

* HTTPS
* Authentication
* Authorization
* Input validation
* Rate limiting where appropriate
* Secure headers
* Safe error handling
* Request size limits
* CORS configuration
* Secret management
* Audit logging for important actions

---

## 18. Database Protection

API clients must never connect directly to PostgreSQL.

```text
Frontend
   ↓
API
   ↓
Business Logic
   ↓
Data Access
   ↓
PostgreSQL
```

Database credentials remain server-side.

---

## 19. Audit Requirements

Important API operations should generate audit events.

Examples:

* Login
* User/role changes
* Provider verification
* Quotation acceptance
* Booking creation/cancellation
* Payment verification
* Important record modifications

Audit information should include:

* User
* Action
* Record
* Timestamp
* Relevant change information

---

## 20. API Documentation

The API should be documented using an industry-standard API documentation approach, preferably **OpenAPI/Swagger**.

Documentation should include:

* Endpoint
* Method
* Authentication
* Parameters
* Request body
* Response
* Errors
* Example requests/responses

---

## 21. API Versioning

Initial API:

```text
/api/v1/
```

Breaking changes should use a new API version rather than silently changing existing contracts.

---

## 22. API Design Principles

AMX APIs shall be:

* Simple
* Consistent
* Secure
* Resource-oriented
* Validated
* Testable
* Documented
* Backward-conscious
* Business-rule compliant

---

## 23. Status

**API Style:** REST
**Version:** `/api/v1`
**Authentication:** Required for protected operations
**Authorization:** Backend enforced
**Documentation:** OpenAPI/Swagger
**Database Access:** Server-side only

**Status:** Draft for Validation

**Next Artifact:**
`docs/architecture/security-architecture.md`

# API Standards

**File:** `docs/api/api-standards.md`
**Project:** AMX — Arba Minch Experiences
**Phase:** API Design
**Status:** Draft — Pending Validation

## 1. Purpose

Define consistent conventions for AMX REST API endpoints, HTTP methods, naming, request and response formats, pagination, status codes, authentication, and versioning.

## 2. General Standards

| Item               | Standard                                                                        |
| ------------------ | ------------------------------------------------------------------------------- |
| API style          | REST                                                                            |
| Base path          | `/api/v1/`                                                                      |
| Data format        | JSON                                                                            |
| Character encoding | UTF-8                                                                           |
| Transport          | HTTPS in deployed environments                                                  |
| Resource naming    | Lowercase plural nouns                                                          |
| Field naming       | `snake_case` in API JSON                                                        |
| Date/time format   | ISO 8601                                                                        |
| Timezone           | Store timestamps consistently; display in Ethiopia local time where appropriate |
| Currency           | ISO currency code, initially `ETB`                                              |
| Identifiers        | UUID strings                                                                    |
| API documentation  | OpenAPI specification                                                           |

Example base URL:

`https://api.example.com/api/v1/`

The production domain is not yet selected. The URL above is illustrative.

## 3. Endpoint Naming

Use resource-oriented paths with plural nouns.

Examples:

```text
GET    /api/v1/packages
GET    /api/v1/packages/{package_id}
GET    /api/v1/providers
POST   /api/v1/inquiries
GET    /api/v1/inquiries/{inquiry_id}
POST   /api/v1/inquiries/{inquiry_id}/quotations
GET    /api/v1/quotations/{quotation_id}
POST   /api/v1/quotations/{quotation_id}/accept
GET    /api/v1/bookings/{booking_id}
POST   /api/v1/bookings/{booking_id}/payments
```

Use action-oriented subpaths only when an operation represents a specific business command, such as accepting a quotation or verifying a payment.

Do not expose internal database table names as the sole basis for API design.

## 4. HTTP Method Standards

| Method   | Purpose                                         | Example                                    |
| -------- | ----------------------------------------------- | ------------------------------------------ |
| `GET`    | Retrieve resources                              | `GET /packages`                            |
| `POST`   | Create a resource or perform a business command | `POST /inquiries`                          |
| `PUT`    | Replace a resource representation               | Use only when full replacement is intended |
| `PATCH`  | Update selected fields                          | `PATCH /inquiries/{id}`                    |
| `DELETE` | Delete a resource where permitted               | Avoid for historical business records      |

Business operations such as quotation acceptance, booking confirmation, and payment verification must have explicit authorization and workflow validation.

## 5. Request Standards

* Accept JSON for applicable request bodies.
* Validate required fields, types, lengths, ranges, and formats on the backend.
* Reject unsupported or malformed input with a consistent error response.
* Ignore no security checks merely because the frontend already validates a field.
* Do not accept client-supplied values for trusted identity, authorization, calculated totals, or verified payment status.
* Use query parameters for filtering, sorting, and pagination.
* Use UUIDs for resource identifiers.

Example inquiry request:

```json
{
  "name": "Example Customer",
  "phone": "+251900000000",
  "travel_date": "2026-12-10",
  "traveler_count": 4,
  "duration_days": 2,
  "budget_amount": "8000.00",
  "currency": "ETB",
  "interests": ["Lake Chamo", "Local culture"]
}
```

This is an illustrative payload. Final field names and requirements must match the approved request schemas. Monetary values may be represented as decimal strings in API contracts to avoid floating-point precision problems.

## 6. Success Response Standards

Use a consistent JSON structure for successful responses. The exact envelope must be confirmed in `request-response-specification.md`.

Example single-resource response:

```json
{
  "data": {
    "id": "resource-uuid",
    "status": "NEW"
  }
}
```

Example list response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total_items": 0,
    "total_pages": 0
  }
}
```

Do not expose password hashes, private notes, internal provider costs, commission terms, or unauthorized personal information in public responses.

## 7. HTTP Status Codes

| Status                      | Use                                                           |
| --------------------------- | ------------------------------------------------------------- |
| `200 OK`                    | Successful retrieval or update                                |
| `201 Created`               | Resource successfully created                                 |
| `202 Accepted`              | Request accepted for asynchronous processing, if supported    |
| `204 No Content`            | Successful operation with no response body                    |
| `400 Bad Request`           | Malformed or invalid request                                  |
| `401 Unauthorized`          | Authentication required or invalid                            |
| `403 Forbidden`             | Authenticated user lacks permission                           |
| `404 Not Found`             | Resource not found or intentionally concealed                 |
| `409 Conflict`              | State conflict, duplicate operation, or incompatible update   |
| `422 Unprocessable Content` | Valid JSON that violates defined validation or business rules |
| `429 Too Many Requests`     | Rate limit exceeded                                           |
| `500 Internal Server Error` | Unexpected server error                                       |
| `503 Service Unavailable`   | Service temporarily unavailable                               |

Use status codes consistently and do not expose internal exception details.

## 8. Pagination, Filtering, and Sorting

Use pagination for list endpoints that may return many records.

Proposed convention:

```text
GET /api/v1/inquiries?page=1&page_size=20&status=NEW
```

Standards:

* Default page size: 20.
* Maximum page size: 100, subject to validation.
* Validate page numbers and page size.
* Allow only documented filter fields.
* Allow only approved sort fields and directions.
* Apply authorization before returning records or calculating totals.
* Consider cursor pagination later if large datasets make offset pagination inefficient.

## 9. Date, Time, and Financial Values

* Use ISO 8601 date strings for dates, such as `2026-12-10`.
* Use ISO 8601 timestamps for timestamp fields.
* Store database timestamps using `TIMESTAMPTZ`.
* Apply Ethiopia's local timezone when displaying or interpreting user-facing schedules.
* Represent money with a defined decimal format and currency.
* Use `ETB` as the initial currency unless an approved business requirement specifies otherwise.
* Calculate totals on the backend and verify them before saving.
* Do not use binary floating-point arithmetic for financial calculations.

## 10. Authentication and Authorization

* Public endpoints must be explicitly identified.
* Protected endpoints require valid authentication.
* Apply role and permission checks on the backend.
* Enforce record-level access rules where users should see only assigned or permitted records.
* Restrict payment verification, refunds, provider verification, user administration, and audit access.
* Apply rate limits to login and public inquiry submission endpoints.
* Never treat a hidden frontend button as an authorization control.

Detailed rules will be specified in `authentication-authorization.md` and `api-security.md`.

## 11. Idempotency and Duplicate Operations

For operations where retries could create duplicate or inconsistent business records, define appropriate idempotency or duplicate-prevention behavior.

Priority operations include:

* Inquiry submission.
* Quotation acceptance.
* Booking creation.
* Payment recording.
* Payment verification.
* Refund or adjustment recording.

Use database uniqueness constraints and transactions where applicable. Do not assume every request needs a separate idempotency key; define the mechanism according to the operation's risk and expected client behavior.

## 12. API Versioning and Compatibility

* Use `/api/v1/` for the initial public API.
* Make backward-compatible additions where practical.
* Treat removing fields, changing meanings, or changing required fields as potentially breaking changes.
* Document changes and update automated tests.
* Introduce a new API version only when a breaking change cannot be handled compatibly.

## 13. Error Response Standards

Errors must use a consistent structure, for example:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": [
      {
        "field": "traveler_count",
        "issue": "Must be greater than zero."
      }
    ],
    "request_id": "request-correlation-id"
  }
}
```

Return only safe, actionable details. Never expose stack traces, SQL statements, secrets, or sensitive record data.

The final error schema will be defined in `validation-error-handling.md`.

## 14. Logging and Documentation

* Assign a request or correlation ID where appropriate.
* Log relevant errors and important operations without exposing secrets.
* Record important business changes in the audit system.
* Maintain an OpenAPI specification for endpoint contracts.
* Keep examples synchronized with actual request and response schemas.
* Test documented behavior against the implemented API.

## 15. Acceptance Checklist

* [ ] Endpoint paths and HTTP methods follow consistent conventions.
* [ ] Request and response schemas use consistent naming.
* [ ] Status codes and error structures are standardized.
* [ ] Pagination and filtering rules are defined.
* [ ] Date, time, currency, and decimal formats are consistent.
* [ ] Authentication and authorization are enforced by the backend.
* [ ] Sensitive data is excluded from unauthorized responses.
* [ ] Duplicate and retry behavior is considered for critical operations.
* [ ] Versioning and documentation practices are defined.
* [ ] Standards align with the SRS and database design.

## 16. Decision

AMX will use a versioned REST API with JSON payloads, resource-oriented routes, consistent status codes, validated inputs, backend-enforced permissions, and documented contracts. These conventions must be validated against the endpoint catalog before implementation.

**Next document:** `docs/api/endpoint-catalog.md`

# AMX API Validation and Error Handling

**File:** `docs/api/validation-error-handling.md`
**Project:** AMX — Arba Minch Experiences
**Status:** Proposed — Pending Validation
**API Version:** `/api/v1`

## 1. Purpose

Define how the AMX backend validates requests, enforces business rules, handles failures, and returns consistent, secure error responses.

All endpoints must follow this document, `api-standards.md`, and `request-response-specification.md`.

## 2. Validation Layers

Validation must occur at multiple levels:

1. **Request validation:** Check required fields, data types, formats, lengths, and request size.
2. **Authentication and authorization:** Verify the user's session and permissions.
3. **Business-rule validation:** Check status transitions, ownership, dates, prices, and workflow conditions.
4. **Database constraints:** Enforce uniqueness, foreign keys, required fields, and other integrity rules.
5. **External-service handling:** Safely handle failures from email, file storage, or other integrations.

The backend is the final authority. Frontend validation improves usability but cannot replace server-side validation.

## 3. Request Validation Rules

* Reject malformed JSON and unsupported content types.
* Accept only documented fields.
* Validate required fields and reject invalid or unexpected values.
* Apply maximum lengths to text fields and limits to arrays and request bodies.
* Validate UUIDs, dates, timestamps, email addresses, and phone numbers.
* Normalize values consistently before processing.
* Validate enum values against approved statuses.
* Reject negative counts, invalid monetary amounts, and unsupported currencies.
* Prevent invalid dates and impossible travel durations.
* Treat all user-provided content as untrusted.

Example: an inquiry must not be accepted with a negative traveler count, malformed travel date, or missing required contact information.

## 4. Business-Rule Validation

The backend must enforce these rules before changing business records.

| Area             | Validation Rule                                                               |
| ---------------- | ----------------------------------------------------------------------------- |
| Customers        | Validate required contact details and avoid duplicate records where practical |
| Providers        | Only authorized users may change verification status                          |
| Packages         | Only eligible active packages may be offered publicly                         |
| Inquiries        | Only valid status transitions are permitted                                   |
| Quotations       | Validate services, prices, expiry, and revision rules                         |
| Bookings         | A booking requires an accepted quotation and must not be duplicated           |
| Booking services | Validate service changes against booking status and agreed terms              |
| Payments         | Verify amount, currency, booking association, and authorization               |
| Refunds          | Require an authorized action and valid refund amount                          |
| Follow-ups       | Require a valid target, assigned user where applicable, and valid due date    |
| Reviews          | Apply the approved eligibility and duplicate-submission policy                |
| Complaints       | Validate the submitted details and permitted status transitions               |
| Users and roles  | Prevent unauthorized role changes and invalid account states                  |

Business rules must match the approved SRS, database design, and workflow specifications.

## 5. Standard Error Response

All API errors must follow the standard response format.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": [
      {
        "field": "traveler_count",
        "issue": "Must be greater than zero."
      }
    ],
    "request_id": "request-uuid"
  }
}
```

Field definitions:

* `code`: stable machine-readable error code.
* `message`: concise description suitable for the caller.
* `details`: optional list of field-level or business-rule errors.
* `request_id`: unique identifier for troubleshooting.

Never expose stack traces, SQL statements, internal file paths, secrets, or sensitive personal information.

## 6. Standard Error Codes

| Error Code                  | Meaning                                                    |
| --------------------------- | ---------------------------------------------------------- |
| `VALIDATION_ERROR`          | One or more request fields are invalid                     |
| `AUTHENTICATION_REQUIRED`   | Valid authentication is required                           |
| `INVALID_CREDENTIALS`       | Login credentials are invalid                              |
| `PERMISSION_DENIED`         | The user lacks required permission                         |
| `RESOURCE_NOT_FOUND`        | The requested resource does not exist or is not accessible |
| `RESOURCE_CONFLICT`         | The operation conflicts with current resource state        |
| `INVALID_STATUS_TRANSITION` | The requested status change is not allowed                 |
| `DUPLICATE_OPERATION`       | The operation has already been processed                   |
| `BUSINESS_RULE_VIOLATION`   | A business rule prevents the operation                     |
| `RATE_LIMIT_EXCEEDED`       | Too many requests were received                            |
| `SERVICE_UNAVAILABLE`       | A required service is temporarily unavailable              |
| `INTERNAL_ERROR`            | An unexpected server failure occurred                      |

Use these codes consistently across modules. Additional codes may be introduced when a clear, documented need exists.

## 7. HTTP Status Mapping

| HTTP Status                 | When to Use                                       |
| --------------------------- | ------------------------------------------------- |
| `400 Bad Request`           | Malformed JSON or invalid request structure       |
| `401 Unauthorized`          | Missing or invalid authentication                 |
| `403 Forbidden`             | Insufficient permissions                          |
| `404 Not Found`             | Resource not found                                |
| `409 Conflict`              | Duplicate operation or conflicting business state |
| `422 Unprocessable Content` | Field validation or business-rule failure         |
| `429 Too Many Requests`     | Rate limit exceeded                               |
| `500 Internal Server Error` | Unexpected server failure                         |
| `503 Service Unavailable`   | Required service temporarily unavailable          |

Use `400` for malformed requests and `422` for well-formed requests that fail validation. Use `409` when the current state prevents an otherwise valid operation.

## 8. Workflow and Status Validation

The backend must validate status transitions against the approved state models.

Examples:

* A declined quotation cannot be accepted without an approved new quotation or revision.
* An expired quotation cannot be accepted unless the business workflow explicitly permits an extension.
* A booking cannot begin before confirmation.
* A completed booking cannot be cancelled through the ordinary cancellation workflow.
* A payment cannot be marked verified by an unauthorized user.
* A refund cannot exceed the amount eligible for refund under the approved policy.
* A published review cannot be modified through unrestricted public access.

Status changes must be atomic where necessary and recorded in the audit log when they affect important business operations.

## 9. Database and Concurrency Errors

* Use database transactions for multi-step business operations.
* Enforce uniqueness and referential integrity in PostgreSQL.
* Translate expected constraint violations into safe API errors.
* Prevent multiple bookings from being created for the same quotation.
* Protect payment and refund operations against accidental duplicate submissions.
* Detect concurrent modifications to critical records where necessary.
* Roll back failed transactions to prevent partial business updates.

Never return raw database error messages to clients. Unexpected database failures should be logged internally and returned as a generic server error.

## 10. Logging and Monitoring

For each failed request, record appropriate diagnostic information:

* Request ID and timestamp.
* HTTP method and route.
* Error code and status.
* Authenticated user ID, when available and appropriate.
* Relevant resource ID.
* Sanitized technical details for debugging.

Do not log passwords, session cookies, authorization secrets, payment credentials, or unnecessary personal information.

Monitor repeated login failures, rate-limit violations, repeated business conflicts, and unexpected server errors. Use request IDs to correlate client reports with server logs.

## 11. Rate Limiting and Abuse Prevention

Apply rate limits to sensitive or publicly accessible endpoints, especially:

* Login and authentication operations.
* Public inquiry submissions.
* Review and complaint submissions.
* Expensive reports and data exports.

Return `429 Too Many Requests` when a limit is exceeded. Where useful, include a `Retry-After` header.

Choose actual limits based on expected usage and operational testing. Rate limits must not be treated as a substitute for authentication, authorization, or input validation.

## 12. Client and Server Responsibilities

**Frontend responsibilities**

* Provide immediate field-level feedback.
* Display safe, understandable error messages.
* Preserve entered data after recoverable failures.
* Avoid exposing technical details to users.

**Backend responsibilities**

* Validate every request independently.
* Enforce authentication, permissions, and business rules.
* Protect data integrity and financial operations.
* Return consistent HTTP statuses and error codes.
* Log unexpected failures securely.
* Never rely on frontend validation or disabled buttons for security.

## 13. Acceptance Criteria

This specification is ready for baseline approval when:

* Invalid request bodies are rejected consistently.
* Required fields, formats, lengths, and enum values are validated.
* Unauthorized and forbidden requests return correct status codes.
* Invalid workflow transitions are blocked.
* Database constraint violations produce safe, meaningful responses.
* Duplicate booking, payment, and refund operations are handled safely.
* Error responses follow the standard envelope.
* Sensitive information is excluded from errors and logs.
* Automated tests cover expected failures and unexpected exceptions.

## 14. Decisions Required Before Approval

1. Define exact field constraints for every endpoint.
2. Finalize allowed status transitions and corresponding error codes.
3. Define refund eligibility and payment verification rules.
4. Set request-size limits and endpoint-specific rate limits.
5. Select the application validation library and error-mapping strategy.
6. Define logging retention and monitoring thresholds.

**Next document:** `docs/api/business-workflow-specification.md`.

# AMX Request and Response Specification

**File:** `docs/api/request-response-specification.md`
**Project:** AMX — Arba Minch Experiences
**Status:** Proposed — Pending Validation
**API Version:** `/api/v1`

## 1. Purpose

Define consistent request formats, response structures, field naming, pagination, and data representation for the AMX REST API.

All endpoints must follow this specification and `api-standards.md`.

## 2. General Standards

* Base path: `/api/v1`
* Format: JSON using UTF-8 encoding.
* Content type: `application/json`
* Field naming: `snake_case`
* Resource identifiers: UUID strings.
* Dates and timestamps: ISO 8601; timestamps include a timezone.
* Currency: ETB for the initial MVP.
* Transport: HTTPS in production.
* Authentication: secure server-managed sessions for staff endpoints.
* Monetary values: decimal strings in JSON to avoid floating-point precision issues.

Example:

```http
POST /api/v1/inquiries
Content-Type: application/json
Accept: application/json
```

## 3. Standard Success Responses

### 3.1 Retrieve a resource

`GET /api/v1/packages/{slug}`

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "lake-chamo-experience",
    "name": "Lake Chamo Experience",
    "description": "A guided lake experience.",
    "destination": "Arba Minch",
    "duration_days": 1,
    "highlights": ["Lake scenery"],
    "itinerary": [],
    "inclusions": [],
    "exclusions": [],
    "important_information": null,
    "cancellation_terms": null,
    "base_price": null,
    "currency": "ETB",
    "media_references": []
  }
}
```

The example values illustrate the format only. Public package retrieval is by slug; `id` remains the UUID used for internal relationships. A `null` base price means visitors should request a quote.

**VS-004 approved package responses:** Package listing responses use the standard paginated list envelope. Public package payloads contain only the allowlisted package fields in the endpoint catalog; do not include status, provider details, internal notes, or cost data. The catalog and response shape are approved for this slice; the remaining API baseline is pending.

**VS-005 Administrator management responses:** `/api/v1/admin/packages` and `/api/v1/admin/providers` return the standard `data`/`meta` pagination envelope. Management details use `{ "data": <record> }`. Package management records include the public package fields plus `status`, `provider_ids`, `created_at`, and `updated_at`; provider records include the approved provider table fields and private operational fields and are never returned by public package APIs. Package creation defaults to `DRAFT`, `ETB`, null price/optional text, empty content arrays, and no assigned providers. Provider creation defaults to `UNVERIFIED`, `INACTIVE`, and `PENDING` agreement status. Provider assignment is a direct package association; service-level assignments are outside this slice.

Package and provider edit payloads accept only documented writable fields. Package status updates accept `DRAFT`, `ACTIVE`, `INACTIVE`, or `ARCHIVED`; provider lifecycle updates accept `ACTIVE`, `SUSPENDED`, or `INACTIVE`; verification updates accept `UNVERIFIED` or `VERIFIED`. All management writes require an active Administrator session and a valid CSRF token. Invalid fields/status values return `400`, missing records return `404`, and duplicate package slugs return `409`. Management responses are not cacheable.

**VS-008 follow-up responses:** `/api/v1/admin/follow-ups` uses the standard `data`/`meta` pagination envelope; details and create/update/status responses use `{ "data": <follow-up> }`. A follow-up contains exactly one `target_type` (`CUSTOMER` or `INQUIRY`) and `target_id`, its target label, description, due timestamp, status, optional active assignee, optional completion time/outcome notes, timestamps, and audit history on detail responses. List filters are `status`, `due=OVERDUE|UPCOMING`, and `search`. Target and active-assignee selection endpoints are Administrator-only. Writes require CSRF; invalid inputs return `400`, nonexistent records `404`, invalid lifecycle transitions or closed-record updates `409`. Responses are not cacheable.

### 3.2 Create a resource

`POST /api/v1/inquiries`

```json
{
  "data": {
    "id": "inquiry-uuid",
    "reference": "INQ-20261009-ABCDEF123456",
    "status": "NEW",
    "created_at": "2026-10-09T09:00:00.000Z"
  },
  "meta": {
    "replayed": false,
    "privacy_notice_version": "2026-10-11-v1"
  }
}
```

The first successful submission returns `201 Created`; an identical retry with the same `Idempotency-Key` returns `200` and the original confirmation. The public response contains no customer information or internal notes.

### 3.3 Update a resource

`PATCH /api/v1/inquiries/{inquiry_id}`

```json
{
  "data": {
    "id": "inquiry-uuid",
    "status": "CONTACTED",
    "updated_at": "2026-10-09T10:00:00+03:00"
  }
}
```

Return only fields appropriate to the endpoint and the caller's permissions. Do not expose internal fields unnecessarily.

## 4. Standard Error Response

All API errors should use a consistent envelope.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": [
      {
        "field": "travel_date",
        "issue": "Must not be in the past."
      }
    ],
    "request_id": "request-uuid"
  }
}
```

Rules:

* `code`: stable machine-readable error identifier.
* `message`: concise, safe description.
* `details`: optional field-level or business-rule details.
* `request_id`: identifier for troubleshooting and support.
* Never return stack traces, SQL errors, secrets, or sensitive internal information.
* Do not reveal whether a private account exists through authentication errors.

## 5. Request Body Rules

* Accept only documented fields.
* Reject or safely handle unsupported fields according to the endpoint's validation rules.
* Validate required fields, data types, lengths, formats, and business constraints on the backend.
* Trim appropriate text fields and normalize email addresses and phone numbers consistently.
* Enforce request-size limits.
* Never trust client-supplied roles, permissions, totals, payment verification status, or derived financial values.

Example inquiry request:

`Idempotency-Key: <UUID>`

```json
{
  "customer_name": "Example Customer",
  "phone": "+251900000000",
  "email": "customer@example.com",
  "preferred_contact_method": "PHONE",
  "package_id": null,
  "travel_date": "2026-11-15",
  "traveler_count": 4,
  "duration_days": 2,
  "arrival_location": "Arba Minch",
  "budget_amount": "12000.00",
  "interests": "Lake Chamo and Dorze culture",
  "hotel_required": true,
  "transport_required": true,
  "special_requests": "Family trip",
  "privacy_consent": true
}
```

For VS-006, the request fields above are the implemented contract. The backend validates future dates in `Africa/Addis_Ababa`, positive traveler and duration counts, the optional decimal ETB budget, email/contact-method consistency, active package selection, and required privacy consent. Unknown fields are rejected. Each unique submission creates a new customer; identical idempotency retries do not create duplicates.

## 6. Field Representation

| Data Type      | Representation         | Example                                  |
| -------------- | ---------------------- | ---------------------------------------- |
| UUID           | String                 | `"550e8400-e29b-41d4-a716-446655440000"` |
| Text           | String                 | `"Lake Chamo Experience"`                |
| Integer        | JSON number            | `4`                                      |
| Boolean        | JSON boolean           | `true`                                   |
| Money          | Decimal string         | `"3500.00"`                              |
| Date           | `YYYY-MM-DD`           | `"2026-11-15"`                           |
| Timestamp      | ISO 8601 with timezone | `"2026-10-09T09:00:00+03:00"`            |
| Status         | Approved enum string   | `"CONFIRMED"`                            |
| Nullable field | `null`                 | `"email": null`                          |
| Collection     | JSON array             | `"interests": ["Nature"]`                |

Use `null` when a field is intentionally absent and nullable. Do not use inconsistent representations such as empty strings, zero, and `null` interchangeably.

## 7. Pagination and Filtering

List endpoints should support pagination.

Example:

`GET /api/v1/inquiries?page=1&page_size=20&status=NEW`

Suggested response:

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

Rules:

* Default page size: `20`.
* Maximum page size: `100`.
* Validate page and page-size values.
* Support filters only when defined for the resource.
* Use deterministic ordering to prevent inconsistent results between pages.
* Restrict sensitive filters and results according to user permissions.
* Avoid exposing unnecessary customer or financial data in list responses.

**VS-007 implementation contract:** Staff inquiry routes are mounted under `/api/v1/admin` and currently require an active Administrator session; this preserves the approved VS-005 access boundary while general role permissions remain unresolved. `GET /admin/inquiries` accepts `page`, `page_size`, optional `status`, and optional `search` (case-insensitive match on inquiry reference, customer name, phone, or email). The standard paginated envelope contains list-safe inquiry and customer-contact fields. `GET /admin/inquiries/{inquiry_id}` returns linked customer/request details, staff-only `internal_notes`, and audit history. `PATCH /admin/inquiries/{inquiry_id}` accepts only `status`, `assigned_user_id`, and/or `internal_notes`; writes require CSRF protection, are audited in the same transaction, and reject inactive or missing assignees. Invalid status transitions return `409`. Manual updates cannot set `CONVERTED`; the transactional booking workflow in VS-010 must create the booking before that status is recorded. Inquiry details and internal notes are never available from public inquiry endpoints.

## 8. Update Semantics

* Use `POST` to create resources or trigger defined business actions.
* Use `PUT` when replacing a complete resource representation is explicitly supported.
* Use `PATCH` for partial updates.
* Use `GET` for retrieval without changing business state.
* Use `DELETE` only for resources where deletion is permitted by the retention and business rules.

For important business records, prefer status changes, archival, or cancellation over deletion. Business actions such as confirming bookings, verifying payments, and publishing reviews should use explicit action endpoints where defined in `endpoint-catalog.md`.

## 9. Status and Conflict Handling

Return appropriate HTTP statuses:

| Status                      | Usage                                              |
| --------------------------- | -------------------------------------------------- |
| `200 OK`                    | Successful retrieval or update                     |
| `201 Created`               | Resource created                                   |
| `202 Accepted`              | Work accepted for asynchronous processing          |
| `204 No Content`            | Successful operation with no response body         |
| `400 Bad Request`           | Malformed request                                  |
| `401 Unauthorized`          | Authentication required or invalid                 |
| `403 Forbidden`             | Insufficient permissions                           |
| `404 Not Found`             | Resource not found                                 |
| `409 Conflict`              | Duplicate operation or invalid state transition    |
| `422 Unprocessable Content` | Valid JSON that fails validation or business rules |
| `429 Too Many Requests`     | Rate limit exceeded                                |
| `500 Internal Server Error` | Unexpected failure                                 |
| `503 Service Unavailable`   | Service temporarily unavailable                    |

Use `409` for cases such as accepting an already-declined quotation or creating a second booking from the same quotation.

## 10. Concurrency and Duplicate Protection

* Use database transactions for multi-step operations.
* Prevent duplicate booking creation from a quotation.
* Protect repeatable requests that record payments, refunds, or other sensitive operations against accidental duplication.
* Consider idempotency keys for operations where retries may create duplicate effects.
* Use conflict detection when two users modify the same critical record.
* Return a clear conflict response instead of silently overwriting a newer change.

The idempotency-key format, storage duration, and endpoint coverage must be finalized during API validation.

## 11. Response Data and Privacy

* Return only fields required by the caller.
* Apply role-based field access for customer, provider, booking, payment, and audit data.
* Never return password hashes, session identifiers, secret tokens, or internal credentials.
* Public provider responses must omit private contact details and internal verification notes.
* Public inquiry submission must not return other customer records or expose administrative information.
* Avoid including sensitive personal information in URLs, error messages, or application logs.

## 12. Date, Time, and Currency Rules

* Store timestamps consistently using timezone-aware database fields.
* Represent timestamps in API responses using ISO 8601 with an explicit timezone; UTC is acceptable and recommended for storage and interchange.
* Use the Ethiopia timezone (`Africa/Addis_Ababa`) for local business display and scheduling.
* Use `YYYY-MM-DD` for calendar dates such as travel dates.
* Represent amounts as decimal strings with a defined scale.
* Include the currency where an amount could be ambiguous.
* Never calculate money using binary floating-point arithmetic.
* Define rounding, deposits, refunds, and balance calculations in the approved financial business rules.

## 13. Acceptance Criteria

This specification is ready for baseline approval when:

* Success and error envelopes are consistent across endpoints.
* Field names, data types, and nullable fields are documented.
* Pagination and filtering are consistent.
* Money and timestamps follow the defined representation.
* Validation errors identify safe, actionable issues.
* Sensitive fields are excluded from unauthorized responses.
* Duplicate and concurrent operations are handled safely.
* API examples match the approved SRS, database schema, and endpoint catalog.

## 14. Decisions Required Before Approval

1. Finalize exact request and response schemas for each endpoint.
2. Define pagination metadata and standard sorting behavior.
3. Decide where idempotency keys are required.
4. Define concurrency handling for quotations, bookings, and payments.
5. Confirm nullable fields and validation limits.
6. Align error codes and business-rule errors across all API modules.

**Next document:** `docs/api/validation-error-handling.md`.

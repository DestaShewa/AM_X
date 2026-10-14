# AMX API Endpoint Catalog

**File:** `docs/api/endpoint-catalog.md`
**Project:** AMX — Arba Minch Experiences
**Status:** Package read endpoints approved for VS-004 MVP implementation; remaining endpoint catalog pending validation.
**API Version:** `/api/v1`

## 1. Purpose

This document defines the proposed REST API endpoints for the AMX MVP. It identifies each endpoint's HTTP method, access level, and purpose.

All endpoints must follow `api-standards.md`, enforce backend authorization, validate inputs, and return consistent responses.

## 2. Access Levels

* **Public:** No login required; restricted to explicitly public operations.
* **Admin:** Authorized AMX administrator.
* **Staff:** Authorized AMX operational staff with assigned permissions.
* **Admin/Staff:** Access depends on role and operation-specific permissions.

## 3. Authentication

| Method | Endpoint       | Access      | Purpose                           |
| ------ | -------------- | ----------- | --------------------------------- |
| POST   | `/auth/login`  | Public      | Authenticate a user               |
| POST   | `/auth/logout` | Admin/Staff | End the current session           |
| GET    | `/auth/me`     | Admin/Staff | Retrieve current user information |

## 4. Public Website

| Method | Endpoint                          | Access | Purpose                                            |
| ------ | --------------------------------- | ------ | -------------------------------------------------- |
| GET    | `/packages`                       | Public | List active packages                               |
| GET    | `/packages/{slug}`                | Public | Retrieve an active package by its public slug      |
| GET    | `/providers/public`               | Public | List approved public provider profiles, if enabled |
| GET    | `/providers/public/{provider_id}` | Public | Retrieve an approved public provider profile       |
| POST   | `/inquiries`                      | Public | Submit a trip inquiry                              |

Public responses must not expose private provider details, internal notes, customer information, or operational data. Provider endpoints remain optional until the public-profile policy is approved.

**VS-004 package contract:** `GET /packages` accepts `page` (default `1`) and `page_size` (default `20`, maximum `100`), returns only `ACTIVE` packages in deterministic name/slug order, and uses the standard `data` and `meta` pagination envelope. `GET /packages/{slug}` returns one `ACTIVE` package or `404`. Public fields are `id`, `name`, `slug`, `description`, `destination`, `duration_days`, `highlights`, `itinerary`, `inclusions`, `exclusions`, `important_information`, `cancellation_terms`, `base_price`, `currency`, and `media_references`. Money is a decimal string or `null`; no private provider or operational fields are returned.

**VS-006 public inquiry contract:** `POST /inquiries` accepts the documented public trip/contact fields and requires a UUID `Idempotency-Key` header. Full name, phone, preferred contact method, future travel date, positive traveler count and duration, arrival location, accommodation/transport preferences, and privacy consent are required. Email is optional unless selected as the preferred contact method. Optional package IDs must identify an active package. Successful first submission returns `201`; identical retries with the same key return the original safe confirmation with `200`; changed content with that key returns `409`. Invalid data returns field-level `400`, inactive/missing packages return `400`, and the rate limit returns `429`. Responses contain only inquiry ID, reference, status, and timestamp. Limits: five public submissions per IP per 15 minutes.

**VS-007 implementation contract:** Management endpoints are mounted at `/api/v1/admin/inquiries` and require an active Administrator session; PATCH requests also require CSRF validation. List queries support pagination, status filtering, and case-insensitive reference/customer/phone/email search. Detail responses include the linked customer information, private request data, staff-only notes, and audit history. Updates accept status, active staff assignment, and internal notes; permitted transitions match `docs/analysis/State & Status Model.md`, except manual conversion is reserved for VS-010's transactional booking workflow. The current Administrator-only restriction does not finalize the broader staff role matrix.

## 5. Customer Management

| Method | Endpoint                             | Access      | Purpose                     |
| ------ | ------------------------------------ | ----------- | --------------------------- |
| GET    | `/customers`                         | Admin/Staff | List and search customers   |
| GET    | `/customers/{customer_id}`           | Admin/Staff | Retrieve customer details   |
| PATCH  | `/customers/{customer_id}`           | Admin/Staff | Update customer information |
| GET    | `/customers/{customer_id}/inquiries` | Admin/Staff | List a customer's inquiries |
| GET    | `/customers/{customer_id}/bookings`  | Admin/Staff | List a customer's bookings  |

Customer records are created when processing inquiries. For VS-006 public submissions, every unique submission creates a new customer; phone is not a unique identifier and is not used to match or merge records. Any future staff-side duplicate resolution requires its own approved workflow.

## 6. Provider Management

| Method | Endpoint                                | Access           | Purpose                                     |
| ------ | --------------------------------------- | ---------------- | ------------------------------------------- |
| GET    | `/admin/providers`                            | Administrator | List providers, including inactive records |
| POST   | `/admin/providers`                            | Administrator | Register a provider                       |
| GET    | `/admin/providers/{provider_id}`              | Administrator | Retrieve provider details                  |
| PATCH  | `/admin/providers/{provider_id}`              | Administrator | Update provider information                |
| PATCH  | `/admin/providers/{provider_id}/verification` | Administrator | Update verification status                 |
| PATCH  | `/admin/providers/{provider_id}/status`       | Administrator | Activate, suspend, or deactivate a provider |

Provider verification and status changes must be Administrator-only and audit logged. Provider self-service accounts are outside the MVP.

## 7. Package Management

| Method | Endpoint                              | Access           | Purpose                                    |
| ------ | ------------------------------------- | ---------------- | ------------------------------------------ |
| GET    | `/admin/packages`                     | Administrator | List all packages, including inactive ones |
| POST   | `/admin/packages`                     | Administrator | Create a package                           |
| GET    | `/admin/packages/{package_id}`        | Administrator | Retrieve package details                   |
| PATCH  | `/admin/packages/{package_id}`        | Administrator | Update package information                 |
| PATCH  | `/admin/packages/{package_id}/status` | Administrator | Activate, deactivate, or archive a package |

Historical quotations and bookings must retain the agreed package details even if the package changes later.

**VS-005 implementation decision (2026-10-11):** These routes are mounted under `/api/v1/admin`. All list endpoints accept `page` (default `1`) and `page_size` (default `20`, maximum `100`) and return the standard `data`/`meta` envelope. Mutating requests require an authenticated active Administrator and the session CSRF token. Package status is `DRAFT`, `ACTIVE`, `INACTIVE`, or `ARCHIVED`; provider verification is `UNVERIFIED` or `VERIFIED`; provider operational status is `ACTIVE`, `SUSPENDED`, or `INACTIVE`. Create, edit, status, and verification writes produce append-only audit entries in the same transaction. Unknown request fields are rejected.

## 8. Inquiry Management

| Method | Endpoint                                  | Access           | Purpose                             |
| ------ | ----------------------------------------- | ---------------- | ----------------------------------- |
| GET    | `/inquiries`                              | Admin/Staff      | List and filter inquiries           |
| GET    | `/inquiries/{inquiry_id}`                 | Admin/Staff      | Retrieve inquiry details            |
| PATCH  | `/inquiries/{inquiry_id}`                 | Admin/Staff      | Update inquiry information          |
| POST   | `/inquiries/{inquiry_id}/contact`         | Admin/Staff      | Record customer contact             |
| POST   | `/inquiries/{inquiry_id}/provider-checks` | Admin/Staff      | Record provider availability checks |
| POST   | `/inquiries/{inquiry_id}/close`           | Authorized Staff | Close an inquiry with a reason      |

Inquiry status changes must follow the approved workflow. A closed or declined inquiry must not be silently converted into a booking.

## 9. Quotations

| Method | Endpoint                               | Access           | Purpose                                              |
| ------ | -------------------------------------- | ---------------- | ---------------------------------------------------- |
| GET    | `/inquiries/{inquiry_id}/quotations`   | Admin/Staff      | List quotations for an inquiry                       |
| POST   | `/inquiries/{inquiry_id}/quotations`   | Admin/Staff      | Create a quotation                                   |
| GET    | `/quotations/{quotation_id}`           | Admin/Staff      | Retrieve quotation details                           |
| PATCH  | `/quotations/{quotation_id}`           | Admin/Staff      | Edit an eligible draft quotation                     |
| POST   | `/quotations/{quotation_id}/send`      | Admin/Staff      | Mark a quotation as sent and record delivery details |
| POST   | `/quotations/{quotation_id}/accept`    | Admin/Staff      | Record customer acceptance                           |
| POST   | `/quotations/{quotation_id}/decline`   | Admin/Staff      | Record customer rejection                            |
| POST   | `/quotations/{quotation_id}/cancel`    | Authorized Staff | Cancel a quotation                                   |
| POST   | `/quotations/{quotation_id}/revisions` | Admin/Staff      | Create a revised quotation                           |

Quotation acceptance must be transactional and prevent duplicate booking creation.

**Pending decision:** Customers initially communicate manually by phone or WhatsApp. A future secure, expiring customer-action link may allow customers to accept or decline quotations directly. Public quotation access must not rely on predictable IDs alone.

## 10. Booking Management

| Method | Endpoint                             | Access           | Purpose                                     |
| ------ | ------------------------------------ | ---------------- | ------------------------------------------- |
| GET    | `/bookings`                          | Admin/Staff      | List and filter bookings                    |
| POST   | `/quotations/{quotation_id}/booking` | Admin/Staff      | Create a booking from an accepted quotation |
| GET    | `/bookings/{booking_id}`             | Admin/Staff      | Retrieve booking details                    |
| PATCH  | `/bookings/{booking_id}`             | Admin/Staff      | Update permitted booking information        |
| POST   | `/bookings/{booking_id}/confirm`     | Authorized Staff | Confirm a booking                           |
| POST   | `/bookings/{booking_id}/start`       | Authorized Staff | Mark a trip as in progress                  |
| POST   | `/bookings/{booking_id}/complete`    | Authorized Staff | Complete a trip                             |
| POST   | `/bookings/{booking_id}/cancel`      | Authorized Staff | Cancel a booking with a reason              |

Booking creation must verify quotation acceptance, preserve agreed prices and services, and prevent multiple bookings from the same quotation. Cancellation and refund handling must follow the approved policy.

## 11. Booking Services

| Method | Endpoint                                  | Access           | Purpose                                |
| ------ | ----------------------------------------- | ---------------- | -------------------------------------- |
| GET    | `/bookings/{booking_id}/services`         | Admin/Staff      | List services included in a booking    |
| POST   | `/bookings/{booking_id}/services`         | Authorized Staff | Add an approved service when permitted |
| PATCH  | `/booking-services/{service_id}`          | Authorized Staff | Update service details                 |
| POST   | `/booking-services/{service_id}/confirm`  | Authorized Staff | Confirm provider/service arrangements  |
| POST   | `/booking-services/{service_id}/complete` | Authorized Staff | Mark a service as completed            |
| POST   | `/booking-services/{service_id}/cancel`   | Authorized Staff | Cancel a service                       |
| POST   | `/booking-services/{service_id}/fail`     | Authorized Staff | Record a failed service arrangement    |

Changes affecting an accepted quotation or confirmed booking must preserve financial and operational history.

## 12. Payment Records

| Method | Endpoint                                 | Access           | Purpose                                |
| ------ | ---------------------------------------- | ---------------- | -------------------------------------- |
| GET    | `/bookings/{booking_id}/payments`        | Admin/Staff      | List payment records                   |
| POST   | `/bookings/{booking_id}/payments`        | Authorized Staff | Record a payment submission or receipt |
| GET    | `/payments/{payment_id}`                 | Admin/Staff      | Retrieve payment details               |
| POST   | `/payments/{payment_id}/verify`          | Authorized Staff | Verify a recorded payment              |
| POST   | `/payments/{payment_id}/reject`          | Authorized Staff | Reject a payment record with a reason  |
| POST   | `/payments/{payment_id}/refunds`         | Authorized Staff | Record an approved refund              |
| GET    | `/bookings/{booking_id}/payment-summary` | Admin/Staff      | Retrieve the booking's payment summary |

These endpoints record and manage payment information; they do **not** process online payments. Payment records and booking-level payment summaries must remain distinct. Refunds and financial adjustments require authorization and audit history.

## 13. Follow-Ups

| Method | Endpoint                                      | Access          | Purpose                                     |
| ------ | --------------------------------------------- | --------------- | ------------------------------------------- |
| GET    | `/admin/follow-ups`                           | Administrator   | List, filter, and paginate follow-ups        |
| GET    | `/admin/follow-ups/targets`                   | Administrator   | Search selectable Customer or Inquiry targets |
| GET    | `/admin/follow-ups/assignees`                 | Administrator   | List active staff assignment options         |
| POST   | `/admin/follow-ups`                           | Administrator   | Create a follow-up task                     |
| GET    | `/admin/follow-ups/{follow_up_id}`            | Administrator   | Retrieve task details and audit history      |
| PATCH  | `/admin/follow-ups/{follow_up_id}`            | Administrator   | Update an open task                         |
| POST   | `/admin/follow-ups/{follow_up_id}/start`      | Administrator   | Move a pending task to in progress           |
| POST   | `/admin/follow-ups/{follow_up_id}/complete`   | Administrator   | Complete an in-progress task                 |
| POST   | `/admin/follow-ups/{follow_up_id}/cancel`     | Administrator   | Cancel a pending task                        |

List filters include `status`, `due=OVERDUE|UPCOMING`, and `search`, with standard `page` and `page_size` pagination. Exactly one Customer or Inquiry target is required. The transition graph is `PENDING → IN_PROGRESS → COMPLETED`, with `PENDING → CANCELLED`; completed and cancelled tasks are terminal. All writes require an Administrator session and CSRF token. Quotation and Booking targets are deferred until those records are implemented.

## 14. Reviews and Complaints

| Method | Endpoint                             | Access                          | Purpose                                       |
| ------ | ------------------------------------ | ------------------------------- | --------------------------------------------- |
| GET    | `/reviews`                           | Admin/Staff                     | List and moderate reviews                     |
| POST   | `/reviews`                           | Public or controlled submission | Submit a review, subject to eligibility rules |
| PATCH  | `/reviews/{review_id}`               | Authorized Staff                | Update moderation details                     |
| POST   | `/reviews/{review_id}/publish`       | Authorized Staff                | Publish an approved review                    |
| POST   | `/reviews/{review_id}/reject`        | Authorized Staff                | Reject a review                               |
| GET    | `/complaints`                        | Admin/Staff                     | List and filter complaints                    |
| POST   | `/complaints`                        | Public or Admin/Staff           | Submit a complaint                            |
| GET    | `/complaints/{complaint_id}`         | Admin/Staff                     | Retrieve complaint details                    |
| PATCH  | `/complaints/{complaint_id}`         | Admin/Staff                     | Update complaint information                  |
| POST   | `/complaints/{complaint_id}/resolve` | Authorized Staff                | Record resolution                             |
| POST   | `/complaints/{complaint_id}/close`   | Authorized Staff                | Close a complaint                             |

Review eligibility, duplicate submissions, public review access, and privacy protections must be defined before implementation.

## 15. Users and Roles

| Method | Endpoint                  | Access | Purpose                          |
| ------ | ------------------------- | ------ | -------------------------------- |
| GET    | `/users`                  | Admin  | List users                       |
| POST   | `/users`                  | Admin  | Create a staff user              |
| GET    | `/users/{user_id}`        | Admin  | Retrieve user details            |
| PATCH  | `/users/{user_id}`        | Admin  | Update user details              |
| PATCH  | `/users/{user_id}/status` | Admin  | Activate or deactivate a user    |
| GET    | `/roles`                  | Admin  | List roles                       |
| GET    | `/roles/{role_id}`        | Admin  | Retrieve role details            |
| PUT    | `/users/{user_id}/roles`  | Admin  | Assign the user's approved roles |

Do not expose password hashes, authentication secrets, or sensitive internal account data. Role assignments must be validated and audit logged.

## 16. Reports and Audit Logs

| Method | Endpoint                     | Access                                   | Purpose                                                                        |
| ------ | ---------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------ |
| GET    | `/reports/dashboard`         | Authorized Staff                         | Retrieve operational summary                                                   |
| GET    | `/reports/inquiries`         | Authorized Staff                         | Report inquiry volume and conversion                                           |
| GET    | `/reports/bookings`          | Authorized Staff                         | Report booking status and completed trips                                      |
| GET    | `/reports/financial`         | Authorized Staff                         | Report recorded income, expenses if tracked, refunds, and outstanding balances |
| GET    | `/audit-logs`                | Admin or specifically authorized auditor | Search audit history                                                           |
| GET    | `/audit-logs/{audit_log_id}` | Admin or specifically authorized auditor | Retrieve an audit record                                                       |

Reports must distinguish quotations from confirmed bookings, recorded payments from revenue, and gross income from profit. Access to financial reports and audit logs must be restricted.

## 17. API-Wide Requirements

* All protected endpoints require authentication and permission checks.
* List endpoints support pagination and appropriate filters.
* Request and response bodies follow `api-standards.md`.
* Use consistent validation errors and HTTP status codes.
* Validate status transitions on the backend.
* Use database transactions for quotation acceptance, booking creation, and other multi-step financial or business operations.
* Use idempotency or duplicate protection for sensitive repeatable actions.
* Audit important changes to users, providers, quotations, bookings, payment records, refunds, and permissions.
* Use archive, deactivate, or status-transition operations instead of deleting historical business records.
* Never expose secrets, private customer details, or internal operational notes through public endpoints.

## 18. Decisions Required Before API Baseline Approval

1. Choose the customer quotation acceptance mechanism: staff-recorded acceptance or a secure customer-action link.
2. Finalize roles and permissions for operational, financial, and audit access.
3. Approve payment, refund, cancellation, and booking-level payment-summary rules.
4. Decide whether provider profiles are publicly visible.
5. Define review eligibility and complaint-submission privacy.
6. Confirm follow-up target relationships and endpoint behavior.
7. Validate endpoint names, payloads, filters, pagination, and error responses against the database design and SRS.

**Next document:** `docs/api/authentication-authorization.md`.

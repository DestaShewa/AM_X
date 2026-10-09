# API Design Plan

**File:** `docs/api/api-design-plan.md`
**Project:** AMX — Arba Minch Experiences
**Phase:** API Design
**Status:** Draft — Pending Validation

## 1. Purpose

Define the plan for designing AMX's REST API so the Next.js frontend can communicate securely and consistently with the Express backend.

The API will support public tourism pages, customer inquiries, provider coordination, quotations, bookings, payment records, follow-ups, reviews, complaints, and administrative reporting.

## 2. Objectives

* Define consistent API endpoints and HTTP methods.
* Establish request and response formats.
* Specify authentication, authorization, and input validation.
* Map endpoints to approved business workflows and database entities.
* Define consistent error handling and status codes.
* Protect customer, provider, and financial information.
* Support maintainable implementation and automated testing.

## 3. Scope

### In scope

* Public package and provider information.
* Customer and inquiry management.
* Provider and package administration.
* Quotation creation, revision, and decisions.
* Booking and booking-service management.
* Payment recording and verification.
* Follow-ups, reviews, and complaints.
* User management, roles, audit access, and reports.
* API security, validation, logging, and testing.

### Out of scope for the MVP

* Online payment processing.
* Provider self-service accounts.
* Native mobile APIs beyond the needs of the responsive website.
* Automated provider availability integrations.
* AI chatbot and automated trip planning.
* Automatic commission splitting.
* Multi-city marketplace functionality.

## 4. Technology and Architecture

| Component      | Decision                                 |
| -------------- | ---------------------------------------- |
| Frontend       | Next.js and React                        |
| Backend        | Node.js and Express                      |
| API style      | REST                                     |
| API base path  | `/api/v1/`                               |
| Data format    | JSON                                     |
| Database       | PostgreSQL                               |
| Authentication | Secure backend-managed authentication    |
| Authorization  | Role-based access control (RBAC)         |
| Transport      | HTTPS in deployed environments           |
| Documentation  | OpenAPI-compatible specification         |
| Testing        | Automated endpoint and integration tests |

The API will run within the existing modular monolith. Separate microservices are not required for the MVP.

## 5. API Design Principles

* Use resource-oriented endpoints and appropriate HTTP methods.
* Apply consistent naming, pagination, filtering, and sorting conventions.
* Validate all inputs on the backend.
* Enforce permissions on every protected operation.
* Keep business logic in backend services rather than relying on frontend validation.
* Use database transactions for operations that must succeed or fail together.
* Return only fields authorized for the requesting user.
* Preserve historical quotations, bookings, payments, and audit records.
* Version public API contracts through the `/api/v1/` prefix.
* Document endpoints before implementing them.

## 6. Main API Modules

| Module           | Main responsibility                                 |
| ---------------- | --------------------------------------------------- |
| Authentication   | Login, logout, current-user information             |
| Users and Roles  | Administrative accounts and permissions             |
| Customers        | Customer records and contact details                |
| Providers        | Provider records and verification                   |
| Packages         | Public packages and administrative management       |
| Inquiries        | Trip requests and inquiry workflow                  |
| Quotations       | Pricing, revisions, and customer decisions          |
| Bookings         | Confirmed trips and booking status                  |
| Booking Services | Services, providers, and operational progress       |
| Payments         | Payment records, verification, and financial status |
| Follow-ups       | Reminders and assigned tasks                        |
| Reviews          | Feedback and moderation                             |
| Complaints       | Issue tracking and resolution                       |
| Reports          | Operational and financial summaries                 |
| Audit Logs       | Authorized review of important system actions       |

## 7. API Design Workflow

1. Define shared API conventions.
2. Create the endpoint catalog.
3. Define authentication and authorization rules.
4. Specify request and response schemas.
5. Define validation and error handling.
6. Document business workflows and status transitions.
7. Define security controls.
8. Plan automated API testing.
9. Validate endpoint coverage against the SRS and database design.
10. Approve and baseline the API specification before implementation.

## 8. Required Design Outputs

The API design phase will produce:

* `api-design-plan.md`
* `api-standards.md`
* `endpoint-catalog.md`
* `authentication-authorization.md`
* `request-response-specification.md`
* `validation-error-handling.md`
* `business-workflow-specification.md`
* `api-security.md`
* `api-testing-strategy.md`
* `api-validation.md`
* `api-baseline.md`

All documents belong in `docs/api/`.

## 9. Validation Criteria

The API design is acceptable when:

* Every required MVP workflow has corresponding endpoint coverage.
* Endpoint permissions match the role-permission specification.
* Request and response schemas are consistent.
* Validation rules align with the SRS and database constraints.
* Critical business operations have defined transactional behavior.
* Errors use consistent formats and appropriate HTTP status codes.
* Sensitive information is protected.
* Testing covers success, validation failure, authorization failure, and business-rule violations.
* Outstanding business decisions are recorded instead of silently assumed.

## 10. Dependencies and Constraints

API design depends on the approved SRS, business rules, role permissions, system architecture, and database model.

The database baseline is currently proposed. Any unresolved financial, relationship, or workflow decisions that affect endpoint behavior must be resolved or explicitly deferred before implementation.

## 11. Risks

| Risk                                     | Mitigation                                                   |
| ---------------------------------------- | ------------------------------------------------------------ |
| API behavior conflicts with requirements | Trace endpoints to requirements and business rules.          |
| Unauthorized data access                 | Apply backend authorization and response filtering.          |
| Inconsistent financial calculations      | Centralize calculations and use transactions where required. |
| Excessive API complexity                 | Implement only MVP requirements.                             |
| Frontend and backend contract mismatch   | Maintain shared API documentation and automated tests.       |
| Unclear status transitions               | Define permitted transitions before implementation.          |

## 12. Acceptance and Approval

* [ ] API standards are defined.
* [ ] Endpoint catalog covers all MVP modules.
* [ ] Authentication and permissions are specified.
* [ ] Request, response, and error schemas are documented.
* [ ] Critical workflows are mapped to endpoints.
* [ ] Security and testing requirements are defined.
* [ ] Requirements and database consistency are reviewed.
* [ ] Open decisions have documented owners or deferrals.

**Current status:** Draft — Pending Validation.

**Next document:** `docs/api/api-standards.md`

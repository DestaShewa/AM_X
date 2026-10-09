# AMX API Testing Strategy

**File:** `docs/api/api-testing-strategy.md`
**Project:** AMX — Arba Minch Experiences
**Status:** Proposed — Pending Validation
**API Version:** `/api/v1`

## 1. Purpose

Define the testing approach for verifying that AMX APIs are functional, secure, reliable, and consistent with approved requirements, business workflows, and database constraints.

Testing must begin before implementation is considered complete and continue throughout development.

## 2. Testing Objectives

* Verify that each endpoint behaves according to its specification.
* Confirm authentication, authorization, and data privacy controls.
* Validate business rules and permitted status transitions.
* Protect database integrity and financial accuracy.
* Detect duplicate operations and concurrency problems.
* Verify consistent responses and error handling.
* Prevent regressions when existing functionality changes.

## 3. Testing Levels

| Test Level           | Purpose                                                                    |
| -------------------- | -------------------------------------------------------------------------- |
| Unit testing         | Test individual functions, validators, services, and business rules        |
| Integration testing  | Verify interactions among API modules, PostgreSQL, and external services   |
| API contract testing | Verify endpoint paths, request schemas, response schemas, and status codes |
| Workflow testing     | Test complete inquiry-to-trip business processes                           |
| Security testing     | Test authentication, permissions, input handling, and data exposure        |
| Performance testing  | Evaluate response times and behavior under expected workloads              |
| Regression testing   | Confirm changes do not break previously working functionality              |
| Acceptance testing   | Confirm the API satisfies approved MVP requirements                        |

## 4. Testing Environment

Use separate environments for development, testing, and production.

The test environment should include:

* Node.js and Express backend.
* A dedicated PostgreSQL test database.
* Test users for each approved role.
* Synthetic customers, providers, packages, inquiries, quotations, bookings, and payment records.
* Environment-specific configuration and test credentials.
* Automated test execution in the development workflow and CI pipeline.

Never run automated tests against production data or use real customer information unnecessarily.

Tests must clean up or isolate their data so they can run repeatedly without unexpected results.

## 5. Recommended Testing Tools

| Tool                     | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| Vitest or Jest           | Unit and service testing                         |
| Supertest                | Testing Express API requests and responses       |
| PostgreSQL test database | Database constraints and transaction testing     |
| OpenAPI tooling          | API contract validation and documentation checks |
| Playwright, if needed    | End-to-end testing of critical browser workflows |
| CI pipeline              | Automated execution of tests on changes          |

Choose and standardize the final toolchain before implementation. Avoid adding unnecessary testing dependencies.

## 6. Endpoint Testing

Every endpoint should be tested for the following cases where applicable:

1. Valid request with expected result.
2. Missing required fields.
3. Invalid data types and formats.
4. Invalid UUID or nonexistent resource.
5. Invalid status or business-rule violation.
6. Unauthenticated request.
7. Authenticated request with insufficient permissions.
8. Duplicate submission or repeated action.
9. Database or dependency failure.
10. Correct response structure and HTTP status.

Test public and protected endpoints separately. Verify that list endpoints enforce pagination, filtering, and permission restrictions.

## 7. Authentication and Authorization Tests

Verify that:

* Valid staff credentials allow login.
* Invalid credentials return a safe error.
* Protected endpoints reject unauthenticated requests.
* Users cannot perform actions outside their permissions.
* Deactivated users cannot continue using invalidated sessions.
* Logout invalidates the relevant session.
* Session cookies use the required security attributes.
* CSRF protection works for cookie-authenticated state-changing requests.
* Repeated login attempts are rate-limited.
* Users cannot gain privileges by changing request fields.

Test each approved role against both allowed and prohibited operations.

## 8. Business Workflow Tests

### Inquiry to Booking

Test the complete flow:

1. Submit a valid public inquiry.
2. Contact the customer and record the action.
3. Record provider availability checks.
4. Create and send a quotation.
5. Record acceptance of the correct quotation version.
6. Create exactly one booking.
7. Confirm provider services.
8. Record and verify applicable payments.
9. Start and complete the trip.
10. Record feedback or a complaint where applicable.

Verify that invalid transitions are rejected and the system preserves history.

### Quotation Tests

* Draft quotations can be edited by authorized staff.
* Sent quotations preserve their issued terms.
* Revisions do not overwrite previous issued versions.
* Expired or declined quotations cannot be accepted improperly.
* Duplicate acceptance does not create multiple bookings.

### Booking Tests

* A booking cannot be created without an accepted quotation.
* A quotation cannot produce more than one booking.
* Unconfirmed bookings cannot start a trip.
* Cancellation follows the approved policy.
* Completed bookings cannot be cancelled through ordinary workflow actions.

### Payment Tests

* Payment records are linked to the correct booking.
* Invalid amounts and currencies are rejected.
* Unauthorized users cannot verify payments or record refunds.
* Repeated requests do not create duplicate financial records.
* Booking payment summaries correctly account for verified payments and applicable refunds.
* Failed transactions do not leave inconsistent financial records.

## 9. Database and Transaction Tests

Verify that:

* Foreign-key constraints prevent invalid relationships.
* Unique constraints prevent prohibited duplicates.
* Required fields and check constraints are enforced.
* Failed transactions roll back completely.
* Quotation acceptance and booking creation remain consistent.
* Concurrent requests cannot create duplicate bookings.
* Concurrent financial updates preserve correct totals.
* Audit records are generated for required sensitive operations.
* Historical quotation and booking information remains intact after package changes.

Use a real PostgreSQL test instance for database-specific behavior rather than relying exclusively on mocks.

## 10. Security Tests

Test for:

* SQL injection and unsafe query construction.
* Mass-assignment vulnerabilities.
* Unauthorized access to records by changing identifiers.
* Sensitive fields exposed through API responses.
* Excessive public endpoint access.
* Malformed and oversized requests.
* Unsafe file handling, if uploads are introduced.
* Secrets or personal information appearing in logs.
* Insecure production configuration and dependency vulnerabilities.

Resolve critical and high-severity vulnerabilities before production deployment.

## 11. Performance and Reliability Tests

Test important endpoints under realistic expected traffic, particularly:

* Public package browsing.
* Inquiry submission.
* Inquiry and booking lists.
* Quotation creation and acceptance.
* Payment summaries.
* Dashboard and financial reports.

The initial performance target is to aim for normal API response times of **two seconds or less**, excluding external network delays and slow third-party services, consistent with the approved non-functional requirements.

Measure response time, error rate, database query performance, and resource usage. Establish realistic concurrency targets before formal load testing.

## 12. API Contract Tests

Validate endpoints against:

* `endpoint-catalog.md`
* `request-response-specification.md`
* `validation-error-handling.md`
* `authentication-authorization.md`
* `business-workflow-specification.md`

Check HTTP methods, paths, request fields, response envelopes, status codes, pagination, and error codes.

Update the OpenAPI specification and related tests whenever an approved API contract changes.

## 13. Test Data Management

* Use synthetic data with no real customer personal information.
* Create reusable fixtures for each user role and major business entity.
* Include normal, invalid, duplicate, expired, cancelled, and completed records.
* Keep test environments separate from production.
* Reset or isolate test data safely.
* Never commit production credentials or sensitive datasets into Git.

## 14. Defect Management

Each defect should include:

* Unique identifier and summary.
* Steps to reproduce.
* Expected and actual results.
* Severity and priority.
* Relevant request ID or sanitized logs.
* Assigned owner and resolution status.
* Regression test where appropriate.

Suggested severity levels:

* **Critical:** Major security breach, severe data loss, or core service unavailable.
* **High:** Major workflow failure or financial/data-integrity risk.
* **Medium:** Important functionality is impaired but a workaround exists.
* **Low:** Minor issue with limited operational impact.

## 15. Entry and Exit Criteria

**Testing entry criteria**

* Requirements and endpoint contracts are sufficiently defined.
* The test environment is available.
* Database migrations can be applied to a clean test database.
* Test data and credentials are configured.
* Acceptance criteria are documented.

**Testing exit criteria**

* All critical workflows pass.
* No unresolved critical or high-severity defects remain.
* Authorization and financial-integrity tests pass.
* Database transaction and duplicate-operation tests pass.
* Required automated tests pass in CI.
* API documentation matches the implemented behavior.
* Remaining risks are documented and formally accepted.

## 16. Acceptance Criteria

The testing strategy is ready for baseline approval when:

* Every endpoint has defined test cases.
* Authentication and role-permission coverage is planned.
* Inquiry-to-booking and payment workflows are tested end to end.
* Database constraints and transactions are tested against PostgreSQL.
* Security and performance tests have defined acceptance criteria.
* Tests are repeatable and integrated into the development process.
* Defect tracking and release criteria are documented.

## 17. Decisions Required Before Approval

1. Select the final unit and integration testing tools.
2. Define minimum test coverage targets for critical modules.
3. Establish expected concurrency and load-testing targets.
4. Finalize the CI pipeline and test execution rules.
5. Confirm severity-based release blocking criteria.
6. Align test cases with the approved endpoint catalog, SRS, and database baseline.

**Next document:** `docs/api/api-validation.md`.

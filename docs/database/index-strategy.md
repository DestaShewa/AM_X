# Database Index Strategy

**File:** `docs/database/index-strategy.md`
**Project:** AMX — Arba Minch Experiences
**Phase:** Database & API Design
**Status:** Draft — Requires Validation

## 1. Purpose

Define PostgreSQL indexes that improve query performance for AMX's public inquiries, admin dashboard, customer records, provider coordination, bookings, payments, reporting, and audit history.

Indexes must support actual query patterns without unnecessarily slowing down inserts and updates.

## 2. Indexing Principles

* PostgreSQL automatically creates indexes for primary keys and unique constraints.
* Add indexes to frequently queried foreign keys where useful; PostgreSQL does not automatically index referencing foreign-key columns.
* Prioritize admin dashboard filters, status-based queues, date ranges, and business-reference lookups.
* Use composite indexes when queries commonly filter or sort by multiple columns.
* Avoid indexing every column.
* Validate index choices using realistic data and `EXPLAIN ANALYZE`.
* Consider index maintenance and storage costs as the database grows.

## 3. Recommended Indexes

| Table                | Index columns                               | Purpose                                                                  |
| -------------------- | ------------------------------------------- | ------------------------------------------------------------------------ |
| `users`              | Unique normalized email, when provided      | Login and duplicate prevention                                           |
| `users`              | Unique normalized username, when provided   | Login and duplicate prevention                                           |
| `users`              | `role_id`                                   | Filter users by role                                                     |
| `customers`          | `phone`                                     | Customer lookup                                                          |
| `customers`          | `status`                                    | Filter active or blocked customers when needed                           |
| `providers`          | `verification_status`, `provider_type`      | Find eligible providers by type and verification state                   |
| `providers`          | `name`                                      | Provider search; consider a search-specific index if needed              |
| `packages`           | Unique `slug`                               | Retrieve package details by URL                                          |
| `packages`           | `status`                                    | Retrieve active public packages                                          |
| `inquiries`          | Unique `reference`                          | Open an inquiry by reference                                             |
| `inquiries`          | `(status, created_at DESC)`                 | Prioritize and review inquiry queues                                     |
| `inquiries`          | `(assigned_user_id, status)`                | Find work assigned to an AMX user                                        |
| `inquiries`          | `travel_date`                               | Find upcoming travel requests                                            |
| `inquiries`          | `customer_id`                               | Retrieve a customer's inquiry history                                    |
| `quotations`         | Unique `reference`                          | Retrieve a quotation by reference                                        |
| `quotations`         | Unique `(inquiry_id, revision_number)`      | Enforce revision uniqueness and retrieve revisions                       |
| `quotations`         | `(status, valid_until)`                     | Review pending and expiring quotations                                   |
| `quotations`         | `customer_id`                               | Retrieve customer quotations                                             |
| `quotation_services` | `quotation_id`                              | Retrieve services for a quotation                                        |
| `quotation_services` | `provider_id`                               | Find quotations involving a provider, when populated                     |
| `bookings`           | Unique `reference`                          | Retrieve a booking by reference                                          |
| `bookings`           | Unique `quotation_id`                       | Enforce at most one booking per quotation                                |
| `bookings`           | `(booking_status, travel_date)`             | Review upcoming trips and operational queues                             |
| `bookings`           | `(customer_id, travel_date DESC)`           | Retrieve customer booking history                                        |
| `booking_services`   | `booking_id`                                | Retrieve services for a booking                                          |
| `booking_services`   | `(provider_id, service_date)`               | Review provider assignments and schedules                                |
| `booking_services`   | `(status, service_date)`                    | Monitor pending and upcoming services                                    |
| `payments`           | `(booking_id, payment_date DESC)`           | Retrieve booking payment history                                         |
| `payments`           | `(verification_status, payment_date)`       | Review payments awaiting verification                                    |
| `payments`           | `reference`                                 | Search payment references when available                                 |
| `follow_ups`         | `(status, due_at)`                          | Find pending and overdue follow-ups                                      |
| `follow_ups`         | `(assigned_user_id, status, due_at)`        | Display each user's work queue                                           |
| `follow_ups`         | `inquiry_id`                                | Retrieve follow-ups for an inquiry, if this direct reference is included |
| `follow_ups`         | `quotation_id`                              | Retrieve follow-ups for a quotation, if included                         |
| `follow_ups`         | `booking_id`                                | Retrieve follow-ups for a booking, if included                           |
| `reviews`            | `(status, created_at DESC)`                 | Moderate and review submissions                                          |
| `reviews`            | `booking_id`                                | Retrieve reviews for a booking                                           |
| `complaints`         | `(status, priority, created_at DESC)`       | Prioritize unresolved complaints                                         |
| `complaints`         | `(assigned_user_id, status)`                | Retrieve complaints assigned to a user                                   |
| `complaints`         | `booking_id`                                | Find complaints associated with a booking                                |
| `audit_logs`         | `(created_at DESC)`                         | Review recent activity                                                   |
| `audit_logs`         | `(entity_type, entity_id, created_at DESC)` | Investigate changes to a particular record                               |
| `audit_logs`         | `(user_id, created_at DESC)`                | Review actions by a user                                                 |

**Implementation note:** The listed columns are recommendations, not a requirement to create every index immediately. Confirm actual query patterns before finalizing the migration.

## 4. Composite Index Strategy

Composite indexes should follow the order of the expected query filters.

Examples:

* `(status, created_at DESC)` for a dashboard filtered by status and sorted by creation time.
* `(booking_status, travel_date)` for a list of bookings filtered by status and ordered or filtered by travel date.
* `(assigned_user_id, status, due_at)` for a user's pending follow-up queue.

The leading columns matter: an index on `(status, created_at)` is not generally equivalent to a standalone index on `created_at`.

Avoid creating separate indexes that duplicate the useful leading columns of an existing composite index unless query evidence justifies them.

## 5. Unique and Partial Indexes

Use unique indexes or unique constraints for:

* Business references.
* Package slugs.
* User login identifiers, when present.
* Quotation revision numbers within each inquiry.
* One booking per quotation.

For optional user identifiers, use partial unique indexes or an equivalent design that allows null values while preventing duplicate non-null identifiers. Normalize case and whitespace consistently before enforcing uniqueness.

Consider a partial index for active packages or pending follow-ups only if measurements show it improves common queries.

## 6. Search Indexes

Start with standard indexes for exact lookup and filtering.

If AMX needs broader search:

* Consider PostgreSQL full-text search for package descriptions and provider/service information.
* Consider `pg_trgm` indexes for partial name and text searches.
* Avoid adding these extensions until a demonstrated search requirement exists.

Public package search must return only active, publishable packages. Internal provider search must respect access permissions.

## 7. Reporting and Financial Queries

* Index booking travel dates and operational statuses for trip planning.
* Index payment verification status and dates for payment reconciliation.
* Index booking and customer references for payment-history queries.
* Prefer query-level aggregation over storing duplicate totals without a consistency strategy.
* Add specialized reporting indexes only after measuring real reporting queries.

Financial reports must distinguish verified customer payments, refunds or adjustments, provider costs, AMX revenue, and profit.

## 8. Indexes to Avoid Initially

Do not automatically index:

* Every status column independently.
* Low-selectivity boolean columns without a demonstrated benefit.
* Large JSONB fields without specific JSONB query requirements.
* Frequently updated fields without evaluating write overhead.
* The same column repeatedly through redundant indexes.
* Fields that are never used in filters, joins, sorting, or uniqueness checks.

## 9. Performance Validation

Before approving indexes:

1. List the most frequent and most important database queries.
2. Create representative test data.
3. Run queries with `EXPLAIN ANALYZE`.
4. Review sequential scans, index scans, join strategies, and query execution time.
5. Compare performance before and after adding indexes.
6. Test common insert and update operations.
7. Revisit index usage as real AMX activity grows.

Do not use execution plans from an empty database as the only evidence for production index decisions.

## 10. Acceptance Checklist

* [ ] Primary-key and unique indexes are accounted for.
* [ ] Frequently used foreign-key columns have been evaluated.
* [ ] Inquiry and booking dashboard queries are supported.
* [ ] Upcoming travel and provider assignment queries are supported.
* [ ] Payment reconciliation and audit-history queries are supported.
* [ ] Composite indexes match actual filter and sort patterns.
* [ ] Redundant and low-value indexes are excluded.
* [ ] Search-specific indexes are added only when needed.
* [ ] Performance is validated with representative data.

## 11. Decision

Adopt a minimal, query-driven indexing strategy for the first AMX release. Finalize indexes alongside API query design and database migrations, then refine them using measured performance.

**Next document:** `docs/database/audit-data-design.md`

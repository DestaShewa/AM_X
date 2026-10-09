# AMX — Table Specification

**File:** `docs/database/table-specification.md`
**Phase:** 6 — Database & API Design
**Status:** Draft for Validation

## 1. Purpose

Define the proposed PostgreSQL tables, columns, data types, keys, and nullability for AMX. This specification translates the conceptual model and entity specifications into a relational database design.

## 2. Database Conventions

* Database: PostgreSQL
* Table names: `snake_case`, plural
* Primary keys: UUID
* Timestamps: `TIMESTAMPTZ`
* Monetary values: `NUMERIC(12,2)` with an explicit currency code
* Status fields: `VARCHAR` constrained to approved values
* Required fields: `NOT NULL`
* Optional fields: nullable
* Foreign keys: explicitly defined
* Passwords: secure hashes only
* All business tables should include `created_at`; mutable tables should also include `updated_at` where appropriate.

**General rule:** The backend validates business rules; database constraints enforce data integrity.

## 3. `roles`

| Column        | Type        | Constraints            |
| ------------- | ----------- | ---------------------- |
| `id`          | UUID        | PK                     |
| `name`        | VARCHAR(50) | NOT NULL, UNIQUE       |
| `description` | TEXT        | NULL                   |
| `permissions` | JSONB       | NOT NULL, default `{}` |
| `created_at`  | TIMESTAMPTZ | NOT NULL               |
| `updated_at`  | TIMESTAMPTZ | NOT NULL               |

## 4. `users`

| Column          | Type         | Constraints                          |
| --------------- | ------------ | ------------------------------------ |
| `id`            | UUID         | PK                                   |
| `role_id`       | UUID         | FK → `roles.id`, NOT NULL            |
| `full_name`     | VARCHAR(150) | NOT NULL                             |
| `email`         | VARCHAR(255) | UNIQUE, nullable if username is used |
| `username`      | VARCHAR(100) | UNIQUE, nullable if email is used    |
| `password_hash` | TEXT         | NOT NULL                             |
| `status`        | VARCHAR(20)  | NOT NULL                             |
| `last_login_at` | TIMESTAMPTZ  | NULL                                 |
| `created_at`    | TIMESTAMPTZ  | NOT NULL                             |
| `updated_at`    | TIMESTAMPTZ  | NOT NULL                             |

**Rule:** Require at least one usable login identifier. Enforce allowed account statuses and credential policies.

## 5. `customers`

| Column                     | Type         | Constraints |
| -------------------------- | ------------ | ----------- |
| `id`                       | UUID         | PK          |
| `full_name`                | VARCHAR(150) | NOT NULL    |
| `phone`                    | VARCHAR(30)  | NOT NULL    |
| `whatsapp_number`          | VARCHAR(30)  | NULL        |
| `email`                    | VARCHAR(255) | NULL        |
| `preferred_contact_method` | VARCHAR(20)  | NOT NULL    |
| `location`                 | VARCHAR(255) | NULL        |
| `notes`                    | TEXT         | NULL        |
| `status`                   | VARCHAR(20)  | NOT NULL    |
| `created_at`               | TIMESTAMPTZ  | NOT NULL    |
| `updated_at`               | TIMESTAMPTZ  | NOT NULL    |

**Rule:** Do not assume phone numbers are globally unique; family members may share a number.

## 6. `providers`

| Column                  | Type         | Constraints            |
| ----------------------- | ------------ | ---------------------- |
| `id`                    | UUID         | PK                     |
| `name`                  | VARCHAR(180) | NOT NULL               |
| `provider_type`         | VARCHAR(40)  | NOT NULL               |
| `phone`                 | VARCHAR(30)  | NOT NULL               |
| `email`                 | VARCHAR(255) | NULL                   |
| `location`              | VARCHAR(255) | NOT NULL               |
| `languages`             | JSONB        | NOT NULL, default `[]` |
| `services_offered`      | JSONB        | NOT NULL, default `[]` |
| `pricing_notes`         | TEXT         | NULL                   |
| `availability_notes`    | TEXT         | NULL                   |
| `verification_status`   | VARCHAR(30)  | NOT NULL               |
| `license_details`       | TEXT         | NULL                   |
| `qualification_details` | TEXT         | NULL                   |
| `agreement_status`      | VARCHAR(30)  | NOT NULL               |
| `commission_terms`      | TEXT         | NULL                   |
| `notes`                 | TEXT         | NULL                   |
| `created_at`            | TIMESTAMPTZ  | NOT NULL               |
| `updated_at`            | TIMESTAMPTZ  | NOT NULL               |

**Rule:** A provider must not be presented publicly as verified unless the verification process has been completed.

## 7. `packages`

| Column             | Type          | Constraints             |
| ------------------ | ------------- | ----------------------- |
| `id`               | UUID          | PK                      |
| `name`             | VARCHAR(180)  | NOT NULL                |
| `slug`             | VARCHAR(200)  | NOT NULL, UNIQUE        |
| `description`      | TEXT          | NOT NULL                |
| `destination`      | VARCHAR(180)  | NOT NULL                |
| `duration_days`    | INTEGER       | NOT NULL                |
| `inclusions`       | JSONB         | NOT NULL, default `[]`  |
| `exclusions`       | JSONB         | NOT NULL, default `[]`  |
| `base_price`       | NUMERIC(12,2) | NULL                    |
| `currency`         | CHAR(3)       | NOT NULL, default `ETB` |
| `media_references` | JSONB         | NOT NULL, default `[]`  |
| `status`           | VARCHAR(20)   | NOT NULL                |
| `created_at`       | TIMESTAMPTZ   | NOT NULL                |
| `updated_at`       | TIMESTAMPTZ   | NOT NULL                |

**Rules:** `duration_days` must be positive. Package prices must not overwrite historical quotation or booking prices.

## 8. `inquiries`

| Column               | Type          | Constraints                   |
| -------------------- | ------------- | ----------------------------- |
| `id`                 | UUID          | PK                            |
| `reference`          | VARCHAR(30)   | NOT NULL, UNIQUE              |
| `customer_id`        | UUID          | FK → `customers.id`, NOT NULL |
| `package_id`         | UUID          | FK → `packages.id`, NULL      |
| `travel_date`        | DATE          | NOT NULL                      |
| `traveler_count`     | INTEGER       | NOT NULL                      |
| `arrival_location`   | VARCHAR(255)  | NOT NULL                      |
| `duration_days`      | INTEGER       | NOT NULL                      |
| `budget_amount`      | NUMERIC(12,2) | NULL                          |
| `budget_currency`    | CHAR(3)       | NOT NULL, default `ETB`       |
| `interests`          | TEXT          | NULL                          |
| `hotel_required`     | BOOLEAN       | NOT NULL, default `FALSE`     |
| `transport_required` | BOOLEAN       | NOT NULL, default `FALSE`     |
| `special_requests`   | TEXT          | NULL                          |
| `status`             | VARCHAR(35)   | NOT NULL                      |
| `assigned_user_id`   | UUID          | FK → `users.id`, NULL         |
| `internal_notes`     | TEXT          | NULL                          |
| `created_at`         | TIMESTAMPTZ   | NOT NULL                      |
| `updated_at`         | TIMESTAMPTZ   | NOT NULL                      |

**Rules:** Traveler count and duration must be positive. Validate dates and permitted inquiry statuses in the backend.

## 9. `quotations`

| Column                 | Type          | Constraints                   |
| ---------------------- | ------------- | ----------------------------- |
| `id`                   | UUID          | PK                            |
| `reference`            | VARCHAR(30)   | NOT NULL, UNIQUE              |
| `inquiry_id`           | UUID          | FK → `inquiries.id`, NOT NULL |
| `customer_id`          | UUID          | FK → `customers.id`, NOT NULL |
| `package_id`           | UUID          | FK → `packages.id`, NULL      |
| `revision_number`      | INTEGER       | NOT NULL                      |
| `travel_date`          | DATE          | NOT NULL                      |
| `traveler_count`       | INTEGER       | NOT NULL                      |
| `subtotal`             | NUMERIC(12,2) | NOT NULL                      |
| `discount_amount`      | NUMERIC(12,2) | NOT NULL, default `0`         |
| `total_amount`         | NUMERIC(12,2) | NOT NULL                      |
| `currency`             | CHAR(3)       | NOT NULL, default `ETB`       |
| `deposit_amount`       | NUMERIC(12,2) | NOT NULL, default `0`         |
| `balance_amount`       | NUMERIC(12,2) | NOT NULL                      |
| `cancellation_terms`   | TEXT          | NOT NULL                      |
| `valid_until`          | DATE          | NOT NULL                      |
| `status`               | VARCHAR(30)   | NOT NULL                      |
| `customer_decision_at` | TIMESTAMPTZ   | NULL                          |
| `created_by`           | UUID          | FK → `users.id`, NOT NULL     |
| `created_at`           | TIMESTAMPTZ   | NOT NULL                      |
| `updated_at`           | TIMESTAMPTZ   | NOT NULL                      |

**Rules:** `revision_number` must be positive. Enforce valid monetary relationships and prevent duplicate revision numbers for the same inquiry. Preserve each sent revision.

## 10. `quotation_services`

| Column         | Type          | Constraints                    |
| -------------- | ------------- | ------------------------------ |
| `id`           | UUID          | PK                             |
| `quotation_id` | UUID          | FK → `quotations.id`, NOT NULL |
| `provider_id`  | UUID          | FK → `providers.id`, NULL      |
| `service_type` | VARCHAR(50)   | NOT NULL                       |
| `description`  | TEXT          | NOT NULL                       |
| `quantity`     | NUMERIC(10,2) | NOT NULL, default `1`          |
| `unit_price`   | NUMERIC(12,2) | NOT NULL                       |
| `line_total`   | NUMERIC(12,2) | NOT NULL                       |
| `currency`     | CHAR(3)       | NOT NULL, default `ETB`        |
| `created_at`   | TIMESTAMPTZ   | NOT NULL                       |

**Rule:** The line total must be consistent with quantity and unit price, using defined rounding rules.

## 11. `bookings`

| Column                | Type          | Constraints                            |
| --------------------- | ------------- | -------------------------------------- |
| `id`                  | UUID          | PK                                     |
| `reference`           | VARCHAR(30)   | NOT NULL, UNIQUE                       |
| `customer_id`         | UUID          | FK → `customers.id`, NOT NULL          |
| `quotation_id`        | UUID          | FK → `quotations.id`, NOT NULL, UNIQUE |
| `travel_date`         | DATE          | NOT NULL                               |
| `traveler_count`      | INTEGER       | NOT NULL                               |
| `total_amount`        | NUMERIC(12,2) | NOT NULL                               |
| `currency`            | CHAR(3)       | NOT NULL, default `ETB`                |
| `booking_status`      | VARCHAR(30)   | NOT NULL                               |
| `payment_status`      | VARCHAR(20)   | NOT NULL                               |
| `cancellation_reason` | TEXT          | NULL                                   |
| `cancelled_at`        | TIMESTAMPTZ   | NULL                                   |
| `internal_notes`      | TEXT          | NULL                                   |
| `created_at`          | TIMESTAMPTZ   | NOT NULL                               |
| `updated_at`          | TIMESTAMPTZ   | NOT NULL                               |

**Rule:** Booking creation must follow quotation acceptance. The backend must ensure the quotation and booking belong to the same customer and preserve agreed terms.

## 12. `booking_services`

| Column              | Type          | Constraints                   |
| ------------------- | ------------- | ----------------------------- |
| `id`                | UUID          | PK                            |
| `booking_id`        | UUID          | FK → `bookings.id`, NOT NULL  |
| `provider_id`       | UUID          | FK → `providers.id`, NOT NULL |
| `service_type`      | VARCHAR(50)   | NOT NULL                      |
| `description`       | TEXT          | NOT NULL                      |
| `service_date`      | DATE          | NULL                          |
| `customer_price`    | NUMERIC(12,2) | NOT NULL                      |
| `provider_cost`     | NUMERIC(12,2) | NULL                          |
| `currency`          | CHAR(3)       | NOT NULL, default `ETB`       |
| `status`            | VARCHAR(30)   | NOT NULL                      |
| `operational_notes` | TEXT          | NULL                          |
| `created_at`        | TIMESTAMPTZ   | NOT NULL                      |
| `updated_at`        | TIMESTAMPTZ   | NOT NULL                      |

## 13. `payments`

| Column                | Type          | Constraints                  |
| --------------------- | ------------- | ---------------------------- |
| `id`                  | UUID          | PK                           |
| `booking_id`          | UUID          | FK → `bookings.id`, NOT NULL |
| `amount`              | NUMERIC(12,2) | NOT NULL                     |
| `currency`            | CHAR(3)       | NOT NULL, default `ETB`      |
| `payment_date`        | TIMESTAMPTZ   | NULL                         |
| `payment_method`      | VARCHAR(40)   | NOT NULL                     |
| `reference`           | VARCHAR(150)  | NULL                         |
| `verification_status` | VARCHAR(20)   | NOT NULL                     |
| `recorded_by`         | UUID          | FK → `users.id`, NOT NULL    |
| `notes`               | TEXT          | NULL                         |
| `created_at`          | TIMESTAMPTZ   | NOT NULL                     |
| `updated_at`          | TIMESTAMPTZ   | NOT NULL                     |

**Rules:** Amount must be positive. Outstanding balance and payment status must use valid verified payments and applicable adjustments.

## 14. `follow_ups`

| Column             | Type        | Constraints                |
| ------------------ | ----------- | -------------------------- |
| `id`               | UUID        | PK                         |
| `customer_id`      | UUID        | FK → `customers.id`, NULL  |
| `inquiry_id`       | UUID        | FK → `inquiries.id`, NULL  |
| `quotation_id`     | UUID        | FK → `quotations.id`, NULL |
| `booking_id`       | UUID        | FK → `bookings.id`, NULL   |
| `assigned_user_id` | UUID        | FK → `users.id`, NULL      |
| `description`      | TEXT        | NOT NULL                   |
| `due_at`           | TIMESTAMPTZ | NOT NULL                   |
| `status`           | VARCHAR(20) | NOT NULL                   |
| `completed_at`     | TIMESTAMPTZ | NULL                       |
| `outcome_notes`    | TEXT        | NULL                       |
| `created_at`       | TIMESTAMPTZ | NOT NULL                   |
| `updated_at`       | TIMESTAMPTZ | NOT NULL                   |

**Rule:** Each follow-up must reference at least one relevant business record. This cross-column rule requires a database constraint or backend validation.

## 15. `reviews`

| Column         | Type        | Constraints                   |
| -------------- | ----------- | ----------------------------- |
| `id`           | UUID        | PK                            |
| `customer_id`  | UUID        | FK → `customers.id`, NOT NULL |
| `booking_id`   | UUID        | FK → `bookings.id`, NOT NULL  |
| `rating`       | SMALLINT    | NOT NULL                      |
| `feedback`     | TEXT        | NULL                          |
| `status`       | VARCHAR(20) | NOT NULL                      |
| `published_at` | TIMESTAMPTZ | NULL                          |
| `created_at`   | TIMESTAMPTZ | NOT NULL                      |
| `updated_at`   | TIMESTAMPTZ | NOT NULL                      |

**Rules:** Rating must be within the approved range, proposed as 1–5. Publication requires moderation. Eligibility must be checked against booking completion.

## 16. `complaints`

| Column               | Type        | Constraints                   |
| -------------------- | ----------- | ----------------------------- |
| `id`                 | UUID        | PK                            |
| `customer_id`        | UUID        | FK → `customers.id`, NOT NULL |
| `booking_id`         | UUID        | FK → `bookings.id`, NULL      |
| `category`           | VARCHAR(50) | NOT NULL                      |
| `description`        | TEXT        | NOT NULL                      |
| `priority`           | VARCHAR(20) | NOT NULL                      |
| `status`             | VARCHAR(30) | NOT NULL                      |
| `assigned_user_id`   | UUID        | FK → `users.id`, NULL         |
| `resolution_details` | TEXT        | NULL                          |
| `resolved_at`        | TIMESTAMPTZ | NULL                          |
| `created_at`         | TIMESTAMPTZ | NOT NULL                      |
| `updated_at`         | TIMESTAMPTZ | NOT NULL                      |

## 17. `audit_logs`

| Column           | Type         | Constraints           |
| ---------------- | ------------ | --------------------- |
| `id`             | UUID         | PK                    |
| `user_id`        | UUID         | FK → `users.id`, NULL |
| `action`         | VARCHAR(100) | NOT NULL              |
| `entity_type`    | VARCHAR(100) | NOT NULL              |
| `entity_id`      | UUID         | NULL                  |
| `change_summary` | JSONB        | NULL                  |
| `correlation_id` | UUID         | NULL                  |
| `created_at`     | TIMESTAMPTZ  | NOT NULL              |

**Rules:** Audit entries should be append-only for normal application users. Avoid logging passwords, secrets, or unnecessary personal data.

## 18. Cross-Table Constraints

The following rules require careful backend validation and, where feasible, database enforcement:

* A quotation's customer must match its inquiry's customer.
* A booking's customer must match the accepted quotation's customer.
* A quotation may create at most one booking.
* A booking's service assignments must reference valid providers.
* A payment must belong to a valid booking.
* A review must belong to the booking's customer and follow trip completion.
* A follow-up must reference at least one business record.
* A booking cannot be confirmed through an unaccepted quotation.
* Monetary totals must remain consistent with service lines, discounts, deposits, and adjustments.

Use transactions for workflows that update related records together.

## 19. Important Design Items to Resolve

Before approving this specification:

1. Decide whether all AMX tables use UUIDs and define UUID generation.
2. Finalize exact status values against the approved SRS.
3. Define quotation revision handling and immutable sent versions.
4. Define how service descriptions and prices are copied into bookings.
5. Define payment adjustments, refunds, and verification rules.
6. Decide whether a dedicated service catalog is needed or service descriptions remain flexible.
7. Define how `follow_ups` references are constrained.
8. Confirm retention and deletion policies.
9. Define currency and rounding rules.
10. Confirm whether each user can have one role or multiple roles.

## 20. Validation Status

* [x] Core tables identified
* [x] Primary keys and major foreign keys proposed
* [x] Monetary fields specified
* [x] Audit and security considerations included
* [x] Main business relationships represented
* [ ] Status constraints finalized
* [ ] Cross-table rules validated
* [ ] Indexes defined
* [ ] Migration strategy aligned
* [ ] Table specification approved

**Current result:** Draft for validation. Do not generate production migrations until unresolved rules and constraints are approved.

## 21. Next Artifact

`docs/database/relationship-specification.md` — formalize cardinalities, optionality, referential integrity, and deletion/update behavior for all table relationships.

# Database Table Specification

**Project:** AMX — Arba Minch Experiences
**Phase:** 6 — Database & API Design
**Status:** Proposed — Pending Validation
**Version:** 0.2

## 1. Purpose

Define the tables, columns, data types, constraints, and relationships required for the AMX MVP using PostgreSQL.

## 2. Database Standards

* Primary keys: UUID.
* Table names: plural `snake_case`.
* Column names: `snake_case`.
* Timestamps: `TIMESTAMPTZ`, stored consistently in UTC.
* Monetary values: `NUMERIC(12,2)`.
* Initial currency: ETB.
* Relationships: foreign keys with deliberate deletion rules.
* Historical business and financial records must be preserved.
* Sensitive changes must be audit logged.

## 3. Core Tables

| Table                | Purpose                                                     |
| -------------------- | ----------------------------------------------------------- |
| `roles`              | Defines staff roles                                         |
| `users`              | Staff accounts and authentication                           |
| `customers`          | Customer contact information                                |
| `providers`          | Guides, drivers, hotels, boat services, and other providers |
| `packages`           | Published and managed tour packages                         |
| `inquiries`          | Customer trip requests                                      |
| `quotations`         | Proposed prices and terms                                   |
| `quotation_services` | Services and providers included in a quotation              |
| `bookings`           | Confirmed or pending trip arrangements                      |
| `booking_services`   | Individual services attached to a booking                   |
| `payments`           | Individual payment, refund, and adjustment transactions     |
| `follow_ups`         | Operational reminders and customer follow-ups               |
| `reviews`            | Customer feedback                                           |
| `complaints`         | Customer complaints and resolution records                  |
| `audit_logs`         | Records important system and business changes               |

## 4. Key Table Specifications

### 4.1 `roles`

| Column        | Type        | Rules            |
| ------------- | ----------- | ---------------- |
| `id`          | UUID        | Primary key      |
| `name`        | VARCHAR(50) | Required, unique |
| `description` | TEXT        | Optional         |
| `created_at`  | TIMESTAMPTZ | Required         |

### 4.2 `users`

| Column          | Type         | Rules                     |
| --------------- | ------------ | ------------------------- |
| `id`            | UUID         | Primary key               |
| `role_id`       | UUID         | Foreign key to `roles.id` |
| `full_name`     | VARCHAR(150) | Required                  |
| `email`         | VARCHAR(254) | Required, unique          |
| `password_hash` | TEXT         | Required                  |
| `is_active`     | BOOLEAN      | Required, default `TRUE`  |
| `last_login_at` | TIMESTAMPTZ  | Optional                  |
| `created_at`    | TIMESTAMPTZ  | Required                  |
| `updated_at`    | TIMESTAMPTZ  | Required                  |

**Note:** The single `role_id` design assumes one role per user. Multi-role support requires an explicit design change.

### 4.3 `customers`

| Column               | Type         | Rules       |
| -------------------- | ------------ | ----------- |
| `id`                 | UUID         | Primary key |
| `full_name`          | VARCHAR(150) | Required    |
| `phone`              | VARCHAR(30)  | Required    |
| `email`              | VARCHAR(254) | Optional    |
| `preferred_language` | VARCHAR(10)  | Optional    |
| `notes`              | TEXT         | Optional    |
| `created_at`         | TIMESTAMPTZ  | Required    |
| `updated_at`         | TIMESTAMPTZ  | Required    |

### 4.4 `providers`

| Column                | Type         | Rules                    |
| --------------------- | ------------ | ------------------------ |
| `id`                  | UUID         | Primary key              |
| `name`                | VARCHAR(150) | Required                 |
| `provider_type`       | VARCHAR(40)  | Required                 |
| `phone`               | VARCHAR(30)  | Required                 |
| `email`               | VARCHAR(254) | Optional                 |
| `location`            | TEXT         | Optional                 |
| `languages`           | JSONB        | Optional                 |
| `verification_status` | VARCHAR(30)  | Required                 |
| `is_active`           | BOOLEAN      | Required, default `TRUE` |
| `internal_notes`      | TEXT         | Optional                 |
| `created_at`          | TIMESTAMPTZ  | Required                 |
| `updated_at`          | TIMESTAMPTZ  | Required                 |

Provider types and verification statuses must use validated values defined in the domain and business rules.

### 4.5 `packages`

| Column          | Type          | Rules                              |
| --------------- | ------------- | ---------------------------------- |
| `id`            | UUID          | Primary key                        |
| `name`          | VARCHAR(150)  | Required                           |
| `slug`          | VARCHAR(180)  | Required, unique                   |
| `description`   | TEXT          | Required                           |
| `duration_days` | INTEGER       | Required, positive                 |
| `base_price`    | NUMERIC(12,2) | Optional until pricing is approved |
| `currency`      | CHAR(3)       | Required, initially `ETB`          |
| `status`        | VARCHAR(20)   | Required                           |
| `created_at`    | TIMESTAMPTZ   | Required                           |
| `updated_at`    | TIMESTAMPTZ   | Required                           |

Package pricing is indicative until the actual provider availability and final quotation are confirmed.

### 4.6 `inquiries`

| Column                 | Type          | Rules                              |
| ---------------------- | ------------- | ---------------------------------- |
| `id`                   | UUID          | Primary key                        |
| `customer_id`          | UUID          | Foreign key to `customers.id`      |
| `travel_date`          | DATE          | Required                           |
| `traveler_count`       | INTEGER       | Required, positive                 |
| `duration_days`        | INTEGER       | Required, positive                 |
| `budget_amount`        | NUMERIC(12,2) | Optional, non-negative             |
| `arrival_location`     | TEXT          | Optional                           |
| `interests`            | JSONB         | Optional                           |
| `special_requirements` | TEXT          | Optional                           |
| `status`               | VARCHAR(30)   | Required                           |
| `assigned_to`          | UUID          | Optional foreign key to `users.id` |
| `created_at`           | TIMESTAMPTZ   | Required                           |
| `updated_at`           | TIMESTAMPTZ   | Required                           |

The inquiry may contain additional contact and trip-preference fields defined in the SRS.

### 4.7 `quotations`

| Column            | Type          | Rules                         |
| ----------------- | ------------- | ----------------------------- |
| `id`              | UUID          | Primary key                   |
| `inquiry_id`      | UUID          | Foreign key to `inquiries.id` |
| `revision_number` | INTEGER       | Required, positive            |
| `total_amount`    | NUMERIC(12,2) | Required, non-negative        |
| `currency`        | CHAR(3)       | Required                      |
| `inclusions`      | JSONB         | Required                      |
| `exclusions`      | JSONB         | Required                      |
| `terms`           | TEXT          | Required                      |
| `valid_until`     | TIMESTAMPTZ   | Required                      |
| `status`          | VARCHAR(30)   | Required                      |
| `created_by`      | UUID          | Foreign key to `users.id`     |
| `created_at`      | TIMESTAMPTZ   | Required                      |
| `updated_at`      | TIMESTAMPTZ   | Required                      |

**Constraint:** A quotation revision number must be unique within its inquiry.

### 4.8 `quotation_services`

| Column         | Type          | Rules                                           |
| -------------- | ------------- | ----------------------------------------------- |
| `id`           | UUID          | Primary key                                     |
| `quotation_id` | UUID          | Foreign key to `quotations.id`                  |
| `provider_id`  | UUID          | Foreign key to `providers.id`, where applicable |
| `service_name` | VARCHAR(150)  | Required                                        |
| `description`  | TEXT          | Optional                                        |
| `quantity`     | INTEGER       | Required, positive                              |
| `unit_price`   | NUMERIC(12,2) | Required, non-negative                          |
| `line_total`   | NUMERIC(12,2) | Required, non-negative                          |

Store agreed service details and prices so historical quotations remain accurate if provider information changes.

### 4.9 `bookings`

| Column                | Type          | Rules                                           |
| --------------------- | ------------- | ----------------------------------------------- |
| `id`                  | UUID          | Primary key                                     |
| `quotation_id`        | UUID          | Required, unique foreign key to `quotations.id` |
| `booking_number`      | VARCHAR(40)   | Required, unique                                |
| `status`              | VARCHAR(30)   | Required                                        |
| `amount_due`          | NUMERIC(12,2) | Required, non-negative                          |
| `currency`            | CHAR(3)       | Required                                        |
| `travel_date`         | DATE          | Required                                        |
| `traveler_count`      | INTEGER       | Required, positive                              |
| `confirmed_at`        | TIMESTAMPTZ   | Optional                                        |
| `completed_at`        | TIMESTAMPTZ   | Optional                                        |
| `cancelled_at`        | TIMESTAMPTZ   | Optional                                        |
| `cancellation_reason` | TEXT          | Optional                                        |
| `created_at`          | TIMESTAMPTZ   | Required                                        |
| `updated_at`          | TIMESTAMPTZ   | Required                                        |

The booking must preserve the agreed quotation terms, price, and services. Final snapshot fields and the booking-creation transaction must be defined before implementation.

### 4.10 `booking_services`

| Column         | Type          | Rules                                  |
| -------------- | ------------- | -------------------------------------- |
| `id`           | UUID          | Primary key                            |
| `booking_id`   | UUID          | Foreign key to `bookings.id`           |
| `provider_id`  | UUID          | Optional foreign key to `providers.id` |
| `service_name` | VARCHAR(150)  | Required                               |
| `description`  | TEXT          | Optional                               |
| `agreed_price` | NUMERIC(12,2) | Required, non-negative                 |
| `status`       | VARCHAR(30)   | Required                               |
| `created_at`   | TIMESTAMPTZ   | Required                               |
| `updated_at`   | TIMESTAMPTZ   | Required                               |

Service details and agreed prices must remain historically accurate after booking creation.

### 4.11 `payments`

This table stores individual financial transactions. It does **not** store the booking's aggregate payment status.

| Column                | Type          | Rules                                                     |
| --------------------- | ------------- | --------------------------------------------------------- |
| `id`                  | UUID          | Primary key                                               |
| `booking_id`          | UUID          | Required foreign key to `bookings.id`                     |
| `transaction_type`    | VARCHAR(20)   | `PAYMENT`, `REFUND`, or `ADJUSTMENT`, subject to approval |
| `amount`              | NUMERIC(12,2) | Required, positive                                        |
| `status`              | VARCHAR(20)   | Required                                                  |
| `payment_method`      | VARCHAR(40)   | Optional until known                                      |
| `reference_number`    | VARCHAR(150)  | Optional                                                  |
| `original_payment_id` | UUID          | Optional self-reference for refunds                       |
| `recorded_by`         | UUID          | Foreign key to `users.id`                                 |
| `verified_by`         | UUID          | Optional foreign key to `users.id`                        |
| `transaction_date`    | TIMESTAMPTZ   | Optional until confirmed                                  |
| `reason`              | TEXT          | Required for refunds and adjustments                      |
| `notes`               | TEXT          | Optional                                                  |
| `created_at`          | TIMESTAMPTZ   | Required                                                  |
| `updated_at`          | TIMESTAMPTZ   | Required                                                  |

Rules:

* Use individual transaction statuses such as `PENDING`, `SUBMITTED`, `VERIFIED`, `REJECTED`, `FAILED`, and `CANCELLED`.
* Refunds must reference the original payment when applicable.
* Only verified transactions affect financial summaries.
* Do not use `REFUNDED` as an individual payment status.
* Preserve financial history and audit all verification, refund, and adjustment operations.
* Booking payment summaries are calculated separately from transaction records.
* Final adjustment semantics and refund rules require business approval.

### 4.12 `follow_ups`

| Column         | Type         | Rules                                  |
| -------------- | ------------ | -------------------------------------- |
| `id`           | UUID         | Primary key                            |
| `customer_id`  | UUID         | Optional foreign key to `customers.id` |
| `inquiry_id`   | UUID         | Optional foreign key to `inquiries.id` |
| `booking_id`   | UUID         | Optional foreign key to `bookings.id`  |
| `assigned_to`  | UUID         | Foreign key to `users.id`              |
| `title`        | VARCHAR(150) | Required                               |
| `due_at`       | TIMESTAMPTZ  | Required                               |
| `status`       | VARCHAR(20)  | Required                               |
| `notes`        | TEXT         | Optional                               |
| `completed_at` | TIMESTAMPTZ  | Optional                               |
| `created_at`   | TIMESTAMPTZ  | Required                               |
| `updated_at`   | TIMESTAMPTZ  | Required                               |

**Constraint:** At least one target record must be supplied. Whether multiple target fields may be populated simultaneously must be decided.

### 4.13 `reviews`

| Column        | Type        | Rules                                  |
| ------------- | ----------- | -------------------------------------- |
| `id`          | UUID        | Primary key                            |
| `booking_id`  | UUID        | Required foreign key to `bookings.id`  |
| `customer_id` | UUID        | Required foreign key to `customers.id` |
| `rating`      | SMALLINT    | Required, 1–5                          |
| `comment`     | TEXT        | Optional                               |
| `status`      | VARCHAR(20) | Required                               |
| `reviewed_by` | UUID        | Optional foreign key to `users.id`     |
| `created_at`  | TIMESTAMPTZ | Required                               |
| `updated_at`  | TIMESTAMPTZ | Required                               |

Review eligibility, duplicate-review prevention, and publication rules must be approved.

### 4.14 `complaints`

| Column             | Type         | Rules                                  |
| ------------------ | ------------ | -------------------------------------- |
| `id`               | UUID         | Primary key                            |
| `booking_id`       | UUID         | Optional foreign key to `bookings.id`  |
| `customer_id`      | UUID         | Required foreign key to `customers.id` |
| `subject`          | VARCHAR(180) | Required                               |
| `description`      | TEXT         | Required                               |
| `status`           | VARCHAR(30)  | Required                               |
| `assigned_to`      | UUID         | Optional foreign key to `users.id`     |
| `resolution_notes` | TEXT         | Optional                               |
| `resolved_at`      | TIMESTAMPTZ  | Optional                               |
| `created_at`       | TIMESTAMPTZ  | Required                               |
| `updated_at`       | TIMESTAMPTZ  | Required                               |

### 4.15 `audit_logs`

| Column        | Type         | Rules                              |
| ------------- | ------------ | ---------------------------------- |
| `id`          | UUID         | Primary key                        |
| `user_id`     | UUID         | Optional foreign key to `users.id` |
| `action`      | VARCHAR(100) | Required                           |
| `entity_type` | VARCHAR(80)  | Required                           |
| `entity_id`   | UUID         | Optional                           |
| `before_data` | JSONB        | Optional                           |
| `after_data`  | JSONB        | Optional                           |
| `ip_address`  | INET         | Optional                           |
| `request_id`  | VARCHAR(100) | Optional                           |
| `created_at`  | TIMESTAMPTZ  | Required                           |

Never store passwords, session tokens, or other secrets in audit records. Restrict access to audit data.

## 5. Shared Constraints

* Foreign keys must reference valid records.
* Status fields must use approved values.
* Traveler counts, quantities, and duration values must be positive.
* Monetary amounts must not be negative; transaction amounts must be positive.
* Required business fields must be `NOT NULL`.
* Unique identifiers and business numbers must have unique constraints.
* Avoid cascading deletion of historical bookings and financial records.
* Use database transactions for related multi-table changes.

## 6. Design Decisions Pending

* [ ] Finalize the adjustment transaction model.
* [ ] Define booking price snapshot fields.
* [ ] Finalize follow-up target constraints.
* [ ] Confirm one role per staff user or multiple roles.
* [ ] Define refund approval and original-payment references.
* [ ] Confirm review eligibility and uniqueness rules.
* [ ] Confirm retention and deletion policies.
* [ ] Align every table with the final ERD and database constraints.

## 7. Validation Status

**Status:** Proposed — Pending validation.

This specification must be reconciled with `erd.md`, `entity-specification.md`, `relationship-specification.md`, `constraint-specification.md`, and `financial-data-design.md` before database migrations are created.

**Approved by:** Pending
**Approval date:** Pending

# AMX — Entity Specification

**File:** `docs/database/entity-specification.md`
**Phase:** 6 — Database & API Design
**Status:** Draft for Validation

## 1. Purpose

Define the purpose, attributes, relationships, and business rules of each AMX database entity before finalizing PostgreSQL tables.

## 2. Entity Specifications

### ENT-01: Customer

**Purpose:** Store customer contact details and service history.

**Attributes:**

* Customer ID
* Full name
* Phone number
* WhatsApp number, if different
* Email, optional
* Preferred contact method
* Location, optional
* Operational notes, optional
* Created and updated timestamps

**Relationships:** One customer may have multiple inquiries, bookings, reviews, and complaints.

**Rules:** Validate contact information; restrict access to personal data; avoid duplicate customer records where reasonably identifiable.

### ENT-02: Inquiry

**Purpose:** Record a customer's tourism request.

**Attributes:**

* Inquiry ID and unique reference
* Customer ID
* Requested travel date
* Number of travelers
* Arrival location
* Trip duration
* Budget and currency
* Interests
* Hotel and transport requirements
* Special requests
* Optional package reference
* Status
* Assigned operator, optional
* Internal notes
* Created and updated timestamps

**Relationships:** Belongs to a customer; may generate multiple quotations.

**Rules:** Validate required fields and travel details. Every inquiry must have a valid reference and controlled status.

### ENT-03: Provider

**Purpose:** Store information about tourism service providers.

**Attributes:**

* Provider ID
* Name and provider type
* Contact details
* Location
* Services offered
* Languages
* Pricing information
* Availability notes
* Verification status
* License or qualification details, where applicable
* Agreement and commission information, where applicable
* Operational notes
* Created and updated timestamps

**Relationships:** May be assigned to multiple booking services.

**Rules:** Only appropriately verified providers may be represented as verified. Restrict access to sensitive provider information.

### ENT-04: Package

**Purpose:** Manage AMX's predefined tourism experiences.

**Attributes:**

* Package ID
* Name and description
* Destination
* Duration
* Included and excluded services
* Base pricing
* Currency
* Images or media references
* Publication status
* Created and updated timestamps

**Relationships:** A package may be referenced by multiple quotations.

**Rules:** Only active packages are publicly offered. Price or description changes must not silently alter historical quotations or confirmed bookings.

### ENT-05: Quotation

**Purpose:** Record the proposed price and terms offered to a customer.

**Attributes:**

* Quotation ID and unique reference
* Inquiry ID
* Customer ID
* Optional package ID
* Travel dates and traveler count
* Service and provider selections
* Price breakdown
* Total price and currency
* Deposit requirement
* Balance due
* Cancellation terms
* Valid-until date
* Status
* Customer decision and decision date
* Revision reference, where applicable
* Created and updated timestamps

**Relationships:** Belongs to an inquiry; contains quotation services; an accepted quotation may produce one booking.

**Rules:** Availability must be checked before a final offer. Sent quotations preserve their offered terms. Acceptance must be recorded before normal booking confirmation.

### ENT-06: Quotation Service

**Purpose:** Represent an individual service proposed in a quotation.

**Attributes:**

* Quotation service ID
* Quotation ID
* Service description and type
* Quantity
* Unit price
* Line total
* Optional provider reference
* Service notes

**Relationships:** Belongs to one quotation; may reference a provider.

**Rules:** Validate quantities and monetary amounts. Preserve the offered service and price even if provider or package details later change.

### ENT-07: Booking

**Purpose:** Represent an agreed customer trip arrangement.

**Attributes:**

* Booking ID and unique reference
* Customer ID
* Source quotation ID
* Travel dates
* Traveler count
* Agreed total and currency
* Payment status
* Booking status
* Cancellation details, where applicable
* Operational notes
* Created and updated timestamps

**Relationships:** Belongs to a customer and originates from an accepted quotation; contains booking services and may have multiple payments, follow-ups, reviews, and complaints.

**Rules:** Preserve agreed terms. Booking creation, quotation acceptance, and related status updates must remain consistent. A booking must not be marked completed before the trip is delivered.

### ENT-08: Booking Service

**Purpose:** Record each agreed service and its provider assignment within a booking.

**Attributes:**

* Booking service ID
* Booking ID
* Provider ID
* Service type and description
* Service date or schedule
* Agreed customer price
* Recorded provider cost, where applicable
* Service status
* Confirmation details
* Operational notes

**Relationships:** Belongs to one booking and references a provider.

**Rules:** One booking may contain multiple services and providers. Preserve agreed pricing and track service-level cancellations or failures.

### ENT-09: Payment

**Purpose:** Record customer payments made outside AMX.

**Attributes:**

* Payment ID
* Booking ID
* Amount and currency
* Payment date
* Payment method
* Transaction or receipt reference, where available
* Verification status
* Recorded by user
* Notes
* Created and updated timestamps

**Relationships:** Belongs to one booking and is recorded by an authorized user.

**Rules:** Distinguish submitted from verified payments. Prevent invalid amounts and duplicate records where identifiable. Do not store card numbers, PINs, banking passwords, or payment credentials.

### ENT-10: Follow-Up

**Purpose:** Track customer and operational follow-up tasks.

**Attributes:**

* Follow-up ID
* Related customer, inquiry, quotation, or booking
* Assigned user
* Task description
* Due date
* Status
* Completion date
* Outcome notes
* Created and updated timestamps

**Relationships:** Associated with a relevant business record and optionally assigned to a user.

**Rules:** Follow-ups require a clear task and status. Completed tasks should retain their outcome.

### ENT-11: Review

**Purpose:** Record customer feedback about an AMX experience.

**Attributes:**

* Review ID
* Customer ID
* Booking ID, where applicable
* Rating
* Feedback text
* Moderation status
* Publication date, if published
* Created and updated timestamps

**Relationships:** Belongs to a customer and may reference a booking.

**Rules:** Feedback related to a completed trip must be linked to that trip. Reviews must be moderated before publication.

### ENT-12: Complaint

**Purpose:** Record and manage customer problems.

**Attributes:**

* Complaint ID
* Customer ID
* Optional booking ID
* Complaint category
* Description
* Severity or priority
* Status
* Assigned user
* Resolution details
* Created and updated timestamps

**Relationships:** Belongs to a customer and may relate to a booking.

**Rules:** Preserve complaint history and resolution outcomes. Escalate urgent safety or emergency issues through the agreed operational process.

### ENT-13: User

**Purpose:** Represent a person authorized to access AMX administration functions.

**Attributes:**

* User ID
* Full name
* Email or username
* Secure password hash
* Role ID
* Account status
* Last-login metadata, where required
* Created and updated timestamps

**Relationships:** Each user has a role and may create audit records.

**Rules:** Require authentication and server-side authorization. Never store plaintext passwords. Provider accounts are excluded from the MVP.

### ENT-14: Role

**Purpose:** Define administrative access permissions.

**Attributes:**

* Role ID
* Role name
* Description
* Permission definition
* Created and updated timestamps

**Relationships:** A role may be assigned to multiple users.

**Rules:** Apply least privilege. The detailed role-permission model must align with the approved access requirements.

### ENT-15: Audit Log

**Purpose:** Maintain a traceable record of important system actions.

**Attributes:**

* Audit log ID
* User ID, if applicable
* Action
* Affected entity and record reference
* Timestamp
* Relevant change summary
* Request or correlation reference, where useful

**Relationships:** May reference a user and identifies the affected business record.

**Rules:** Audit records must be protected from unauthorized modification or deletion. Do not include passwords, payment credentials, or unnecessary personal data in logs.

---

## 3. Shared Data Standards

The detailed schema must define consistent standards for:

* Primary keys and foreign keys
* Created and updated timestamps
* Currency and monetary precision
* Status values
* Optional versus required attributes
* Phone, email, and date validation
* Soft deletion or archival where justified
* Personal-data access and retention

PostgreSQL data types, exact lengths, constraints, and indexes will be specified in the table specification.

## 4. Important Modeling Decisions

1. **Quotation revisions:** Preserve previously sent offers rather than silently overwriting them.
2. **Historical pricing:** Preserve agreed prices in quotations and bookings.
3. **Multiple providers:** Use booking services to support different providers within one trip.
4. **Payment tracking:** Calculate outstanding balances using valid, verified payment records and applicable adjustments.
5. **Auditability:** Keep audit logs separate from operational business records.
6. **Optional relationships:** Custom trips may not reference a package; some complaints may not reference a booking.
7. **Deletion:** Protect financial, booking, and audit history from unsafe deletion.
8. **Data minimization:** Collect only information needed to coordinate and operate AMX.

## 5. Validation Checklist

* [x] Fifteen core entities documented
* [x] Main attributes and responsibilities identified
* [x] Relationships aligned with the conceptual model
* [x] Financial and historical accuracy considered
* [x] Security and audit requirements included
* [ ] Exact fields and data types approved
* [ ] Relationship cardinalities confirmed
* [ ] Constraints and indexes specified
* [ ] Entity specifications approved

**Current result:** Draft prepared; detailed schema decisions remain.

## 6. Next Artifact

`docs/database/table-specification.md` — define the PostgreSQL tables, columns, data types, primary keys, foreign keys, and nullability.

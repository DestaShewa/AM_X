# 3.9 — Domain Model

## 1. Purpose

The Domain Model defines the main **business concepts (entities)** in AMX and the relationships between them.

It represents the real-world AMX business domain before database and API design.

---

## 2. Core Domain Concepts

| Domain Concept  | Purpose                                           |
| --------------- | ------------------------------------------------- |
| Customer        | Person or organization requesting an experience   |
| Inquiry         | Customer's request for a tourism experience       |
| Provider        | Local business/person providing a tourism service |
| Package         | Predefined AMX tourism experience                 |
| Quotation       | Proposed price and services for an inquiry        |
| Booking         | Confirmed customer trip                           |
| Booking Service | Individual service included in a booking          |
| Payment         | Money received or recorded for a booking          |
| Follow-Up       | Reminder or action related to a customer/booking  |
| Review          | Customer feedback after a trip                    |
| Complaint       | Customer-reported problem requiring attention     |
| User            | Person authorized to access the AMX system        |
| Role            | Defines system permissions                        |
| Audit Log       | Record of important administrative actions        |

---

# 3. Core Domain Relationship

The central business relationship is:

```text id="1clb7w"
Customer
   │
   │ makes
   ↓
Inquiry
   │
   │ produces
   ↓
Quotation
   │
   │ accepted as
   ↓
Booking
   │
   ├──────────────→ Payment
   │
   ├──────────────→ Booking Services
   │                       │
   │                       ↓
   │                    Provider
   │
   ├──────────────→ Follow-Up
   │
   └──────────────→ Review / Complaint
```

---

# 4. Package Relationship

A customer may request an existing package or a custom experience.

```text id="nq1sgd"
Customer
    │
    ↓
  Inquiry
    │
    ├──────────────→ Package
    │                  │
    │                  ↓
    │              Services
    │
    └──────────────→ Custom Requirements
```

Examples:

* Lake Chamo Experience
* Dorze + Lake Chamo
* Custom Arba Minch Experience

---

# 5. Provider Model

A **Provider** represents a person or organization that supplies tourism services.

Provider types may include:

* Tour Guide
* Driver
* Hotel/Lodge
* Boat-Service Provider
* Tour Operator

```text id="gq8w1t"
                  Provider
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
        Guide      Driver    Hotel/Lodge
                     │
                     ├──── Boat Provider
                     │
                     └──── Tour Operator
```

For the MVP, these can be represented as different **provider types** rather than creating separate independent business entities for every provider category.

---

# 6. Provider & Service Relationship

A provider may offer one or more services.

```text id="g7o5yn"
Provider
   │
   │ offers
   ↓
Service
   │
   ├── Guiding
   ├── Transportation
   ├── Accommodation
   ├── Boat Trip
   └── Tourism Activity
```

A service may have:

* Name
* Description
* Price information
* Availability information
* Conditions
* Provider

---

# 7. Inquiry Model

An Inquiry represents a customer's request before a booking exists.

An inquiry may contain:

* Customer
* Travel date
* Number of travelers
* Arrival location
* Duration
* Budget
* Interests
* Hotel requirement
* Transport requirement
* Special requirements
* Requested package
* Status

Relationship:

```text id="0gcjpc"
Customer 1 ──────── * Inquiry

Package 0..1 ────── * Inquiry
```

A customer can make multiple inquiries.

An inquiry may or may not be associated with a predefined package.

---

# 8. Quotation Model

A quotation is created for an inquiry after AMX evaluates the requested services.

```text id="h1y1d2"
Inquiry
   │
   │ generates
   ↓
Quotation
   │
   ├── Customer
   ├── Services
   ├── Providers
   ├── Price
   ├── Included Items
   ├── Excluded Items
   ├── Valid Until
   └── Terms
```

Relationship:

```text id="8g2y47"
Inquiry 1 ─────── 0..* Quotation
```

Multiple quotations may be created if the customer requests changes or alternatives.

Only an accepted quotation should normally lead to a confirmed booking.

---

# 9. Booking Model

A Booking represents a confirmed tourism arrangement.

```text id="v5r7p1"
Quotation
    │
    │ accepted
    ↓
 Booking
    │
    ├── Customer
    ├── Travel Date
    ├── Travelers
    ├── Services
    ├── Providers
    ├── Total Price
    ├── Payment Status
    └── Booking Status
```

Relationship:

```text id="q4ohjp"
Customer 1 ──────── * Booking

Quotation 1 ─────── 1 Booking
```

A booking should have a unique booking reference.

---

# 10. Booking Service Model

A booking can contain multiple services.

Example:

```text id="9myt9a"
Booking
   │
   ├── Transport
   ├── Boat Trip
   ├── Guide
   └── Hotel
```

Therefore:

```text id="ykx0k6"
Booking 1 ─────── * Booking Service
                         │
                         ↓
                      Provider
```

Each Booking Service can record:

* Service type
* Provider
* Date/time
* Agreed price
* Status
* Notes

This is important because one booking may involve several independent providers.

---

# 11. Payment Model

Payments belong to a booking.

```text id="w5q9c0"
Booking
   │
   │ has
   ↓
Payment
```

Relationship:

```text id="z8kz3v"
Booking 1 ──────── * Payment
```

A booking may have:

* Deposit
* Partial payment
* Final payment
* Refund record where applicable

Payment information may include:

* Amount
* Date
* Method
* Reference
* Status
* Notes

---

# 12. Follow-Up Model

Follow-ups allow AMX to remember important actions.

Examples:

* Contact customer tomorrow
* Confirm provider before trip
* Request remaining payment
* Check customer satisfaction

```text id="e9b3qk"
Customer ──────┐
               │
Inquiry ───────┼──→ Follow-Up
               │
Booking ───────┘
```

A follow-up may be associated with a customer, inquiry, or booking.

---

# 13. Review & Complaint Model

After a trip, a customer may provide feedback.

```text id="h2k8yb"
Booking
   │
   ├────────→ Review
   │
   └────────→ Complaint
```

Relationships:

```text id="m6k7up"
Customer 1 ──────── * Review
Booking  1 ──────── 0..1 Review

Customer 1 ──────── * Complaint
Booking  1 ──────── * Complaint
```

A complaint may require follow-up and resolution.

---

# 14. User & Role Model

The MVP has system users primarily for AMX administration.

```text id="9f4g5n"
User
  │
  │ assigned
  ↓
Role
  │
  ↓
Permissions
```

Initial MVP role:

**Administrator / AMX Operator**

Future roles may include:

* Manager
* Finance
* Staff
* Provider

Provider accounts are **not required for MVP**.

---

# 15. Audit Log

Important administrative actions should be traceable.

```text id="c6q2xx"
User
  │
  │ performs
  ↓
System Action
  │
  ↓
Audit Log
```

Examples:

* Created quotation
* Changed quotation
* Confirmed booking
* Recorded payment
* Changed booking status
* Updated provider
* Cancelled booking

---

# 16. Complete Domain Model

```text id="m5k6x8"
                         ┌──────────────┐
                         │   Customer   │
                         └──────┬───────┘
                                │
                    makes        │
                                ↓
                         ┌──────────────┐
                         │   Inquiry    │
                         └──────┬───────┘
                                │
                         generates
                                ↓
                         ┌──────────────┐
                         │  Quotation   │
                         └──────┬───────┘
                                │
                            accepted
                                ↓
                         ┌──────────────┐
                         │   Booking    │
                         └──────┬───────┘
                                │
              ┌─────────────────┼─────────────────┐
              ↓                 ↓                 ↓
       ┌────────────┐    ┌─────────────┐   ┌────────────┐
       │  Payment   │    │   Booking   │   │ Follow-Up  │
       └────────────┘    │   Service   │   └────────────┘
                         └──────┬──────┘
                                │
                                ↓
                           ┌──────────┐
                           │ Provider │
                           └──────────┘

                         Booking
                            │
                     ┌──────┴──────┐
                     ↓             ↓
                  Review       Complaint


Package ─────────────→ Inquiry
Package ─────────────→ Booking Service


User ─────────→ Role ─────────→ Permissions
 │
 └────────────→ Audit Log
```

---

# 17. Cardinality Summary

| Relationship               | Cardinality |
| -------------------------- | ----------- |
| Customer → Inquiry         | 1 : Many    |
| Customer → Booking         | 1 : Many    |
| Inquiry → Quotation        | 1 : Many    |
| Quotation → Booking        | 1 : 0..1    |
| Booking → Payment          | 1 : Many    |
| Booking → Booking Service  | 1 : Many    |
| Provider → Booking Service | 1 : Many    |
| Booking → Review           | 1 : 0..1    |
| Booking → Complaint        | 1 : Many    |
| Customer → Review          | 1 : Many    |
| Customer → Complaint       | 1 : Many    |
| Package → Inquiry          | 1 : Many    |
| User → Role                | Many : 1    |
| User → Audit Log           | 1 : Many    |

---

# 18. Important Modeling Decision

### Do not create separate core entities for:

* Guide
* Driver
* Hotel
* Boat Provider
* Tour Operator

Instead, the MVP should primarily use:

```text
Provider
   │
   └── Provider Type
```

For example:

```text
Provider:
Name: Abebe
Type: Tour Guide

Provider:
Name: ABC Transport
Type: Driver

Provider:
Name: XYZ Lodge
Type: Hotel
```

This reduces unnecessary complexity while preserving the business distinction.

---

# 19. Domain Model Principles

1. **Inquiry is not a booking.**
2. **Quotation is not a booking.**
3. **A booking is created after customer confirmation.**
4. **One booking may contain multiple services.**
5. **One booking may involve multiple providers.**
6. **Payments belong to bookings.**
7. **Reviews and complaints belong to completed customer experiences.**
8. **Providers remain external business actors but are managed as records inside AMX.**
9. **Users and providers are different concepts.**
10. **The domain model represents business concepts, not database implementation.**

---

# 20. MVP Domain Boundary

### Core

```text
Customer
Inquiry
Provider
Package
Quotation
Booking
Booking Service
Payment
Follow-Up
Review
Complaint
User
Role
Audit Log
```

### Future

```text
Customer Account
Provider Account
Provider Availability Calendar
Online Payment Transaction
Notification
Promotion
Advanced Analytics
AI Assistant
```

---

# 21. Validation

The domain model should be validated against:

* Requirements
* Business rules
* Use cases
* Activity diagrams
* Sequence diagrams
* Real AMX operations

Particular attention should be given to:

* Whether one inquiry can produce multiple quotations
* Whether one quotation can create only one booking
* Whether bookings can contain multiple providers
* How payments and refunds are recorded
* Whether hotels should remain a Provider Type
* Whether complaints require a separate entity
* Whether organizations/groups require a separate Customer Type

**Status:** Draft — pending domain validation.

---

## Next Artifact

**3.10 — System Boundary**

This will formally define exactly what the **AMX software system is responsible for**, what remains human/manual, and what belongs to external providers and services.

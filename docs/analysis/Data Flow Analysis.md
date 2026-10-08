# 3.11 — Data Flow Analysis

## 1. Purpose

This document defines how information enters, moves through, is processed by, and leaves the AMX system.

The objective is to ensure that:

* Required information is captured.
* Information reaches the correct process.
* Important business data is stored.
* Human and system responsibilities are clear.
* No unnecessary data flow is introduced into the MVP.

---

# 2. AMX Information Flow Overview

The core AMX information flow is:

```text
Customer
   │
   │ Trip Requirements
   ↓
Inquiry
   │
   │ Requirements
   ↓
AMX Admin
   │
   │ Service Request
   ↓
Providers
   │
   │ Availability + Price
   ↓
AMX Admin
   │
   │ Confirmed Services
   ↓
Quotation
   │
   │ Price + Terms
   ↓
Customer
   │
   │ Accept / Decline
   ↓
Booking
   │
   ├── Payment
   ├── Provider Coordination
   └── Follow-Up
   │
   ↓
Trip Completion
   │
   ↓
Review / Complaint
   │
   ↓
Business Records & Reports
```

---

# 3. Main External Data Sources

| Source           | Information Provided                 | Used By                        |
| ---------------- | ------------------------------------ | ------------------------------ |
| Visitor/Customer | Trip requirements                    | Inquiry                        |
| Guide            | Availability, price, service details | Provider coordination          |
| Driver           | Availability, transport price        | Provider coordination          |
| Hotel/Lodge      | Availability, room/service price     | Provider coordination          |
| Boat Provider    | Availability, boat/service price     | Provider coordination          |
| Tour Operator    | Service/package information          | Provider coordination          |
| Payment Provider | Payment result, if integrated        | Payment                        |
| Email/WhatsApp   | Communication                        | Customer/provider coordination |

---

# 4. Main AMX Data Stores

The system will maintain structured records for:

```text
D1  Customers
D2  Inquiries
D3  Providers
D4  Packages
D5  Quotations
D6  Bookings
D7  Booking Services
D8  Payments
D9  Follow-Ups
D10 Reviews
D11 Complaints
D12 Users / Roles
D13 Audit Logs
```

These represent logical data stores. They do not yet define the final database tables.

---

# 5. Level 0 — Context Data Flow

At the highest level, AMX can be viewed as one system.

```text
                  Trip Request
Customer ─────────────────────────→
                                    │
                                    ↓
                              ┌───────────┐
                              │           │
                              │    AMX    │
                              │  SYSTEM   │
                              │           │
                              └───────────┘
                                    │
                Quote / Booking /  │
                Trip Information   │
Customer ←─────────────────────────┘


Providers ───── Availability / Price ───→ AMX
Providers ←──── Service Request ───────── AMX

Payment Provider ─── Payment Result ───→ AMX
AMX ─────────────── Payment Request ──→ Payment Provider
```

The AMX system is the central coordination point.

---

# 6. Level 1 — Major Data Flows

The system can be divided into the following major processes:

```text
P1  Inquiry Management
P2  Customer Management
P3  Provider Management
P4  Package Management
P5  Quotation Management
P6  Booking Management
P7  Payment Management
P8  Follow-Up Management
P9  Review & Complaint Management
P10 Reporting & Audit
```

Main flow:

```text
Customer
   ↓
[P1 Inquiry Management]
   ↓
[P2 Customer Management]
   ↓
[P3 Provider Management]
   ↓
[P5 Quotation Management]
   ↓
[P6 Booking Management]
   ↓
[P7 Payment Management]
   ↓
[P8 Follow-Up]
   ↓
[P9 Review / Complaint]
   ↓
[P10 Reporting]
```

---

# 7. DFD — Inquiry Flow

## Input

Customer provides:

* Name
* Phone/WhatsApp
* Email if available
* Travel date
* Number of travelers
* Arrival location
* Number of days
* Budget
* Interests
* Hotel requirement
* Transport requirement
* Special requirements
* Selected package, if applicable

## Flow

```text
Customer
   │
   │ Inquiry Information
   ↓
P1 — Inquiry Management
   │
   ├── Validate Information
   │
   ├── Create Customer Record
   │
   └── Create Inquiry Record
   │
   ↓
D1 Customers
D2 Inquiries
```

## Output

* Inquiry confirmation
* Inquiry reference
* Status
* Required follow-up information

---

# 8. DFD — Provider Coordination Flow

```text
D2 Inquiries
     │
     ↓
AMX Admin
     │
     │ Service Requirements
     ↓
Provider
     │
     │ Availability
     │ Price
     │ Conditions
     ↓
AMX Admin
     │
     ↓
D3 Providers
     │
     ↓
Selected Services
```

### Important Boundary

Provider communication may happen through:

* Phone
* WhatsApp
* Email
* In-person communication

The communication platform is external.

AMX stores the important resulting information.

---

# 9. DFD — Quotation Flow

```text
Customer Requirements
        │
        ↓
   D2 Inquiry
        │
        ↓
Provider Information
        │
        ↓
   P5 Quotation
        │
        ├── Services
        ├── Providers
        ├── Prices
        ├── Included Items
        ├── Excluded Items
        ├── Terms
        └── Validity
        │
        ↓
   D5 Quotation
        │
        ↓
     Customer
```

### Quotation Output

The quotation should clearly communicate:

* Customer
* Travel date
* Number of travelers
* Services
* Providers where appropriate
* Total price
* Included services
* Excluded services
* Payment terms
* Cancellation terms
* Validity
* Booking instructions

---

# 10. DFD — Customer Decision Flow

```text
Quotation
    │
    ↓
Customer
    │
    ├──────────────→ Decline
    │                  │
    │                  ↓
    │              Inquiry Closed
    │
    ├──────────────→ Request Changes
    │                  │
    │                  ↓
    │              AMX Admin
    │                  │
    │                  ↓
    │             New Quotation
    │
    └──────────────→ Accept
                       │
                       ↓
                  Booking Process
```

The system records the customer's decision.

---

# 11. DFD — Booking Flow

```text
Accepted Quotation
        │
        ↓
P6 — Booking Management
        │
        ├── Generate Booking Reference
        ├── Record Customer
        ├── Record Travel Date
        ├── Record Services
        ├── Record Providers
        ├── Record Price
        └── Set Booking Status
        │
        ↓
D6 Bookings
D7 Booking Services
```

### Output

Customer receives:

* Booking reference
* Travel information
* Confirmed services
* Payment information
* Important terms
* Contact/support information

---

# 12. DFD — Payment Flow

## MVP

Payment may occur outside the AMX system.

```text
Customer
   │
   │ Payment
   ↓
Bank / Mobile Money / Other Method
   │
   │ Payment Evidence
   ↓
AMX Admin
   │
   │ Verify
   ↓
P7 Payment Management
   │
   ↓
D8 Payments
```

The system records:

* Amount
* Date
* Method
* Reference
* Status
* Notes
* Remaining balance

---

# 13. Future Online Payment Flow

Online payment is outside the MVP but may later be integrated.

```text
Customer
    │
    ↓
AMX
    │
    ↓
Payment Provider
    │
    ├── Success
    └── Failed
    │
    ↓
AMX
    │
    ↓
Booking Payment Status
```

The payment provider remains responsible for actual transaction processing.

---

# 14. DFD — Trip Coordination Flow

```text
Confirmed Booking
       │
       ↓
AMX Admin
       │
       ├────→ Guide
       │
       ├────→ Driver
       │
       ├────→ Hotel/Lodge
       │
       └────→ Boat Provider
                 │
                 ↓
           Service Delivery
                 │
                 ↓
            Trip Completed
                 │
                 ↓
              AMX Admin
                 │
                 ↓
            D6 Booking
```

The system supports coordination and recording.

It does **not** control the physical trip.

---

# 15. DFD — Completion & Feedback

```text
Trip Completed
      │
      ↓
AMX Admin
      │
      ├── Confirm completion
      ├── Record final payment
      └── Request feedback
              │
              ↓
          Customer
              │
              ├── Review
              │
              └── Complaint
                    │
                    ↓
          P9 Review & Complaint
                    │
                    ↓
              D10 / D11
```

---

# 16. Complete End-to-End Data Flow

```text
┌──────────┐
│ Customer │
└────┬─────┘
     │
     │ Trip Requirements
     ↓
┌─────────────┐
│   Inquiry   │
└──────┬──────┘
       │
       ↓
┌────────────────────┐
│ AMX Admin Review   │
└─────────┬──────────┘
          │
          │ Service Request
          ↓
┌────────────────────┐
│     Providers      │
└─────────┬──────────┘
          │
          │ Availability + Price
          ↓
┌────────────────────┐
│     Quotation      │
└─────────┬──────────┘
          │
          │ Quote
          ↓
     ┌──────────┐
     │ Customer │
     └────┬─────┘
          │
       Accept
          ↓
┌────────────────────┐
│      Booking       │
└─────────┬──────────┘
          │
          ├────→ Payment
          │
          ├────→ Providers
          │
          └────→ Follow-Up
                    │
                    ↓
              Trip Completed
                    │
                    ↓
             Review / Complaint
                    │
                    ↓
             Business Reports
```

---

# 17. Critical Data Flow Rules

## DFR-01 — Inquiry Before Booking

A customer request must first exist as an inquiry before a booking is created.

## DFR-02 — Provider Information Before Final Quote

Provider availability and relevant pricing should be confirmed before the final quotation is issued.

## DFR-03 — Quotation Before Booking

A booking should normally be created only after the customer accepts the quotation.

## DFR-04 — Booking Before Payment Recording

Payments must be associated with a valid booking.

## DFR-05 — Payment Verification

A payment should be marked as confirmed only after AMX verifies the payment.

## DFR-06 — Important External Results Must Be Recorded

When provider communication occurs outside the system, important results should be recorded in AMX.

## DFR-07 — Minimum Necessary Data

Only information required for AMX operations should be collected and stored.

## DFR-08 — Traceability

Important operational changes should be traceable through audit records.

---

# 18. Data Ownership

| Data                      | Primary Responsibility                |
| ------------------------- | ------------------------------------- |
| Customer information      | AMX                                   |
| Inquiry                   | AMX                                   |
| Provider record           | AMX                                   |
| Provider's actual service | Provider                              |
| Package information       | AMX                                   |
| Quotation                 | AMX                                   |
| Booking                   | AMX                                   |
| Payment transaction       | External payment institution/provider |
| Payment record            | AMX                                   |
| Physical trip delivery    | Provider                              |
| Review                    | Customer                              |
| Complaint                 | Customer + AMX resolution             |
| Operational audit         | AMX                                   |

---

# 19. Sensitive Information

AMX should protect:

* Customer contact information
* Travel information
* Payment information
* Provider contact information
* Internal pricing/margin information
* Complaints
* Administrative credentials

Sensitive information should only be accessible to authorized users.

---

# 20. Data Flow Validation

Before Phase 3 is approved, verify:

* [ ] Customer inquiry data is complete.
* [ ] Provider information required for quotation is defined.
* [ ] Quotation data is sufficient to create a booking.
* [ ] Booking data supports multiple services/providers.
* [ ] Payment information is sufficient for tracking balances.
* [ ] Review and complaint information is connected to the booking.
* [ ] External communication results can be recorded.
* [ ] Data ownership is clear.
* [ ] Sensitive data is identified.
* [ ] No unnecessary MVP data flow has been introduced.

---

# 21. Key Analysis Result

The most important AMX data-flow principle is:

> **AMX receives customer requirements, coordinates external provider information, transforms that information into a clear quotation and booking, records the financial and operational result, and uses feedback to improve future operations.**

The system is therefore a **central information and coordination layer**, not a replacement for the external providers.

**Status:** Draft — pending validation.

---

## Next Artifact

**3.12 — State & Status Model**

This will formally define the lifecycle of the major AMX objects, especially:

**Inquiry → Quotation → Booking → Payment → Completion**

including valid statuses, transitions, and cancellation paths.

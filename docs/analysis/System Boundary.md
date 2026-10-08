# 3.10 — System Boundary

## 1. Purpose

This document defines exactly what is **inside and outside the AMX software system**.

The boundary prevents unnecessary features from entering the MVP and clarifies which activities remain human-controlled or are performed by external providers.

---

## 2. System Definition

**System Name:** AMX — Arba Minch Experiences Management System

### Core Purpose

> AMX is a software-supported tourism coordination system that helps AMX receive customer requests, manage providers, prepare quotations, manage bookings, record payments, coordinate trips, and track customer feedback.

The system **supports AMX operations** but does not physically provide tourism services.

---

# 3. System Boundary Diagram

```text
                     EXTERNAL WORLD
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Visitor / Customer                    Local Providers       │
│        │                          ┌───────────────────────┐   │
│        │                          │ Guide                │   │
│        │                          │ Driver               │   │
│        │                          │ Hotel / Lodge        │   │
│        │                          │ Boat Provider        │   │
│        │                          │ Tour Operator        │   │
│        │                          └───────────┬───────────┘   │
│        │                                      │               │
│        │                                      │               │
│        ↓                                      ↓               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                     AMX SYSTEM                         │  │
│  │                                                        │  │
│  │  Customer Management                                   │  │
│  │  Inquiry Management                                    │  │
│  │  Provider Management                                   │  │
│  │  Package Management                                    │  │
│  │  Quotation Management                                  │  │
│  │  Booking Management                                    │  │
│  │  Payment Recording                                     │  │
│  │  Follow-Up Management                                  │  │
│  │  Review / Complaint Management                         │  │
│  │  Authentication & Authorization                        │  │
│  │  Reporting & Audit                                     │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                         ↑                                    │
│                         │                                    │
│                  AMX Admin / Operator                         │
│                                                              │
│  External Services: Payment / Email / WhatsApp / Hosting     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

# 4. Inside the AMX System

The following responsibilities are **inside the software boundary**.

## 4.1 Customer Management

The system stores and manages:

* Customer name
* Contact information
* Trip history
* Customer notes
* Organization/group information where applicable

---

## 4.2 Inquiry Management

The system supports:

* Creating inquiries
* Viewing inquiries
* Updating inquiries
* Assigning status
* Recording customer requirements
* Tracking follow-ups
* Closing inquiries

---

## 4.3 Provider Management

The system stores:

* Provider name
* Provider type
* Contact information
* Location
* Services
* Price information
* Verification information
* Notes
* Availability information received by AMX
* Provider performance notes

Provider communication itself may remain external.

---

## 4.4 Package Management

The system manages:

* Package name
* Description
* Destination
* Duration
* Services
* Price guidance
* Inclusions
* Exclusions
* Status

Example:

```text
Lake Chamo Experience
Dorze + Lake Chamo
Custom Arba Minch Experience
```

---

## 4.5 Quotation Management

The system supports:

* Creating quotations
* Adding services
* Adding prices
* Calculating totals
* Recording inclusions/exclusions
* Recording terms
* Setting validity
* Sending/storing quotations
* Tracking quotation status

---

## 4.6 Booking Management

The system manages:

* Booking creation
* Booking reference
* Customer
* Travel date
* Services
* Providers
* Total price
* Booking status
* Cancellation
* Completion

---

## 4.7 Payment Recording

The MVP records:

* Payment amount
* Payment date
* Payment method
* Reference
* Payment status
* Remaining balance

The actual movement of money may occur outside the AMX system.

---

## 4.8 Follow-Up Management

The system supports:

* Customer follow-ups
* Provider follow-ups
* Payment reminders
* Pre-trip confirmation
* Post-trip follow-up
* Complaint follow-up

---

## 4.9 Reviews & Complaints

The system records:

* Customer review
* Rating where applicable
* Complaint
* Complaint status
* Resolution notes
* Follow-up

---

## 4.10 Authentication & Authorization

The MVP supports secure access for AMX staff/operators.

It includes:

* Login
* Password protection
* User roles
* Access control
* Session/security management

---

## 4.11 Reporting & Audit

The system provides basic information such as:

* Number of inquiries
* Quotations
* Confirmed bookings
* Completed trips
* Revenue
* Payments
* Cancellations
* Customer feedback

Important administrative actions may be recorded in an audit log.

---

# 5. Outside the AMX System

The following are explicitly outside the software boundary.

## 5.1 Physical Tourism Services

AMX does not physically perform:

* Driving
* Tour guiding
* Boat operation
* Hotel accommodation
* Restaurant services
* Physical tourism activities

These are provided by external businesses/persons.

---

## 5.2 Provider Internal Operations

AMX does not manage the provider's internal:

* Payroll
* Accounting
* Fleet management
* Employee management
* Hotel room management
* Boat maintenance
* Internal scheduling systems

AMX only records information required for coordination.

---

## 5.3 Customer's Personal Systems

AMX does not control:

* Customer bank accounts
* Customer mobile-money accounts
* Customer personal devices
* Customer private email systems

---

## 5.4 External Payment Processing

If online payment is introduced, the payment gateway remains outside AMX.

```text
Customer
   ↓
Payment Provider
   ↓
Payment Result
   ↓
AMX
```

AMX records the transaction result rather than becoming the financial institution.

---

## 5.5 External Communication Platforms

WhatsApp, phone networks, email providers, and similar platforms are external.

For the MVP:

```text
AMX System
     ↓
Operator
     ↓
WhatsApp / Phone / Email
     ↓
Provider
```

The important result can then be recorded in AMX.

---

# 6. Human vs System Responsibility

This distinction is critical.

| Activity                      |  System |   Human  |
| ----------------------------- | :-----: | :------: |
| Receive inquiry               |    ✓    |          |
| Review requirements           | Support |     ✓    |
| Clarify customer needs        | Support |     ✓    |
| Find suitable provider        | Support |     ✓    |
| Contact provider              |         |     ✓    |
| Confirm provider availability |  Record |     ✓    |
| Calculate quotation           |    ✓    |  Review  |
| Negotiate price               |         |     ✓    |
| Send quotation                |    ✓    |  Review  |
| Customer decision             |         |     ✓    |
| Create booking                |    ✓    |  Confirm |
| Record payment                |    ✓    |  Verify  |
| Physical trip coordination    | Support |     ✓    |
| Deliver tourism service       |         | Provider |
| Record completion             |    ✓    |  Confirm |
| Collect feedback              |    ✓    |  Support |
| Resolve complaint             | Support |     ✓    |

---

# 7. MVP System Boundary

### Must Be Inside

```text
✓ Public Website
✓ Inquiry Management
✓ Customer Management
✓ Provider Management
✓ Package Management
✓ Quotation Management
✓ Booking Management
✓ Payment Recording
✓ Follow-Ups
✓ Reviews / Complaints
✓ Authentication
✓ Basic Reporting
✓ Audit Records
```

### Must Stay Outside

```text
✗ Provider Self-Service Portal
✗ Online Payment Processing
✗ Automatic Hotel Availability
✗ Live Vehicle Tracking
✗ Native Mobile Application
✗ AI Chatbot
✗ Multi-City Marketplace
✗ Provider Accounting
✗ Provider Fleet Management
✗ Automatic Commission Splitting
```

---

# 8. System Boundary by Responsibility

```text
                    AMX RESPONSIBILITY
                           │
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
    Information         Coordination       Records
        │                  │                  │
        ↓                  ↓                  ↓
   Customers          Providers          Payments
   Inquiries           Services          Bookings
   Packages            Quotations        Reviews
```

AMX is responsible for the **coordination layer**, while providers remain responsible for the actual service delivery.

---

# 9. Data Boundary

### AMX Owns/Manages

* Customer information
* Inquiry information
* Provider records
* Package information
* Quotations
* Booking records
* Payment records
* Reviews
* Complaints
* Operational notes
* Audit records

### External Data

* Bank/payment-provider transaction details
* Provider internal accounting
* Provider employee records
* Hotel internal systems
* External communication records
* Government/regulatory records

Only the minimum information required for AMX operations should be stored.

---

# 10. Scope-Control Rules

The following rules apply to prevent scope creep:

### Rule 1 — Coordination, Not Marketplace

AMX coordinates selected providers but does not attempt to become a national tourism marketplace.

### Rule 2 — Human Coordination First

If manual phone/WhatsApp coordination works for the MVP, automation is not required.

### Rule 3 — Record Important Results

Even when an activity happens outside the system, its important result should be recorded when necessary.

### Rule 4 — No Provider Accounts in MVP

Providers remain external actors unless future validation proves self-service accounts are necessary.

### Rule 5 — No Online Payments Initially

Payment recording is sufficient until the business model and payment process are validated.

### Rule 6 — No AI Before Core Workflow Works

AI should only be considered after the basic AMX workflow is reliable.

---

# 11. Future Boundary Expansion

The boundary may expand after MVP validation.

Possible future additions:

```text
Provider Portal
      ↓
Online Payment
      ↓
Automated Availability
      ↓
Customer Accounts
      ↓
Notifications
      ↓
Mobile Application
      ↓
AI Travel Assistant
      ↓
Multi-City Operations
```

These are **future system capabilities**, not MVP requirements.

---

# 12. Boundary Validation Questions

Before moving forward, validate:

1. Is every MVP responsibility clearly inside the system?
2. Are physical tourism services clearly outside?
3. Are providers correctly treated as external actors?
4. Is manual WhatsApp/phone coordination acceptable for MVP?
5. Is payment recording sufficient initially?
6. Are there legal/regulatory responsibilities that must be added?
7. Are there any features currently inside the scope that AMX does not actually need?

---

# 13. Boundary Decision

The AMX MVP follows this principle:

> **If AMX needs to manage, record, coordinate, or report it, it belongs inside the system. If an external person, provider, platform, or organization performs it independently, it remains outside the system.**

This boundary keeps the MVP **small enough to build, but complete enough to operate the real AMX business.**

**Status:** Draft — pending stakeholder and legal validation.

---

## Next Artifact

**3.11 — Data Flow Analysis**

This will define how information moves through AMX:

**Customer → Inquiry → Provider Information → Quotation → Booking → Payment → Trip → Feedback**

and identify the major inputs, outputs, data stores, and information flows.

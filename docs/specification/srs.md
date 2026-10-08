# AMX — Software Requirements Specification (SRS)

**Project:** AMX — Arba Minch Experiences Management System
**Document:** Software Requirements Specification
**Version:** 1.0
**Status:** Draft for Validation
**Phase:** 4 — Requirements Specification

---

## 1. Introduction

### 1.1 Purpose

This document defines the software requirements for the **AMX — Arba Minch Experiences Management System**.

It establishes what the AMX system must provide for customers and AMX administrators and serves as the baseline for system architecture, design, implementation, and testing.

### 1.2 Product Vision

AMX will provide a single coordination point where visitors can request an Arba Minch experience and AMX can coordinate verified local providers, prepare a clear quotation, manage the booking, and support the customer.

### 1.3 Business Objective

The system must help AMX:

* Receive and manage customer inquiries.
* Coordinate local tourism providers.
* Create clear quotations.
* Convert qualified inquiries into bookings.
* Track payments and operational costs.
* Support customers before and during trips.
* Measure business performance.

---

# 2. Product Scope

## 2.1 MVP In Scope

The system shall provide:

1. Public website
2. Package and service information
3. Customer inquiry submission
4. Customer management
5. Provider management
6. Provider verification records
7. Package management
8. Quotation management
9. Booking management
10. Payment recording
11. Follow-up management
12. Reviews and complaints
13. Administrator authentication
14. Role and access control
15. Business reports
16. Audit records
17. Security and backup capabilities
18. Mobile-responsive interface

## 2.2 Out of Scope

The MVP shall not include:

* Provider self-service accounts
* Automatic provider availability
* Online payment processing
* Native mobile applications
* AI chatbot
* Live vehicle tracking
* Multi-city marketplace
* Automatic commission splitting
* Complex payment integrations

---

# 3. Users and Actors

| Actor                        | Main Responsibility                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| Visitor / Customer           | Explore services, submit inquiry, receive quotation, confirm booking, provide feedback |
| Administrator / AMX Operator | Manage the complete operational workflow                                               |
| Tour Guide                   | Provide tourism services                                                               |
| Driver                       | Provide transportation                                                                 |
| Hotel / Lodge                | Provide accommodation                                                                  |
| Boat Provider                | Provide boat services                                                                  |
| Tour Operator                | Provide tourism services where applicable                                              |

Providers interact with AMX operationally through **phone, WhatsApp, email, or other external communication** in the MVP.

---

# 4. System Overview

### Core workflow

```text
Visitor
   ↓
View Packages / Services
   ↓
Submit Inquiry
   ↓
AMX Reviews Inquiry
   ↓
Check Providers & Availability
   ↓
Prepare Quotation
   ↓
Send Quotation
   ↓
Customer Accepts / Declines
   ↓
Booking
   ↓
Payment Recording
   ↓
Trip Coordination
   ↓
Trip Completion
   ↓
Review / Complaint
   ↓
Business Reporting
```

The system supports the workflow; important real-world decisions remain under AMX human control.

---

# 5. Functional Requirements

## 5.1 Public Website

**FR-01** The system shall display AMX information and services.

**FR-02** The system shall display available tourism packages.

**FR-03** The system shall display package details, including services, duration, inclusions, and exclusions.

**FR-04** The system shall provide AMX contact methods.

**FR-05** The system shall provide a custom-trip inquiry form.

---

## 5.2 Customer Inquiry

**FR-06** The system shall allow visitors to submit inquiries.

**FR-07** An inquiry shall capture relevant information including:

* Customer name
* Phone/WhatsApp
* Email where available
* Travel date
* Number of travelers
* Arrival location
* Number of days
* Budget
* Interests
* Hotel requirements
* Transport requirements
* Special requirements

**FR-08** The system shall assign a unique inquiry reference.

**FR-09** Administrators shall be able to view, update, and manage inquiries.

**FR-10** The system shall support inquiry status tracking.

---

## 5.3 Customer Management

**FR-11** Administrators shall create and manage customer records.

**FR-12** The system shall maintain customer inquiry and booking history.

**FR-13** Administrators shall be able to search and filter customers.

---

## 5.4 Provider Management

**FR-14** Administrators shall create and manage provider records.

**FR-15** Provider records shall include provider type, contact information, services, pricing information, availability process, and verification information.

**FR-16** The system shall record provider verification status.

**FR-17** The system shall record provider performance and operational notes.

**FR-18** The system shall prevent an unverified provider from being represented as verified.

---

## 5.5 Package Management

**FR-19** Administrators shall create, update, activate, deactivate, and archive packages.

**FR-20** Packages shall contain services, descriptions, duration, inclusions, exclusions, and pricing information where applicable.

---

## 5.6 Quotation Management

**FR-21** Administrators shall create quotations from customer requirements and confirmed provider information.

**FR-22** A quotation shall include:

* Customer information
* Travel dates
* Number of guests
* Services
* Providers
* Inclusions
* Exclusions
* Total price
* Deposit/balance
* Cancellation terms
* Booking reference when applicable

**FR-23** The system shall calculate quotation totals.

**FR-24** The system shall maintain quotation status.

**FR-25** Administrators shall be able to send quotations through available communication channels.

---

## 5.7 Booking Management

**FR-26** The system shall create a booking after quotation acceptance.

**FR-27** Each booking shall have a unique booking reference.

**FR-28** Administrators shall manage booking status.

**FR-29** A booking shall contain its required services and providers.

**FR-30** Administrators shall record booking changes and important operational notes.

---

## 5.8 Payment Management

**FR-31** Administrators shall record payments against bookings.

**FR-32** Payment records shall include amount, date, method, reference, and status.

**FR-33** The system shall calculate recorded paid amount and remaining balance.

**FR-34** The MVP shall record payments but shall not process online payments.

---

## 5.9 Follow-Up

**FR-35** Administrators shall create follow-up tasks.

**FR-36** The system shall track follow-up status and dates.

**FR-37** Administrators shall record follow-up notes.

---

## 5.10 Reviews and Complaints

**FR-38** Customers shall be able to provide feedback after a completed experience.

**FR-39** Administrators shall record and manage reviews.

**FR-40** Administrators shall record and manage complaints.

**FR-41** Complaints shall support resolution tracking.

---

## 5.11 Authentication and Administration

**FR-42** Administrators shall authenticate securely.

**FR-43** The system shall enforce role-based access control.

**FR-44** The system shall restrict administrative functions to authorized users.

**FR-45** Important administrative actions shall be auditable.

---

## 5.12 Reporting

**FR-46** Administrators shall view operational information.

**FR-47** The system shall support reports for:

* Inquiries
* Quotations
* Bookings
* Payments
* Revenue
* Costs where recorded
* Completed trips
* Cancellations
* Reviews and complaints

---

# 6. Business Rules

The system shall enforce or support the following principles:

* **BRL-01:** Provider verification must be recorded before claiming a provider is verified.
* **BRL-02:** Provider availability should be confirmed before final booking.
* **BRL-03:** A quotation is normally required before a confirmed booking.
* **BRL-04:** A quotation must contain a clear total price.
* **BRL-05:** A confirmed booking must have a unique booking reference.
* **BRL-06:** Payments must be associated with a booking.
* **BRL-07:** Payment information must be verified before being treated as confirmed.
* **BRL-08:** Price changes must be communicated to the customer.
* **BRL-09:** Cancellation conditions must be recorded and communicated.
* **BRL-10:** Customer information must be protected.
* **BRL-11:** Important operational changes must be traceable.
* **BRL-12:** AMX must not misrepresent provider qualifications or availability.
* **BRL-13:** Legal and tourism requirements must be validated before commercial operation.

---

# 7. Core Status Requirements

### Inquiry

```text
NEW
 → CONTACTED
 → PROVIDER_CHECKING
 → QUOTATION_SENT
 → AWAITING_CONFIRMATION
 → CONVERTED
 → CLOSED
```

Alternative outcomes include:

```text
DECLINED
CANCELLED
```

### Booking

```text
PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
                    ↘
                     CANCELLED
```

### Payment

```text
PENDING → SUBMITTED → VERIFIED
                    → FAILED
                    → PARTIAL
                    → PAID
                    → REFUNDED
```

Exact transition rules are defined in the system analysis and will be refined during design.

---

# 8. Data Requirements

The system shall manage at minimum:

* Customers
* Inquiries
* Providers
* Packages
* Quotations
* Bookings
* Booking Services
* Payments
* Follow-Ups
* Reviews
* Complaints
* Users
* Roles
* Audit Logs

Data relationships and database implementation will be defined in Phase 6.

---

# 9. Interface Requirements

## 9.1 Customer Interface

The public interface shall provide:

* Home
* About
* Packages
* Package details
* Custom-trip request
* Contact
* Terms
* Privacy

## 9.2 Administrator Interface

The administrative interface shall provide:

* Dashboard
* Inquiries
* Customers
* Providers
* Packages
* Quotations
* Bookings
* Payments
* Follow-ups
* Reviews/Complaints
* Reports
* Users/Roles
* Audit information

## 9.3 External Communication

The MVP shall support operational communication through:

* Phone
* WhatsApp
* Email

External communication platforms are not part of the AMX core system.

---

# 10. Non-Functional Requirements

The system shall be:

| Area            | Requirement                                                                |
| --------------- | -------------------------------------------------------------------------- |
| Performance     | Common pages and operations should respond quickly under expected MVP load |
| Security        | Authentication, authorization, validation, secure credentials              |
| Availability    | Suitable for normal tourism business operations                            |
| Reliability     | Prevent data loss and preserve important operational records               |
| Usability       | Simple for non-technical AMX operators                                     |
| Responsive      | Usable on desktop, tablet, and mobile                                      |
| Maintainability | Modular and documented codebase                                            |
| Scalability     | Able to support future growth                                              |
| Backup          | Regular database and important-data backups                                |
| Privacy         | Protect customer and operational information                               |
| Compatibility   | Support modern browsers                                                    |
| Accessibility   | Follow practical accessibility standards                                   |
| Observability   | Maintain useful logs and error information                                 |
| SEO             | Public pages should support basic search-engine visibility                 |
| Localization    | English first; Amharic support where practical                             |

Detailed measurable targets will be defined in the dedicated NFR specification.

---

# 11. Security Requirements

The system shall:

* Require authentication for administrative functions.
* Enforce authorization by role.
* Protect administrator credentials.
* Validate user input.
* Protect sensitive customer information.
* Use secure communication in production.
* Maintain audit records for important actions.
* Restrict unnecessary access to data.
* Support secure backups and recovery.
* Avoid storing unnecessary payment credentials.

---

# 12. Reporting Requirements

The system should provide operational visibility into:

```text
Inquiries
   ↓
Quotations
   ↓
Bookings
   ↓
Payments
   ↓
Completed Trips
   ↓
Revenue / Costs
   ↓
Customer Feedback
```

Key business indicators include:

* Number of inquiries
* Inquiry-to-quotation rate
* Quotation-to-booking rate
* Completed bookings
* Average booking value
* Revenue
* Recorded costs
* Gross margin
* Cancellation rate
* Customer satisfaction
* Provider reliability

---

# 13. Legal and Compliance Requirements

Before commercial launch, AMX shall validate applicable requirements concerning:

* Business registration
* Tourism licensing
* Provider qualifications
* Customer terms and conditions
* Cancellation and refund policies
* Privacy and data protection
* Tax and accounting
* Provider agreements
* Liability and emergency responsibilities

The system shall not assume legal compliance where professional or governmental validation is required.

---

# 14. MVP Acceptance Criteria

The MVP will be considered functionally ready when AMX can complete this real-world flow:

```text
Customer submits inquiry
        ↓
Admin reviews inquiry
        ↓
Provider availability is checked
        ↓
Quotation is created
        ↓
Quotation is sent
        ↓
Customer accepts
        ↓
Booking is created
        ↓
Payment is recorded
        ↓
Trip is coordinated
        ↓
Trip is completed
        ↓
Review/complaint is recorded
        ↓
Business result is reported
```

A successful pilot should demonstrate the workflow using a **real or controlled test booking** from beginning to completion.

---

# 15. Traceability

Every major requirement shall remain traceable through:

```text
Business Need
      ↓
Business Requirement
      ↓
User Requirement
      ↓
Functional / Non-Functional Requirement
      ↓
Use Case / User Story
      ↓
System Design
      ↓
Implementation
      ↓
Test Case
```

The detailed traceability matrix will remain the authoritative reference for requirement coverage.

---

# 16. Future Expansion

The following may be considered after MVP validation:

* Provider accounts
* Customer accounts
* Online payments
* Automated notifications
* Provider availability calendar
* Advanced analytics
* AI-assisted customer support
* Mobile/PWA
* Additional destinations
* Integration with external tourism services

Future features must not compromise the simplicity of the core coordination workflow.

---

# 17. SRS Approval Criteria

This SRS is ready for baseline approval when:

* All MVP requirements are specified.
* Requirements are clear and testable.
* No major contradictions exist.
* Scope matches the approved Project Charter.
* Requirements are traceable to Phase 2 and Phase 3.
* Legal/open business questions are clearly identified.
* Stakeholders approve the specification.

**Status:** Draft → Under Review → Validated → Approved → Baselined

---

## 18. Next Phase

After SRS approval:

**PHASE 5 — SYSTEM ARCHITECTURE & DESIGN**

The next phase will determine **how AMX will be built**, including architecture, components, technology decisions, security architecture, deployment architecture, and system design.

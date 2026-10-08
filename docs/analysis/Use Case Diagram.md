# 3.6 — Use Case Diagram

## 1. Purpose

This document defines the major interactions between **AMX users/external actors** and the AMX Management System.

The use-case model identifies **what the system must allow users to do**, without defining how the system will be implemented.

---

## 2. System Boundary

**System:** AMX — Arba Minch Experiences Management System

### Primary System Actors

1. **Visitor / Customer**
2. **Administrator / AMX Operator**

### External Service Actors

3. Tour Guide
4. Driver
5. Hotel / Lodge
6. Boat-Service Provider
7. Tour Operator
8. Payment Provider — future
9. Email/Messaging Service — future

> In the MVP, providers do not have AMX accounts. Their information is communicated to the AMX Operator and recorded in the system.

---

## 3. Main Use Cases

### Visitor / Customer

* UC-01 View Packages & Services
* UC-02 View Package Details
* UC-03 Submit Inquiry
* UC-04 Contact AMX
* UC-05 Receive Quotation
* UC-06 Accept / Decline Quotation
* UC-07 Receive Booking Confirmation
* UC-08 Provide Review / Complaint

### Administrator / AMX Operator

* UC-09 Authenticate
* UC-10 Manage Inquiries
* UC-11 Manage Customers
* UC-12 Manage Providers
* UC-13 Manage Packages
* UC-14 Check Provider Information
* UC-15 Create Quotation
* UC-16 Send Quotation
* UC-17 Manage Bookings
* UC-18 Record Payment
* UC-19 Manage Follow-Ups
* UC-20 Record Review / Complaint
* UC-21 View Business Reports
* UC-22 Manage Users / Roles

### Supporting / Future Integrations

* UC-23 Process Online Payment — Future
* UC-24 Send Automated Notification — Future

---

## 4. Use Case Diagram

```text
                    AMX MANAGEMENT SYSTEM
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   Visitor / Customer                                         │
│        │                                                     │
│        ├──────> (UC-01 View Packages & Services)            │
│        ├──────> (UC-02 View Package Details)                │
│        ├──────> (UC-03 Submit Inquiry)                      │
│        ├──────> (UC-04 Contact AMX)                         │
│        │                                                     │
│        ├──────> (UC-05 Receive Quotation)                   │
│        ├──────> (UC-06 Accept / Decline Quotation)          │
│        ├──────> (UC-07 Receive Booking Confirmation)         │
│        └──────> (UC-08 Provide Review / Complaint)           │
│                                                              │
│                                                              │
│   Administrator / AMX Operator                               │
│        │                                                     │
│        ├──────> (UC-09 Authenticate)                        │
│        ├──────> (UC-10 Manage Inquiries)                    │
│        ├──────> (UC-11 Manage Customers)                    │
│        ├──────> (UC-12 Manage Providers)                    │
│        ├──────> (UC-13 Manage Packages)                     │
│        ├──────> (UC-14 Check Provider Information)           │
│        ├──────> (UC-15 Create Quotation)                    │
│        ├──────> (UC-16 Send Quotation)                      │
│        ├──────> (UC-17 Manage Bookings)                     │
│        ├──────> (UC-18 Record Payment)                      │
│        ├──────> (UC-19 Manage Follow-Ups)                   │
│        ├──────> (UC-20 Record Review / Complaint)           │
│        ├──────> (UC-21 View Business Reports)               │
│        └──────> (UC-22 Manage Users / Roles)                │
│                                                              │
└──────────────────────────────────────────────────────────────┘


 External Service Actors

 Tour Guide ────────────────┐
 Driver ────────────────────┤
 Hotel / Lodge ─────────────┤
 Boat Provider ─────────────┼──> Provider Information /
 Tour Operator ─────────────┘    Availability / Price
                                  │
                                  ↓
                           AMX Operator


 Payment Provider ─────────────> (UC-23 Process Online Payment)
                                      [FUTURE]

 Email / Messaging Service ───> (UC-24 Send Automated Notification)
                                      [FUTURE]
```

---

## 5. Core Use-Case Relationships

The most important relationships are:

```text
Submit Inquiry
      │
      └──> Manage Inquiry
                 │
                 └──> Check Provider Information
                            │
                            ↓
                     Create Quotation
                            │
                            └──> Send Quotation
                                      │
                                      ↓
                              Customer Decision
                               /            \
                            Accept          Decline
                              │                │
                              ↓                ↓
                       Manage Booking      Close Inquiry
                              │
                              ├──> Record Payment
                              │
                              └──> Coordinate Trip
                                         │
                                         ↓
                                  Complete Booking
                                         │
                                         ↓
                                  Record Review
```

---

## 6. Use-Case Grouping

### A. Customer Engagement

* View Packages
* View Package Details
* Submit Inquiry
* Contact AMX
* Receive Quotation
* Accept/Decline Quotation
* Receive Confirmation
* Provide Feedback

### B. Inquiry & Customer Management

* Manage Inquiries
* Manage Customers
* Follow-Up

### C. Provider Management

* Manage Providers
* Check Provider Information
* Record availability and pricing
* Record provider performance

### D. Sales & Booking

* Create Quotation
* Send Quotation
* Manage Booking
* Record Payment
* Complete Booking

### E. Administration

* Authenticate
* Manage Users/Roles
* Manage Packages
* View Reports
* Review complaints

---

## 7. Core MVP Use Cases

The following use cases are the **business-critical MVP path**:

```text
UC-03 Submit Inquiry
        ↓
UC-10 Manage Inquiry
        ↓
UC-14 Check Provider Information
        ↓
UC-15 Create Quotation
        ↓
UC-16 Send Quotation
        ↓
UC-06 Accept / Decline
        ↓
UC-17 Manage Booking
        ↓
UC-18 Record Payment
        ↓
Trip Coordination
        ↓
UC-20 Record Review / Complaint
```

If this flow works reliably, AMX can operate its core business.

---

## 8. Provider Interaction Model

Providers do **not** directly operate the AMX system in the MVP.

Instead:

```text
AMX Operator
     │
     │ Phone / WhatsApp / Email
     ↓
Provider
     │
     │ Availability / Price / Confirmation
     ↓
AMX Operator
     │
     ↓
AMX System
```

The operator records the important information in AMX.

This keeps the MVP operationally simple.

---

## 9. Important Use-Case Boundaries

### Included in MVP

* Public package browsing
* Inquiry submission
* Contact
* Admin authentication
* Inquiry management
* Customer management
* Provider management
* Package management
* Quotation creation
* Quotation sending
* Booking management
* Payment recording
* Follow-up
* Reviews/complaints
* Basic reporting

### Future

* Customer accounts
* Provider accounts
* Provider self-service dashboard
* Online payment
* Automated notifications
* Provider availability calendar
* Advanced analytics
* AI assistant
* Mobile application

---

## 10. Use-Case Priority

| ID    | Use Case                     | Priority |
| ----- | ---------------------------- | -------- |
| UC-01 | View Packages & Services     | Must     |
| UC-02 | View Package Details         | Must     |
| UC-03 | Submit Inquiry               | Must     |
| UC-04 | Contact AMX                  | Must     |
| UC-05 | Receive Quotation            | Must     |
| UC-06 | Accept / Decline Quotation   | Must     |
| UC-07 | Receive Booking Confirmation | Must     |
| UC-08 | Review / Complaint           | Should   |
| UC-09 | Authenticate                 | Must     |
| UC-10 | Manage Inquiries             | Must     |
| UC-11 | Manage Customers             | Must     |
| UC-12 | Manage Providers             | Must     |
| UC-13 | Manage Packages              | Must     |
| UC-14 | Check Provider Information   | Must     |
| UC-15 | Create Quotation             | Must     |
| UC-16 | Send Quotation               | Must     |
| UC-17 | Manage Bookings              | Must     |
| UC-18 | Record Payment               | Must     |
| UC-19 | Manage Follow-Ups            | Should   |
| UC-20 | Record Review / Complaint    | Should   |
| UC-21 | View Business Reports        | Should   |
| UC-22 | Manage Users / Roles         | Must     |
| UC-23 | Online Payment               | Future   |
| UC-24 | Automated Notifications      | Future   |

---

## 11. Primary Use-Case Dependencies

### Inquiry

```text
Submit Inquiry
      ↓
Manage Inquiry
      ↓
Check Providers
```

### Quotation

```text
Check Providers
      ↓
Create Quotation
      ↓
Send Quotation
```

### Booking

```text
Customer Accepts
      ↓
Manage Booking
      ↓
Record Payment
      ↓
Coordinate Trip
      ↓
Complete Booking
```

### Feedback

```text
Completed Booking
      ↓
Collect Feedback
      ↓
Record Review / Complaint
```

---

## 12. Use-Case Modeling Principle

A use case describes a **user goal**, not a technical function.

For example:

**Good:**

> Create Quotation

**Not a primary use case:**

> Insert quotation record into PostgreSQL

The database operation belongs to system design and implementation, not the use-case model.

---

## 13. Validation Questions

Before moving forward, validate:

1. Are Visitor and AMX Operator the correct MVP system actors?
2. Are any additional internal roles required?
3. Should providers ever receive direct AMX accounts?
4. Is customer acceptance through the website necessary, or can it remain manual?
5. Is online payment required for the MVP?
6. Are reviews collected through the system or manually?
7. Are automated email/WhatsApp notifications required now or later?

---

## 14. Phase 3 Dependency

The Use Case Diagram provides the foundation for:

* Detailed Use-Case Specifications
* Activity Diagrams
* Sequence Diagrams
* UI screen identification
* API identification
* Permission design
* Testing scenarios

**Status:** Draft — pending stakeholder validation.

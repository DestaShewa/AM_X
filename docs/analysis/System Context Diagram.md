# 3.5 — System Context Diagram

## 1. Purpose

The System Context Diagram defines the boundary of the **AMX software system** and shows how it interacts with external actors and services.

It answers:

> **Who interacts with AMX, what information do they exchange, and what belongs outside the system?**

---

## 2. System Under Analysis

**System Name:** AMX — Arba Minch Experiences Management System

The AMX system supports:

* Customer inquiries
* Customer management
* Provider management
* Package management
* Quotations
* Bookings
* Payment records
* Follow-ups
* Reviews and complaints
* Basic business reporting

The system supports the AMX operator; it does **not** replace human coordination.

---

## 3. External Actors

| Actor / External System        | Interaction with AMX                                                         |
| ------------------------------ | ---------------------------------------------------------------------------- |
| Visitor / Customer             | Submits inquiries, receives quotations, confirms bookings, provides feedback |
| AMX Admin / Operator           | Manages the complete AMX operation                                           |
| Tour Guide                     | Provides availability, pricing, and service information                      |
| Driver                         | Provides transportation availability and pricing                             |
| Hotel / Lodge                  | Provides accommodation availability and pricing                              |
| Boat-Service Provider          | Provides boat availability and pricing                                       |
| Tour Operator                  | Provides additional tourism services                                         |
| Payment Provider               | Handles payment externally if online payment is introduced                   |
| Email / Messaging Service      | Supports customer communication and notifications                            |
| Hosting / Cloud Infrastructure | Runs and stores the AMX system                                               |

---

## 4. Context Diagram

```text
                         ┌──────────────────────┐
                         │   Tour Guide         │
                         │ Availability / Price │
                         └──────────┬───────────┘
                                    │
                                    │
┌─────────────────┐                 │
│ Visitor /       │                 │
│ Customer        │                 │
│                 │                 │
│ Inquiry         │                 │
│ Confirmation    │                 │
│ Feedback        │                 │
└────────┬────────┘                 │
         │                          │
         │                          ↓
         │                ┌────────────────────────┐
         │                │                        │
         ├───────────────→│          AMX           │←──────────────┐
         │                │   Management System    │               │
         │                │                        │               │
         │                │ • Inquiries            │               │
         │                │ • Customers            │               │
         │                │ • Providers            │               │
         │                │ • Packages             │               │
         │                │ • Quotations           │               │
         │                │ • Bookings             │               │
         │                │ • Payments             │               │
         │                │ • Reviews              │               │
         │                │ • Reporting             │               │
         │                └───────────┬────────────┘               │
         │                            │                            │
         │                            │                            │
         │                            │                 ┌──────────┴─────────┐
         │                            │                 │ AMX Admin /        │
         │                            │                 │ Operator            │
         │                            │                 │ Management          │
         │                            │                 └────────────────────┘
         │                            │
         │                            │
         │            ┌───────────────┼───────────────┐
         │            │               │               │
         ↓            ↓               ↓               ↓
   ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────────┐
   │ Driver   │ │ Hotel /  │ │ Boat Service │ │ Tour         │
   │          │ │ Lodge    │ │ Provider     │ │ Operator     │
   └──────────┘ └──────────┘ └──────────────┘ └──────────────┘


                 External / Supporting Systems
                              │
                ┌─────────────┼─────────────┐
                ↓             ↓             ↓
        ┌────────────┐ ┌────────────┐ ┌──────────────┐
        │ Payment    │ │ Messaging  │ │ Cloud /      │
        │ Provider   │ │ / Email    │ │ Hosting      │
        └────────────┘ └────────────┘ └──────────────┘
```

---

## 5. Information Exchange

### 5.1 Visitor ↔ AMX

**Visitor → AMX**

* Personal/contact information
* Travel date
* Group size
* Arrival location
* Number of days
* Budget
* Interests
* Hotel requirements
* Transport requirements
* Special requirements
* Confirmation/decline
* Feedback/complaints

**AMX → Visitor**

* Package information
* Clarification questions
* Quotation
* Booking confirmation
* Booking reference
* Payment instructions/records
* Trip information
* Support information

---

### 5.2 AMX Admin ↔ AMX

The Admin/Operator:

* Creates and updates records
* Reviews inquiries
* Manages providers
* Checks provider information
* Creates quotations
* Manages bookings
* Records payments
* Tracks follow-ups
* Records reviews/complaints
* Views reports

The AMX system provides the operator with structured information and workflow support.

---

### 5.3 AMX ↔ Tour Guide

**AMX → Guide**

* Service request
* Date
* Group size
* Required service
* Customer requirements

**Guide → AMX**

* Availability
* Price
* Service details
* Confirmation
* Changes/problems

---

### 5.4 AMX ↔ Driver

**AMX → Driver**

* Transportation request
* Date/time
* Pickup location
* Destination
* Group size
* Vehicle requirements

**Driver → AMX**

* Availability
* Price
* Vehicle information
* Confirmation
* Changes/problems

---

### 5.5 AMX ↔ Hotel/Lodge

**AMX → Hotel/Lodge**

* Accommodation request
* Dates
* Number of guests
* Room requirements

**Hotel/Lodge → AMX**

* Availability
* Room information
* Price
* Booking conditions
* Confirmation

---

### 5.6 AMX ↔ Boat-Service Provider

**AMX → Boat Provider**

* Requested date/time
* Group size
* Required boat service
* Customer requirements

**Boat Provider → AMX**

* Availability
* Price
* Capacity
* Confirmation
* Changes/problems

---

### 5.7 AMX ↔ Tour Operator

AMX may request:

* Specialized tourism services
* Package support
* Availability
* Pricing
* Confirmation

The tour operator provides the corresponding service information.

---

## 6. External Supporting Systems

### Payment Provider

**MVP:** Payment may be recorded manually.

**Future:** If online payment is introduced:

```text
AMX → Payment Provider → Payment Result → AMX
```

The payment provider remains outside the AMX system.

### Email / Messaging

Used for:

* Customer communication
* Notifications
* Quotation delivery
* Booking communication

WhatsApp/phone communication may remain manually controlled in the MVP.

### Cloud / Hosting

Provides:

* Application hosting
* Database infrastructure
* File storage
* Backups
* System availability

These are infrastructure dependencies, not AMX business actors.

---

## 7. System Boundary

### Inside AMX System

```text
✓ Customer Management
✓ Inquiry Management
✓ Provider Management
✓ Package Management
✓ Quotation Management
✓ Booking Management
✓ Payment Recording
✓ Follow-Up Management
✓ Review/Complaint Management
✓ Authentication & Authorization
✓ Basic Reporting
✓ Audit/Operational Records
```

### Outside AMX System

```text
✗ Actual transportation
✗ Tour guiding
✗ Boat operation
✗ Hotel accommodation
✗ Physical trip delivery
✗ External payment processing
✗ Government/regulatory operations
✗ Provider's internal systems
✗ Customer's personal banking system
```

---

## 8. Important MVP Boundary

AMX is primarily a **coordination and management system**.

It does not attempt to digitally control every provider.

For example:

```text
AMX System
     │
     │ Request
     ↓
Guide / Driver / Hotel / Boat Provider
     │
     │ Availability + Price
     ↓
AMX System
```

The provider communication may happen through phone or WhatsApp, while the **important result is recorded inside AMX**.

---

## 9. Context-Level Business Flow

```text
Customer
   │
   │ Trip Request
   ↓
┌───────────────────┐
│       AMX         │
│ Management System │
└─────────┬─────────┘
          │
          │ Service Requests
          ↓
   Local Providers
          │
          │ Availability + Price
          ↓
┌───────────────────┐
│       AMX         │
└─────────┬─────────┘
          │
          │ Quotation
          ↓
       Customer
          │
          │ Confirmation
          ↓
┌───────────────────┐
│       AMX         │
└─────────┬─────────┘
          │
          │ Coordination
          ↓
     Trip Delivery
```

---

## 10. Key Context-Level Rules

1. AMX is the central coordination system.
2. The customer interacts with AMX as the primary contact point.
3. Providers remain independent external actors.
4. Provider availability is not automatically assumed.
5. AMX records important provider and customer communication outcomes.
6. External payment processing is outside the core system.
7. Human coordination remains part of the MVP.
8. The system boundary may expand in future versions.

---

## 11. Validation Questions

Before architecture and implementation, validate:

* Are all important external actors identified?
* Does AMX need a separate tour-operator actor?
* Will hotels communicate directly with AMX?
* Which payment methods will be used initially?
* Is online payment required for MVP?
* Which communication channels will be official?
* What information must be exchanged with each provider?
* What legal/regulatory actors or systems must be included?

---

## 12. Phase 3 Dependency

This context model provides the foundation for:

* **3.6 Use Case Diagram**
* Activity Diagrams
* Sequence Diagrams
* Domain Model
* Data Flow Analysis
* System Boundary Definition
* Architecture Design

**Status:** Draft — validate with real AMX operational stakeholders.

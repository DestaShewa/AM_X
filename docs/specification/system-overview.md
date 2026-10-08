# AMX — System Overview

## 1. Purpose

The **AMX — Arba Minch Experiences Management System** is a web-based system that supports AMX in coordinating tourism experiences between customers and local service providers.

It is a **coordination and management system**, not a tourism marketplace.

---

## 2. System Goal

AMX shall enable:

> **Inquiry → Provider Coordination → Quotation → Booking → Payment Recording → Trip Coordination → Completion → Feedback**

The system manages information and workflow while AMX staff handle important real-world coordination.

---

## 3. Primary Users

| User              | Main Function                                                                          |
| ----------------- | -------------------------------------------------------------------------------------- |
| Visitor/Customer  | Explore services, submit inquiry, receive quotation, confirm booking, provide feedback |
| AMX Administrator | Manage customers, providers, inquiries, quotations, bookings, payments, and operations |

### External Providers

* Tour guides
* Drivers
* Hotels/lodges
* Boat providers
* Tour operators

Providers have **no system accounts in the MVP**.

---

## 4. Major System Modules

```text
AMX System
├── Public Website
├── Authentication & Access Control
├── Customer Management
├── Inquiry Management
├── Provider Management
├── Package Management
├── Quotation Management
├── Booking Management
├── Payment Recording
├── Follow-Up Management
├── Reviews & Complaints
├── Reporting
└── Audit & System Management
```

---

## 5. Core Workflow

```text
Customer
   ↓
Submit Inquiry
   ↓
Admin Reviews
   ↓
Check Providers
   ↓
Confirm Availability & Price
   ↓
Create Quotation
   ↓
Customer Accepts
   ↓
Create Booking
   ↓
Record Payment
   ↓
Coordinate Trip
   ↓
Complete Trip
   ↓
Feedback
```

---

## 6. System Boundary

### Inside AMX

* Customer records
* Inquiries
* Providers and verification records
* Packages
* Quotations
* Bookings
* Payment records
* Follow-ups
* Reviews/complaints
* Reports
* Audit records

### Outside AMX

* Physical tourism services
* Provider internal operations
* External payment processing
* WhatsApp/phone/email platforms
* Government/regulatory systems

---

## 7. MVP Technology Direction

The system is expected to use:

* **Frontend:** Next.js / React
* **Backend:** Node.js + Express
* **Database:** PostgreSQL
* **Architecture:** Modular monolith
* **Deployment:** Cloud/VPS environment
* **Version Control:** Git/GitHub
* **Containerization:** Docker

Final technology and architecture decisions will be made in **Phase 5**.

---

## 8. Core Principle

**Automate records and workflow; keep important tourism decisions human-controlled.**

This ensures the MVP remains simple, reliable, and operationally realistic.

---

## 9. System Success

The system is successful when AMX can manage a real customer from:

**Inquiry → Quotation → Booking → Payment → Trip Completion → Feedback**

without losing important information or relying on scattered manual records.

**Next:** `functional-specification.md`

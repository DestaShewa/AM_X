# 3.3 — Future-State Analysis (TO-BE)

## 1. Purpose

This document defines the desired future state of **AMX — Arba Minch Experiences** after the MVP is implemented.

The goal is to replace fragmented tourism coordination with a **simple, centralized, human-supported coordination process**.

---

## 2. Future-State Vision

AMX will provide visitors with **one clear point of coordination** for Arba Minch experiences.

Instead of the visitor separately contacting multiple providers, AMX will:

1. Receive the visitor's request.
2. Understand the trip requirements.
3. Check suitable providers.
4. Confirm availability and prices.
5. Prepare one clear quotation.
6. Confirm the booking.
7. Coordinate the trip.
8. Record the outcome and feedback.

---

## 3. TO-BE Business Process

```text
Visitor
   ↓
Submit Inquiry
   ↓
AMX Reviews Request
   ↓
Contact / Clarify Requirements
   ↓
Check Providers & Availability
   ↓
Confirm Services & Prices
   ↓
Prepare Quotation
   ↓
Send Quotation
   ↓
Customer Accepts / Declines
   ↓
Booking Confirmed
   ↓
Trip Coordination
   ↓
Trip Completed
   ↓
Review & Feedback
   ↓
AMX Records Result
```

---

## 4. Future-State Customer Journey

| Stage      | Future AMX Process                                                            |
| ---------- | ----------------------------------------------------------------------------- |
| Discover   | Visitor finds AMX through website, WhatsApp, hotel, referral, or social media |
| Request    | Visitor submits trip requirements                                             |
| Clarify    | AMX contacts visitor when information is missing                              |
| Coordinate | AMX checks appropriate providers                                              |
| Quote      | AMX prepares one clear quotation                                              |
| Confirm    | Visitor accepts and booking is recorded                                       |
| Experience | AMX coordinates the agreed services                                           |
| Complete   | Trip is marked completed                                                      |
| Feedback   | Visitor provides review/complaint                                             |
| Improve    | AMX records lessons and business results                                      |

---

## 5. Future-State Operational Model

### Visitor

The visitor has **one main coordination point** instead of managing every provider separately.

### AMX Admin/Operator

AMX becomes the central coordinator responsible for:

* Managing inquiries
* Communicating with customers
* Checking providers
* Confirming availability
* Preparing quotations
* Managing bookings
* Recording payments
* Coordinating trip delivery
* Handling follow-ups and problems
* Collecting feedback

### Providers

Providers continue delivering their own services.

They do not need a self-service dashboard in the MVP.

Communication remains mainly through:

* Phone
* WhatsApp
* Email
* In-person communication where necessary

---

## 6. Future-State Information Flow

```text
Customer Information
       ↓
     Inquiry
       ↓
Provider Information
       ↓
Availability + Prices
       ↓
    Quotation
       ↓
    Booking
       ↓
Payment Information
       ↓
Trip Delivery
       ↓
Review / Complaint
```

AMX maintains the central operational record.

---

## 7. Future-State System Responsibilities

The AMX system should support:

* Public package/service information
* Inquiry collection
* Customer records
* Provider records
* Package management
* Quotation creation
* Booking status tracking
* Payment recording
* Follow-up reminders
* Review and complaint records
* Basic business reporting
* Secure administrative access

The system **supports coordination**; it does not replace the human operator.

---

## 8. Future-State Booking Status

```text
New Inquiry
    ↓
Contacted
    ↓
Provider Checking
    ↓
Quotation Sent
    ↓
Awaiting Confirmation
    ↓
Confirmed
    ↓
In Progress
    ↓
Completed
```

Alternative:

```text
Any Stage → Cancelled
```

Each booking should have a clear current status.

---

## 9. Future-State Business Rules

The future process should follow these principles:

1. A provider should be verified before being presented as verified.
2. Availability should be confirmed before final booking.
3. A quotation should be prepared before customer confirmation.
4. The quotation should clearly show included and excluded services.
5. A booking should receive a unique reference.
6. Payments should be recorded against the correct booking.
7. Price changes should be communicated before confirmation.
8. Cancellation conditions should be clear.
9. Customer information should be protected.
10. AMX should maintain accurate operational and financial records.

---

## 10. AS-IS → TO-BE Improvement

| Current State                  | Future State                    |
| ------------------------------ | ------------------------------- |
| Multiple provider contacts     | One AMX coordination point      |
| Fragmented information         | Central operational record      |
| Separate price discussions     | One clear quotation             |
| Uncertain availability         | Availability confirmation       |
| Manual scattered notes         | Structured records              |
| Multiple booking conversations | One booking process             |
| Difficult follow-up            | Follow-up tracking              |
| Limited financial visibility   | Booking/payment records         |
| Unclear responsibility         | AMX coordination responsibility |

---

## 11. MVP Future-State Boundary

The MVP will **not** attempt to automate everything.

### Included

* Human-assisted provider coordination
* Website inquiry
* Admin dashboard
* Customer/provider/package records
* Quotation
* Booking tracking
* Payment recording
* Follow-up
* Review/complaint recording

### Not Included

* Provider self-service dashboards
* Automatic provider availability
* Online payment integration
* AI chatbot
* Live vehicle tracking
* Native mobile application
* Multi-city marketplace
* Automated commission splitting

These can be considered after the MVP is validated.

---

## 12. Expected Future-State Benefits

The TO-BE process should provide:

* **Simpler customer experience**
* **Faster coordination**
* **Clearer pricing**
* **Better provider management**
* **Better booking visibility**
* **Reduced information loss**
* **Improved customer trust**
* **Better financial tracking**
* **Measurable business performance**

---

## 13. TO-BE Success Condition

The future state is successful when:

> **A visitor can give AMX their requirements once, AMX can coordinate the necessary providers, provide one clear quotation, confirm the booking, coordinate the trip, record payment and completion, and collect feedback.**

This is the core operational model of the AMX MVP.

---

## 14. Validation

The TO-BE model must be validated with:

* AMX owner/operator
* Potential visitors/customers
* Tour guides
* Drivers
* Hotels/lodges
* Boat-service providers
* Tour operators

Any validated business changes should be reflected in the requirements and analysis documents.

---

## 15. Next Artifact

**3.4 — Business Process Model**

The next artifact will formally model the AMX business workflow, actors, activities, decisions, inputs, outputs, and process boundaries.

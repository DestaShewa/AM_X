# 3.4 — Business Process Model

## 1. Purpose

This document defines the main business processes of **AMX — Arba Minch Experiences**, including actors, activities, decisions, inputs, outputs, and process boundaries.

The model represents how AMX operates from the first customer inquiry through trip completion and feedback.

---

## 2. Core Business Process

The primary AMX process is:

```text
Customer Inquiry
      ↓
Review Requirements
      ↓
Clarify Information
      ↓
Check Providers
      ↓
Confirm Availability & Prices
      ↓
Prepare Quotation
      ↓
Send Quotation
      ↓
Customer Decision
   ↙          ↘
Accept        Decline
  ↓              ↓
Create Booking   Close Inquiry
  ↓
Record Payment
  ↓
Coordinate Trip
  ↓
Complete Trip
  ↓
Collect Feedback
  ↓
Record Business Result
```

---

## 3. Business Process Actors

| Actor              | Main Responsibility                                |
| ------------------ | -------------------------------------------------- |
| Visitor/Customer   | Requests and confirms an experience                |
| AMX Admin/Operator | Coordinates the complete process                   |
| Tour Guide         | Provides guiding service                           |
| Driver             | Provides transportation                            |
| Hotel/Lodge        | Provides accommodation when required               |
| Boat Provider      | Provides boat service                              |
| Tour Operator      | Provides additional tourism services when required |

**Primary process owner:** AMX Admin/Operator

---

## 4. Process Inputs

The process may begin with:

* Customer name
* Contact information
* Travel date
* Number of travelers
* Arrival location
* Number of days
* Budget
* Interests
* Hotel requirements
* Transport requirements
* Special requirements

Provider-related inputs include:

* Service availability
* Service price
* Capacity
* Provider details
* Cancellation conditions

---

## 5. Main Business Activities

### BP-01 — Receive Inquiry

**Input:** Customer trip request
**Activity:** AMX receives and records the inquiry
**Output:** New inquiry

---

### BP-02 — Review & Clarify Request

**Input:** New inquiry
**Activity:** AMX checks whether required information is complete
**Decision:**

```text
Information complete?
      ├── No → Contact Customer → Update Inquiry
      └── Yes → Continue
```

**Output:** Valid trip requirements

---

### BP-03 — Identify Suitable Services

AMX determines which services are required.

Examples:

* Transport
* Guide
* Boat
* Hotel
* Tour/activity
* Other special services

**Output:** Required service list

---

### BP-04 — Check Providers

AMX contacts suitable providers and checks:

* Availability
* Price
* Capacity
* Service conditions
* Special requirements

**Output:** Available provider options

---

### BP-05 — Confirm Provider Arrangement

AMX selects suitable providers based on:

* Availability
* Price
* Reliability
* Customer requirements
* Service quality
* Previous experience

**Output:** Confirmed provider information

---

### BP-06 — Prepare Quotation

AMX calculates the customer price and prepares a quotation containing:

* Customer information
* Travel dates
* Number of travelers
* Services
* Providers where appropriate
* Included services
* Excluded services
* Total price
* Deposit/balance
* Cancellation conditions
* Booking validity

**Output:** Quotation

---

### BP-07 — Customer Decision

AMX sends the quotation to the customer.

```text
Customer Decision
      ↓
 ┌───────────────┐
 │               │
Accept         Decline
 │               │
 ↓               ↓
Booking        Close/Follow-up
```

If the customer requests changes, AMX revises the quotation where appropriate.

---

### BP-08 — Confirm Booking

After customer acceptance:

1. Create booking record.
2. Generate booking reference.
3. Record agreed services.
4. Confirm providers.
5. Record payment/deposit information.
6. Provide booking confirmation.

**Output:** Confirmed booking

---

### BP-09 — Coordinate Trip

Before and during the trip, AMX coordinates:

* Customer communication
* Provider communication
* Pickup/meeting arrangements
* Schedule
* Service changes
* Problems or emergencies

**Output:** Trip delivered

---

### BP-10 — Complete Trip

After the planned services are delivered:

* Mark booking as completed.
* Record final payment status.
* Record additional costs or changes.
* Record operational notes.

**Output:** Completed booking

---

### BP-11 — Collect Feedback

AMX asks the customer for:

* Overall experience
* Service quality
* Provider feedback
* Problems/complaints
* Suggestions

**Output:** Review or complaint record

---

### BP-12 — Record Business Result

AMX records:

* Revenue
* Costs
* Profit/margin
* Provider performance
* Customer outcome
* Problems
* Lessons learned

**Output:** Business performance information

---

## 6. End-to-End Process Model

```text
┌─────────────┐
│   Customer  │
└──────┬──────┘
       │ Inquiry
       ↓
┌────────────────────┐
│  Receive Inquiry   │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Review & Clarify   │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Identify Services  │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Check Providers    │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Confirm Providers  │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Prepare Quotation  │
└─────────┬──────────┘
          ↓
     ┌────────────┐
     │ Customer   │
     │ Decision   │
     └─────┬──────┘
       Yes │ No
           │
     ┌─────┴─────┐
     ↓           ↓
┌──────────┐  ┌─────────────┐
│ Booking  │  │Close/Follow │
└────┬─────┘  └─────────────┘
     ↓
┌───────────────┐
│ Record Payment│
└───────┬───────┘
        ↓
┌──────────────────┐
│ Coordinate Trip  │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Complete Trip    │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Feedback/Review  │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Business Result  │
└──────────────────┘
```

---

## 7. Process Decision Points

| Decision                        | If Yes                      | If No                        |
| ------------------------------- | --------------------------- | ---------------------------- |
| Inquiry complete?               | Check providers             | Contact customer             |
| Suitable provider available?    | Confirm service             | Find alternative             |
| Price acceptable?               | Prepare quotation           | Recalculate/find alternative |
| Customer accepts?               | Create booking              | Close/follow up              |
| Payment requirement satisfied?  | Confirm according to policy | Request required payment     |
| Service successfully delivered? | Complete booking            | Handle issue                 |
| Customer satisfied?             | Record review               | Record complaint/follow-up   |

---

## 8. Process Status Model

The main inquiry/booking lifecycle is:

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

Alternative path:

```text
Any applicable stage
        ↓
    Cancelled
```

---

## 9. Business Process Boundaries

### Inside AMX

* Inquiry management
* Customer communication
* Provider coordination
* Package management
* Quotation
* Booking management
* Payment recording
* Follow-up
* Feedback
* Business reporting

### Outside AMX

* Actual driving
* Guiding service delivery
* Boat operation
* Hotel accommodation
* External payment-provider processing
* Government/regulatory activities
* Customer's independent travel arrangements

AMX **coordinates these services but does not directly perform every service**.

---

## 10. Business Process Outputs

The process should produce:

* Customer record
* Inquiry record
* Provider selection
* Quotation
* Booking
* Payment record
* Trip completion record
* Review/complaint
* Revenue and cost information
* Operational lessons

---

## 11. Key Business Rules

1. No final booking without customer confirmation.
2. Provider availability should be confirmed before final quotation/booking.
3. Customer should receive clear pricing and service scope.
4. Included and excluded services must be stated.
5. Booking must have a unique reference.
6. Payments must be associated with the correct booking.
7. Price changes must be communicated before confirmation.
8. Cancellation conditions must be clear.
9. Provider communication remains human-assisted in the MVP.
10. Customer and financial information must be handled securely.

---

## 12. Process Performance Measures

AMX should eventually measure:

| KPI                       | Purpose                            |
| ------------------------- | ---------------------------------- |
| Inquiry response time     | Measure operational speed          |
| Inquiry → quotation rate  | Measure coordination effectiveness |
| Quotation → booking rate  | Measure conversion                 |
| Completed bookings        | Measure real business activity     |
| Average booking value     | Measure revenue opportunity        |
| Gross margin per booking  | Measure profitability              |
| Cancellation rate         | Identify operational problems      |
| Customer satisfaction     | Measure service quality            |
| Provider reliability      | Measure provider performance       |
| Repeat/referral customers | Measure customer trust             |

---

## 13. Process Ownership

**Process Owner:** AMX Owner/Operator

The owner is responsible for:

* Maintaining the process
* Approving business rules
* Managing provider relationships
* Monitoring quality
* Reviewing KPIs
* Improving the process based on real operational data

---

## 14. MVP Process Principle

> **AMX should automate record-keeping and workflow support, while keeping provider coordination and important customer decisions human-controlled.**

This keeps the MVP simple, practical, and suitable for real-world validation.

---

## 15. Phase 3 Relationship

This business process model provides the foundation for:

* System Context Diagram
* Use Case Diagram
* Activity Diagrams
* Sequence Diagrams
* Domain Model
* Data Flow Analysis
* State/Status Model
* System Boundary

---

## 16. Validation

The process must be validated using real AMX operations and stakeholder interviews.

Particular attention should be given to:

* Provider availability
* Pricing process
* Payment/deposit rules
* Cancellation process
* Customer communication
* Trip problem handling
* Legal/regulatory responsibilities

**Status:** Draft — pending real-world validation.

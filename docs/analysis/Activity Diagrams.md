# 3.7 — Activity Diagrams

## 1. Purpose

Activity diagrams define the **step-by-step workflows** of the AMX system and show:

* Activities
* Decisions
* Actors/responsibilities
* Alternative paths
* Process completion

They translate the use cases into operational workflows.

---

# 2. Activity Diagram — Customer Inquiry

## Objective

Show how a visitor submits a tourism request and how AMX processes the inquiry.

```text
START
  │
  ↓
Visitor Opens AMX
  │
  ↓
Views Packages / Services
  │
  ↓
Selects Package or Custom Trip
  │
  ↓
Enters Trip Requirements
  │
  ↓
Submits Inquiry
  │
  ↓
System Validates Information
  │
  ├── Incomplete ──→ Request Missing Information
  │                       │
  │                       ↓
  │                  Visitor Updates
  │                       │
  │                       └──────────┐
  │                                  ↓
  └── Complete ─────────────→ Create Inquiry
                                  │
                                  ↓
                           Notify / Show Success
                                  │
                                  ↓
                                END
```

### Main Inputs

* Customer information
* Travel date
* Group size
* Destination/package
* Budget
* Interests
* Hotel requirement
* Transport requirement
* Special requirements

### Output

**New Inquiry**

---

# 3. Activity Diagram — Inquiry to Quotation

## Objective

Show how AMX converts a customer inquiry into a quotation.

```text
START
  │
  ↓
Admin Reviews Inquiry
  │
  ↓
Check Customer Requirements
  │
  ↓
Requirements Clear?
  │
  ├── NO ──→ Contact Customer
  │              │
  │              ↓
  │        Update Inquiry
  │              │
  │              └─────────────┐
  │                            ↓
  └── YES ─────────────→ Identify Required Services
                              │
                              ↓
                       Select Suitable Providers
                              │
                              ↓
                     Contact Providers
                              │
                              ↓
                    Check Availability
                              │
                              ↓
                       Provider Available?
                         /            \
                       NO              YES
                       │                │
                       ↓                ↓
                Find Alternative   Record Price
                       │                │
                       └───────┐        │
                               │        ↓
                               │   Confirm Services
                               │        │
                               └────────┤
                                        ↓
                               Calculate Total Price
                                        │
                                        ↓
                                 Create Quotation
                                        │
                                        ↓
                                  Send Quotation
                                        │
                                        ↓
                                       END
```

### Important Rule

A quotation should be prepared using **confirmed provider information whenever possible**, rather than assumed availability or outdated prices.

---

# 4. Activity Diagram — Customer Quotation Decision

## Objective

Show what happens after the quotation is sent.

```text
START
  │
  ↓
Customer Receives Quotation
  │
  ↓
Customer Reviews Quotation
  │
  ↓
Customer Decision
  │
  ├── Request Changes
  │       │
  │       ↓
  │   AMX Reviews Request
  │       │
  │       ↓
  │   Update Quotation
  │       │
  │       └──────────────→ Send Revised Quotation
  │
  ├── Decline
  │       │
  │       ↓
  │   Record Decline
  │       │
  │       ↓
  │   Follow-Up if Appropriate
  │       │
  │       ↓
  │      END
  │
  └── Accept
          │
          ↓
    Confirm Customer Details
          │
          ↓
    Confirm Provider Arrangements
          │
          ↓
    Create Booking
          │
          ↓
         END
```

---

# 5. Activity Diagram — Booking & Trip Coordination

## Objective

Show how AMX manages a confirmed booking through completion.

```text
START
  │
  ↓
Booking Confirmed
  │
  ↓
Generate Booking Reference
  │
  ↓
Record Payment / Deposit
  │
  ↓
Confirm Provider Arrangements
  │
  ↓
Send Booking Information
  │
  ↓
Pre-Trip Follow-Up
  │
  ↓
Trip Begins
  │
  ↓
Coordinate Services
  │
  ↓
Problem or Change?
  │
  ├── YES → Contact Relevant Provider
  │              │
  │              ↓
  │        Resolve / Adjust Service
  │              │
  │              └──────────────┐
  │                             ↓
  └── NO ─────────────────→ Continue Trip
                                 │
                                 ↓
                            Trip Completed
                                 │
                                 ↓
                         Record Final Status
                                 │
                                 ↓
                                END
```

---

# 6. Activity Diagram — Payment Recording

## Objective

Show how AMX records customer payments.

```text
START
  │
  ↓
Booking Confirmed
  │
  ↓
Payment Required?
  │
  ├── NO ─────────────→ Continue According to Terms
  │
  └── YES
       │
       ↓
Customer Makes Payment
       │
       ↓
AMX Verifies Payment
       │
       ↓
Payment Valid?
     /       \
   NO         YES
   │           │
   ↓           ↓
Request      Record Payment
Correction       │
   │             ↓
   └──────→ Update Booking Balance
                 │
                 ↓
                END
```

> In the MVP, payment may be recorded manually. Online payment integration is a future capability.

---

# 7. Activity Diagram — Trip Completion & Feedback

## Objective

Show how AMX closes the customer journey.

```text
START
  │
  ↓
Trip Completed
  │
  ↓
Confirm Services Delivered
  │
  ↓
Record Final Payment / Costs
  │
  ↓
Mark Booking "Completed"
  │
  ↓
Request Customer Feedback
  │
  ↓
Customer Provides Feedback?
  │
  ├── NO ──→ Close Booking
  │
  └── YES
       │
       ↓
   Record Review
       │
       ↓
   Complaint?
    /      \
  NO        YES
  │          │
  ↓          ↓
Record     Record Complaint
Review          │
  │             ↓
  │        Follow-Up / Resolution
  │             │
  └──────┬──────┘
         ↓
   Update Business Records
         │
         ↓
        END
```

---

# 8. Overall AMX Activity Flow

The four main business workflows connect as follows:

```text
┌─────────────────┐
│ Customer Inquiry│
└────────┬────────┘
         ↓
┌─────────────────┐
│ Inquiry Review  │
└────────┬────────┘
         ↓
┌─────────────────┐
│Provider Checking│
└────────┬────────┘
         ↓
┌─────────────────┐
│   Quotation     │
└────────┬────────┘
         ↓
┌─────────────────┐
│Customer Decision│
└────────┬────────┘
         ↓
     ┌───┴───┐
   Decline  Accept
     │        │
     ↓        ↓
   Close   Booking
              │
              ↓
       Payment / Deposit
              │
              ↓
       Trip Coordination
              │
              ↓
        Trip Completed
              │
              ↓
        Feedback / Review
              │
              ↓
       Business Records
```

---

# 9. Activity Responsibility Summary

| Activity             | Primary Responsible Actor |
| -------------------- | ------------------------- |
| Submit inquiry       | Visitor                   |
| Validate inquiry     | System                    |
| Review inquiry       | AMX Admin                 |
| Clarify requirements | AMX Admin + Visitor       |
| Check providers      | AMX Admin                 |
| Confirm availability | AMX Admin + Provider      |
| Prepare quotation    | AMX Admin                 |
| Review quotation     | Visitor                   |
| Accept/decline       | Visitor                   |
| Create booking       | AMX Admin/System          |
| Record payment       | AMX Admin                 |
| Coordinate trip      | AMX Admin                 |
| Deliver service      | Provider                  |
| Complete booking     | AMX Admin                 |
| Collect feedback     | AMX                       |
| Handle complaint     | AMX Admin                 |
| Generate reports     | AMX Admin/System          |

---

# 10. Key Decision Points

The AMX activity model contains these important decisions:

1. **Is the inquiry complete?**
2. **Is a suitable provider available?**
3. **Is the requested price/service acceptable?**
4. **Does the customer accept the quotation?**
5. **Is payment required and verified?**
6. **Does a problem occur during the trip?**
7. **Was the trip successfully completed?**
8. **Did the customer provide feedback?**
9. **Is there a complaint requiring follow-up?**

These decisions will later influence the system's business rules, states, APIs, and test cases.

---

# 11. MVP Boundary

The activity diagrams intentionally keep some activities **human-controlled**:

* Provider communication
* Availability confirmation
* Price negotiation
* Customer clarification
* Important booking decisions
* Trip problem resolution
* Payment verification

The software mainly provides **records, workflow, visibility, and operational support**.

---

# 12. Validation Criteria

The activity model is acceptable when:

* Every major use case has a corresponding workflow.
* The main customer journey can be followed from inquiry to completion.
* Alternative paths are represented.
* Responsibilities are clear.
* Business decisions are identifiable.
* MVP and future automation are not mixed.
* The workflow can later be translated into system behavior and test cases.

**Status:** Draft — pending validation with real AMX operations.

---

## Next Artifact

**3.8 — Sequence Diagrams**

Sequence diagrams will show **how actors and the AMX system communicate over time**, especially for the critical flow:

**Submit Inquiry → Check Providers → Create Quotation → Customer Accepts → Create Booking.**

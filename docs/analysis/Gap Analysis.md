# 3.14 — Gap Analysis

## 1. Purpose

This document identifies the gaps between the current tourism coordination environment (**AS-IS**) and the desired AMX operating model (**TO-BE**).

The analysis determines:

* What problems currently exist.
* What AMX must improve.
* Whether the gap requires software, process, people, or business changes.
* Which gaps belong in the MVP.
* Which gaps should remain future improvements.

---

# 2. AS-IS vs TO-BE

### Current State

```text
Visitor
   ↓
Search
   ↓
Contact Multiple Providers
   ↓
Compare Prices
   ↓
Check Availability
   ↓
Arrange Services Separately
   ↓
Travel
   ↓
Handle Problems Manually
```

### AMX Future State

```text
Visitor
   ↓
One AMX Inquiry
   ↓
AMX Coordinates Providers
   ↓
Availability Confirmed
   ↓
One Clear Quotation
   ↓
Customer Confirms
   ↓
One Booking
   ↓
AMX Coordinates Trip
   ↓
Completion + Feedback
```

---

# 3. Gap Classification

AMX gaps are divided into:

1. Business gaps
2. Customer-experience gaps
3. Process gaps
4. Information/data gaps
5. Technology gaps
6. Provider-management gaps
7. Financial gaps
8. Communication gaps
9. Operational gaps
10. Trust and quality gaps
11. Legal/compliance gaps

---

# 4. Business Gaps

| ID      | Current Gap                                           | Desired State                    | AMX Response                       | Priority |
| ------- | ----------------------------------------------------- | -------------------------------- | ---------------------------------- | -------- |
| GAP-B01 | No clear single coordination point                    | One AMX coordination point       | AMX service model                  | Critical |
| GAP-B02 | Services often arranged separately                    | Complete coordinated experience  | Package + custom coordination      | High     |
| GAP-B03 | Customer may compare multiple providers independently | One coordinated quotation        | Quotation system                   | Critical |
| GAP-B04 | Limited centralized operational visibility            | AMX sees entire customer journey | Admin dashboard                    | High     |
| GAP-B05 | Business model needs validation                       | Measurable revenue model         | Track inquiries, bookings, revenue | Critical |
| GAP-B06 | AMX may depend heavily on individual providers        | Structured provider network      | Provider records + verification    | High     |

---

# 5. Customer Experience Gaps

| ID      | Current Gap                                  | Desired State                  | AMX Response                 |
| ------- | -------------------------------------------- | ------------------------------ | ---------------------------- |
| GAP-C01 | Customer contacts multiple providers         | Customer contacts AMX once     | Inquiry form + communication |
| GAP-C02 | Prices may be unclear or fragmented          | One understandable quotation   | Quotation                    |
| GAP-C03 | Availability may be uncertain                | AMX confirms availability      | Provider coordination        |
| GAP-C04 | Customer may not know what is included       | Clear inclusions/exclusions    | Package + quotation          |
| GAP-C05 | Changes require repeated communication       | AMX coordinates changes        | Admin workflow               |
| GAP-C06 | Support responsibility may be unclear        | AMX becomes coordination point | Booking + support            |
| GAP-C07 | Feedback may not be systematically collected | Feedback recorded              | Review/complaint system      |

---

# 6. Process Gaps

### Current

```text
Multiple conversations
       ↓
Informal arrangements
       ↓
Scattered information
       ↓
Manual follow-up
       ↓
Possible confusion
```

### Desired

```text
Standardized AMX workflow
       ↓
Structured inquiry
       ↓
Provider checking
       ↓
Quotation
       ↓
Booking
       ↓
Payment tracking
       ↓
Trip coordination
       ↓
Completion
```

### Process Gaps

| ID      | Gap                                          | Solution            |
| ------- | -------------------------------------------- | ------------------- |
| GAP-P01 | No standardized inquiry process              | Inquiry workflow    |
| GAP-P02 | No standardized quotation process            | Quotation workflow  |
| GAP-P03 | No consistent booking lifecycle              | Booking statuses    |
| GAP-P04 | Follow-ups can be forgotten                  | Follow-up tracking  |
| GAP-P05 | Cancellation handling may be inconsistent    | Cancellation rules  |
| GAP-P06 | Trip completion may not be formally recorded | Completion workflow |
| GAP-P07 | Complaint handling may be informal           | Complaint workflow  |

---

# 7. Information & Data Gaps

## Current State

Information may exist across:

```text
WhatsApp
Phone Calls
Paper
Spreadsheets
Personal Memory
Emails
Provider Records
```

## Desired State

```text
             AMX
              │
      ┌───────┼────────┐
      ↓       ↓        ↓
 Customer  Provider  Booking
      │       │        │
      └───────┼────────┘
              ↓
        Central Records
```

### Data Gaps

| ID      | Gap                                | AMX Solution             |
| ------- | ---------------------------------- | ------------------------ |
| GAP-D01 | Customer data scattered            | Customer records         |
| GAP-D02 | Provider information scattered     | Provider records         |
| GAP-D03 | Inquiry history difficult to track | Inquiry records          |
| GAP-D04 | Quotes may not be standardized     | Quotation records        |
| GAP-D05 | Booking details may be scattered   | Booking records          |
| GAP-D06 | Payment records may be fragmented  | Payment records          |
| GAP-D07 | Follow-up history may be lost      | Follow-up records        |
| GAP-D08 | Feedback may not be retained       | Review/complaint records |
| GAP-D09 | Changes may not be traceable       | Audit/history            |

---

# 8. Technology Gaps

| ID      | Current Gap                              | Desired Capability       | MVP? |
| ------- | ---------------------------------------- | ------------------------ | ---- |
| GAP-T01 | No dedicated AMX management system       | Central web system       | Yes  |
| GAP-T02 | Manual inquiry handling                  | Digital inquiry capture  | Yes  |
| GAP-T03 | Manual quotation preparation             | Structured quotation     | Yes  |
| GAP-T04 | Manual booking tracking                  | Booking management       | Yes  |
| GAP-T05 | Payment tracking may be manual/scattered | Payment records          | Yes  |
| GAP-T06 | Limited reporting                        | Basic business reports   | Yes  |
| GAP-T07 | No provider self-service                 | Provider portal          | No   |
| GAP-T08 | No automated availability                | Availability integration | No   |
| GAP-T09 | No online payment                        | Payment integration      | No   |
| GAP-T10 | No AI assistance                         | AI capabilities          | No   |

---

# 9. Provider Management Gaps

### Current Problem

AMX may depend on different independent providers without a standardized way to manage their information.

### Desired State

```text
Provider
   ↓
Information
   ↓
Verification
   ↓
Services
   ↓
Prices
   ↓
Availability
   ↓
Performance
```

### Gaps

| ID       | Gap                                      | Solution                      |
| -------- | ---------------------------------------- | ----------------------------- |
| GAP-PR01 | Provider information inconsistent        | Standard provider record      |
| GAP-PR02 | Verification may be unclear              | Verification status           |
| GAP-PR03 | Provider availability difficult to track | Record confirmed availability |
| GAP-PR04 | Provider prices may change               | Record latest agreed price    |
| GAP-PR05 | Provider performance may be forgotten    | Performance notes             |
| GAP-PR06 | Provider communication is external       | Record communication results  |

### Important Finding

AMX does **not** need provider self-service accounts to solve these MVP gaps.

Manual coordination can be supported by structured records first.

---

# 10. Financial Gaps

### Current Problem

The business may not clearly distinguish:

```text
Customer Price
      ↓
Provider Cost
      ↓
AMX Revenue
      ↓
Actual Profit / Margin
```

### Desired State

AMX should be able to determine:

* What customer was charged.
* What was paid.
* What remains.
* What providers cost.
* What AMX earned.
* Which bookings generated revenue.

### Financial Gaps

| ID      | Gap                                  | Solution                 |
| ------- | ------------------------------------ | ------------------------ |
| GAP-F01 | Payment records may be scattered     | Payment module           |
| GAP-F02 | Remaining balance may be unclear     | Balance calculation      |
| GAP-F03 | Provider costs may be unclear        | Cost records             |
| GAP-F04 | Revenue may be difficult to measure  | Basic reporting          |
| GAP-F05 | Refunds/cancellations may be unclear | Financial status/history |

---

# 11. Communication Gaps

### Current

```text
Customer ↔ Guide
Customer ↔ Driver
Customer ↔ Hotel
Customer ↔ Boat Provider
```

This creates multiple communication channels.

### Desired

```text
Customer
    ↕
   AMX
    ↕
Providers
```

AMX becomes the main coordination point.

### Gap Response

The MVP does **not** need to replace WhatsApp or phone communication.

Instead:

```text
WhatsApp / Phone / Email
          ↓
      AMX Admin
          ↓
     AMX System
          ↓
    Record Result
```

This is a deliberate MVP decision.

---

# 12. Operational Gaps

| ID      | Gap                                        | Desired Solution        |
| ------- | ------------------------------------------ | ----------------------- |
| GAP-O01 | Follow-up can be forgotten                 | Follow-up records       |
| GAP-O02 | Booking status unclear                     | Status model            |
| GAP-O03 | Provider changes may be missed             | Provider notes/status   |
| GAP-O04 | Customer changes may be lost               | Inquiry/booking history |
| GAP-O05 | No centralized problem tracking            | Complaint/issue records |
| GAP-O06 | Completion may not be recorded             | Completion status       |
| GAP-O07 | Business performance difficult to evaluate | Reports/KPIs            |

---

# 13. Trust & Quality Gaps

AMX's value depends heavily on trust.

### Current Risks

* Unknown provider quality
* Unconfirmed availability
* Unclear pricing
* Unclear responsibility
* Inconsistent service
* Poor communication

### Desired State

```text
Provider Verification
        +
Availability Confirmation
        +
Clear Quotation
        +
Booking Reference
        +
AMX Coordination
        +
Feedback
        ↓
Higher Customer Confidence
```

### Priority Gaps

| Gap                | AMX Response                      |
| ------------------ | --------------------------------- |
| Provider trust     | Verification process              |
| Availability trust | Confirmation before quote/booking |
| Price trust        | Clear quotation                   |
| Responsibility     | AMX coordination                  |
| Quality feedback   | Reviews/complaints                |
| Traceability       | Records/audit                     |

---

# 14. Legal & Compliance Gaps

Some requirements cannot be resolved purely through software.

Potential gaps include:

* Business registration requirements
* Tourism-related licensing/permissions
* Provider qualifications
* Contractual relationships
* Customer terms
* Cancellation policies
* Privacy requirements
* Tax/accounting requirements
* Liability/responsibility arrangements

### Required Response

```text
Identify Requirement
        ↓
Verify Applicable Law
        ↓
Define AMX Responsibility
        ↓
Document Policy
        ↓
Implement Operational/System Control
```

These must be validated before commercial launch.

---

# 15. People & Capability Gaps

Software alone cannot solve every AMX problem.

AMX may need capability in:

* Customer communication
* Provider relationship management
* Negotiation
* Trip coordination
* Complaint handling
* Financial management
* Local tourism knowledge
* Emergency/problem response

### Key Principle

> **Technology can organize the work, but AMX still needs capable people to perform the coordination.**

---

# 16. Gap-to-Solution Matrix

| Gap                              | Solution                     | Type              | MVP |
| -------------------------------- | ---------------------------- | ----------------- | --- |
| Fragmented customer coordination | AMX inquiry workflow         | Process + System  | ✓   |
| Unclear prices                   | Structured quotation         | System            | ✓   |
| Unknown provider status          | Provider verification        | Process + System  | ✓   |
| Uncertain availability           | Manual confirmation + record | Process + System  | ✓   |
| Scattered customer data          | Customer records             | System            | ✓   |
| Scattered booking information    | Booking management           | System            | ✓   |
| Payment tracking problem         | Payment records              | System            | ✓   |
| Forgotten follow-ups             | Follow-up management         | System            | ✓   |
| Poor feedback tracking           | Review/complaint records     | System            | ✓   |
| Limited business visibility      | Basic reports                | System            | ✓   |
| Provider self-service            | Provider portal              | System            | ✗   |
| Online payment                   | Payment gateway              | System            | ✗   |
| Automatic availability           | Provider integration         | System            | ✗   |
| AI assistance                    | AI system                    | System            | ✗   |
| Multi-city marketplace           | Marketplace architecture     | Business + System | ✗   |

---

# 17. Root Causes

The major problems are not caused only by lack of software.

```text
                  Current Problems
                        │
        ┌───────────────┼────────────────┐
        ↓               ↓                ↓
 Fragmentation      Manual Work      Lack of Standardization
        │               │                │
        └───────────────┼────────────────┘
                        ↓
              Poor Coordination
                        ↓
        Uncertainty / Inefficiency / Risk
```

Therefore AMX must solve **both process and technology gaps**.

---

# 18. MVP Gap Prioritization

## Critical

These gaps must be solved for AMX to operate:

```text
1. Single customer coordination point
2. Inquiry management
3. Provider verification
4. Provider availability confirmation
5. Clear quotation
6. Booking management
7. Payment tracking
8. Customer communication
9. Basic operational records
10. Legal/compliance validation
```

## High

```text
11. Follow-up management
12. Reviews/complaints
13. Basic business reporting
14. Provider performance tracking
15. Financial/margin visibility
```

## Future

```text
16. Provider portal
17. Online payment
18. Automatic availability
19. Customer accounts
20. AI assistant
21. Mobile application
22. Multi-city marketplace
```

---

# 19. Key Gap: Business Validation

The largest gap is not technological.

AMX must prove:

```text
Customer Interest
       ↓
Real Inquiry
       ↓
Successful Coordination
       ↓
Customer Pays
       ↓
Trip Delivered
       ↓
Customer Satisfied
       ↓
AMX Earns Money
```

If this loop does not work, additional technology will not solve the fundamental business problem.

Therefore the MVP should prioritize **real operational validation** over feature quantity.

---

# 20. Gap Resolution Strategy

AMX should close gaps in this order:

### Step 1 — Business Validation

Confirm:

* Real customer demand
* Real provider availability
* Real package pricing
* Real commission/margin
* Legal requirements

### Step 2 — Process Standardization

Define:

* Inquiry process
* Provider checking process
* Quotation process
* Booking process
* Payment process
* Cancellation process
* Completion process

### Step 3 — Software Support

Build software around the validated processes.

### Step 4 — Automation

Only automate activities that create measurable value after the manual process works.

---

# 21. Gap Analysis Conclusion

The primary AMX gap is:

> **A fragmented tourism coordination environment needs to become a clear, centralized, trackable customer journey.**

AMX addresses this through:

```text
One Customer Request
        ↓
One Coordination Point
        ↓
Verified/Selected Providers
        ↓
Confirmed Services
        ↓
One Clear Quotation
        ↓
One Booking
        ↓
Coordinated Trip
        ↓
Feedback + Business Records
```

The analysis confirms that the AMX MVP should remain **small, human-supported, and operationally focused** rather than becoming a large tourism marketplace.

**Status:** Draft — pending validation.

---

## Phase 3 Analysis Summary

The following artifacts are now defined:

* `system-analysis-plan.md`
* `current-state-analysis.md`
* `future-state-analysis.md`
* `business-process-model.md`
* `system-context-diagram.md`
* `use-case-diagram.md`
* `activity-diagrams.md`
* `sequence-diagrams.md`
* `domain-model.md`
* `system-boundary.md`
* `data-flow-analysis.md`
* `state-status-model.md`
* `business-rules-analysis.md`
* `gap-analysis.md`

### Next Artifact

**3.15 — Analysis Validation**

This is the **Phase 3 gate**. It will validate consistency between the requirements and all analysis models, identify contradictions/open issues, define approval criteria, and formally determine whether AMX is ready to move to **Phase 4 — Requirements Specification**.

# AMX — System Analysis Plan

**Project:** AMX — Arba Minch Experiences
**Phase:** Phase 3 — System Analysis & Modeling
**Artifact:** 3.1 System Analysis Plan
**Version:** 1.0
**Status:** Draft

---

## 1. Purpose

This document defines the approach, scope, methods, outputs, and validation process for analyzing the AMX business and software system.

The objective is to transform validated requirements into a clear model of:

* How AMX operates.
* How users interact with AMX.
* How information moves through the system.
* How business processes work.
* What the system must control.
* What belongs inside and outside the system boundary.

---

## 2. Analysis Objectives

The analysis phase shall:

1. Understand the current tourism coordination process.
2. Define the desired AMX operating process.
3. Identify system actors and external systems.
4. Model important business workflows.
5. Identify core business entities and relationships.
6. Analyze information and data flows.
7. Define lifecycle states and transitions.
8. Analyze business rules.
9. Identify gaps between current and desired processes.
10. Validate the analysis before architecture and detailed design.

---

## 3. Analysis Scope

### 3.1 In Scope

The analysis will cover:

* Visitor inquiry
* Customer management
* Provider management
* Provider verification
* Package management
* Availability checking
* Quotation creation
* Quotation approval
* Booking management
* Payment recording
* Trip coordination
* Follow-ups
* Reviews and complaints
* Basic operational reporting
* Administrator operations
* Customer communication
* Core data flows
* System boundaries

### 3.2 Out of Scope

The analysis will not design or implement:

* Native mobile applications
* Provider self-service portals
* AI chatbot
* Live vehicle tracking
* Automated hotel availability
* Multi-city marketplace
* Advanced online payment infrastructure
* Automated commission settlement
* Complex external integrations

These may be analyzed later if they become approved requirements.

---

## 4. Analysis Perspective

AMX will be analyzed from two perspectives:

### Business Perspective

How AMX operates as a real tourism coordination service.

```text
Visitor
   ↓
Inquiry
   ↓
AMX Coordination
   ↓
Provider Confirmation
   ↓
Quotation
   ↓
Booking
   ↓
Trip Delivery
   ↓
Completion
   ↓
Review
```

### System Perspective

How the software supports the business process.

```text
Visitor
   ↓
Public Website
   ↓
Inquiry
   ↓
Admin System
   ↓
Customers / Providers / Packages
   ↓
Quotation
   ↓
Booking
   ↓
Payment / Follow-up / Review
```

The software supports the business; it does not replace all human coordination in the MVP.

---

## 5. Analysis Methods

The following methods will be used:

### 5.1 Process Analysis

Analyze how AMX activities occur from inquiry to trip completion.

### 5.2 Use Case Analysis

Identify actors, system interactions, goals, and expected outcomes.

### 5.3 Workflow Analysis

Break major processes into activities, decisions, and outcomes.

### 5.4 Data Analysis

Identify important business information and how it moves through the system.

### 5.5 Domain Analysis

Identify important AMX concepts such as:

* Customer
* Inquiry
* Provider
* Package
* Quotation
* Booking
* Payment
* Review
* Follow-up

### 5.6 State Analysis

Identify lifecycle states such as:

```text
New
→ Contacted
→ Provider Checking
→ Quotation Sent
→ Awaiting Confirmation
→ Confirmed
→ In Progress
→ Completed
```

With cancellation where applicable:

```text
Any applicable stage
        ↓
    Cancelled
```

### 5.7 Gap Analysis

Compare the current process with the desired AMX process and identify improvements.

---

## 6. Modeling Standards

The analysis will use clear and consistent modeling conventions.

Where appropriate, the following will be used:

* Context diagrams
* Use case diagrams
* Activity diagrams
* Sequence diagrams
* Domain models
* State diagrams
* Data flow models
* Process flow diagrams

Diagrams should prioritize clarity and business understanding over unnecessary complexity.

---

## 7. Core Business Process

The primary process to analyze is:

```text
Customer Inquiry
      ↓
Review Requirements
      ↓
Contact Customer
      ↓
Check Providers
      ↓
Confirm Availability
      ↓
Calculate Price
      ↓
Create Quotation
      ↓
Send Quotation
      ↓
Customer Decision
   ↙          ↘
Accept       Decline
  ↓
Booking
  ↓
Payment
  ↓
Trip Coordination
  ↓
Trip Completion
  ↓
Review
  ↓
Financial/Performance Record
```

This process will be refined during the remaining analysis activities.

---

## 8. Primary Actors

The initial actors are:

### External Actors

* Visitor/Customer
* Tour Guide
* Driver
* Hotel/Lodge
* Boat-Service Provider
* Tour Operator
* Payment Provider, if integrated later
* Relevant external/regulatory parties

### Internal Actor

* AMX Administrator/Operator

Providers will initially interact with AMX manually rather than through provider accounts.

---

## 9. Core Business Entities

The analysis will initially consider:

```text
Customer
Inquiry
Provider
Package
Quotation
Booking
Payment
Follow-Up
Review
Complaint
```

The final domain model may combine or separate some entities after detailed analysis.

---

## 10. Key Questions

The analysis must answer:

### Business

* How does AMX receive an inquiry?
* Who handles the inquiry?
* How are providers selected?
* How is availability confirmed?
* How is the price calculated?
* When does a quotation become valid?
* What makes a booking confirmed?
* How are cancellations handled?
* Who is responsible for each service?
* How does AMX make money?

### System

* What information must be stored?
* What information is required at each stage?
* Which actions require authentication?
* Which actions change a record's status?
* What information should users see?
* What information must remain private?
* What data must be traceable?
* What events need to be recorded?

---

## 11. Assumptions to Validate

The following assumptions must be validated during analysis:

* Manual provider communication is sufficient for the MVP.
* WhatsApp/phone can support provider coordination.
* Customers prefer a single quotation.
* Provider availability can be confirmed manually.
* Three initial packages are sufficient for MVP validation.
* The AMX administrator can manage the operational workflow.
* Online payment integration is not required for the first MVP.
* A modular monolith is appropriate for the initial system.

Unvalidated assumptions shall not be treated as confirmed requirements.

---

## 12. Analysis Deliverables

Phase 3 will produce:

```text
docs/analysis/
├── system-analysis-plan.md
├── current-state-analysis.md
├── future-state-analysis.md
├── business-process-model.md
├── system-context-diagram.md
├── use-case-diagram.md
├── activity-diagrams.md
├── sequence-diagrams.md
├── domain-model.md
├── system-boundary.md
├── data-flow-analysis.md
├── state-status-model.md
├── business-rules-analysis.md
├── gap-analysis.md
└── analysis-validation.md
```

---

## 13. Analysis Dependencies

The analysis is based on:

* AMX Project Charter
* Requirements Plan
* Stakeholder Analysis
* Requirements Elicitation
* Business Requirements
* User Requirements
* Functional Requirements
* Non-Functional Requirements
* Business Rules
* Use Cases
* User Stories
* Requirements Prioritization
* Requirements Validation
* Requirements Traceability

Changes to approved requirements may require updates to the analysis.

---

## 14. Validation Approach

Each analysis artifact shall be reviewed for:

* Correctness
* Completeness
* Consistency
* Feasibility
* Traceability
* Business alignment
* Scope alignment

The analysis must represent the actual intended AMX operation rather than an assumed generic tourism system.

---

## 15. Phase Gate

System Analysis & Modeling can proceed to the next SDLC phase only when:

* Current-state processes are understood.
* Future-state processes are defined.
* Major workflows are modeled.
* Actors are identified.
* System boundaries are defined.
* Core entities are identified.
* Data flows are understood.
* Important states are defined.
* Business rules are analyzed.
* Major gaps are identified.
* Analysis artifacts are validated.

---

## 16. Success Criteria

The analysis phase is successful when a developer, business stakeholder, or reviewer can understand:

> **Who uses AMX, what they do, what information they provide, what the system does, what happens at each stage, and where the system ends and human operations begin.**

---

## 17. Next Artifact

**3.2 — Current-State Analysis (AS-IS)**

This will document how tourism coordination currently happens **before AMX**, including the problems, manual processes, actors, information flows, and operational limitations.

# AMX Requirements Traceability

## 1. Purpose

This document connects business objectives to requirements, system design, implementation, and testing.

The goal is to ensure that important business needs are not lost during development.

## 2. Traceability Chain

```text
Business Need
    ↓
Business Requirement
    ↓
User Requirement
    ↓
Functional Requirement
    ↓
Use Case / User Story
    ↓
Architecture / API / Database
    ↓
Implementation
    ↓
Test Case
```

## 3. Traceability Matrix

| Business Requirement | User Requirement | Functional Requirement | Use Case | Test Case | Status |
| -------------------- | ---------------- | ---------------------- | -------- | --------- | ------ |
| BR-01                | UR-01            | FR-01                  | UC-01    | TC-01     | Draft  |
| BR-02                | UR-03            | FR-05                  | UC-01    | TC-02     | Draft  |
| BR-03                | UR-06            | FR-21                  | UC-07    | TC-03     | Draft  |
| BR-04                | UR-13            | FR-16                  | UC-04    | TC-04     | Draft  |
| BR-05                | UR-10            | FR-08                  | UC-02    | TC-05     | Draft  |
| BR-06                | UR-15            | FR-28                  | UC-10    | TC-06     | Draft  |
| BR-07                | UR-16            | FR-30                  | UC-11    | TC-07     | Draft  |
| BR-08                | UR-05            | FR-41                  | UC-02    | TC-08     | Draft  |
| BR-09                | UR-09            | FR-35                  | UC-13    | TC-09     | Draft  |
| BR-10                | Multiple         | Multiple               | Multiple | Multiple  | Draft  |

## 4. Example Detailed Trace

### BR-02 — Support Complete Experiences

**Business Need:** Customers need coordinated tourism services.

**User Requirement:**
UR-03 — Visitor can submit a travel inquiry.

**Functional Requirement:**
FR-05 — System allows visitors to submit inquiries.

**Use Case:**
UC-01 — Submit Inquiry.

**Implementation:**
To be defined during architecture and implementation.

**Test Case:**
TC-02 — Verify that a visitor can successfully submit an inquiry.

## 5. Traceability Rules

Every important requirement should eventually be connected to:

* A business objective or stakeholder need.
* A system requirement.
* A design element.
* An implementation component.
* A test case.

## 6. Change Impact

When a requirement changes, identify affected:

* Requirements
* Use cases
* User stories
* Database
* API
* UI
* Implementation
* Tests
* Documentation

## 7. Status

This matrix will be updated throughout the SDLC.

**Current Status:** Draft

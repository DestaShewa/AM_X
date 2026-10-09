# AMX User Flow Diagrams

**Project:** AMX — Arba Minch Experiences
**Document:** `docs/ui-ux/user-flow-diagrams.md`
**Version:** 1.0
**Status:** Proposed — Pending Review

## 1. Purpose

Define the main interactions between visitors, customers, AMX staff, providers, and finance staff before designing individual screens.

## 2. Visitor Inquiry Flow

```mermaid
flowchart TD
    A[Visit AMX Website] --> B[Browse Experiences]
    B --> C[View Package Details]
    C --> D{Choose Trip Type}
    D -->|Existing Package| E[Select Package]
    D -->|Custom Trip| F[Enter Trip Preferences]
    E --> G[Complete Inquiry Form]
    F --> G
    G --> H{Form Valid?}
    H -->|No| I[Show Validation Errors]
    I --> G
    H -->|Yes| J[Submit Inquiry]
    J --> K[Show Confirmation]
    K --> L[AMX Staff Reviews Inquiry]
```

**Required UI states:** Empty form, validation errors, submission in progress, submission success, and submission failure with a retry option.

## 3. Inquiry-to-Quotation Flow

```mermaid
flowchart TD
    A[New Inquiry] --> B[Staff Reviews Details]
    B --> C[Contact Customer]
    C --> D{Customer Interested?}
    D -->|No| E[Record Outcome]
    D -->|Yes| F[Check Provider Availability]
    F --> G{Suitable Services Available?}
    G -->|No| H[Suggest Alternatives]
    H --> F
    G -->|Yes| I[Prepare Quotation]
    I --> J[Review Price and Terms]
    J --> K[Send Quotation]
    K --> L[Record Customer Response]
    L --> M{Accepted?}
    M -->|Requests Changes| I
    M -->|Declined| E
    M -->|Accepted| N[Record Acceptance Evidence]
    N --> O[Create Booking]
```

**Important rules:**

* Quotation revisions must remain traceable.
* Staff must not create duplicate bookings from the same quotation.
* Acceptance must be recorded before booking creation.
* A quotation must not be accepted if it is expired or otherwise ineligible.

## 4. Booking-to-Trip Completion Flow

```mermaid
flowchart TD
    A[Booking Created] --> B[Confirm Customer and Provider Arrangements]
    B --> C{Required Arrangements Confirmed?}
    C -->|No| D[Resolve Outstanding Items]
    D --> B
    C -->|Yes| E[Confirm Booking]
    E --> F[Coordinate Trip]
    F --> G[Trip Begins]
    G --> H[Trip In Progress]
    H --> I[Trip Completed?]
    I -->|No| H
    I -->|Yes| J[Mark Booking Completed]
    J --> K[Request Customer Feedback]
    K --> L[Record Feedback and Complaints]
    L --> M[Review Business Results]
```

**Important rules:**

* Booking status and individual service status must be tracked separately.
* The trip cannot be marked completed before it actually finishes.
* Cancellation and unexpected service failures require controlled workflows.
* Feedback collection must respect the approved review policy.

## 5. Payment Recording Flow

```mermaid
flowchart TD
    A[Open Booking] --> B[Review Amount Due]
    B --> C[Customer Makes Payment Externally]
    C --> D[Staff Records Transaction]
    D --> E{Evidence Sufficient?}
    E -->|No| F[Keep Pending or Request Evidence]
    F --> D
    E -->|Yes| G[Authorized Staff Verifies]
    G --> H{Valid Transaction?}
    H -->|No| I[Reject with Reason]
    H -->|Yes| J[Record Verified Transaction]
    J --> K[Recalculate Booking Payment Summary]
    K --> L[Audit Financial Change]
```

**Important rules:**

* AMX MVP records payments; it does not process online payments.
* Recording a transaction is not the same as verifying it.
* Only verified transactions affect payment summaries.
* Refunds are separate transactions linked to the original payment where applicable.
* Only authorized staff may verify financial transactions.

## 6. Staff Login and Permission Flow

```mermaid
flowchart TD
    A[Open Staff Login] --> B[Enter Credentials]
    B --> C{Credentials Valid?}
    C -->|No| D[Show Safe Error Message]
    D --> B
    C -->|Yes| E[Create Secure Session]
    E --> F[Open Authorized Dashboard]
    F --> G[Staff Requests Action]
    G --> H{Permission Granted?}
    H -->|No| I[Reject Action]
    H -->|Yes| J[Validate Business Rules]
    J --> K{Valid?}
    K -->|No| L[Show Validation Error]
    K -->|Yes| M[Execute Action]
    M --> N[Audit Sensitive Change]
```

**Important rules:**

* Permissions must be checked by the backend for every protected operation.
* Hiding a button is not sufficient authorization.
* Financial actions require the appropriate permissions.
* Session expiry, logout, and access denial must be handled clearly.

## 7. Main Screens Required by These Flows

| Flow            | Required Screens                                                                      |
| --------------- | ------------------------------------------------------------------------------------- |
| Visitor inquiry | Home, package listing, package details, custom-trip form, inquiry confirmation        |
| Quotation       | Inquiry list, inquiry details, customer details, quotation editor, quotation details  |
| Booking         | Booking list, booking details, service coordination, trip completion                  |
| Payments        | Booking financial summary, transaction form, transaction details, verification result |
| Authentication  | Login, dashboard, unauthorized-access message, session-expiry handling                |

## 8. Exceptions to Design

The wireframes must also cover:

* No packages available.
* Provider unavailable for requested dates.
* Invalid or incomplete inquiry.
* Duplicate submission.
* Expired quotation.
* Customer changes or cancellation request.
* Booking cancellation or provider failure.
* Rejected or disputed payment.
* Refund request.
* Unauthorized access.
* Network or server failure.

## 9. Validation Criteria

The flows are ready for approval when:

* Each main journey has a clear start and end.
* Decisions and failure paths are represented.
* Status changes agree with the requirements and database/API design.
* Every user action maps to a screen or component.
* Sensitive operations have explicit permission checks.
* Business-owner decisions are marked pending rather than assumed.

**Current status:** Proposed — pending stakeholder and cross-document review.

**Next file:** `docs/ui-ux/information-architecture.md`.

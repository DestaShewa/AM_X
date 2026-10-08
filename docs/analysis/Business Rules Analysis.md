# 3.13 — Business Rules Analysis

## 1. Purpose

This document analyzes the business rules that govern AMX operations.

It determines:

* What AMX must do.
* What AMX must not do.
* Which rules the software should enforce.
* Which rules require human judgment.
* Which business entities and processes are affected.
* Which rules are critical for consistency, trust, security, and financial control.

---

# 2. Business Rule Categories

AMX rules are grouped into:

1. Customer & Inquiry Rules
2. Provider Rules
3. Quotation Rules
4. Booking Rules
5. Payment Rules
6. Cancellation Rules
7. Trip Coordination Rules
8. Review & Complaint Rules
9. Data & Security Rules
10. Financial Rules
11. Operational Rules
12. Legal & Compliance Rules

---

# 3. Customer & Inquiry Rules

| ID      | Business Rule                                                                | Enforcement    |
| ------- | ---------------------------------------------------------------------------- | -------------- |
| BRL-A01 | Every inquiry must have enough information to understand the requested trip. | System + Human |
| BRL-A02 | Required inquiry information must be validated before submission.            | System         |
| BRL-A03 | An inquiry must belong to a customer.                                        | System         |
| BRL-A04 | A customer may submit multiple inquiries.                                    | System         |
| BRL-A05 | An inquiry may be for an existing package or a custom trip.                  | System         |
| BRL-A06 | AMX may contact the customer to clarify incomplete or unclear requirements.  | Human          |
| BRL-A07 | Inquiry status must follow the defined lifecycle.                            | System         |
| BRL-A08 | A booking should originate from a valid customer request/inquiry.            | System         |

### Required Inquiry Information

At minimum:

* Customer name
* Contact information
* Travel date
* Number of travelers
* Trip requirements
* Destination/service interest

Additional information may include:

* Budget
* Duration
* Arrival location
* Hotel
* Transport
* Special requirements

---

# 4. Provider Rules

| ID      | Business Rule                                                                  | Enforcement    |
| ------- | ------------------------------------------------------------------------------ | -------------- |
| BRL-P01 | Provider information must be recorded before using the provider operationally. | System         |
| BRL-P02 | Provider verification status must be recorded.                                 | System         |
| BRL-P03 | AMX must not publicly claim an unverified provider is verified.                | System + Human |
| BRL-P04 | Provider availability should be confirmed before final booking.                | Human + System |
| BRL-P05 | Provider pricing should be confirmed before final quotation.                   | Human + System |
| BRL-P06 | Provider changes must be communicated to AMX.                                  | Human          |
| BRL-P07 | A provider may offer multiple services.                                        | System         |
| BRL-P08 | One booking may use multiple providers.                                        | System         |
| BRL-P09 | Provider performance problems should be recorded when relevant.                | Human + System |
| BRL-P10 | Providers remain independent external service providers.                       | Operational    |

### Provider Verification Principle

```text
Provider
   ↓
Information Collected
   ↓
Verification
   ↓
VERIFIED
   ↓
May be presented as verified
```

Verification must never be assumed simply because a provider exists in the database.

---

# 5. Quotation Rules

| ID      | Business Rule                                                            | Enforcement    |
| ------- | ------------------------------------------------------------------------ | -------------- |
| BRL-Q01 | A quotation must be linked to an inquiry.                                | System         |
| BRL-Q02 | A quotation must contain the services being offered.                     | System         |
| BRL-Q03 | A quotation must have a calculated total price.                          | System         |
| BRL-Q04 | Included and excluded services should be clearly stated.                 | System         |
| BRL-Q05 | Payment terms should be stated.                                          | System         |
| BRL-Q06 | Cancellation terms should be stated.                                     | System         |
| BRL-Q07 | A quotation should have a validity period.                               | System         |
| BRL-Q08 | Provider availability should be confirmed before final quotation.        | Human          |
| BRL-Q09 | Price changes must be communicated before booking confirmation.          | Human + System |
| BRL-Q10 | A changed quotation should remain traceable.                             | System         |
| BRL-Q11 | A quotation must be accepted before creating a normal confirmed booking. | System         |
| BRL-Q12 | A declined quotation must not create a confirmed booking.                | System         |

### Quotation Principle

> **No clear quotation → no normal confirmed booking.**

---

# 6. Booking Rules

| ID      | Business Rule                                                                | Enforcement    |
| ------- | ---------------------------------------------------------------------------- | -------------- |
| BRL-B01 | A booking must belong to a customer.                                         | System         |
| BRL-B02 | A booking should originate from an accepted quotation.                       | System         |
| BRL-B03 | Every booking must have a unique booking reference.                          | System         |
| BRL-B04 | A booking must contain travel/service information.                           | System         |
| BRL-B05 | A booking may contain multiple services.                                     | System         |
| BRL-B06 | A booking may involve multiple providers.                                    | System         |
| BRL-B07 | Booking status must follow valid state transitions.                          | System         |
| BRL-B08 | A confirmed booking requires required provider arrangements to be confirmed. | Human + System |
| BRL-B09 | Booking changes must be recorded.                                            | System         |
| BRL-B10 | Cancellation must record reason and relevant details.                        | System         |
| BRL-B11 | A completed booking must not normally return to confirmed/pending.           | System         |
| BRL-B12 | Booking completion requires confirmation that the service was delivered.     | Human + System |

---

# 7. Booking Service Rules

Each booking may contain multiple services.

Example:

```text
Booking AMX-001

├── Driver
├── Hotel
├── Boat Trip
└── Guide
```

Rules:

| ID       | Rule                                                                         |
| -------- | ---------------------------------------------------------------------------- |
| BRL-BS01 | Every booking service must belong to a booking.                              |
| BRL-BS02 | Every booking service should identify its provider.                          |
| BRL-BS03 | Each service should have its own agreed price.                               |
| BRL-BS04 | Each service may have its own status.                                        |
| BRL-BS05 | Failure of one service should be recorded separately.                        |
| BRL-BS06 | Changes to a service should not silently overwrite the original arrangement. |

This allows AMX to understand exactly which part of a trip succeeded or failed.

---

# 8. Payment Rules

| ID        | Business Rule                                                                                | Enforcement    |
| --------- | -------------------------------------------------------------------------------------------- | -------------- |
| BRL-PAY01 | A payment record must belong to a booking.                                                   | System         |
| BRL-PAY02 | Payment amount must be greater than zero unless representing a documented adjustment/refund. | System         |
| BRL-PAY03 | Payment date must be recorded.                                                               | System         |
| BRL-PAY04 | Payment method must be recorded.                                                             | System         |
| BRL-PAY05 | Payment reference should be recorded where available.                                        | System         |
| BRL-PAY06 | Payment should be verified before being marked verified/received.                            | Human          |
| BRL-PAY07 | Multiple payments may belong to one booking.                                                 | System         |
| BRL-PAY08 | Deposit and final payments must be distinguishable where applicable.                         | System         |
| BRL-PAY09 | Remaining balance should be calculated from recorded payments.                               | System         |
| BRL-PAY10 | Refunds must be recorded separately and traceably.                                           | System + Human |
| BRL-PAY11 | Payment status must not automatically determine booking status.                              | System         |

### Example

```text
Booking Total       = 10,000 ETB
Deposit             = 3,000 ETB
Remaining Balance   = 7,000 ETB
```

---

# 9. Cancellation Rules

Cancellation can occur at different levels.

```text
Inquiry
Quotation
Booking
Booking Service
Payment
```

## Rules

| ID      | Rule                                                              |
| ------- | ----------------------------------------------------------------- |
| BRL-C01 | Cancellation must identify the affected record.                   |
| BRL-C02 | Cancellation reason should be recorded.                           |
| BRL-C03 | Applicable cancellation terms must be considered.                 |
| BRL-C04 | Provider cancellation must be communicated to affected customers. |
| BRL-C05 | Customer cancellation must be communicated to affected providers. |
| BRL-C06 | Financial consequences must be recorded.                          |
| BRL-C07 | Refunds, if applicable, must be traceable.                        |
| BRL-C08 | Cancellation must not silently delete historical records.         |

### Principle

> **Cancel records; do not erase business history.**

---

# 10. Trip Coordination Rules

| ID      | Business Rule                                                                  |
| ------- | ------------------------------------------------------------------------------ |
| BRL-T01 | AMX should confirm important provider arrangements before the trip.            |
| BRL-T02 | Customer should receive relevant confirmed trip information.                   |
| BRL-T03 | Important pre-trip changes must be communicated.                               |
| BRL-T04 | Problems during the trip should be recorded.                                   |
| BRL-T05 | AMX should coordinate reasonable resolution of operational problems.           |
| BRL-T06 | Physical service delivery remains the responsibility of the relevant provider. |
| BRL-T07 | Trip completion should be confirmed before marking the booking completed.      |

---

# 11. Review & Complaint Rules

## Review

| ID      | Rule                                                                                    |
| ------- | --------------------------------------------------------------------------------------- |
| BRL-R01 | A review should be associated with a completed/relevant booking.                        |
| BRL-R02 | Review information must not be fabricated or modified to misrepresent customer opinion. |
| BRL-R03 | Public reviews may require moderation.                                                  |
| BRL-R04 | Review status must be traceable.                                                        |

## Complaint

| ID      | Rule                                                                              |
| ------- | --------------------------------------------------------------------------------- |
| BRL-R05 | A complaint should be associated with the relevant booking/customer.              |
| BRL-R06 | Complaints must be recorded accurately.                                           |
| BRL-R07 | Complaint resolution actions should be recorded.                                  |
| BRL-R08 | Serious unresolved complaints should remain visible to authorized administrators. |

---

# 12. Customer Data Rules

| ID      | Business Rule                                                            |
| ------- | ------------------------------------------------------------------------ |
| BRL-D01 | Collect only information required for AMX operations.                    |
| BRL-D02 | Customer information must be accessible only to authorized users.        |
| BRL-D03 | Sensitive information must not be unnecessarily exposed.                 |
| BRL-D04 | Customer information must not be sold or misused.                        |
| BRL-D05 | Important customer-data changes should be traceable.                     |
| BRL-D06 | Data retention and deletion should follow applicable legal requirements. |

---

# 13. User & Access Rules

The MVP primarily has:

```text
Administrator / AMX Operator
```

Rules:

| ID      | Rule                                                                         |
| ------- | ---------------------------------------------------------------------------- |
| BRL-U01 | Users must authenticate before accessing protected administrative functions. |
| BRL-U02 | Users may only perform actions allowed by their role.                        |
| BRL-U03 | Authentication credentials must be protected.                                |
| BRL-U04 | Important administrative actions should be logged.                           |
| BRL-U05 | Provider accounts are not required in the MVP.                               |

---

# 14. Financial Rules

AMX must distinguish between:

```text
Customer Price
       ↓
Provider Costs
       ↓
AMX Revenue / Margin
       ↓
Actual Business Result
```

Rules:

| ID      | Rule                                                                                        |
| ------- | ------------------------------------------------------------------------------------------- |
| BRL-F01 | Customer quotation price must be clearly defined.                                           |
| BRL-F02 | Provider costs should be recorded where required for business analysis.                     |
| BRL-F03 | AMX should distinguish revenue from provider costs.                                         |
| BRL-F04 | Financial records must be traceable to bookings.                                            |
| BRL-F05 | Revenue calculations should not be based only on quotation values when actual costs differ. |
| BRL-F06 | Financial corrections must preserve historical traceability.                                |

---

# 15. Operational Rules

| ID      | Business Rule                                                                             |
| ------- | ----------------------------------------------------------------------------------------- |
| BRL-O01 | AMX remains the central coordination point for the customer.                              |
| BRL-O02 | Important provider communication results should be recorded.                              |
| BRL-O03 | Human judgment is required for provider selection and important service decisions.        |
| BRL-O04 | The system should reduce administrative work, not unnecessarily automate human decisions. |
| BRL-O05 | Manual phone/WhatsApp/email coordination is acceptable in the MVP.                        |
| BRL-O06 | Operational problems should be tracked until resolved or formally closed.                 |
| BRL-O07 | AMX should not promise a service before provider availability is confirmed.               |

---

# 16. Legal & Compliance Rules

These rules require validation against Ethiopian laws, regulations, contracts, and applicable tourism requirements before launch.

| ID      | Business Rule                                                                                                   |
| ------- | --------------------------------------------------------------------------------------------------------------- |
| BRL-L01 | AMX must operate according to applicable Ethiopian laws and regulations.                                        |
| BRL-L02 | Required tourism/business permissions or licenses must be verified before offering regulated services.          |
| BRL-L03 | Provider qualifications/licenses should be verified where legally or operationally required.                    |
| BRL-L04 | Customer terms and cancellation conditions should be communicated clearly.                                      |
| BRL-L05 | Privacy and personal-data handling must follow applicable requirements.                                         |
| BRL-L06 | Financial and tax obligations must be properly handled.                                                         |
| BRL-L07 | AMX should clearly define its role as coordinator/intermediary versus direct service provider where applicable. |

**Important:** These are analysis requirements, not a legal opinion. Final compliance requirements should be confirmed with the relevant Ethiopian authorities or qualified legal/accounting professionals.

---

# 17. System-Enforced vs Human-Enforced Rules

This distinction is critical.

## System Should Enforce

```text
✓ Required fields
✓ Valid status transitions
✓ Unique booking reference
✓ Valid quotation → booking relationship
✓ Payment → booking relationship
✓ Positive payment amounts
✓ User authentication
✓ Role permissions
✓ Required quotation fields
✓ Audit records
✓ Data relationships
```

## Human Should Decide

```text
✓ Which provider is best
✓ Whether provider quality is acceptable
✓ Whether provider availability is reliable
✓ Price negotiation
✓ Customer clarification
✓ Whether an alternative service is appropriate
✓ Handling unusual customer requests
✓ Complaint resolution
✓ Exceptional cancellation decisions
✓ Final operational judgment
```

---

# 18. Rule Priority

| Priority | Meaning                                                                        |
| -------- | ------------------------------------------------------------------------------ |
| Critical | Violation could cause serious business, security, financial, or trust problems |
| High     | Important for correct AMX operation                                            |
| Medium   | Important but manageable operationally                                         |
| Low      | Useful operational guidance                                                    |

### Critical Rules

```text
BRL-P03  Do not falsely claim provider verification
BRL-Q11  Accepted quotation before normal confirmed booking
BRL-B03  Unique booking reference
BRL-PAY06 Verify payment
BRL-D02  Authorized access to customer data
BRL-U01  Protected admin access
BRL-O07  Do not promise unconfirmed provider service
BRL-L01  Legal compliance
```

---

# 19. Rule-to-Process Mapping

| Process                 | Main Rules      |
| ----------------------- | --------------- |
| Receive Inquiry         | BRL-A01–A08     |
| Provider Coordination   | BRL-P01–P10     |
| Create Quotation        | BRL-Q01–Q12     |
| Create Booking          | BRL-B01–B12     |
| Manage Booking Services | BRL-BS01–BS06   |
| Record Payment          | BRL-PAY01–PAY11 |
| Cancellation            | BRL-C01–C08     |
| Trip Coordination       | BRL-T01–T07     |
| Reviews & Complaints    | BRL-R01–R08     |
| Data Management         | BRL-D01–D06     |
| Authentication          | BRL-U01–U05     |
| Financial Management    | BRL-F01–F06     |
| Operations              | BRL-O01–O07     |
| Legal Compliance        | BRL-L01–L07     |

---

# 20. Rule Conflict Resolution

If two business rules appear to conflict:

1. Legal/compliance requirements take priority.
2. Security and privacy requirements take priority.
3. Confirmed customer/provider commitments must be considered.
4. Financial records must remain traceable.
5. The AMX owner/operator makes the final operational decision within the applicable rules.
6. The conflict and decision should be documented when significant.

---

# 21. Business Rule Examples

### Example 1 — Provider Not Available

```text
Customer requests Lake Chamo
        ↓
AMX contacts boat provider
        ↓
Provider unavailable
        ↓
AMX finds alternative
        ↓
Update service arrangement
        ↓
Create quotation
```

The system should **not** automatically mark the boat as confirmed.

---

### Example 2 — Customer Changes Trip

```text
Quotation = SENT
       ↓
Customer requests different date
       ↓
AMX checks providers again
       ↓
New availability/price
       ↓
Updated quotation
```

The previous quotation remains traceable.

---

### Example 3 — Partial Payment

```text
Booking Total = 10,000 ETB

Payment 1 = 3,000 ETB
Payment Status = PARTIAL

Remaining = 7,000 ETB
```

The booking may remain `CONFIRMED` if AMX's payment terms allow a deposit.

---

# 22. Business Rule Principles

### Principle 1 — Trust

AMX must never promise what has not been confirmed.

### Principle 2 — Traceability

Important business decisions and changes must remain traceable.

### Principle 3 — Separation

Inquiry, quotation, booking, payment, and provider status are separate concepts.

### Principle 4 — Human Control

Important operational decisions remain under human control in the MVP.

### Principle 5 — Minimum Data

Only necessary customer and provider information should be collected.

### Principle 6 — Financial Clarity

Customer price, provider cost, payment, and AMX business result should be distinguishable.

### Principle 7 — Legal Compliance

AMX must validate applicable legal and regulatory requirements before commercial launch.

---

# 23. Validation Checklist

Before completing business-rule analysis:

* [ ] Customer rules validated
* [ ] Provider rules validated
* [ ] Quotation rules validated
* [ ] Booking rules validated
* [ ] Payment rules validated
* [ ] Cancellation rules validated
* [ ] Trip coordination rules validated
* [ ] Review/complaint rules validated
* [ ] Data rules validated
* [ ] Access-control rules validated
* [ ] Financial rules validated
* [ ] Legal requirements reviewed
* [ ] Human vs system enforcement identified
* [ ] Critical rules identified

---

# 24. Final Analysis Decision

The AMX business rules establish the following core principle:

> **AMX coordinates and records the customer journey, but important real-world decisions—provider availability, service quality, negotiation, exceptions, and problem resolution—remain human-controlled in the MVP.**

The software should enforce **consistency, security, relationships, calculations, and valid state transitions**, while AMX staff remain responsible for **real-world coordination and judgment**.

**Status:** Draft — pending validation.

---

## Next Artifact

**3.14 — Gap Analysis**

This will compare the **current AS-IS state** with the **future TO-BE AMX state** and identify exactly what gaps AMX must solve, including process, information, technology, operational, provider, customer, and business gaps.

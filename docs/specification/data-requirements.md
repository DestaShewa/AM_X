# AMX — Data Requirements

## 1. Purpose

Define the data AMX must collect, store, relate, protect, and retrieve for the MVP.

---

## 2. Core Data Entities

| ID    | Entity          | Purpose                            |
| ----- | --------------- | ---------------------------------- |
| DR-01 | Customer        | Store customer information         |
| DR-02 | Inquiry         | Store trip requests                |
| DR-03 | Provider        | Store tourism provider information |
| DR-04 | Package         | Store AMX packages                 |
| DR-05 | Quotation       | Store customer quotations          |
| DR-06 | Booking         | Store confirmed trips              |
| DR-07 | Booking Service | Store services within a booking    |
| DR-08 | Payment         | Record booking payments            |
| DR-09 | Follow-Up       | Track operational follow-ups       |
| DR-10 | Review          | Store customer feedback            |
| DR-11 | Complaint       | Track customer problems            |
| DR-12 | User            | Store system users                 |
| DR-13 | Role            | Define permissions                 |
| DR-14 | Audit Log       | Track important system actions     |

---

## 3. Customer Data

The system shall support:

* Customer ID
* Name
* Phone/WhatsApp
* Email, if available
* Preferred contact method
* Location
* Customer notes
* Created/updated dates

Only necessary information shall be collected.

---

## 4. Inquiry Data

Each inquiry shall contain:

* Inquiry ID/reference
* Customer
* Travel date
* Number of travelers
* Arrival location
* Number of days
* Budget
* Interests
* Hotel requirement
* Transport requirement
* Special requirements
* Selected package, if applicable
* Status
* Notes
* Created/updated dates

---

## 5. Provider Data

Provider records shall support:

* Provider ID
* Name
* Provider type
* Contact information
* Location
* Services
* Languages
* Pricing information
* Availability information
* Verification status
* Verification notes
* License/qualification information where applicable
* Commission/agreement information
* Operational notes
* Created/updated dates

---

## 6. Package Data

A package shall support:

* Package ID
* Name
* Description
* Destination
* Duration
* Services
* Inclusions
* Exclusions
* Base pricing information
* Images/media references
* Status
* Created/updated dates

---

## 7. Quotation Data

A quotation shall contain:

* Quotation ID/reference
* Customer
* Inquiry
* Travel details
* Services
* Providers
* Price components
* Total price
* Deposit
* Balance
* Validity/expiry
* Cancellation terms
* Status
* Customer decision
* Notes
* Created/updated dates

---

## 8. Booking Data

A booking shall contain:

* Booking ID/reference
* Customer
* Source quotation
* Travel dates
* Number of travelers
* Booking services
* Providers
* Total amount
* Payment status
* Booking status
* Cancellation information
* Operational notes
* Created/updated dates

---

## 9. Payment Data

Each payment shall support:

* Payment ID
* Booking
* Amount
* Date
* Payment method
* Transaction/reference number
* Verification status
* Notes
* Recorded by
* Created/updated dates

**MVP:** AMX records payments; it does not process online transactions.

---

## 10. Operational Data

### Follow-Up

* Follow-up ID
* Related customer/inquiry/booking
* Task
* Due date
* Status
* Result
* Notes
* Assigned user

### Review

* Review ID
* Customer
* Booking
* Rating/feedback
* Status
* Date

### Complaint

* Complaint ID
* Customer
* Booking
* Description
* Status
* Resolution
* Notes
* Dates

---

## 11. Security Data

The system shall store:

* User ID
* Name
* Email/username
* Secure password representation
* Role
* Account status
* Login/security metadata where required

Passwords shall **never be stored in plain text**.

---

## 12. Relationships

```text
Customer
 ├── Inquiry
 ├── Booking
 ├── Review
 └── Complaint

Inquiry
 └── Quotation
       └── Booking
             ├── Booking Services
             │      └── Provider
             └── Payments

User
 └── Role

User
 └── Audit Logs
```

Detailed cardinalities and database implementation will be defined in **Phase 6 — Database & API Design**.

---

## 13. Data Integrity Requirements

The system shall:

* Use unique identifiers.
* Validate required fields.
* Maintain valid relationships.
* Prevent invalid status transitions.
* Preserve financial accuracy.
* Record important changes.
* Avoid unnecessary duplication.
* Maintain historical records where required.

---

## 14. Data Protection

Customer and operational data shall be:

* Access-controlled
* Protected during transmission
* Protected in storage where appropriate
* Backed up
* Retained only as necessary
* Removed or archived according to approved policies

Legal retention and privacy requirements must be validated before launch.

---

## 15. Data Ownership

| Data                     | Primary Responsibility                       |
| ------------------------ | -------------------------------------------- |
| Customer records         | AMX                                          |
| Inquiry records          | AMX                                          |
| Provider records         | AMX                                          |
| Package records          | AMX                                          |
| Quotations               | AMX                                          |
| Booking records          | AMX                                          |
| Payment records          | AMX records / external institution processes |
| Physical tourism service | Provider                                     |
| Customer feedback        | AMX                                          |

---

## 16. MVP Data Principle

> **Store what AMX needs to coordinate, operate, protect, and measure the business — not unnecessary data.**

**Next:** `interface-requirements.md`

# 3.8 — Sequence Diagrams

## 1. Purpose

Sequence diagrams describe how **actors, the AMX system, and external providers communicate over time**.

They define the order of interactions for the most important AMX workflows.

---

# 2. Sequence Diagram — Submit Inquiry

### Objective

Show how a visitor submits a tourism request.

```text
Visitor          AMX Website        AMX System        Database
   │                  │                  │                │
   │ Open website     │                  │                │
   ├─────────────────>│                  │                │
   │                  │                  │                │
   │ Enter trip info  │                  │                │
   ├─────────────────>│                  │                │
   │                  │                  │                │
   │ Submit inquiry   │                  │                │
   ├─────────────────>│                  │                │
   │                  │ Validate input   │                │
   │                  ├─────────────────>│                │
   │                  │                  │ Validate       │
   │                  │                  │ business rules │
   │                  │                  │                │
   │                  │                  ├───────────────>│
   │                  │                  │ Save inquiry   │
   │                  │                  │<───────────────┤
   │                  │<─────────────────┤                │
   │<─────────────────┤ Success message  │                │
   │                  │                  │                │
```

### Result

A new inquiry is created and becomes available to the AMX operator.

---

# 3. Sequence Diagram — Inquiry Processing & Provider Checking

### Objective

Show how AMX processes an inquiry and obtains provider information.

```text
AMX Admin       AMX System       Database       Provider
   │                 │               │              │
   │ View inquiries  │               │              │
   ├────────────────>│               │              │
   │                 ├──────────────>│              │
   │                 │ Get inquiry   │              │
   │                 │<──────────────┤              │
   │<────────────────┤               │              │
   │                 │               │              │
   │ Review inquiry  │               │              │
   │                 │               │              │
   │ Contact provider│               │              │
   ├───────────────────────────────────────────────>│
   │                 │               │              │
   │                 │               │  Availability│
   │<───────────────────────────────────────────────┤
   │                 │               │              │
   │ Record provider information     │              │
   ├────────────────>│               │              │
   │                 ├──────────────>│              │
   │                 │ Save/update   │              │
   │                 │ provider data │              │
   │                 │<──────────────┤              │
   │<────────────────┤               │              │
```

### Important

Provider communication may occur through **phone, WhatsApp, email, or in person**. The system records the important result rather than requiring provider self-service in the MVP.

---

# 4. Sequence Diagram — Create & Send Quotation

### Objective

Show how AMX converts confirmed service information into a quotation.

```text
AMX Admin       AMX System       Database       Customer
   │                 │               │              │
   │ Select inquiry  │               │              │
   ├────────────────>│               │              │
   │                 ├──────────────>│              │
   │                 │ Get inquiry   │              │
   │                 │<──────────────┤              │
   │<────────────────┤               │              │
   │                 │               │              │
   │ Enter services  │               │              │
   │ & prices        │               │              │
   ├────────────────>│               │              │
   │                 │ Calculate     │              │
   │                 │ total price   │              │
   │                 │               │              │
   │                 ├──────────────>│              │
   │                 │ Save quote    │              │
   │                 │<──────────────┤              │
   │<────────────────┤               │              │
   │                 │               │              │
   │ Send quotation  │               │              │
   ├────────────────>│               │              │
   │                 │───────────────┼─────────────>│
   │                 │               │  Quotation   │
   │<────────────────┤               │              │
   │                 │               │              │
```

### Quotation should contain

* Customer
* Travel dates
* Number of guests
* Services
* Included items
* Excluded items
* Total price
* Deposit/balance
* Cancellation terms
* Validity
* Booking information

---

# 5. Sequence Diagram — Customer Accepts Quotation & Booking

### Objective

Show how an accepted quotation becomes a confirmed booking.

```text
Customer        AMX System       Database       AMX Admin
   │                 │               │              │
   │ Review quote    │               │              │
   │                 │               │              │
   │ Accept quote    │               │              │
   ├────────────────>│               │              │
   │                 │               │              │
   │                 │ Validate quote│              │
   │                 ├──────────────>│              │
   │                 │<──────────────┤              │
   │                 │               │              │
   │                 │ Create booking│              │
   │                 ├──────────────>│              │
   │                 │ Save booking  │              │
   │                 │<──────────────┤              │
   │                 │               │              │
   │                 │ Notify admin  ├─────────────>│
   │                 │               │              │
   │<────────────────┤ Booking       │              │
   │                 │ confirmation   │              │
```

### Result

The quotation becomes a booking with:

* Booking reference
* Customer
* Services
* Date
* Providers
* Price
* Payment status
* Booking status

---

# 6. Sequence Diagram — Payment Recording

### Objective

Show how AMX records a customer payment.

```text
Customer       Payment Method     AMX Admin       AMX System       Database
   │                 │                │                │              │
   │ Make payment    │                │                │              │
   ├────────────────>│                │                │              │
   │                 │                │                │              │
   │                 │ Payment made   │                │              │
   │                 ├───────────────>│                │              │
   │                 │                │ Verify payment │              │
   │                 │                │                │              │
   │                 │                ├───────────────>│              │
   │                 │                │                ├─────────────>│
   │                 │                │                │ Record       │
   │                 │                │                │ payment      │
   │                 │                │                │<─────────────┤
   │                 │                │<───────────────┤              │
   │                 │                │                │              │
   │<─────────────────────────────────┤                │              │
   │ Payment recorded                 │                │              │
```

### MVP Principle

Payment processing can remain external/manual. AMX records:

* Amount
* Date
* Payment method
* Reference/receipt if available
* Booking
* Payment status
* Remaining balance

---

# 7. Sequence Diagram — Trip Coordination & Completion

### Objective

Show how AMX coordinates the confirmed trip.

```text
Customer       AMX Admin       AMX System       Providers
   │                │                │               │
   │ Trip date      │                │               │
   │                │                │               │
   │                │ Review booking │               │
   │                ├───────────────>│               │
   │                │<───────────────┤               │
   │                │                │               │
   │                │ Confirm services               │
   │                ├────────────────────────────────>│
   │                │                │               │
   │                │<────────────────────────────────┤
   │                │ Provider confirmation           │
   │                │                │               │
   │<───────────────┤ Trip details   │               │
   │                │                │               │
   │                │ Coordinate trip                │
   │                ├────────────────────────────────>│
   │<─────────────────────────────────────────────────┤
   │                │ Service delivered              │
   │                │                │               │
   │                │ Mark completed │               │
   │                ├───────────────>│               │
   │                │                │               │
   │                │ Request feedback               │
   │<───────────────┤                │               │
```

---

# 8. Sequence Diagram — Feedback & Complaint

```text
Customer        AMX System       Database       AMX Admin
   │                 │               │              │
   │ Submit feedback │               │              │
   ├────────────────>│               │              │
   │                 │ Validate      │              │
   │                 │ feedback      │              │
   │                 ├──────────────>│              │
   │                 │ Save feedback │              │
   │                 │<──────────────┤              │
   │                 │               │              │
   │                 │ Complaint?    │              │
   │                 │               │              │
   │                 ├─────────────────────────────>│
   │                 │               │   Review      │
   │                 │               │   complaint   │
   │                 │               │              │
   │                 │               │<─────────────┤
   │<────────────────┤ Resolution /  │              │
   │                 │ response      │              │
```

---

# 9. Core Sequence — Complete AMX Journey

The complete MVP interaction is:

```text
Customer
   │
   │ 1. Submit Inquiry
   ↓
AMX System
   │
   │ 2. Store Inquiry
   ↓
AMX Admin
   │
   │ 3. Review Requirements
   │
   │ 4. Contact Providers
   ↓
Providers
   │
   │ 5. Availability + Price
   ↓
AMX Admin
   │
   │ 6. Create Quotation
   ↓
AMX System
   │
   │ 7. Save & Send
   ↓
Customer
   │
   │ 8. Accept
   ↓
AMX System
   │
   │ 9. Create Booking
   ↓
AMX Admin
   │
   │ 10. Coordinate Trip
   ↓
Providers
   │
   │ 11. Deliver Services
   ↓
Customer
   │
   │ 12. Complete Trip
   ↓
AMX System
   │
   │ 13. Record Completion
   │
   │ 14. Collect Feedback
   ↓
AMX Admin
   │
   │ 15. Handle Issues / Review Results
   ↓
END
```

---

# 10. Main System Interactions

| Sequence          | Primary Actors             | Main Result               |
| ----------------- | -------------------------- | ------------------------- |
| Submit Inquiry    | Customer, System           | Inquiry created           |
| Provider Checking | Admin, Providers, System   | Availability confirmed    |
| Create Quotation  | Admin, System, Customer    | Quotation sent            |
| Confirm Booking   | Customer, System, Admin    | Booking created           |
| Record Payment    | Customer, Admin, System    | Payment recorded          |
| Coordinate Trip   | Admin, Providers, Customer | Trip delivered            |
| Feedback          | Customer, System, Admin    | Review/complaint recorded |

---

# 11. Important Business Rules Reflected

The sequence diagrams enforce these principles:

1. Inquiry comes before quotation.
2. Provider information should be checked before final quotation.
3. Customer acceptance comes before confirmed booking.
4. Payment is associated with a booking.
5. Provider coordination happens before/during trip delivery.
6. Booking is completed after service delivery.
7. Feedback is collected after completion.
8. Important operational results are recorded in AMX.

---

# 12. MVP vs Future Integration

### MVP

```text
Customer
   ↓
AMX System
   ↓
AMX Admin
   ↓
Phone / WhatsApp / Email
   ↓
Provider
```

### Future

```text
Customer
   ↓
AMX System
   ├── Payment Gateway
   ├── Automated Notifications
   ├── Provider Portal
   ├── Availability System
   └── Customer Account
```

Future integrations should not complicate the initial MVP architecture.

---

# 13. Validation Criteria

The sequence model is valid when:

* The main actors are correctly identified.
* Message order reflects the actual AMX process.
* Every critical business step has a corresponding interaction.
* Human and automated activities are clearly separated.
* External providers remain outside the core system.
* Payment processing remains outside AMX unless later integrated.
* The sequences can be mapped to use cases and future API operations.

**Status:** Draft — pending validation.

---

## Next Artifact

**3.9 — Domain Model**

The Domain Model will identify the core business objects and their relationships, such as:

**Customer → Inquiry → Quotation → Booking → Payment → Review**

and

**Provider → Services → Quotation/Booking**.

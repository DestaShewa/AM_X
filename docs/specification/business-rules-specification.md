# AMX — Business Rules Specification

## 1. Purpose

This document defines the business rules that control how AMX operates and how the system must enforce or support those rules.

---

## 2. Customer & Inquiry Rules

| ID     | Rule                                                                      |
| ------ | ------------------------------------------------------------------------- |
| BRL-01 | A customer inquiry must contain sufficient information before processing. |
| BRL-02 | Each inquiry must have a unique reference.                                |
| BRL-03 | Every inquiry must have a defined status.                                 |
| BRL-04 | Customer information must be protected from unauthorized access.          |
| BRL-05 | An inquiry must exist before a normal quotation is created.               |

---

## 3. Provider Rules

| ID     | Rule                                                                             |
| ------ | -------------------------------------------------------------------------------- |
| BRL-06 | Provider information must be recorded before the provider is used operationally. |
| BRL-07 | Provider verification status must be recorded.                                   |
| BRL-08 | AMX must not claim an unverified provider is verified.                           |
| BRL-09 | Availability should be confirmed before final booking.                           |
| BRL-10 | Provider price and important conditions must be recorded when relevant.          |
| BRL-11 | Provider performance problems should be recorded for future decisions.           |

---

## 4. Package Rules

| ID     | Rule                                                                     |
| ------ | ------------------------------------------------------------------------ |
| BRL-12 | Only active packages should be publicly displayed.                       |
| BRL-13 | Packages must define their services and important inclusions/exclusions. |
| BRL-14 | Package changes must not silently alter an already confirmed booking.    |
| BRL-15 | Obsolete packages should be archived rather than unnecessarily deleted.  |

---

## 5. Quotation Rules

| ID     | Rule                                                                             |
| ------ | -------------------------------------------------------------------------------- |
| BRL-16 | A quotation must be based on customer requirements.                              |
| BRL-17 | Provider availability should be confirmed before a final quotation.              |
| BRL-18 | A quotation must contain a clear total price.                                    |
| BRL-19 | Inclusions and exclusions must be stated.                                        |
| BRL-20 | Deposit and balance requirements must be clear when applicable.                  |
| BRL-21 | Cancellation conditions must be communicated.                                    |
| BRL-22 | Price changes must be communicated before customer confirmation.                 |
| BRL-23 | Customer acceptance must be recorded before creating a normal confirmed booking. |

---

## 6. Booking Rules

| ID     | Rule                                                              |
| ------ | ----------------------------------------------------------------- |
| BRL-24 | Each confirmed booking must have a unique booking reference.      |
| BRL-25 | A booking must be linked to a customer.                           |
| BRL-26 | A booking must contain its required services.                     |
| BRL-27 | Required providers must be associated with the relevant services. |
| BRL-28 | Booking status must reflect the real operational state.           |
| BRL-29 | Important booking changes must be recorded.                       |
| BRL-30 | Cancellation must follow the applicable cancellation conditions.  |

---

## 7. Payment Rules

| ID     | Rule                                                                                |
| ------ | ----------------------------------------------------------------------------------- |
| BRL-31 | Every payment record must belong to a booking.                                      |
| BRL-32 | Payment amount, date, method, and reference should be recorded.                     |
| BRL-33 | Payment must be verified before being treated as confirmed.                         |
| BRL-34 | Paid amount must not exceed the valid booking amount without authorized adjustment. |
| BRL-35 | Remaining balance must be calculated from recorded payments.                        |
| BRL-36 | MVP payment processing is external; AMX records the transaction.                    |

---

## 8. Trip & Completion Rules

| ID     | Rule                                                                           |
| ------ | ------------------------------------------------------------------------------ |
| BRL-37 | A trip should not enter progress without a confirmed booking.                  |
| BRL-38 | AMX must record important provider arrangements.                               |
| BRL-39 | Operational problems should be recorded and followed up.                       |
| BRL-40 | A booking should be marked completed only after service delivery is confirmed. |
| BRL-41 | Customer feedback should be requested after completion.                        |

---

## 9. Review & Complaint Rules

| ID     | Rule                                                      |
| ------ | --------------------------------------------------------- |
| BRL-42 | Reviews should relate to a completed customer experience. |
| BRL-43 | Complaints must have a defined status.                    |
| BRL-44 | Complaint resolution actions should be recorded.          |
| BRL-45 | Reviews must not be manipulated or falsely attributed.    |

---

## 10. Security & Access Rules

| ID     | Rule                                                        |
| ------ | ----------------------------------------------------------- |
| BRL-46 | Administrative functions require authentication.            |
| BRL-47 | Users may only access functions permitted by their role.    |
| BRL-48 | Sensitive customer information must have restricted access. |
| BRL-49 | Important administrative actions must be auditable.         |
| BRL-50 | Credentials must never be stored in plain text.             |

---

## 11. Financial Rules

| ID     | Rule                                                                 |
| ------ | -------------------------------------------------------------------- |
| BRL-51 | Customer payments and provider costs must be distinguishable.        |
| BRL-52 | Revenue must be calculated from recorded business transactions.      |
| BRL-53 | Financial adjustments must be traceable.                             |
| BRL-54 | Commission or margin rules must be defined before commercial launch. |

---

## 12. Legal & Operational Rules

| ID     | Rule                                                                                   |
| ------ | -------------------------------------------------------------------------------------- |
| BRL-55 | AMX must comply with applicable tourism and business requirements.                     |
| BRL-56 | Provider qualifications and licensing requirements must be validated where applicable. |
| BRL-57 | Customer terms, cancellation, and refund policies must be defined.                     |
| BRL-58 | AMX responsibilities and provider responsibilities must be clearly defined.            |
| BRL-59 | Privacy and data-protection obligations must be validated before launch.               |

---

## 13. Human-Controlled Decisions

The system shall **support**, not automatically decide:

* Provider selection
* Provider availability confirmation
* Price negotiation
* Special customer requests
* Exceptional cancellations/refunds
* Complaint resolution
* Emergency/problem handling
* Final trip coordination decisions

### Principle

> **The system enforces rules and preserves records; AMX staff make operational judgments.**

---

## 14. Rule Priority

```text
Legal / Safety
      ↓
Customer Trust
      ↓
Financial Accuracy
      ↓
Operational Control
      ↓
System Convenience
```

Rules related to legal compliance, safety, customer trust, and financial accuracy take priority over convenience or automation.

**Next:** `data-requirements.md`

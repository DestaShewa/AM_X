# AMX — Functional Specification

## 1. Purpose

This document defines **what the AMX system must do** to support its approved MVP workflow.

---

## 2. Functional Modules

| ID    | Module               | Main Functions                            |
| ----- | -------------------- | ----------------------------------------- |
| FS-01 | Public Website       | Display AMX, packages, services, contact  |
| FS-02 | Inquiry Management   | Receive, review, update, track inquiries  |
| FS-03 | Customer Management  | Create, search, update customer records   |
| FS-04 | Provider Management  | Manage providers and verification         |
| FS-05 | Package Management   | Create and manage tourism packages        |
| FS-06 | Quotation Management | Create, calculate, send, track quotations |
| FS-07 | Booking Management   | Confirm and manage bookings               |
| FS-08 | Payment Management   | Record and track payments                 |
| FS-09 | Follow-Up            | Schedule and track follow-ups             |
| FS-10 | Reviews & Complaints | Record and manage customer feedback       |
| FS-11 | Authentication       | Secure administrator access               |
| FS-12 | Reporting            | Monitor operational and financial results |
| FS-13 | Audit                | Record important system actions           |

---

## 3. Public Website

**FS-01.1** Display AMX information and value proposition.

**FS-01.2** Display active packages and services.

**FS-01.3** Display package details, inclusions, exclusions, and relevant information.

**FS-01.4** Provide inquiry/contact options.

**FS-01.5** Provide WhatsApp/phone/email contact methods.

**FS-01.6** Work correctly on mobile and desktop.

---

## 4. Inquiry Management

**FS-02.1** Receive customer inquiries.

**FS-02.2** Validate required inquiry information.

**FS-02.3** Generate a unique inquiry reference.

**FS-02.4** Allow administrators to view and update inquiries.

**FS-02.5** Track inquiry status.

**FS-02.6** Record communication and operational notes.

**FS-02.7** Convert a qualified inquiry into a quotation.

---

## 5. Customer Management

**FS-03.1** Create customer records.

**FS-03.2** Link customers to inquiries and bookings.

**FS-03.3** Search and filter customers.

**FS-03.4** View customer history.

**FS-03.5** Update customer information.

---

## 6. Provider Management

**FS-04.1** Create provider records.

**FS-04.2** Store provider type, contact, services, pricing, and operational information.

**FS-04.3** Record verification status.

**FS-04.4** Record provider availability information.

**FS-04.5** Record provider performance notes.

**FS-04.6** Prevent unverified providers from being represented as verified.

---

## 7. Package Management

**FS-05.1** Create packages.

**FS-05.2** Update package information.

**FS-05.3** Activate/deactivate packages.

**FS-05.4** Record duration, services, inclusions, exclusions, and pricing.

**FS-05.5** Archive obsolete packages.

---

## 8. Quotation Management

**FS-06.1** Create quotations from inquiries.

**FS-06.2** Add confirmed services and providers.

**FS-06.3** Calculate total price.

**FS-06.4** Record inclusions, exclusions, deposit, balance, and cancellation terms.

**FS-06.5** Assign quotation status.

**FS-06.6** Send quotation to the customer.

**FS-06.7** Record customer acceptance, rejection, or requested changes.

---

## 9. Booking Management

**FS-07.1** Create a booking after quotation acceptance.

**FS-07.2** Generate a unique booking reference.

**FS-07.3** Record booking services and providers.

**FS-07.4** Track booking status.

**FS-07.5** Record changes, cancellations, and operational notes.

**FS-07.6** Mark bookings as completed after trip delivery.

---

## 10. Payment Management

**FS-08.1** Record customer payments.

**FS-08.2** Link each payment to a booking.

**FS-08.3** Record amount, date, method, reference, and status.

**FS-08.4** Calculate paid amount and remaining balance.

**FS-08.5** Record refunds or payment adjustments where applicable.

**Note:** MVP records payments; it does not process online payments.

---

## 11. Follow-Up Management

**FS-09.1** Create follow-up tasks.

**FS-09.2** Assign follow-up dates.

**FS-09.3** Track follow-up status.

**FS-09.4** Record follow-up results and notes.

---

## 12. Reviews & Complaints

**FS-10.1** Record customer reviews after completed trips.

**FS-10.2** Record complaints.

**FS-10.3** Track complaint status.

**FS-10.4** Record resolution actions.

---

## 13. Authentication & Access

**FS-11.1** Authenticate administrators.

**FS-11.2** Enforce role-based permissions.

**FS-11.3** Restrict protected functions to authorized users.

**FS-11.4** Record important administrative actions.

---

## 14. Reporting

**FS-12.1** Report inquiry volume and status.

**FS-12.2** Report quotations and conversion.

**FS-12.3** Report bookings and cancellations.

**FS-12.4** Report payments, revenue, and recorded costs.

**FS-12.5** Report completed trips.

**FS-12.6** Report reviews, complaints, and provider performance.

---

## 15. Audit

**FS-13.1** Record important create/update/delete actions.

**FS-13.2** Record user, action, date/time, and relevant record.

**FS-13.3** Protect audit records from unauthorized modification.

---

## 16. End-to-End Functional Acceptance

The MVP must support:

```text
Inquiry
  ↓
Review
  ↓
Provider Check
  ↓
Quotation
  ↓
Customer Decision
  ↓
Booking
  ↓
Payment Recording
  ↓
Trip Coordination
  ↓
Completion
  ↓
Feedback
```

**Functional baseline:** Every step must be supported by the system or have a clearly defined human-controlled external action.

**Next:** `non-functional-specification.md`

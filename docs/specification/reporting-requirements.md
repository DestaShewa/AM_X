# AMX — Reporting Requirements

## 1. Purpose

Define the reports and business information required to monitor AMX operations, financial performance, customers, and providers.

---

## 2. Reporting Principles

Reports shall be:

* Accurate
* Simple
* Actionable
* Based on recorded system data
* Filterable by relevant dates/statuses
* Accessible only to authorized users

---

## 3. Dashboard

The administrator dashboard should show:

* New inquiries
* Active inquiries
* Quotations sent
* Confirmed bookings
* Upcoming trips
* Completed trips
* Pending payments
* Revenue
* Recorded costs
* Open complaints
* Pending follow-ups

---

## 4. Inquiry Reports

The system shall support:

| ID     | Report                    |
| ------ | ------------------------- |
| REP-01 | Total inquiries           |
| REP-02 | Inquiries by status       |
| REP-03 | Inquiries by date         |
| REP-04 | Inquiry-to-quotation rate |
| REP-05 | Inquiry-to-booking rate   |

---

## 5. Booking Reports

The system shall support:

* Total bookings
* Confirmed bookings
* Upcoming bookings
* Completed bookings
* Cancelled bookings
* Bookings by package
* Bookings by provider
* Bookings by date

---

## 6. Financial Reports

The system shall support:

* Total customer payments
* Outstanding balances
* Revenue
* Recorded provider/service costs
* Gross margin where sufficient data exists
* Refunds
* Financial results by period

### Basic calculation

```text
Revenue = Customer Payments / Confirmed Revenue
Gross Margin = Revenue − Recorded Business Costs
Outstanding Balance = Booking Total − Verified Payments
```

Financial reports must clearly distinguish **recorded facts** from estimates.

---

## 7. Provider Reports

The system should provide:

* Provider list
* Verification status
* Services provided
* Booking count
* Completed services
* Cancellations/failures
* Customer complaints
* Provider performance notes

---

## 8. Customer Reports

The system should support:

* Customer history
* Inquiry history
* Booking history
* Payment history
* Reviews
* Complaints
* Repeat customers

---

## 9. Review & Complaint Reports

Reports shall include:

* Number of reviews
* Average rating where applicable
* Complaints by status
* Open complaints
* Resolved complaints
* Common operational problems

---

## 10. Operational Reports

The system should support:

* Pending follow-ups
* Overdue follow-ups
* Upcoming trips
* Provider availability checks
* Pending quotations
* Pending customer decisions
* Cancelled services

---

## 11. Filters

Reports should support appropriate filters such as:

* Date range
* Status
* Package
* Provider
* Customer
* Booking

---

## 12. Export

The system should support future export of selected reports to common formats such as:

* PDF
* CSV/Excel

Export permissions shall be restricted to authorized users.

---

## 13. Key Business KPIs

AMX should monitor:

```text
Inquiry Response Time
        ↓
Inquiry → Quotation Rate
        ↓
Quotation → Booking Rate
        ↓
Completed Trips
        ↓
Average Booking Value
        ↓
Revenue / Gross Margin
        ↓
Cancellation Rate
        ↓
Customer Satisfaction
        ↓
Provider Reliability
```

---

## 14. Reporting Principle

> **Reports exist to support decisions, not simply to display data.**

The MVP should prioritize a small number of reliable operational and financial reports over complex analytics.

**Next:** `localization-requirements.md`

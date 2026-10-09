# AMX Screen Inventory

**Project:** AMX — Arba Minch Experiences
**Document:** `docs/ui-ux/screen-inventory.md`
**Version:** 1.0

## 1. Purpose

List all screens required for the AMX MVP, including their purpose, users, main components, actions, and important interface states. This inventory guides wireframes, frontend development, and UI/UX validation.

## 2. Public Website Screens

| ID     | Screen               | Purpose                                     | Main Components and Actions                                                      |
| ------ | -------------------- | ------------------------------------------- | -------------------------------------------------------------------------------- |
| PUB-01 | Home                 | Introduce AMX and encourage trip inquiries. | Hero, featured experiences, benefits, how-it-works section, CTA                  |
| PUB-02 | Experiences Listing  | Browse available experiences.               | Experience cards, highlights, duration, confirmed starting prices, details links |
| PUB-03 | Package Details      | Explain one experience.                     | Gallery, itinerary, inclusions, exclusions, price conditions, request button     |
| PUB-04 | Custom Trip Request  | Collect trip preferences.                   | Contact details, dates, group size, budget, interests, special requirements      |
| PUB-05 | How It Works         | Explain the coordination process.           | Steps, quotation process, confirmation information, CTA                          |
| PUB-06 | About AMX            | Explain the service and its purpose.        | Mission, local focus, coordination approach                                      |
| PUB-07 | Provider Profiles    | Introduce approved local providers.         | Approved profile details, services, languages, verification information          |
| PUB-08 | Contact              | Help visitors contact AMX.                  | Phone, email, WhatsApp, contact form                                             |
| PUB-09 | Inquiry Confirmation | Confirm successful inquiry submission.      | Confirmation message, next steps, contact option                                 |
| PUB-10 | Terms and Conditions | Explain service terms.                      | Terms content and contact information                                            |
| PUB-11 | Cancellation Policy  | Explain cancellation and refund conditions. | Approved policy, relevant deadlines, contact instructions                        |
| PUB-12 | Privacy Policy       | Explain data collection and use.            | Data categories, purposes, retention, privacy contact                            |
| PUB-13 | Not Found            | Handle unavailable pages.                   | Clear message, home link, experience link                                        |

## 3. Authentication and Shared Admin Screens

| ID     | Screen             | Purpose                          | Main Components and Actions                                                          |
| ------ | ------------------ | -------------------------------- | ------------------------------------------------------------------------------------ |
| ADM-01 | Staff Login        | Authenticate authorized staff.   | Email/username, password, validation, login button                                   |
| ADM-02 | Dashboard Overview | Summarize current operations.    | Inquiry counts, quotation status, upcoming bookings, follow-ups, financial summaries |
| ADM-03 | Account Menu       | Manage staff session.            | Account details, logout                                                              |
| ADM-04 | Access Denied      | Explain insufficient permission. | Safe error message, return navigation                                                |
| ADM-05 | Session Expired    | Handle expired sessions.         | Expiry message, login link                                                           |
| ADM-06 | Not Found          | Handle unavailable admin pages.  | Error message, dashboard link                                                        |

## 4. Inquiry and Customer Screens

| ID     | Screen              | Purpose                               | Main Components and Actions                                   |
| ------ | ------------------- | ------------------------------------- | ------------------------------------------------------------- |
| ADM-07 | Inquiry List        | Monitor incoming requests.            | Search, filters, status, travel date, assigned staff          |
| ADM-08 | Inquiry Details     | Review and manage one inquiry.        | Customer details, preferences, notes, status, contact actions |
| ADM-09 | Create/Edit Inquiry | Record or update an inquiry.          | Validated form, source, dates, travelers, budget, interests   |
| ADM-10 | Customer List       | Find customers.                       | Search, phone, name, inquiry/booking summary                  |
| ADM-11 | Customer Details    | Review customer history.              | Contact details, related inquiries, quotations, bookings      |
| ADM-12 | Follow-up History   | Track communication and next actions. | Follow-up timeline, due dates, outcomes, notes                |

## 5. Provider and Package Screens

| ID     | Screen                  | Purpose                          | Main Components and Actions                                             |
| ------ | ----------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| ADM-13 | Provider List           | Manage local providers.          | Search, service type, verification status, active status                |
| ADM-14 | Provider Details        | Review provider information.     | Contact, services, languages, rates, documents, history                 |
| ADM-15 | Create/Edit Provider    | Maintain provider records.       | Provider form, services, rates, availability notes, verification fields |
| ADM-16 | Provider Verification   | Record verification decisions.   | Evidence, verification status, reviewer, decision notes                 |
| ADM-17 | Package List            | Manage public experiences.       | Search, status, price, create/edit actions                              |
| ADM-18 | Package Details Preview | Preview public-facing content.   | Title, description, images, itinerary, price, inclusions                |
| ADM-19 | Create/Edit Package     | Create and maintain experiences. | Content fields, itinerary, pricing, images, publication status          |

## 6. Quotation Screens

| ID     | Screen                      | Purpose                               | Main Components and Actions                                          |
| ------ | --------------------------- | ------------------------------------- | -------------------------------------------------------------------- |
| ADM-20 | Quotation List              | Track quotations.                     | Search, status, customer, expiry, total                              |
| ADM-21 | Create/Edit Quotation       | Prepare a customer quotation.         | Inquiry, services, quantities, prices, inclusions, exclusions, terms |
| ADM-22 | Quotation Details           | Review a quotation and its history.   | Revision number, total, status, expiry, service breakdown            |
| ADM-23 | Quotation Preview           | Review the customer-facing quotation. | Clear pricing, itinerary, terms, contact details                     |
| ADM-24 | Quotation Acceptance Record | Record acceptance evidence.           | Acceptance method, date/time, staff member, supporting notes         |
| ADM-25 | Quotation Revision          | Create a revised quotation.           | Previous revision reference, changed services/prices, revised terms  |

## 7. Booking and Service Screens

| ID     | Screen                     | Purpose                               | Main Components and Actions                                               |
| ------ | -------------------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| ADM-26 | Booking List               | Monitor confirmed and upcoming trips. | Search, booking number, status, dates, customer                           |
| ADM-27 | Booking Details            | Manage one booking.                   | Customer, accepted quotation, price snapshot, itinerary, status, services |
| ADM-28 | Booking Service Management | Coordinate individual services.       | Provider assignment, service status, schedule, costs, notes               |
| ADM-29 | Booking Status Update      | Record valid status transitions.      | Current status, permitted next status, confirmation, reason               |
| ADM-30 | Trip Completion            | Record the trip outcome.              | Completion date, service outcomes, issues, internal notes                 |
| ADM-31 | Cancellation Management    | Process cancellation requests.        | Reason, policy reference, service impact, authorized decision             |

## 8. Finance Screens

| ID     | Screen                     | Purpose                                  | Main Components and Actions                                        |
| ------ | -------------------------- | ---------------------------------------- | ------------------------------------------------------------------ |
| ADM-32 | Booking Financial Summary  | Review amount due and payment position.  | Amount due, verified payments, refunds, outstanding balance        |
| ADM-33 | Payment Transaction List   | Find recorded transactions.              | Booking, transaction type, status, date, amount                    |
| ADM-34 | Record Payment Transaction | Record an externally made payment.       | Amount, method, reference, date, evidence/notes                    |
| ADM-35 | Transaction Details        | Inspect one financial transaction.       | Type, status, evidence, booking, original payment if applicable    |
| ADM-36 | Verify/Reject Transaction  | Record an authorized decision.           | Evidence review, decision, reason, confirmation                    |
| ADM-37 | Refund/Adjustment Record   | Record an approved refund or adjustment. | Original payment, amount, reason, authorization, audit information |

## 9. Follow-ups, Feedback, and Complaints

| ID     | Screen                | Purpose                              | Main Components and Actions                              |
| ------ | --------------------- | ------------------------------------ | -------------------------------------------------------- |
| ADM-38 | Follow-up List        | Track tasks requiring action.        | Due date, target, assigned staff, status, filters        |
| ADM-39 | Create/Edit Follow-up | Schedule or update follow-up work.   | Target record, due date, assigned staff, notes           |
| ADM-40 | Review Management     | Manage submitted feedback.           | Review details, eligibility, moderation status, decision |
| ADM-41 | Complaint List        | Monitor customer complaints.         | Status, booking, severity, assigned staff                |
| ADM-42 | Complaint Details     | Investigate and resolve a complaint. | Description, history, internal notes, status, resolution |

## 10. Administration and Reporting Screens

| ID     | Screen                         | Purpose                              | Main Components and Actions                                                     |
| ------ | ------------------------------ | ------------------------------------ | ------------------------------------------------------------------------------- |
| ADM-43 | Staff User List                | Manage staff accounts.               | Search, role, account status, create/edit actions                               |
| ADM-44 | Create/Edit Staff User         | Maintain authorized staff accounts.  | Identity, role assignment, account status                                       |
| ADM-45 | Role and Permission Management | Control access to system operations. | Role definitions, permission matrix, changes                                    |
| ADM-46 | Reports                        | Review business performance.         | Inquiry conversion, bookings, revenue and expenses where recorded, date filters |
| ADM-47 | Audit Log                      | Review sensitive system activity.    | Actor, action, target, timestamp, filters                                       |
| ADM-48 | Admin Profile                  | View staff account details.          | Profile information, session actions where supported                            |

## 11. Reusable UI Components

Build reusable components rather than implementing every screen independently.

* Public header, navigation menu, and footer
* Experience card and provider card
* Gallery and image viewer
* Form fields, date inputs, selects, and text areas
* Buttons, confirmation dialogs, and notifications
* Status badges and status-transition controls
* Search, filters, tables, and pagination
* Breadcrumbs, page headings, and empty states
* Loading indicators, validation messages, and error states
* Price breakdown and financial summary
* Audit-history timeline

## 12. Required Interface States

Applicable screens must handle:

1. Initial loading.
2. Successful data display.
3. Empty results.
4. Invalid input.
5. Failed requests and network errors.
6. Permission denied.
7. Duplicate or conflicting operations.
8. Successful creation or update.
9. Confirmation before sensitive actions.
10. Mobile and narrow-screen layouts.

Financial and booking screens must also show clear status, action permissions, and reasons for rejected or blocked operations where appropriate.

## 13. Screen Access Rules

* Public visitors can access only published public content and inquiry submission.
* Operations staff can access assigned operational functions according to their permissions.
* Finance staff can access authorized financial functions.
* Administrators can manage staff and system configuration within the approved permission model.
* Audit logs are restricted to authorized users.
* The backend must enforce all permissions; hiding a screen or button alone is insufficient.

## 14. MVP Priorities

**Priority 1 — Essential launch screens**

* Public home, experiences, package details, custom-trip request, contact, and legal pages.
* Staff login and dashboard.
* Inquiry, customer, provider, and package management.
* Quotations, acceptance recording, bookings, and booking services.
* Payment transaction recording and verification.
* Follow-ups, basic reports, and audit logs.

**Priority 2 — Operational completeness**

* Reviews and complaints.
* Advanced filters and reporting.
* Improved provider verification management.
* More detailed account-management screens.

Priorities must be reconciled with the approved MVP requirements before implementation.

## 15. Next Step

Create `docs/ui-ux/wireframes.md` to define the layout, content hierarchy, major components, and interactions for the highest-priority public and admin screens before frontend development begins.

# AMX UI/UX Design Plan

**Project:** AMX — Arba Minch Experiences
**Document:** `docs/ui-ux/ui-ux-design-plan.md`
**Version:** 1.0
**Status:** Proposed — Pending Review

## 1. Purpose

Define the plan for designing a professional, responsive, accessible, and user-friendly AMX website and administrative dashboard before implementation.

## 2. Design Objectives

* Help visitors discover Arba Minch experiences and submit trip inquiries easily.
* Communicate packages, pricing information, inclusions, and booking steps clearly.
* Build trust through transparent information and genuinely verified local providers.
* Help staff manage inquiries, quotations, bookings, payment records, and follow-ups efficiently.
* Provide a consistent experience across mobile, tablet, and desktop devices.
* Support future Amharic localization while using English for the initial MVP.

## 3. Target Users

| User                        | Primary Needs                                                      |
| --------------------------- | ------------------------------------------------------------------ |
| Domestic visitors           | Find suitable experiences, understand costs, and request trips.    |
| International visitors      | Understand services, logistics, inclusions, and local support.     |
| Families and groups         | Submit group details and request customized quotations.            |
| Hotel and referral partners | Understand AMX services and contact the team.                      |
| Operations staff            | Manage inquiries, providers, quotations, bookings, and follow-ups. |
| Finance staff               | Record and verify payments and review financial summaries.         |
| Administrator               | Manage staff accounts, roles, packages, and system activity.       |

## 4. Design Scope

### 4.1 Public website

* Home
* About AMX
* Experiences/packages listing
* Package details
* Custom-trip request form
* Provider profiles
* How It Works
* Contact and WhatsApp
* Terms and conditions
* Cancellation policy
* Privacy policy

### 4.2 Administrative dashboard

* Staff login
* Dashboard overview
* Inquiry management
* Customer management
* Provider management
* Package management
* Quotation management
* Booking management
* Booking-service management
* Payment transaction records
* Follow-up management
* Reviews and complaints
* Staff users and roles
* Reports
* Audit logs
* Account and session management

The final screen inventory must identify which screens are full pages, dialogs, forms, or reusable components.

## 5. Core User Journeys

### Visitor journey

Discover AMX → Browse experiences → Review package details → Submit inquiry → Receive follow-up → Review quotation → Confirm the trip with AMX.

### Staff journey

Log in → Review new inquiry → Contact customer → Check provider availability → Prepare quotation → Record customer acceptance → Create booking → Coordinate services → Record payment transactions → Complete trip → Request feedback.

### Finance journey

Log in with appropriate permissions → Find booking → Review payment evidence → Verify or reject transaction → Review payment summary → Record required audit information.

## 6. UX Principles

1. **Clarity:** Use understandable labels and explain what happens next.
2. **Trust:** Display only accurate prices, provider details, and verification claims.
3. **Simplicity:** Keep forms short and request only necessary information.
4. **Consistency:** Reuse the same patterns for tables, forms, statuses, and actions.
5. **Feedback:** Show loading states, validation errors, confirmations, and success messages.
6. **Safety:** Confirm destructive or sensitive actions before execution.
7. **Accessibility:** Support keyboard navigation, readable contrast, labels, and clear focus states.
8. **Mobile-first:** Make browsing, inquiry submission, and WhatsApp contact easy on mobile.
9. **Operational efficiency:** Let staff search, filter, sort, and update records without unnecessary steps.
10. **Privacy:** Show users only the customer, financial, and operational information they are authorized to access.

## 7. Proposed Visual Direction

* **Brand personality:** Trustworthy, welcoming, local, professional, and experience-focused.
* **Visual theme:** Nature-inspired colors, clean layouts, strong photography, and restrained decorative elements.
* **Typography:** Readable sans-serif typefaces with clear heading hierarchy.
* **Layout:** Responsive grids, consistent spacing, clear calls to action, and uncluttered forms.
* **Imagery:** Authentic, permission-cleared photographs of Arba Minch, Lake Chamo, local experiences, and providers.
* **Components:** Reusable buttons, cards, forms, tables, badges, dialogs, alerts, and navigation.
* **Motion:** Subtle transitions only where they improve understanding or feedback.

Final colors, fonts, and component specifications will be recorded in `design-system.md`.

## 8. Proposed Design Tools and Implementation Alignment

* **Wireframes and prototypes:** Figma or an equivalent design tool.
* **Frontend:** Next.js and React.
* **Styling:** Tailwind CSS.
* **Reusable UI:** Shared components with consistent states and responsive behavior.
* **Source control:** Git and GitHub.

UI design must remain consistent with the approved system architecture and API contracts. No real customer data or production credentials should be placed in design files.

## 9. Design Deliverables

| Deliverable              | File                          |
| ------------------------ | ----------------------------- |
| Design plan              | `ui-ux-design-plan.md`        |
| User flows               | `user-flow-diagrams.md`       |
| Information architecture | `information-architecture.md` |
| Screen inventory         | `screen-inventory.md`         |
| Wireframes               | `wireframes.md`               |
| Design system            | `design-system.md`            |
| Responsive design        | `responsive-design.md`        |
| Accessibility guidelines | `accessibility-guidelines.md` |
| Validation checklist     | `ui-ux-validation.md`         |
| Approved baseline        | `ui-ux-baseline.md`           |

## 10. Validation and Acceptance Criteria

The UI/UX design will be ready for approval when:

* All required public and administrative screens are inventoried.
* The main visitor and staff journeys are documented.
* Forms, statuses, errors, empty states, loading states, and confirmations are defined.
* Designs cover mobile, tablet, and desktop layouts.
* Role-sensitive information and actions are addressed.
* Accessibility and privacy requirements are incorporated.
* Designs are consistent with the requirements and proposed API.
* Stakeholders review the design and record their approval.

## 11. Constraints and Dependencies

* The initial release focuses on Arba Minch.
* English is the initial interface language; Amharic support may follow.
* Customer and provider accounts are excluded from the MVP.
* Online payment processing is excluded; staff record payment transactions.
* Provider availability is checked manually.
* Licensing, provider-verification, cancellation, and refund policies must be confirmed before corresponding claims or workflows are finalized.
* Database and API baselines remain pending validation and approval.

## 12. Next Steps

1. Review this plan.
2. Create `user-flow-diagrams.md`.
3. Define `information-architecture.md`.
4. Inventory every required screen.
5. Prepare wireframes and the design system.
6. Validate the complete design and obtain approval before frontend implementation.

**Current status:** Proposed design plan; pending review.

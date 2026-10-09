# AMX UI/UX Design Baseline

**Project:** AMX — Arba Minch Experiences
**Document:** `docs/ui-ux/ui-ux-baseline.md`
**Version:** 1.0

## 1. Purpose

Establish the UI/UX design specifications that guide implementation of the AMX public website and administrative dashboard. This baseline promotes consistent navigation, visual design, responsive behavior, accessibility, and business workflows.

## 2. Baseline Documents

The following documents collectively define the UI/UX design baseline:

| # | Document                      | Purpose                                      |
| - | ----------------------------- | -------------------------------------------- |
| 1 | `ui-ux-design-plan.md`        | Design objectives, principles, and scope     |
| 2 | `user-flow-diagrams.md`       | Visitor and staff workflows                  |
| 3 | `information-architecture.md` | Public and admin navigation structure        |
| 4 | `screen-inventory.md`         | Required screens and screen identifiers      |
| 5 | `wireframes.md`               | Screen layouts and component placement       |
| 6 | `design-system.md`            | Colors, typography, spacing, and components  |
| 7 | `responsive-design.md`        | Layout behavior across device sizes          |
| 8 | `accessibility-guidelines.md` | Accessibility requirements and testing       |
| 9 | `ui-ux-validation.md`         | Validation checklist and acceptance criteria |

## 3. Agreed Design Direction

### Public Website

The public website must help visitors:

* Discover Arba Minch experiences and packages.
* Understand package prices, inclusions, exclusions, and conditions.
* Submit custom-trip inquiries.
* Learn how AMX coordinates local providers.
* Contact AMX through available communication channels, including WhatsApp.

The initial experience is English-first, responsive, and designed to support future Amharic localization.

### Administrative Dashboard

The dashboard must support authorized staff in managing:

* Inquiries and customers
* Providers and packages
* Quotations and quotation revisions
* Bookings and booking services
* Payment transactions and booking payment summaries
* Follow-ups
* Reviews and complaints
* Users, roles, reports, and audit logs

The interface must prioritize operational clarity, accurate information, and efficient daily work.

## 4. Design Standards

* **Accessibility:** WCAG 2.2 Level AA target.
* **Typography:** Inter or a suitable equivalent.
* **Primary color:** `#176B57`.
* **Secondary color:** `#D9A441`.
* **Spacing:** 4px-based spacing scale.
* **Content width:** Approximately 1200px maximum for primary desktop layouts.
* **Responsive breakpoints:** Follow `responsive-design.md`.
* **Component consistency:** Reuse documented buttons, forms, cards, status indicators, tables, and dialogs.
* **Motion:** Respect reduced-motion preferences.
* **Mobile usability:** Core public and administrative workflows must remain usable on supported mobile layouts.

The detailed specifications in `design-system.md`, `responsive-design.md`, and `accessibility-guidelines.md` take precedence over this summary.

## 5. Business Rules Reflected in the Interface

1. An inquiry is not a booking.
2. A quotation is not a confirmed booking.
3. Accepting a quotation and confirming a booking are distinct workflow steps.
4. Quotation revisions and accepted terms must remain understandable and traceable.
5. Payment recording does not mean AMX processes payments online.
6. Individual payment transactions must be distinguished from the booking's overall payment summary.
7. Sensitive financial actions must show appropriate permissions, confirmation, and feedback.
8. Provider verification must be represented accurately.
9. Private customer and financial information must not appear on public pages.
10. UI controls must never replace backend authorization or business-rule enforcement.

## 6. Implementation Boundaries

The UI/UX baseline covers the design of the approved MVP experience. It does not authorize adding excluded features such as:

* Native mobile applications
* Provider self-service dashboards
* Online payment processing
* AI chatbots
* Live vehicle tracking
* Automated provider availability integrations
* Multi-city marketplace functionality

Any change to these boundaries must be evaluated against the project scope and relevant requirements.

## 7. Change Control

When a design change is required:

1. Identify the affected screen and document.
2. Describe the reason and expected benefit.
3. Check impacts on user flows, requirements, security, accessibility, and business rules.
4. Update the relevant design documents.
5. Review related documents for consistency.
6. Record the change in the project's change log.
7. Obtain project-owner approval for material changes.

Small visual refinements may be made during implementation if they preserve the approved workflows, accessibility, and requirements.

## 8. Baseline Acceptance Checklist

* [ ] All nine baseline documents are present and internally consistent.
* [ ] Required public and admin screens are covered.
* [ ] Critical user journeys are represented.
* [ ] Design-system and responsive rules are documented.
* [ ] Accessibility requirements are documented.
* [ ] Inquiry, quotation, booking, and payment distinctions are preserved.
* [ ] Security, privacy, and role-based access considerations are reflected.
* [ ] Critical validation issues are resolved.
* [ ] The project owner has reviewed and approved the baseline.

## 9. Baseline Record

| Field              | Value                                             |
| ------------------ | ------------------------------------------------- |
| Baseline version   | 1.0                                               |
| Baseline scope     | AMX MVP UI/UX                                     |
| Reference folder   | `docs/ui-ux/`                                     |
| Approval authority | Project owner                                     |
| Approval date      | To be recorded                                    |
| Change history     | Record material changes in the project change log |

This document defines the intended baseline. Formal approval should be recorded when the acceptance checklist has been reviewed and the project owner has approved the design set.

## 10. Next SDLC Phase

**Phase 7 — UI/UX Design** is documented. The next phase is **Phase 8 — Implementation**.

Before coding, use the approved requirements, architecture, database/API design, and UI/UX baseline as implementation references. Start with repository setup, development environment configuration, and a small end-to-end vertical slice rather than building every module independently.

# AMX Accessibility Guidelines

**Project:** AMX — Arba Minch Experiences
**Document:** `docs/ui-ux/accessibility-guidelines.md`
**Version:** 1.0

## 1. Purpose

Define accessibility requirements for the AMX public website and administrative dashboard so people with different abilities can navigate pages, understand information, submit inquiries, and complete authorized operational tasks.

**Target standard:** WCAG 2.2 Level AA.

## 2. Core Principles

* **Perceivable:** Information must be available through appropriate text, visual, and assistive-technology alternatives.
* **Operable:** All essential functions must work with a keyboard and other supported input methods.
* **Understandable:** Content, navigation, instructions, and errors must be clear and consistent.
* **Robust:** Use semantic HTML and compatible patterns that work with assistive technologies.

Accessibility must be considered during design, development, and testing—not added only at the end.

## 3. Text, Typography, and Contrast

* Use readable fonts and consistent typography from `design-system.md`.
* Provide sufficient contrast between text and its background:

  * Normal text: at least **4.5:1**.
  * Large text: at least **3:1**.
  * Essential UI component boundaries and visual indicators: generally at least **3:1** against adjacent colors where WCAG requires it.
* Do not use color alone to communicate status or errors.
* Support browser zoom and text resizing without loss of essential content or functionality.
* Use descriptive headings and short paragraphs.
* Avoid text embedded in images when actual text can be used.

## 4. Navigation and Keyboard Access

* All links, buttons, menus, forms, dialogs, and essential controls must be keyboard accessible.
* Provide a logical tab order.
* Display a visible keyboard focus indicator.
* Do not trap keyboard focus except within an active modal dialog, where focus must be managed correctly.
* Provide a skip-to-main-content link.
* Use descriptive link text instead of vague labels such as “Click here.”
* Ensure menus can be opened, navigated, and closed using the keyboard.
* Avoid keyboard shortcuts that conflict with assistive technologies.

## 5. Headings and Page Structure

* Use semantic HTML elements such as `header`, `nav`, `main`, `section`, and `footer` appropriately.
* Give each page a meaningful title.
* Use headings in a logical hierarchy.
* Provide clear labels for major page regions.
* Avoid using headings solely to change text appearance.
* Keep navigation and page structures consistent across the public website and admin dashboard.

## 6. Forms and Validation

Applies to trip inquiries, login, provider management, quotations, bookings, and financial records.

* Every form field must have a persistent, programmatically associated label.
* Clearly identify required fields.
* Explain the expected format for phone numbers, dates, email addresses, and monetary values.
* Do not rely on placeholder text as the only label.
* Show validation errors in text near the relevant field.
* Identify errors clearly and explain how to correct them.
* Preserve valid entered data when validation fails.
* Associate error messages with their fields for assistive technologies.
* Announce important submission results, such as success or failure, appropriately.
* Prevent duplicate submissions and provide clear feedback while a request is processing.
* Use suitable input types and autocomplete attributes where appropriate.

## 7. Images and Media

* Provide meaningful alternative text for informative images.
* Use empty alternative text for purely decorative images.
* Avoid repeating nearby captions unnecessarily in alternative text.
* Provide captions or transcripts for meaningful prerecorded audio and video where applicable.
* Do not convey essential package details, prices, or booking conditions exclusively through images.
* Ensure text placed over photographs remains readable.
* Use only images AMX has permission to publish.

## 8. Buttons, Links, and Touch Targets

* Use buttons for actions and links for navigation.
* Give controls accessible names that describe their purpose.
* Avoid ambiguous icon-only controls unless they have accessible labels.
* Make touch targets at least **24 × 24 CSS pixels**, or provide sufficient spacing, consistent with WCAG 2.2 AA requirements. Prefer larger targets for common mobile actions.
* Ensure adjacent actions, such as “Confirm” and “Cancel,” are distinguishable.
* Do not communicate that an action is available only through hover.
* Make focus and active states visually clear.

## 9. Tables and Data Presentation

* Use semantic table headers and associate them with the relevant data cells.
* Provide clear table captions or accessible names where useful.
* Ensure sorting controls communicate their current state.
* Provide understandable labels for search, filters, pagination, and row actions.
* When tables become cards on mobile, preserve each value's relationship to its field label.
* Do not require horizontal scrolling for information that can reasonably be presented in a simpler layout.
* Ensure financial and booking information remains understandable at increased zoom.

## 10. Dialogs, Notifications, and Statuses

* Give each dialog a descriptive title.
* Move keyboard focus into an opened modal and restore focus when it closes.
* Keep focus inside an active modal until it is closed.
* Allow dialogs to close using an accessible close control and, where appropriate, the Escape key.
* Announce important success messages and errors to assistive technologies.
* Do not communicate inquiry, quotation, booking, provider, or payment status through color alone.
* Pair status colors with text labels or other clear indicators.
* Ask for confirmation before destructive or financially significant actions.
* Explain the consequences of cancellations, refunds, and other irreversible operations.

## 11. Authentication and Security

* Make login fields and authentication errors accessible.
* Do not rely exclusively on visual puzzles or inaccessible authentication methods.
* Support password managers and pasting into password fields.
* Provide accessible session-expiration warnings where practical.
* Allow users to understand and recover from authentication failures without revealing sensitive account information.
* Ensure permission-denied messages explain the situation without exposing protected records.
* Accessibility must never bypass authentication or role-based authorization.

## 12. Motion, Animation, and Focus

* Respect the user's reduced-motion preference.
* Avoid unnecessary flashing, parallax, and continuous animation.
* Do not use flashing content that could trigger seizures.
* Ensure animated menus and dialogs do not interfere with keyboard focus.
* Keep important content available when animations are disabled.
* Do not automatically move focus unexpectedly during routine updates.

## 13. Language and Understandability

* Set the correct page language in the document.
* Identify changes in language when necessary for assistive technologies.
* Use clear English for the initial MVP.
* Design text and layout so Amharic localization can be added later.
* Use consistent terminology for inquiries, quotations, bookings, payments, and cancellations.
* Explain unfamiliar tourism or financial terms where needed.
* Display dates, phone numbers, and ETB monetary values consistently.

## 14. Testing Strategy

Perform accessibility testing throughout implementation.

**Automated checks**

* Use tools such as axe or Lighthouse to identify common accessibility issues.
* Include automated checks in development or continuous integration where practical.

**Manual checks**

* Navigate every critical workflow using only a keyboard.
* Test focus order and focus visibility.
* Check text and component contrast.
* Test forms, errors, dialogs, menus, and status announcements.
* Test at mobile widths and increased zoom.
* Test representative pages with a screen reader.

Automated tools alone cannot confirm full accessibility compliance.

## 15. Critical Workflow Testing

| Workflow            | Accessibility Checks                                  |
| ------------------- | ----------------------------------------------------- |
| Browse experiences  | Headings, images, navigation, readable content        |
| Submit trip inquiry | Labels, required fields, validation, success feedback |
| Staff login         | Keyboard access, labels, authentication errors        |
| Manage inquiries    | Table/card labels, filters, status communication      |
| Create quotation    | Field instructions, monetary values, validation       |
| Confirm booking     | Clear confirmation and status feedback                |
| Verify payment      | Accessible amounts, transaction details, confirmation |
| Cancel or refund    | Understandable consequences and confirmation          |
| Review reports      | Table structure, readable figures, clear labels       |

## 16. Acceptance Criteria

Accessibility work is ready for release when:

* Critical workflows are keyboard operable.
* All form controls have accessible names.
* Errors are identifiable and actionable.
* Required contrast checks pass.
* Focus indicators and modal focus management work correctly.
* Images have appropriate text alternatives.
* Statuses do not rely on color alone.
* Responsive layouts remain usable with zoom and assistive technologies.
* Automated and manual test findings are documented and critical issues are resolved.
* No critical accessibility barrier remains in a core inquiry, booking, or financial workflow.

## 17. Next Step

Create `docs/ui-ux/ui-ux-validation.md` to define the review checklist and acceptance process for the AMX UI/UX design artifacts before establishing the UI/UX baseline.

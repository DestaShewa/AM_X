# AMX Responsive Design Specification

**Project:** AMX — Arba Minch Experiences
**Document:** `docs/ui-ux/responsive-design.md`
**Version:** 1.0

## 1. Purpose

Define how the AMX public website and administrative dashboard adapt to mobile phones, tablets, laptops, and desktop computers while maintaining usability, accessibility, and consistent functionality.

## 2. Design Principles

* Use a mobile-first approach.
* Keep all essential content and actions available at every supported screen size.
* Prioritize inquiry submission and contact actions on the public website.
* Prioritize operational efficiency on the admin dashboard.
* Prevent horizontal page overflow.
* Make forms, tables, navigation, and dialogs usable on touchscreens.
* Preserve permissions and business rules across all device sizes.
* Optimize images, loading performance, and network usage.

## 3. Responsive Breakpoints

| Device Layout | Width             | Design Behavior                                 |
| ------------- | ----------------- | ----------------------------------------------- |
| Small mobile  | Below 375 px      | Compact spacing, single-column layouts          |
| Mobile        | 375–639 px        | Single-column content and mobile navigation     |
| Tablet        | 640–1023 px       | Flexible grids and collapsible admin navigation |
| Desktop       | 1024–1279 px      | Multi-column content and desktop navigation     |
| Large desktop | 1280 px and above | Wider content within a maximum-width container  |

Breakpoints are design guidelines, not assumptions about device type. Components should adapt to the available viewport width.

## 4. Public Website

### 4.1 Header and navigation

**Mobile**

* Display the AMX logo and a menu button.
* Place navigation links inside an accessible collapsible menu.
* Keep “Plan Your Trip” easy to find.
* Close the menu after navigation.

**Tablet**

* Use compact navigation or a menu where space is limited.
* Keep the main call to action visible when practical.

**Desktop**

* Display primary navigation horizontally.
* Use a prominent trip-request button.
* Keep the header consistent across public pages.

### 4.2 Home page

**Mobile**

* Stack the hero text and image.
* Use a readable heading and concise introduction.
* Stack primary and secondary actions when necessary.
* Display experience cards vertically.

**Tablet**

* Use a balanced two-column hero when space allows.
* Display two experience cards per row.

**Desktop**

* Use a spacious hero layout.
* Display two or three experience cards per row, depending on content width.
* Separate sections with consistent vertical spacing.

### 4.3 Experiences and package details

* Scale images proportionally without distortion.
* Use a single-column card layout on narrow screens.
* Use two or three columns on larger screens where appropriate.
* Stack itinerary, inclusions, exclusions, and terms on mobile.
* Use multiple columns for supporting details only when readable.
* Keep price conditions and cancellation information visible and understandable.
* Ensure request buttons are accessible without excessive scrolling.

### 4.4 Inquiry forms

**Mobile**

* Use one field per row.
* Use appropriate mobile keyboards for phone numbers, email, and numeric fields.
* Make labels and validation errors easy to read.
* Use touch-friendly inputs and buttons.
* Preserve entered values when validation fails.

**Tablet and desktop**

* Use two columns for independent fields when this improves completion speed.
* Keep related fields grouped.
* Avoid excessively wide input fields.
* Keep the form submission action clearly visible.

The form must not become more difficult to complete merely because the viewport is small.

## 5. Admin Dashboard

### 5.1 Navigation and page layout

**Mobile**

* Replace the persistent sidebar with an accessible drawer.
* Show a compact top bar with page title and account controls.
* Stack dashboard summaries vertically.
* Use compact page headings and clear primary actions.

**Tablet**

* Support a collapsible sidebar.
* Allow content to use additional columns when available.
* Keep navigation from reducing table and form usability.

**Desktop**

* Use a persistent sidebar.
* Display page title, breadcrumbs, and primary actions consistently.
* Use the available content width for tables, forms, and dashboards.

### 5.2 Dashboard summaries

* Display summary cards in one column on narrow mobile screens.
* Use two columns on larger mobile or tablet screens when readable.
* Use three or four columns on desktop where appropriate.
* Keep financial summaries visible only to authorized staff.
* Avoid displaying too many metrics at once on small screens.

### 5.3 Data tables

Administrative tables must remain usable on narrow screens.

Preferred behavior, in order:

1. Use a compact record-card layout for highly detailed records.
2. Hide only nonessential columns when the same information remains accessible in record details.
3. Use controlled horizontal scrolling when a tabular comparison is important.
4. Keep critical identifiers, statuses, and actions accessible.

Tables must retain meaningful labels, readable values, and keyboard accessibility. Do not shrink text excessively to fit every column.

### 5.4 Forms and dialogs

* Stack fields vertically on mobile.
* Allow dialogs to expand to nearly the full available width on small screens.
* Ensure dialog content can scroll without hiding important actions.
* Keep confirm and cancel buttons distinguishable.
* Prevent background interaction while a modal dialog is active.
* Ensure sensitive actions, including payment verification and cancellation, remain clearly explained.

## 6. Responsive Tables by Data Type

| Data Type  | Mobile Behavior                            | Desktop Behavior                        |
| ---------- | ------------------------------------------ | --------------------------------------- |
| Inquiries  | Compact customer cards or key-column table | Searchable, filterable table            |
| Customers  | Name, phone, and primary action            | Full customer list with filters         |
| Providers  | Name, services, verification status        | Detailed provider table                 |
| Quotations | Customer, total, status, expiry            | Full quotation table                    |
| Bookings   | Booking number, date, status               | Detailed booking table                  |
| Payments   | Amount, transaction type, status           | Financial table with authorized filters |
| Audit logs | Key event details with record view         | Searchable audit table                  |

## 7. Images and Media

* Use responsive image sizes appropriate to the rendered layout.
* Prefer modern optimized formats such as WebP or AVIF when supported.
* Specify image dimensions or aspect ratios to reduce layout shifts.
* Lazy-load below-the-fold images where appropriate.
* Avoid large autoplaying videos in the initial MVP.
* Provide descriptive alternative text for meaningful images.
* Maintain image quality without unnecessarily increasing mobile data use.

## 8. Performance Requirements

* Avoid loading unnecessary JavaScript or large media on mobile.
* Load only the components required by the current page.
* Paginate large administrative datasets on the server.
* Use appropriate loading indicators and prevent duplicate submissions.
* Handle slow or interrupted network connections gracefully.
* Test performance on representative low-bandwidth connections.

The UI should align with the system's existing performance objective of normal operations completing within two seconds, excluding external-service and network delays. Actual performance must be measured during testing.

## 9. Accessibility Requirements

* Support keyboard navigation at every viewport size.
* Maintain visible focus indicators.
* Use readable text sizes and sufficient contrast.
* Provide labels for all form controls.
* Ensure touch targets are comfortably sized.
* Support browser zoom and enlarged text.
* Avoid fixed elements that obscure content.
* Ensure menus and dialogs work with assistive technologies.
* Do not use color alone to communicate status.
* Respect reduced-motion preferences.

## 10. Responsive Testing Matrix

| Test                              | Mobile   | Tablet   | Desktop  |
| --------------------------------- | -------- | -------- | -------- |
| Navigation and menus              | Required | Required | Required |
| Inquiry form validation           | Required | Required | Required |
| Experience cards and images       | Required | Required | Required |
| Login and session handling        | Required | Required | Required |
| Dashboard summaries               | Required | Required | Required |
| Tables and filters                | Required | Required | Required |
| Booking and quotation workflows   | Required | Required | Required |
| Payment verification permissions  | Required | Required | Required |
| Dialogs and notifications         | Required | Required | Required |
| Keyboard and accessibility checks | Required | Required | Required |

Also test narrow widths, landscape orientation, zoom, slow connections, and long text.

## 11. Implementation Guidance

* Use CSS Grid and Flexbox for adaptive layouts.
* Use shared Tailwind CSS breakpoints and reusable responsive components.
* Avoid fixed widths where fluid sizing is appropriate.
* Use consistent container widths and spacing tokens from `design-system.md`.
* Test actual content, not just empty placeholder layouts.
* Ensure responsive styling never changes backend authorization or business logic.

## 12. Acceptance Criteria

Responsive design is complete when:

* Public pages work at all specified viewport sizes.
* Inquiry forms can be completed on mobile without unnecessary scrolling or horizontal overflow.
* Admin navigation and records remain usable on small screens.
* Booking and financial actions remain clear and secure.
* Images and layouts adapt without distortion.
* Accessibility checks pass at supported sizes.
* Performance is measured and issues are recorded.
* All critical workflows pass responsive testing.

## 13. Next Step

Create `docs/ui-ux/accessibility-guidelines.md` to define the detailed accessibility standards for navigation, forms, dialogs, tables, images, and status communication across the AMX system.

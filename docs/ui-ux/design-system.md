# AMX Design System

**Project:** AMX — Arba Minch Experiences
**Document:** `docs/ui-ux/design-system.md`
**Version:** 1.0

## 1. Purpose

Define consistent visual styles, reusable components, typography, spacing, interaction states, and accessibility standards for the AMX public website and administrative dashboard.

## 2. Design Direction

**Brand personality:** Trustworthy, welcoming, locally grounded, professional, and experience-focused.

The interface should combine the beauty of Arba Minch and its surrounding landscapes with the clarity and reliability of a professional travel-coordination service.

Design principles:

* Use authentic local imagery.
* Prioritize readability and clear calls to action.
* Keep layouts clean and uncluttered.
* Use consistent components across all pages.
* Make pricing, inclusions, and booking conditions easy to understand.
* Keep the admin dashboard functional rather than decorative.
* Avoid unsupported claims about provider verification or customer reviews.

## 3. Color Palette

Use a nature-inspired palette that reflects the lakes, landscapes, and welcoming atmosphere of Arba Minch.

| Token           | Hex       | Usage                                  |
| --------------- | --------- | -------------------------------------- |
| Primary         | `#176B57` | Main buttons, links, active navigation |
| Primary Hover   | `#105343` | Hover and pressed states               |
| Primary Light   | `#E8F3EF` | Subtle highlighted backgrounds         |
| Secondary       | `#D9A441` | Small accents and highlights           |
| Secondary Light | `#FBF2DD` | Informational accent backgrounds       |
| Background      | `#FFFFFF` | Main page background                   |
| Surface         | `#F7F8F6` | Cards and secondary sections           |
| Text Primary    | `#202923` | Main text and headings                 |
| Text Secondary  | `#5F6B63` | Supporting text                        |
| Border          | `#DDE3DE` | Dividers, input borders, card borders  |
| Success         | `#237A45` | Successful actions and completion      |
| Warning         | `#946200` | Warnings and attention-required states |
| Danger          | `#B42318` | Errors, rejection, destructive actions |
| Info            | `#175CD3` | Informational messages                 |

**Rules:**

* Use primary green for important actions and selected navigation.
* Use gold sparingly for accents, not large blocks of text.
* Use semantic colors consistently.
* Check text and control contrast before release.
* Never communicate status through color alone.

## 4. Typography

Use **Inter** as the preferred interface typeface, with a system sans-serif fallback.

| Style      | Desktop Size | Weight | Usage                               |
| ---------- | -----------: | -----: | ----------------------------------- |
| Display    |        48 px |    700 | Home-page hero                      |
| H1         |        36 px |    700 | Main page heading                   |
| H2         |        28 px |    600 | Major section headings              |
| H3         |        22 px |    600 | Subsections and card headings       |
| H4         |        18 px |    600 | Small section headings              |
| Body Large |        18 px |    400 | Hero descriptions and introductions |
| Body       |        16 px |    400 | Main body text                      |
| Body Small |        14 px |    400 | Supporting information              |
| Caption    |        12 px |    400 | Secondary metadata                  |
| Button     |     14–16 px |    600 | Interactive actions                 |

### Typography rules

* Use sentence case for most headings and buttons.
* Keep paragraphs short and readable.
* Use consistent line height, generally 1.5 for body text.
* Use tabular numerals for financial totals and data tables where supported.
* Reduce display and heading sizes on mobile.
* Avoid using small text for important pricing, cancellation, or safety information.

## 5. Spacing System

Use a base spacing unit of 4 px.

| Token      | Value | Usage                         |
| ---------- | ----: | ----------------------------- |
| `space-1`  |  4 px | Small icon/text gaps          |
| `space-2`  |  8 px | Compact component spacing     |
| `space-3`  | 12 px | Form field internals          |
| `space-4`  | 16 px | Standard component gaps       |
| `space-6`  | 24 px | Card padding and section gaps |
| `space-8`  | 32 px | Larger content separation     |
| `space-12` | 48 px | Section spacing               |
| `space-16` | 64 px | Large section separation      |
| `space-20` | 80 px | Major desktop section spacing |

Use smaller spacing on mobile where appropriate while preserving readability and touch targets.

## 6. Layout and Containers

* Use a centered content container with a maximum width around 1200 px.
* Use responsive grids for experiences and provider cards.
* Use a consistent page-header pattern.
* Align content to a shared spacing grid.
* Keep forms at a readable width rather than stretching them across large screens.
* Use a persistent sidebar for desktop administration and a drawer on smaller screens.

### Suggested responsive breakpoints

| Breakpoint |             Width | Behavior                                       |
| ---------- | ----------------: | ---------------------------------------------- |
| Mobile     |      Below 640 px | Single-column content and compact navigation   |
| Tablet     |       640–1023 px | Flexible grids and collapsible admin sidebar   |
| Desktop    | 1024 px and above | Multi-column layouts and full admin navigation |

These breakpoints are initial design standards and may be adjusted to suit actual components.

## 7. Buttons

### Variants

* **Primary:** Main action, such as “Plan Your Trip.”
* **Secondary:** Supporting action, such as “Explore Experiences.”
* **Outline:** Lower-priority action.
* **Ghost:** Navigation and lightweight actions.
* **Danger:** Destructive or irreversible action.

### Sizes

* Small: 32 px minimum height.
* Medium: 40 px minimum height.
* Large: 48 px minimum height.

Interactive targets should generally be at least 44 × 44 CSS pixels where practical.

### Button states

Every button must support applicable:

* Default
* Hover
* Focus-visible
* Pressed
* Disabled
* Loading

Use clear action labels. Avoid vague labels such as “Submit” when a more specific label, such as “Send Inquiry,” improves understanding.

## 8. Cards

Use cards for experiences, providers, dashboard summaries, and grouped content.

**Standard card structure:**

1. Image or optional icon.
2. Title.
3. Short description.
4. Relevant metadata.
5. Price or status where appropriate.
6. Clear action.

### Card styling

* Background: white.
* Border: `1px solid #DDE3DE`.
* Border radius: 12 px.
* Padding: 16–24 px.
* Shadow: subtle and used only when it improves hierarchy.

Avoid excessive shadows, unnecessary decoration, and inconsistent card heights in the same grid.

## 9. Forms and Inputs

Form components include:

* Text input
* Email input
* Phone input
* Date picker
* Number input
* Select
* Checkbox
* Radio group
* Text area
* File upload where required and approved

Each form field must include:

* Visible label.
* Required or optional indication.
* Helpful instructions when necessary.
* Clear validation feedback.
* Appropriate keyboard and mobile input behavior.

### Input states

* Default
* Focus
* Filled
* Invalid
* Disabled
* Read-only
* Loading, when relevant

Show errors beside the relevant field and provide a form-level summary when multiple errors make it helpful.

Never rely on placeholder text as the only field label.

## 10. Status Badges

Use text labels with consistent semantic styling.

| Status Type            | Example                   | Appearance    |
| ---------------------- | ------------------------- | ------------- |
| New or pending         | New, Pending              | Neutral       |
| In progress            | Contacted, Investigating  | Informational |
| Confirmed or completed | Confirmed, Completed      | Success       |
| Attention required     | Action Required, Expiring | Warning       |
| Declined or failed     | Rejected, Failed          | Danger        |
| Inactive               | Inactive, Archived        | Neutral       |

Badge colors must be paired with readable text and sufficient contrast. Use the actual business status; never infer a status from color or appearance.

## 11. Navigation

### Public website

* Clear horizontal navigation on desktop.
* Collapsible menu on mobile.
* One prominent primary action.
* Consistent active and focus states.
* Footer links for contact and legal pages.

### Admin dashboard

* Sidebar navigation on desktop.
* Drawer navigation on mobile and smaller tablets.
* Breadcrumbs for nested pages.
* Clear page title and primary action.
* Navigation items shown according to staff permissions.

Backend authorization remains mandatory regardless of what the navigation displays.

## 12. Tables and Data Display

Administrative tables should provide:

* Clear column headings.
* Search and filtering when useful.
* Pagination for large result sets.
* Consistent date, amount, and status formats.
* Empty and loading states.
* Row actions with understandable labels.
* Responsive behavior on narrow screens.

For financial information, align amounts consistently and display `ETB` explicitly. Avoid ambiguous totals and distinguish amount due, verified payments, refunds, and outstanding balance.

## 13. Dialogs and Notifications

### Dialogs

Use dialogs for focused tasks and confirmation of sensitive actions. Include a descriptive title, concise explanation, and clearly labeled actions.

### Notifications

* Success: Confirm what happened.
* Error: Explain the issue and how to recover.
* Warning: Explain the risk or action needed.
* Information: Provide relevant context.

Do not show success messages until the server confirms the operation. Important errors must remain available long enough to be read.

## 14. Iconography and Imagery

* Use one consistent icon family, such as Lucide.
* Use icons alongside text for important actions.
* Decorative icons must not compete with primary content.
* Use authentic, relevant Arba Minch imagery with permission to use it.
* Optimize image size and use appropriate responsive image variants.
* Provide meaningful alternative text for informative images.
* Use empty image placeholders when approved imagery is unavailable; do not present unrelated imagery as a real AMX experience.

## 15. Accessibility

* Target WCAG 2.2 Level AA as the accessibility goal.
* Maintain sufficient color contrast.
* Support keyboard navigation and visible focus.
* Associate inputs with accessible labels.
* Provide meaningful alternative text.
* Make errors identifiable without relying on color.
* Respect reduced-motion preferences.
* Ensure dialogs, menus, and forms are usable with assistive technology.
* Test layouts at zoomed text sizes and on small screens.

## 16. Motion and Transitions

* Use subtle transitions for menus, hover states, and dialog appearance.
* Keep animation brief and functional.
* Avoid motion that delays important actions.
* Respect reduced-motion preferences.
* Do not use animation as the only indicator of status or change.

## 17. Dark Mode

Dark mode is not required for the initial MVP. The design tokens should be structured so a dark theme can be added later without redesigning every component.

## 18. Implementation Standards

* Implement design tokens as shared CSS variables or Tailwind theme values.
* Build reusable components instead of duplicating styles.
* Keep public and admin visual patterns consistent where appropriate.
* Separate business logic from visual presentation.
* Test components across supported browsers and responsive sizes.
* Avoid hardcoding repeated colors, spacing, and typography values in individual components.

## 19. Acceptance Criteria

The design system is ready for implementation when:

* Colors, typography, spacing, and breakpoints are documented.
* Reusable component variants and interaction states are defined.
* Accessibility requirements are included.
* Financial and operational statuses use consistent visual rules.
* Public and admin interfaces share the same foundational tokens.
* The system is aligned with the approved wireframes and responsive requirements.

## 20. Next Step

Create `docs/ui-ux/responsive-design.md` to specify how the AMX public website and admin dashboard adapt across mobile, tablet, and desktop layouts.

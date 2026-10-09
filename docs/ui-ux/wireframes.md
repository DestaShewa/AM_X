# AMX Wireframes

**Project:** AMX — Arba Minch Experiences
**Document:** `docs/ui-ux/wireframes.md`
**Version:** 1.0

## 1. Purpose

Define the low-fidelity layouts, content hierarchy, components, and interactions for the AMX public website and admin dashboard before detailed visual design and frontend implementation.

## 2. Wireframe Principles

* Prioritize content clarity and the next user action.
* Use responsive, mobile-first layouts.
* Keep inquiry forms simple and easy to complete.
* Make prices, inclusions, exclusions, and terms clear.
* Keep inquiry, quotation, booking, and payment records distinct.
* Show operational statuses consistently.
* Enforce permissions for sensitive administrative actions.
* Include loading, empty, error, success, and confirmation states.

## 3. Public Website Wireframes

### 3.1 Home Page

```text
+--------------------------------------------------+
| AMX LOGO        Experiences  How It Works  About |
|                                      Contact     |
+--------------------------------------------------+
|                                                  |
|  Discover Arba Minch with Local Experiences      |
|  Verified local providers. Clear quotations.    |
|  Support throughout your trip.                  |
|                                                  |
|  [Explore Experiences]  [Plan Your Trip]         |
|                                                  |
|             HERO IMAGE                           |
+--------------------------------------------------+
|             FEATURED EXPERIENCES                 |
|  +---------------+  +---------------+            |
|  | Lake Chamo    |  | Dorze + Lake  |            |
|  | Image         |  | Image         |            |
|  | Highlights    |  | Highlights    |            |
|  | [View Details]|  | [View Details]|            |
|  +---------------+  +---------------+            |
+--------------------------------------------------+
|                 HOW AMX WORKS                    |
|  1. Tell us  →  2. Get a quote  →  3. Enjoy trip |
+--------------------------------------------------+
| Why AMX? | Local Experiences | Custom Trips      |
+--------------------------------------------------+
| Contact | WhatsApp | Terms | Privacy             |
+--------------------------------------------------+
```

**Primary action:** Explore Experiences or Plan Your Trip.

**Mobile behavior:** Stack experience cards vertically, collapse navigation, and keep the trip-request action easy to find.

### 3.2 Experiences Listing

```text
+--------------------------------------------------+
| HEADER                                           |
+--------------------------------------------------+
| Explore Arba Minch Experiences                   |
| Find an experience that fits your interests.     |
+--------------------------------------------------+
| [Category Filter] [Duration Filter]              |
|                                                  |
| +----------------------+  +--------------------+ |
| | Experience Image     |  | Experience Image   | |
| | Lake Chamo           |  | Dorze + Lake Chamo | |
| | Highlights           |  | Highlights          | |
| | Duration             |  | Duration            | |
| | Starting price*      |  | Starting price*     | |
| | [View Details]       |  | [View Details]      | |
| +----------------------+  +--------------------+ |
|                                                  |
| Can't find your trip? [Request a Custom Trip]     |
+--------------------------------------------------+
| FOOTER                                           |
+--------------------------------------------------+
```

*Display a starting price only when the pricing basis and conditions are confirmed.

### 3.3 Package Details

```text
+--------------------------------------------------+
| HEADER                                           |
+--------------------------------------------------+
| Home > Experiences > Lake Chamo                  |
|                                                  |
| Lake Chamo Experience                            |
| +----------------------------------------------+ |
| |                                              | |
| |                PHOTO GALLERY                 | |
| |                                              | |
| +----------------------------------------------+ |
| Duration: [Confirmed duration]                   |
| Price: [Confirmed price or request a quotation]  |
|                                                  |
| [Request This Experience]                        |
+--------------------------------------------------+
| Overview                                         |
| Highlights                                      |
| Itinerary                                       |
| What's Included                                 |
| What's Excluded                                 |
| Important Information                           |
| Cancellation Terms                              |
+--------------------------------------------------+
| Questions? [Contact AMX]                         |
+--------------------------------------------------+
```

**Interaction:** The request button opens the inquiry form with the selected package prefilled.

### 3.4 Custom Trip Request Form

```text
+--------------------------------------------------+
| HEADER                                           |
+--------------------------------------------------+
| Plan Your Arba Minch Experience                  |
| Tell us what you need. We'll contact you to      |
| discuss availability and prepare a quotation.    |
+--------------------------------------------------+
| CONTACT                                          |
| Full Name*          [________________________]   |
| Phone/WhatsApp*     [________________________]   |
| Email               [________________________]   |
|                                                  |
| TRIP DETAILS                                     |
| Travel Date*       [__________]                  |
| Number of Travelers* [____]                      |
| Number of Days      [____]                       |
| Arrival Location    [________________________]   |
|                                                  |
| PREFERENCES                                      |
| Budget              [________________________]   |
| Interests           [ ] Nature [ ] Culture       |
|                     [ ] Wildlife [ ] Other       |
| Accommodation       [________________________]   |
| Transport Needs     [________________________]   |
| Special Requests    [________________________]   |
|                                                  |
| [ ] I have read the Privacy Policy               |
|                                                  |
|              [Submit Inquiry]                    |
+--------------------------------------------------+
```

**Required states:**

* Inline validation for missing or invalid information.
* Submission progress indicator.
* Success confirmation with next steps.
* Clear error message and safe retry behavior.
* Duplicate-submission prevention.

## 4. Admin Dashboard Wireframes

### 4.1 Staff Login

```text
+--------------------------------------------------+
|                     AMX                          |
|              Staff Administration                |
|                                                  |
| Email / Username                                 |
| [____________________________________________]   |
|                                                  |
| Password                                         |
| [____________________________________________]   |
|                                                  |
|                 [Sign In]                        |
|                                                  |
|         Secure access for authorized staff       |
+--------------------------------------------------+
```

Do not reveal whether an individual account exists when login fails.

### 4.2 Dashboard Overview

```text
+------------------+--------------------------------+
| AMX              | Search              Account    |
+------------------+--------------------------------+
| Dashboard        | Dashboard Overview             |
| Inquiries        |                                |
| Quotations       | +----------+ +---------------+ |
| Bookings         | | New      | | Upcoming      | |
| Customers        | | Inquiries| | Bookings      | |
| Providers        | +----------+ +---------------+ |
| Packages         |                                |
| Finance          | +----------+ +---------------+ |
| Follow-ups       | | Pending  | | Outstanding   | |
| Reviews/Complaints| | Follow-ups| | Balances*    | |
| Reports          | +----------+ +---------------+ |
| Users and Roles  |                                |
| Audit Logs       | Recent Inquiries               |
|                  | +----------------------------+ |
|                  | | Customer | Date | Status   | |
|                  | +----------------------------+ |
|                  | Upcoming Bookings              |
|                  | +----------------------------+ |
|                  | | Booking | Date | Status    | |
|                  | +----------------------------+ |
+------------------+--------------------------------+
```

*Financial summary visibility depends on the staff member's permissions.

### 4.3 Inquiry List

```text
+--------------------------------------------------+
| Inquiries                       [+ New Inquiry]   |
|                                                  |
| [Search customer/phone] [Status v] [Date v]      |
|                                                  |
| +----------------------------------------------+ |
| | Customer | Travel Date | Status | Assigned   | |
| |----------|-------------|--------|------------| |
| | A. User  | 12 Nov      | New    | Unassigned | |
| | B. User  | 15 Nov      | Contacted | Staff 1 | |
| +----------------------------------------------+ |
|             [Previous] [1] [Next]                |
+--------------------------------------------------+
```

**Row action:** Open inquiry details.

### 4.4 Inquiry Details

```text
+--------------------------------------------------+
| Inquiries > Inquiry Details                      |
|                                                  |
| Customer: [Customer Name]                        |
| Phone: [Phone]        [Contact Customer]         |
| Travel Date: [Date]                              |
| Travelers: [Number]                              |
| Budget: [Budget]                                 |
| Interests: [Interests]                           |
|                                                  |
| Inquiry Status: [Provider Checking v]            |
| Assigned Staff: [Staff Member v]                 |
|                                                  |
| Customer Requirements                            |
| [____________________________________________]   |
|                                                  |
| Communication / Follow-up History                |
| [Timeline of notes and actions]                  |
|                                                  |
| [Save Changes] [Create Quotation] [Add Follow-up]|
+--------------------------------------------------+
```

Only valid status transitions should be available. Sensitive changes must be audited.

### 4.5 Quotation Editor

```text
+--------------------------------------------------+
| Quotations > Create Quotation                    |
|                                                  |
| Inquiry: [Select Inquiry v]                      |
| Customer: [Linked Customer]                      |
| Travel Dates: [Start] - [End]                    |
| Travelers: [Number]                              |
|                                                  |
| SERVICES                                         |
| +----------------------------------------------+ |
| | Service | Provider | Qty | Unit Price | Total| |
| |---------|----------|-----|------------|------| |
| | [Select]| [Select] | [ ] | [________] | Auto | |
| +----------------------------------------------+ |
|                   [+ Add Service]                |
|                                                  |
| Subtotal:                  [Calculated amount]   |
| Other Charges:             [___________]         |
| Total:                     [Calculated amount]   |
|                                                  |
| Inclusions:             [____________________]   |
| Exclusions:             [____________________]   |
| Terms / Cancellation:   [____________________]   |
| Expiry Date:            [__________]             |
|                                                  |
| [Save Draft] [Preview] [Send Quotation]          |
+--------------------------------------------------+
```

**Rules:** Totals are calculated and validated by the backend. Preserve quotation revisions and record sending and acceptance events.

### 4.6 Booking Details

```text
+--------------------------------------------------+
| Bookings > Booking Details                       |
|                                                  |
| Booking Number: [AMX-BOOKING-NUMBER]             |
| Status: [Confirmed]                              |
| Customer: [Customer Name]                        |
| Travel Dates: [Dates]                            |
| Travelers: [Number]                              |
|                                                  |
| Accepted Quotation                               |
| Price Snapshot | Services | Terms                |
|                                                  |
| BOOKING SERVICES                                 |
| +----------------------------------------------+ |
| | Service | Provider | Date | Status | Action | |
| +----------------------------------------------+ |
|                                                  |
| FINANCIAL SUMMARY*                               |
| Amount Due | Verified Payments | Refunds         |
| Outstanding Balance                              |
|                                                  |
| Follow-ups | Notes | Audit History               |
|                                                  |
| [Update Status] [Manage Services] [Record Trip]  |
+--------------------------------------------------+
```

*Show financial information only to authorized staff. Payment actions must follow the approved role permissions.

### 4.7 Payment Transaction Verification

```text
+--------------------------------------------------+
| Finance > Transaction Details                    |
|                                                  |
| Booking Number: [Booking Number]                 |
| Transaction Type: [Payment / Refund / Adjustment]|
| Amount: [Amount] ETB                             |
| Method: [Method]                                 |
| Reference: [Reference Number]                    |
| Transaction Date: [Date]                         |
| Evidence / Notes: [Available details]            |
|                                                  |
| Status: [Submitted]                              |
|                                                  |
| Decision Notes: [____________________________]   |
|                                                  |
| [Verify Transaction] [Reject Transaction]        |
+--------------------------------------------------+
```

**Rules:** Only authorized staff can verify or reject transactions. A verified transaction triggers a consistent financial-summary recalculation and audit record.

## 5. Shared Component Wireframes

### Experience Card

```text
+-----------------------------+
|         EXPERIENCE IMAGE    |
| Experience Name              |
| Short description            |
| Duration | Key highlight     |
| Starting price, if confirmed |
| [View Details]               |
+-----------------------------+
```

### Status Indicator

```text
+------------------------------+
| Record: [Booking / Inquiry]  |
| Status: [Current Status]     |
| Next action: [Valid Action]  |
+------------------------------+
```

Status labels must always include readable text; color alone must not communicate meaning.

### Confirmation Dialog

```text
+------------------------------------------+
| Confirm Action                           |
|                                          |
| Are you sure you want to continue?       |
| This action may affect a booking or      |
| financial record.                        |
|                                          |
| [Cancel]                    [Confirm]    |
+------------------------------------------+
```

Use confirmation dialogs for sensitive actions, including cancellation, financial verification, refund recording, and permission changes.

## 6. Responsive Layout Rules

### Mobile

* Single-column page content.
* Collapsible public navigation.
* Forms use full-width inputs.
* Experience cards stack vertically.
* Admin navigation becomes a drawer.
* Wide tables become compact record cards or controlled horizontal scrolling.
* Primary actions remain visible and easy to tap.

### Tablet

* Flexible two-column public layouts.
* Collapsible dashboard navigation.
* Tables retain key columns and allow scrolling where needed.

### Desktop

* Wider content area.
* Multi-column experience cards.
* Persistent admin sidebar.
* Tables with search, filtering, and pagination.
* Related information grouped into clear sections.

## 7. Accessibility and Interaction Requirements

* Every input has a visible label.
* Keyboard users can access navigation, forms, dialogs, and tables.
* Focus states are visible.
* Text and controls have sufficient contrast.
* Errors explain how to correct the problem.
* Loading states prevent accidental duplicate submissions.
* Success and failure messages are understandable.
* Dialogs manage focus correctly and support keyboard interaction.
* Dates, currency, and status labels use consistent formats.

## 8. Wireframe Priorities

**First:** Home, experience listing, package details, inquiry form, staff login, dashboard, inquiry list/details, quotation editor, booking details, and payment verification.

**Second:** Provider and package administration, follow-ups, reviews, complaints, reports, users/roles, and audit logs.

## 9. Acceptance Criteria

The wireframes are ready for visual design when:

* Every Priority 1 screen has a defined layout.
* Main user journeys can be completed without unclear navigation.
* Required fields and actions are identified.
* Loading, empty, error, success, and confirmation states are addressed.
* Responsive and accessibility rules are included.
* Financial and booking operations reflect the documented business rules.
* Screens respect the intended permission model.

## 10. Next Step

Create `docs/ui-ux/design-system.md` to define the visual foundations and reusable UI standards used across all AMX screens.

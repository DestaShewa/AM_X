# AMX Information Architecture

**Project:** AMX — Arba Minch Experiences
**Document:** `docs/ui-ux/information-architecture.md`
**Version:** 1.0

## 1. Purpose

Define the organization of AMX website pages, navigation, content, and administrative modules so visitors can discover experiences easily and staff can manage daily operations efficiently.

## 2. Main System Structure

AMX has two main interfaces:

1. **Public Website** — for visitors exploring experiences and submitting trip inquiries.
2. **Admin Dashboard** — for authorized staff managing customers, providers, quotations, bookings, and operations.

## 3. Public Website Sitemap

```text
AMX Public Website
├── Home
├── Experiences
│   ├── All Experiences
│   ├── Lake Chamo Experience
│   ├── Dorze + Lake Chamo
│   └── Package Details
├── Plan a Custom Trip
│   └── Custom Trip Request Form
├── Local Providers
│   └── Provider Profile
├── How It Works
├── About AMX
├── Contact
│   ├── Contact Form
│   └── WhatsApp Contact
└── Legal
    ├── Terms and Conditions
    ├── Cancellation Policy
    └── Privacy Policy
```

### Primary navigation

* Home
* Experiences
* Custom Trip
* How It Works
* About
* Contact

**Primary call to action:** Plan Your Trip

**Secondary call to action:** Explore Experiences

On mobile, use a compact navigation menu with a clearly visible trip-request action.

## 4. Public Page Content Hierarchy

### Home

1. Hero section with a clear value proposition.
2. Featured experiences.
3. How AMX works.
4. Benefits of booking with local coordination.
5. Local experience highlights.
6. Customer testimonials only when genuine and authorized.
7. Custom-trip call to action.
8. Contact and footer.

### Experiences listing

1. Page heading and introduction.
2. Available experience cards.
3. Key details: duration, highlights, starting price if confirmed.
4. Filters or categories if useful.
5. Custom-trip alternative.
6. Contact call to action.

### Package details

1. Experience title and photography.
2. Overview and highlights.
3. Duration and itinerary.
4. Inclusions and exclusions.
5. Price and pricing conditions.
6. Important travel information.
7. Cancellation terms.
8. Request-this-experience button.

### Custom-trip request

1. Short explanation of the process.
2. Contact information.
3. Travel dates and duration.
4. Number of travelers.
5. Budget and interests.
6. Arrival location and accommodation details, where relevant.
7. Transport and special requirements.
8. Privacy notice and submission button.
9. Confirmation after successful submission.

### Contact

1. Contact details.
2. WhatsApp action.
3. Email and phone, where available.
4. Contact form.
5. Operating information, if confirmed.

## 5. Admin Dashboard Sitemap

```text
AMX Admin Dashboard
├── Authentication
│   ├── Login
│   └── Account / Session Handling
├── Dashboard Overview
├── Inquiries
│   ├── Inquiry List
│   ├── Inquiry Details
│   └── Follow-up History
├── Customers
│   ├── Customer List
│   └── Customer Details
├── Providers
│   ├── Provider List
│   ├── Provider Details
│   └── Verification Management
├── Packages
│   ├── Package List
│   ├── Create / Edit Package
│   └── Package Details
├── Quotations
│   ├── Quotation List
│   ├── Create / Edit Quotation
│   └── Quotation Details and Revisions
├── Bookings
│   ├── Booking List
│   ├── Booking Details
│   ├── Booking Services
│   └── Trip Completion
├── Finance
│   ├── Payment Transactions
│   ├── Transaction Details
│   ├── Payment Verification
│   └── Refund / Adjustment Records
├── Follow-ups
├── Reviews and Complaints
├── Reports
├── Staff Users and Roles
├── Audit Logs
└── Account Menu
    ├── Profile
    └── Logout
```

## 6. Admin Navigation

Use a persistent sidebar on desktop and a collapsible navigation drawer on smaller screens.

Recommended sidebar order:

1. Dashboard
2. Inquiries
3. Quotations
4. Bookings
5. Customers
6. Providers
7. Packages
8. Finance
9. Follow-ups
10. Reviews and Complaints
11. Reports
12. Users and Roles
13. Audit Logs

The sidebar and available actions must reflect each staff member's permissions.

## 7. Content and Data Relationships

The main operational journey is:

```text
Customer
   ↓
Inquiry
   ↓
Quotation and Revisions
   ↓
Accepted Quotation
   ↓
Booking
   ├── Booking Services
   ├── Payment Transactions
   ├── Follow-ups
   ├── Reviews
   └── Complaints
```

A customer may have multiple inquiries. An inquiry may have multiple quotation revisions. An accepted quotation can create at most one booking. A booking may have multiple service assignments and financial transactions.

## 8. Global Interface Elements

### Public website

* Header and primary navigation
* Footer and legal links
* Contact and WhatsApp actions
* Responsive page container
* Consistent buttons and forms

### Admin dashboard

* Sidebar navigation
* Top bar and account menu
* Breadcrumbs
* Page title and primary action
* Search, filters, and pagination where needed
* Status indicators
* Confirmation dialogs for sensitive actions
* Success and error notifications

## 9. Search and Filtering

Prioritize search and filters for:

* Inquiries: status, travel date, creation date, assigned staff.
* Customers: name and phone number.
* Providers: verification status and service type.
* Quotations: status, customer, and expiry date.
* Bookings: booking number, status, and travel date.
* Payments: booking, transaction status, and transaction date.
* Follow-ups: due date, completion status, and assigned staff.

Search results must respect backend authorization and must not expose unauthorized records.

## 10. Responsive Behavior

* **Mobile:** Single-column content, compact navigation, large touch targets, simple inquiry forms.
* **Tablet:** Flexible grids and collapsible admin navigation.
* **Desktop:** Wider content layouts, multi-column dashboards, and data tables.

On small screens, administrative tables should support responsive layouts or controlled horizontal scrolling.

## 11. Information Architecture Rules

* Keep public navigation simple and focused on planning a trip.
* Make the next action obvious on every important page.
* Keep inquiry, quotation, and booking records distinct.
* Display status, ownership, and key dates consistently.
* Separate financial transactions from booking payment summaries.
* Hide unauthorized navigation items, while enforcing permissions on the backend.
* Use clear labels rather than technical database terminology.
* Never publish provider contact details or verification claims without authorization.

## 12. Next Step

Create `docs/ui-ux/screen-inventory.md` to list every public and admin screen, its purpose, users, key components, actions, and required states before beginning wireframes.

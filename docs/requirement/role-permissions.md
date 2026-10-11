# AMX Roles and Permissions

## 1. MVP Roles

The MVP uses two system roles:

1. Visitor
2. Administrator

Providers do not receive system accounts in the MVP.

## 2. Visitor

### Can:

* View public pages.
* View packages.
* View provider information approved for public display.
* Submit an inquiry.
* Contact AMX.
* Receive quotation information through AMX communication.
* Provide feedback.

### Cannot:

* Access the administration dashboard.
* View other customers.
* Modify provider records.
* Modify packages.
* View internal financial information.

## 3. Administrator

### Can:

* Authenticate into the admin system.
* Manage inquiries.
* Manage customers.
* Manage providers.
* Manage packages.
* Manage quotations.
* Manage bookings.
* Record payments.
* Manage follow-ups.
* Manage reviews and complaints.
* View operational reports.
* Manage relevant system settings.

## 4. Provider

### MVP Access

No direct system account.

### Communication

* Phone
* WhatsApp
* Email
* Other agreed communication methods

### Future

A provider portal may be considered after the MVP has validated the business model.

## 5. Permission Principle

The system shall follow the principle of least privilege:

> Users should only access information and actions required for their responsibilities.

## 6. Approved MVP Authorization Policy

For VS-003, the project owner approved the MVP-only policy:

* Visitors use public functionality without a staff account.
* Only active users assigned to the `Administrator` role may access staff/admin operations.
* The Administrator retains the capabilities listed in Section 3.
* No Operations, Finance, Auditor, or other staff roles, and no fine-grained permission exceptions, are introduced in this slice.

This policy does not resolve the detailed permissions for future roles or sensitive-action separation.

## 7. Future Roles

Possible future roles:

* Operations Manager
* Sales/Customer Support
* Finance
* Provider
* Super Administrator

These are outside the initial MVP.

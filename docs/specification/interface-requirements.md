# AMX — Interface Requirements

## 1. Purpose

Define the interfaces through which customers, administrators, and external services interact with AMX.

---

## 2. Interface Categories

```text
Customer
   ↓
Public Web Interface
   ↓
AMX Application
   ↓
Admin Interface
   ↓
External Communication / Services
```

---

## 3. Public Web Interface

The public website shall provide:

* Home
* About AMX
* Packages
* Package Details
* Custom Trip Request
* How It Works
* Contact
* Terms & Conditions
* Privacy

### Requirements

| ID     | Requirement                                            |
| ------ | ------------------------------------------------------ |
| INT-01 | Interface shall be mobile responsive.                  |
| INT-02 | Navigation shall be simple and consistent.             |
| INT-03 | Package information shall be easy to understand.       |
| INT-04 | Inquiry forms shall clearly identify required fields.  |
| INT-05 | Validation and error messages shall be understandable. |
| INT-06 | Contact actions shall be easily accessible.            |

---

## 4. Customer Inquiry Interface

The inquiry form shall support:

* Name
* Phone/WhatsApp
* Email
* Travel date
* Travelers
* Arrival location
* Number of days
* Budget
* Interests
* Hotel requirement
* Transport requirement
* Special requirements

### Requirements

**INT-07** Required fields shall be clearly marked.

**INT-08** Invalid information shall produce clear feedback.

**INT-09** Successful submission shall provide an inquiry reference or confirmation.

**INT-10** The form shall work effectively on mobile devices.

---

## 5. Administrator Interface

The admin interface shall provide:

```text
Dashboard
├── Inquiries
├── Customers
├── Providers
├── Packages
├── Quotations
├── Bookings
├── Payments
├── Follow-Ups
├── Reviews / Complaints
├── Reports
├── Users / Roles
└── Audit Logs
```

### Requirements

**INT-11** Admin pages shall use consistent navigation.

**INT-12** Lists shall support search, filtering, and appropriate sorting.

**INT-13** Forms shall validate input before submission.

**INT-14** Important actions shall require confirmation where appropriate.

**INT-15** Status information shall be visually clear.

---

## 6. Quotation Interface

The quotation interface shall clearly display:

* Customer
* Travel dates
* Travelers
* Services
* Providers
* Inclusions
* Exclusions
* Total price
* Deposit
* Balance
* Cancellation terms
* Validity
* Booking reference when applicable

The quotation must be understandable to a customer without requiring internal AMX knowledge.

---

## 7. Booking Interface

The booking interface shall display:

* Booking reference
* Customer
* Travel dates
* Services
* Providers
* Payment status
* Booking status
* Operational notes
* Cancellation information

---

## 8. Payment Interface

The admin interface shall support:

* Payment amount
* Date
* Method
* Reference
* Verification status
* Remaining balance
* Notes

The MVP shall not collect online payment credentials.

---

## 9. External Interfaces

AMX may interact with:

| Interface               | MVP Use                              |
| ----------------------- | ------------------------------------ |
| WhatsApp                | Customer/provider communication      |
| Phone                   | Customer/provider coordination       |
| Email                   | Communication and quotations         |
| Hosting/Cloud           | Application operation                |
| External Payment Method | Customer payment; AMX records result |

External systems remain outside the AMX system boundary.

---

## 10. Interface Security

**INT-16** Administrative interfaces shall require authentication.

**INT-17** Users shall only see authorized functions and data.

**INT-18** Production interfaces shall use HTTPS.

**INT-19** Sensitive information shall not be unnecessarily displayed.

---

## 11. Usability Principles

The interface shall prioritize:

1. **Clarity**
2. **Simplicity**
3. **Fast operation**
4. **Mobile usability**
5. **Error prevention**
6. **Consistent navigation**

> The interface should help AMX complete the business workflow, not add unnecessary complexity.

---

## 12. Future Interfaces

Possible future interfaces:

* Provider portal
* Customer account
* Online payment gateway
* Automated notifications
* Mobile/PWA
* AI-assisted customer support

These are outside the MVP.

**Next:** `security-requirements.md`

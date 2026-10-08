# AMX — Security Requirements

## 1. Purpose

Define the minimum security requirements for protecting AMX users, customer information, business data, and system operations.

---

## 2. Security Objectives

AMX security shall protect:

* Customer personal information
* Provider information
* Booking and payment records
* Administrator accounts
* Business and financial information
* System availability and integrity

---

## 3. Authentication

| ID     | Requirement                                                      |
| ------ | ---------------------------------------------------------------- |
| SEC-01 | Administrative functions shall require authentication.           |
| SEC-02 | Passwords shall never be stored in plain text.                   |
| SEC-03 | Sessions shall expire after an appropriate period of inactivity. |
| SEC-04 | Failed authentication attempts should be monitored.              |
| SEC-05 | Password reset procedures shall securely verify the user.        |

---

## 4. Authorization

| ID     | Requirement                                                         |
| ------ | ------------------------------------------------------------------- |
| SEC-06 | Access shall follow least-privilege principles.                     |
| SEC-07 | Users shall only access authorized functions.                       |
| SEC-08 | Sensitive records shall require appropriate permissions.            |
| SEC-09 | Authorization shall be enforced on the backend, not only in the UI. |

MVP roles:

```text
Administrator
   └── Full authorized operational access

Visitor
   └── Public website / inquiry functions
```

---

## 5. Data Protection

| ID     | Requirement                                                        |
| ------ | ------------------------------------------------------------------ |
| SEC-10 | Data transmission shall use HTTPS in production.                   |
| SEC-11 | Sensitive information shall be protected from unauthorized access. |
| SEC-12 | Only necessary customer information shall be collected.            |
| SEC-13 | Sensitive information shall not be unnecessarily exposed in logs.  |
| SEC-14 | Production secrets shall not be stored in source code.             |

---

## 6. Input & Application Security

The system shall protect against common application threats, including:

* SQL injection
* Cross-site scripting (XSS)
* Cross-site request forgery where applicable
* Broken authentication
* Broken authorization
* Malicious file uploads
* Invalid or unexpected input
* Abuse of public forms

**SEC-15** All external input shall be validated.

**SEC-16** Database access shall use safe parameterized mechanisms.

**SEC-17** Uploaded files, if supported, shall be validated and restricted.

---

## 7. API Security

**SEC-18** Protected API endpoints shall require authentication.

**SEC-19** APIs shall enforce authorization.

**SEC-20** Request data shall be validated.

**SEC-21** Sensitive endpoints should have rate limiting.

**SEC-22** API errors shall not expose internal implementation details.

---

## 8. Audit & Accountability

The system shall record important actions such as:

* Login/security events
* User changes
* Provider verification changes
* Quotation changes
* Booking changes
* Payment records
* Cancellation actions
* Important administrative updates

Audit records should contain:

```text
User
Action
Affected Record
Date/Time
Relevant Change
```

---

## 9. Backup & Recovery

**SEC-23** Critical data shall be backed up regularly.

**SEC-24** Backups shall have restricted access.

**SEC-25** Recovery procedures shall be documented and tested.

**SEC-26** Backup failures should be monitored.

---

## 10. Infrastructure Security

Production infrastructure shall use:

* HTTPS
* Secure environment variables/secrets
* Restricted server/database access
* Firewall/network controls where applicable
* Updated dependencies
* Regular security updates
* Database access restrictions

The database should not be publicly exposed unnecessarily.

---

## 11. Privacy

**SEC-27** Customer data shall only be accessible to authorized personnel.

**SEC-28** AMX shall define appropriate data retention and deletion policies.

**SEC-29** Privacy requirements shall be reviewed against applicable Ethiopian laws and regulations before launch.

**SEC-30** Customer information shall not be shared with providers beyond what is necessary for service delivery.

---

## 12. Payment Security

The MVP shall **not store customer banking credentials, card details, or payment passwords**.

AMX shall record only necessary transaction information such as:

* Amount
* Date
* Payment method
* Transaction/reference number
* Verification status

Actual payment processing remains outside the AMX system.

---

## 13. Security Monitoring

The system should monitor:

* Authentication failures
* Application errors
* Suspicious requests
* Important administrative actions
* Backup failures

Sensitive information must not be unnecessarily included in monitoring logs.

---

## 14. Security Priorities

```text
Authentication
      ↓
Authorization
      ↓
Data Protection
      ↓
Input Validation
      ↓
Auditability
      ↓
Backup & Recovery
      ↓
Monitoring
```

### Security Principle

> **Protect customer data, prevent unauthorized actions, preserve business records, and keep the system simple enough to operate securely.**

**Next:** `reporting-requirements.md`

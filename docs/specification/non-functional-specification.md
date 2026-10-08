# AMX — Non-Functional Specification

## 1. Purpose

This document defines the **quality, performance, security, reliability, and operational requirements** of the AMX system.

---

## 2. Performance

| ID     | Requirement                                                                |
| ------ | -------------------------------------------------------------------------- |
| NFR-01 | Public pages should load quickly under normal MVP traffic.                 |
| NFR-02 | Normal administrative operations should respond within an acceptable time. |
| NFR-03 | Database queries shall be optimized for expected MVP usage.                |
| NFR-04 | Images and static assets shall be optimized.                               |

**Target:** Typical user operations should normally complete within **2 seconds**, excluding external services or network delays.

---

## 3. Availability & Reliability

| ID     | Requirement                                                       |
| ------ | ----------------------------------------------------------------- |
| NFR-05 | The system should be available during normal business operations. |
| NFR-06 | Critical data shall not be lost during normal failures.           |
| NFR-07 | Failed operations shall provide useful error feedback.            |
| NFR-08 | Important business records shall remain consistent.               |

---

## 4. Security

| ID     | Requirement                                            |
| ------ | ------------------------------------------------------ |
| NFR-09 | Administrative functions require authentication.       |
| NFR-10 | Authorization shall follow least-privilege principles. |
| NFR-11 | Passwords and credentials shall be securely protected. |
| NFR-12 | User input shall be validated and sanitized.           |
| NFR-13 | Production communication shall use HTTPS.              |
| NFR-14 | Sensitive data shall not be unnecessarily exposed.     |
| NFR-15 | Important administrative actions shall be auditable.   |

---

## 5. Usability

| ID     | Requirement                                                   |
| ------ | ------------------------------------------------------------- |
| NFR-16 | The system shall be simple for non-technical AMX staff.       |
| NFR-17 | Common tasks should require minimal steps.                    |
| NFR-18 | Forms shall provide clear validation and error messages.      |
| NFR-19 | Status and important information shall be easy to understand. |

---

## 6. Responsive Design

| ID     | Requirement                                                 |
| ------ | ----------------------------------------------------------- |
| NFR-20 | The public website shall support mobile devices.            |
| NFR-21 | The administrative system shall work on desktop and tablet. |
| NFR-22 | Interfaces shall remain usable across common screen sizes.  |

---

## 7. Maintainability

| ID     | Requirement                                             |
| ------ | ------------------------------------------------------- |
| NFR-23 | The system shall use a modular structure.               |
| NFR-24 | Code shall follow consistent engineering standards.     |
| NFR-25 | Important system components shall be documented.        |
| NFR-26 | Configuration shall be separated from application code. |
| NFR-27 | The system shall support automated testing.             |

---

## 8. Scalability

| ID     | Requirement                                                                  |
| ------ | ---------------------------------------------------------------------------- |
| NFR-28 | The architecture shall support future growth.                                |
| NFR-29 | Database design shall support increasing customers, providers, and bookings. |
| NFR-30 | New modules shall be addable without major redesign.                         |

The MVP should remain a **modular monolith** rather than introducing unnecessary distributed complexity.

---

## 9. Backup & Recovery

| ID     | Requirement                                          |
| ------ | ---------------------------------------------------- |
| NFR-31 | Critical database data shall be backed up regularly. |
| NFR-32 | Backup access shall be restricted.                   |
| NFR-33 | Recovery procedures shall be documented.             |
| NFR-34 | Backups shall be tested periodically.                |

---

## 10. Data Integrity

| ID     | Requirement                                              |
| ------ | -------------------------------------------------------- |
| NFR-35 | Required fields shall be validated.                      |
| NFR-36 | Invalid relationships shall be prevented.                |
| NFR-37 | Financial calculations shall be consistent.              |
| NFR-38 | Booking and payment records shall remain traceable.      |
| NFR-39 | Important status transitions shall follow defined rules. |

---

## 11. Compatibility

| ID     | Requirement                                                          |
| ------ | -------------------------------------------------------------------- |
| NFR-40 | The system shall support current major browsers.                     |
| NFR-41 | The public website shall work on common Android and desktop devices. |
| NFR-42 | The system shall use standards-based web technologies.               |

---

## 12. Accessibility

| ID     | Requirement                                                          |
| ------ | -------------------------------------------------------------------- |
| NFR-43 | Text shall remain readable on supported devices.                     |
| NFR-44 | Forms shall have clear labels.                                       |
| NFR-45 | Interactive elements shall provide understandable feedback.          |
| NFR-46 | The interface should follow practical WCAG accessibility principles. |

---

## 13. Observability

| ID     | Requirement                                                          |
| ------ | -------------------------------------------------------------------- |
| NFR-47 | Application errors shall be logged.                                  |
| NFR-48 | Important system events shall be traceable.                          |
| NFR-49 | Production failures shall provide sufficient diagnostic information. |
| NFR-50 | Logs shall not unnecessarily expose sensitive information.           |

---

## 14. SEO & Discoverability

| ID     | Requirement                                                        |
| ------ | ------------------------------------------------------------------ |
| NFR-51 | Public pages shall have meaningful titles and metadata.            |
| NFR-52 | Package pages shall be indexable where appropriate.                |
| NFR-53 | URLs should be human-readable.                                     |
| NFR-54 | Basic sitemap and search-engine configuration should be supported. |

---

## 15. Localization

| ID     | Requirement                                                        |
| ------ | ------------------------------------------------------------------ |
| NFR-55 | English shall be supported for MVP.                                |
| NFR-56 | The design shall allow future Amharic support.                     |
| NFR-57 | Date, currency, and text formatting shall be handled consistently. |

---

## 16. Privacy

| ID     | Requirement                                                                                     |
| ------ | ----------------------------------------------------------------------------------------------- |
| NFR-58 | Only necessary customer information shall be collected.                                         |
| NFR-59 | Customer information shall only be accessible to authorized users.                              |
| NFR-60 | Privacy requirements shall be reviewed against applicable Ethiopian requirements before launch. |

---

## 17. Quality Priorities

For the MVP, priorities are:

```text
Security
   ↓
Data Integrity
   ↓
Reliability
   ↓
Usability
   ↓
Performance
   ↓
Maintainability
   ↓
Scalability
```

The system should prioritize **trustworthy operations over unnecessary features or technical complexity**.

**Next:** `business-rules-specification.md`

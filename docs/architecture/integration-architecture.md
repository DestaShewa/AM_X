# AMX — Integration Architecture

**File:** `docs/architecture/integration-architecture.md`
**Phase:** 5 — System Architecture & Design
**Status:** Draft for Validation

## 1. Purpose

Define how AMX communicates with external systems and services while keeping the core system independent, secure, and maintainable.

---

## 2. Integration Architecture

```text
                         AMX
                          │
              ┌───────────┼───────────┐
              │           │           │
           WhatsApp     Email       Phone
              │           │           │
              └───────────┼───────────┘
                          │
                    External Services
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   Payment Methods    File Storage       Hosting
   (External)         (Optional)        Infrastructure
```

AMX remains the authoritative system for its own operational records.

---

## 3. Integration Principles

AMX integrations shall follow these principles:

1. **Loose coupling** — external services should not control AMX business logic.
2. **Minimal integration** — integrate only when there is clear business value.
3. **Failure tolerance** — AMX should continue operating when a non-critical service fails.
4. **Security** — protect credentials and transmitted information.
5. **Traceability** — important external actions should be recorded when necessary.
6. **Replaceability** — avoid unnecessary dependence on one provider.

---

## 4. WhatsApp Integration

### MVP Approach

WhatsApp will primarily be used as a **manual communication channel**.

Examples:

* Customer inquiry follow-up
* Provider availability checks
* Quotation communication
* Trip coordination
* Customer support

The AMX system may store relevant communication outcomes, but does not need to store complete conversations.

### Future

Potential future integration:

* WhatsApp Business API
* Message templates
* Automated notifications
* Message delivery tracking

This is outside the MVP.

---

## 5. Phone Integration

Phone communication remains external.

AMX may record:

* Contact attempt
* Date/time
* Person contacted
* Result
* Follow-up required

AMX does not need to implement its own telephone system.

---

## 6. Email Integration

Email may be used for:

* Customer communication
* Quotations
* Booking information
* Administrative notifications

### MVP

Email may remain manual if automation is not required.

### Future

Possible integration:

```text
AMX
 ↓
Email Service
 ↓
Customer
```

Automated email notifications remain a **Could/Future** capability.

---

## 7. External Payment Integration

### MVP

AMX does not process online payments.

```text
Customer
   ↓
External Payment Method
   ↓
Payment Completed
   ↓
AMX Records Payment
   ↓
Verification
```

AMX records:

* Amount
* Date
* Method
* Reference
* Verification status

### Future

Online payment gateways may be integrated after business, legal, security, and operational requirements are validated.

---

## 8. File Storage Integration

If AMX requires file uploads, such as:

* Provider documents
* Package images
* Other approved operational files

files may be stored in external/object storage.

```text
AMX API
   ↓
Storage Service
   ↓
File

PostgreSQL
   ↓
File Metadata / Reference
```

Large files should not unnecessarily be stored directly in PostgreSQL.

---

## 9. Hosting Integration

AMX depends on its hosting infrastructure for:

* Application execution
* Database hosting
* Networking
* Storage
* Backups
* Monitoring

The application must remain portable enough to move between suitable cloud/VPS providers.

---

## 10. Integration Failure Handling

External services can fail.

Examples:

* WhatsApp unavailable
* Email delivery failure
* Storage unavailable
* Payment confirmation delayed

The system should:

1. Detect the failure.
2. Record relevant information.
3. Provide a useful error/status.
4. Avoid corrupting AMX records.
5. Allow manual recovery where possible.

Critical business data must not depend on successful delivery of a non-critical external message.

---

## 11. Integration Security

External integrations shall use:

* HTTPS/TLS
* Secure credentials
* Environment variables/secrets
* Least-privilege access
* Input/output validation
* Appropriate timeout handling
* Safe error handling

External API credentials must never be committed to GitHub.

---

## 12. Integration Boundary

```text
┌──────────────────────── AMX ────────────────────────┐
│                                                      │
│  Business Logic                                      │
│  Customers • Inquiries • Quotes • Bookings •        │
│  Payments • Providers • Reports                     │
│                                                      │
└───────────────────────┬──────────────────────────────┘
                        │
                  Integration Layer
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
     WhatsApp         Email         File Storage
        │
     Phone
        │
 External Payment Methods
```

External services must not directly modify AMX business records without controlled API logic.

---

## 13. Integration Priority

| Integration            | MVP              | Priority |
| ---------------------- | ---------------- | -------- |
| WhatsApp               | Manual           | High     |
| Phone                  | Manual           | High     |
| Email                  | Manual/Basic     | Medium   |
| External Payment       | Manual recording | High     |
| File Storage           | If required      | Medium   |
| Automated Email        | Future           | Low      |
| WhatsApp API           | Future           | Low      |
| Online Payment Gateway | Future           | Low      |

---

## 14. Future Integration Architecture

Potential future integrations:

* WhatsApp Business API
* Payment gateway
* Email provider
* SMS provider
* Maps/location services
* Hotel systems
* Provider portal
* Customer accounts
* AI services

Each future integration requires its own technical, security, legal, and business evaluation.

---

## 15. Integration Principle

> **AMX owns the business workflow; external services provide supporting capabilities.**

If an external service becomes unavailable, AMX should preserve its operational records and provide a practical fallback whenever possible.

---

## 16. Status

**Integration Strategy:** Loose coupling
**MVP Communication:** WhatsApp / Phone / Email
**Payment:** External + manual recording
**File Storage:** External when required
**Automation:** Limited in MVP
**Future Integrations:** Controlled and separately evaluated

**Status:** Draft for Validation

**Next Artifact:**
`docs/architecture/architecture-diagrams.md`

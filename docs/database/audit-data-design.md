# Audit Data Design

**File:** `docs/database/audit-data-design.md`
**Project:** AMX — Arba Minch Experiences
**Phase:** Database & API Design
**Status:** Draft — Requires Validation

## 1. Purpose

Define how AMX records important system activities and business changes to support accountability, troubleshooting, financial review, and protection of customer and provider information.

## 2. Scope

The audit system must record significant activities involving:

* User authentication and access control.
* Customer and inquiry management.
* Provider verification and status changes.
* Package creation and publication.
* Quotation creation, revision, and customer decisions.
* Booking confirmation, changes, and cancellation.
* Payment recording, verification, and refunds.
* Follow-up activities.
* Review moderation and complaint resolution.
* Administrative configuration and permission changes.

Routine page views and low-value actions do not need to be audited in the MVP.

## 3. Audit Log Data Model

Use the existing `audit_logs` table defined in `table-specification.md`.

| Field            | Purpose                                                      |
| ---------------- | ------------------------------------------------------------ |
| `id`             | UUID primary key                                             |
| `user_id`        | Actor responsible for the action; nullable for system events |
| `action`         | Standardized action name                                     |
| `entity_type`    | Type of affected record                                      |
| `entity_id`      | ID of the affected record, when applicable                   |
| `change_summary` | Structured JSONB summary of relevant changes                 |
| `correlation_id` | Identifier connecting related operations or requests         |
| `created_at`     | Timestamp when the event was recorded                        |

Do not store passwords, authentication tokens, payment-card details, or unnecessary personal information in audit records.

## 4. Audit Event Categories

| Category       | Example events                                       |
| -------------- | ---------------------------------------------------- |
| Authentication | Login success, login failure, logout, account lock   |
| Access control | User created, role changed, account deactivated      |
| Inquiry        | Inquiry assigned, status changed, request updated    |
| Provider       | Verification status changed, provider suspended      |
| Package        | Package created, activated, archived, price updated  |
| Quotation      | Quotation created, revised, sent, accepted, declined |
| Booking        | Booking confirmed, rescheduled, completed, cancelled |
| Payment        | Payment recorded, verified, rejected, refunded       |
| Follow-up      | Follow-up assigned, completed, cancelled             |
| Review         | Review approved, rejected, published                 |
| Complaint      | Complaint assigned, investigated, resolved           |
| Administration | Important system settings or permissions changed     |

## 5. Audit Event Format

Each event must identify the actor, action, affected record, and time. Include a change summary when appropriate.

Example:

```json
{
  "action": "booking.status_changed",
  "entity_type": "booking",
  "entity_id": "booking-uuid",
  "change_summary": {
    "field": "booking_status",
    "old_value": "PENDING",
    "new_value": "CONFIRMED"
  },
  "correlation_id": "request-correlation-id"
}
```

This is an illustrative structure, not a real AMX record. Use actual UUIDs in production. Store only fields needed to understand the change.

## 6. Audit Logging Rules

1. Record important events through centralized backend audit services.
2. Capture the authenticated user from the server-side security context, not from client-supplied identity fields.
3. Record the old and new values of important changes where safe and necessary.
4. Record important status transitions and financial actions.
5. Use consistent action names, such as `quotation.sent` and `payment.verified`.
6. Store timestamps consistently using `TIMESTAMPTZ`.
7. Include a correlation ID where available to connect related operations.
8. Never allow ordinary users to edit or delete audit records through the application.
9. Avoid recording the same business event multiple times because of retries.
10. Ensure audit failures are handled according to the sensitivity of the operation.

## 7. Transaction and Failure Handling

For critical business changes, such as payment verification, quotation acceptance, booking confirmation, and cancellation, write the audit event in the same database transaction as the business change where practical.

If the transaction fails, neither the business change nor its corresponding audit event should be committed.

For authentication and infrastructure events that may occur outside a business transaction, use an appropriate separate logging mechanism. Do not silently ignore failures to record critical security events.

## 8. Security and Access Control

* Restrict audit-log access to authorized administrators or personnel with a legitimate operational need.
* Prevent application users from modifying historical audit events.
* Protect logs from unauthorized access and accidental exposure.
* Avoid storing secrets, full payment credentials, or unnecessary customer details.
* Record access-control changes so that privilege modifications are traceable.
* Treat audit logs as sensitive operational data.

Database permissions should prevent ordinary application roles from directly updating or deleting historical audit records. Stronger tamper protection can be considered as AMX grows.

## 9. Retention and Archiving

Define a retention period after reviewing applicable Ethiopian legal requirements, business needs, privacy obligations, and available storage.

Until the period is approved:

* Do not assume audit data can be retained forever.
* Do not automatically delete historical logs.
* Document the retention decision before production launch.
* Restrict access to archived logs.
* Apply approved deletion or anonymization procedures when required.

## 10. Relationship to Application Logs

Audit logs and application logs serve different purposes.

| Audit logs                                        | Application logs                                 |
| ------------------------------------------------- | ------------------------------------------------ |
| Record who changed business data and what changed | Record application behavior and technical events |
| Support accountability and financial review       | Support debugging and performance monitoring     |
| Stored in the structured audit table              | Stored through the application logging system    |
| Access tightly controlled                         | Access controlled according to operational need  |

Both systems must avoid recording credentials, secrets, and unnecessary personal data.

## 11. Acceptance Checklist

* [ ] The `audit_logs` table matches the approved schema.
* [ ] Important business and security events are identified.
* [ ] Actor identity is obtained securely.
* [ ] Sensitive information is excluded from event payloads.
* [ ] Critical business changes and audit events are transactionally consistent.
* [ ] Audit access is restricted.
* [ ] Logs cannot be changed through ordinary application functions.
* [ ] Retention and archiving rules are approved.
* [ ] Audit events are tested for success, failure, and retry scenarios.

## 12. Decision

AMX will use structured database audit records for important business and administrative actions, alongside separate application logs for technical monitoring. Finalize the event catalog, permissions, and retention rules before production deployment.

**Next document:** `docs/database/financial-data-design.md`

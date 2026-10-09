# AMX Implementation Baseline

**Project:** AMX — Arba Minch Experiences
**File:** `docs/implementation/implementation-baseline.md`
**Version:** 1.0
**Phase:** 8 — Implementation Planning
**Status:** Proposed — Pending Validation and Approval

## 1. Purpose

This document establishes the implementation planning baseline for AMX. It consolidates the development approach, repository organization, coding standards, Git workflow, development environment, backlog, vertical-slice strategy, AI-assisted workflow, and validation process.

It provides a consistent reference for developing AMX without losing alignment with its business requirements, architecture, database design, API contracts, security rules, or UI/UX specifications.

**This baseline records the intended implementation approach. It does not certify that the application has been implemented, tested, deployed, or approved for production.**

## 2. Implementation Objectives

The implementation phase aims to:

1. Deliver the AMX MVP through small, complete, testable vertical slices.
2. Follow the established modular-monolith architecture.
3. Maintain consistency between requirements, database, API, and UI/UX designs.
4. Protect customer, provider, staff, booking, and financial information.
5. Preserve important business and financial history.
6. Use AI coding agents under controlled, human-reviewed workflows.
7. Prepare a maintainable application for controlled pilot operation in Arba Minch.

## 3. Baseline Documents

The following documents define the implementation planning baseline.

| Document                  | Path                                               | Purpose                                |
| ------------------------- | -------------------------------------------------- | -------------------------------------- |
| Implementation plan       | `docs/implementation/implementation-plan.md`       | Overall development sequence and scope |
| Repository structure      | `docs/implementation/repository-structure.md`      | Code organization                      |
| Coding standards          | `docs/implementation/coding-standards.md`          | Coding and engineering conventions     |
| Git workflow              | `docs/implementation/git-workflow.md`              | Branching, commits, and reviews        |
| Development environment   | `docs/implementation/development-environment.md`   | Local setup and configuration          |
| Implementation backlog    | `docs/implementation/implementation-backlog.md`    | Prioritized development tasks          |
| Vertical-slice plan       | `docs/implementation/vertical-slice-plan.md`       | Incremental end-to-end delivery        |
| AI development workflow   | `docs/implementation/ai-development-workflow.md`   | Controlled AI-assisted development     |
| Implementation validation | `docs/implementation/implementation-validation.md` | Readiness checks and evidence          |

These documents must be used together with the authoritative requirements, architecture, database, API, and UI/UX documents.

## 4. Agreed Implementation Direction

### 4.1 Technology stack

| Layer                      | Planned technology                                           |
| -------------------------- | ------------------------------------------------------------ |
| Frontend                   | Next.js, React, JavaScript, Tailwind CSS                     |
| Backend                    | Node.js and Express                                          |
| API                        | REST, versioned under `/api/v1/`                             |
| Database                   | PostgreSQL                                                   |
| Development and deployment | Linux, Docker, Docker Compose                                |
| Version control            | Git and GitHub                                               |
| API documentation          | OpenAPI                                                      |
| Testing                    | Automated unit, integration, workflow, and relevant UI tests |
| Communication              | Manual phone, WhatsApp, and email workflows initially        |

Final package versions, migration tooling, session implementation details, hosting provider, and production configuration must be verified and recorded before their use.

### 4.2 Architecture

AMX will follow a **modular-monolith architecture** for the initial MVP.

* The frontend provides public experience pages and staff administration screens.
* The Express backend owns business logic, validation, permissions, and API behavior.
* PostgreSQL stores operational and financial records.
* Database access remains on the backend.
* Related business operations use transactions where required.
* External communication and payment handling remain limited to the approved MVP scope.

Microservices are not required for the initial release.

## 5. MVP Implementation Scope

### Included

* Public website and experience packages.
* Custom-trip inquiries.
* Customer and inquiry management.
* Provider and package administration.
* Staff authentication and role-based permissions.
* Quotations and quotation revisions.
* Bookings and service coordination.
* Payment recording and verification.
* Follow-ups.
* Reviews and complaints.
* Operational and financial reports.
* Audit logs.
* Testing, deployment preparation, backups, and operational documentation.

### Excluded from the initial MVP

* Native mobile applications.
* Customer and provider self-service accounts.
* Automatic provider availability integrations.
* Automated online payment processing.
* Live vehicle tracking.
* AI chatbot or automated trip planner.
* Automatic commission splitting.
* Multi-city marketplace expansion.

Any scope change must be assessed for cost, schedule, security, requirements, architecture, and operational impact before acceptance.

## 6. Implementation Sequence

Development will follow this dependency-aware sequence:

1. Repository and environment foundation.
2. Database, migration, API, and testing foundations.
3. Staff authentication and permissions.
4. Public package listing and provider/package administration.
5. Public inquiry submission and staff inquiry management.
6. Follow-up management.
7. Quotations and quotation revisions.
8. Booking creation and service coordination.
9. Payment recording and financial tracking.
10. Reviews and complaints.
11. Operational and financial reports.
12. Integration testing, security hardening, deployment, and pilot preparation.

The exact sequence may be adjusted when dependencies or validated requirements justify a change. Such adjustments must be documented.

## 7. Engineering Standards

All implementation work must follow these rules:

* Use JavaScript ES modules and the established naming conventions.
* Maintain clear boundaries between frontend, backend, and database responsibilities.
* Validate all untrusted inputs on the server.
* Enforce permissions in the backend.
* Use parameterized database access and controlled migrations.
* Preserve quotation revisions and accepted booking terms.
* Calculate totals and balances on the backend.
* Record refunds separately from original payment transactions.
* Audit sensitive business and financial changes.
* Add tests alongside each relevant feature.
* Avoid unrelated refactoring and unnecessary dependencies.
* Update documentation whenever implementation changes an API, schema, workflow, or operational procedure.

## 8. AI-Assisted Development Policy

AI coding agents may assist with analysis, implementation, testing, debugging, and documentation.

Every assigned task must:

1. Identify its objective and acceptance criteria.
2. Reference the relevant requirements and design documents.
3. Inspect existing code before making changes.
4. Identify unresolved decisions before implementing dependent behavior.
5. Make only the authorized changes.
6. Run relevant checks and report actual results.
7. Review changes for security, correctness, and scope.
8. Update relevant documentation.
9. Receive human review before acceptance.

AI agents must not independently change approved business rules, perform unauthorized destructive operations, deploy to production, or claim unverified work is complete.

## 9. Critical Decisions and Conditions

The following matters must be resolved before implementing the features they affect:

* Final staff role and permission matrix.
* Session expiry and account recovery behavior.
* Quotation acceptance method and expiry rules.
* Booking snapshot fields and transactional creation rules.
* Booking and service confirmation conditions.
* Deposit, cancellation, refund, adjustment, and overpayment rules.
* Follow-up relationships.
* Review eligibility and duplicate-review handling.
* Data retention, deletion, privacy, and applicable legal obligations.
* Migration tooling, backup targets, and recovery procedures.
* Production hosting, secrets, monitoring, and incident response.

Each decision must be recorded in its authoritative document and reflected in affected database, API, UI/UX, and implementation specifications.

Do not treat proposed database or API designs as formally approved merely because they are included in this baseline.

## 10. Validation and Acceptance

Before this baseline is approved:

* [ ] All implementation planning documents exist and are consistent.
* [ ] The implementation scope matches the SRS and architecture.
* [ ] The repository structure supports the planned modules.
* [ ] The development environment can be reproduced or its unverified aspects are documented.
* [ ] Backlog priorities and vertical-slice dependencies have been reviewed.
* [ ] Coding, Git, and AI development workflows are consistent.
* [ ] Security, financial integrity, testing, and documentation requirements are covered.
* [ ] Critical implementation blockers are identified and assigned.
* [ ] The implementation validation review has been completed.
* [ ] The project owner has reviewed and approved the baseline.

Each checklist item must be marked complete only when evidence supports it.

## 11. Baseline Change Control

After approval, changes affecting implementation scope, architecture, data integrity, security, or major dependencies must be reviewed before adoption.

For each material change:

1. Record the reason and proposed change.
2. Identify affected requirements and documents.
3. Evaluate technical, security, cost, schedule, and operational impact.
4. Obtain the required approval.
5. Update the authoritative documents and version information.
6. Update implementation tasks and tests.
7. Verify the resulting implementation against the revised baseline.

Minor clarifications may be handled through normal document maintenance when they do not change approved scope or behavior.

## 12. Approval Record

| Field               | Value                                      |
| ------------------- | ------------------------------------------ |
| Baseline version    | 1.0                                        |
| Status              | Proposed — Pending Validation and Approval |
| Prepared by         | AMX Project Owner / Development Team       |
| Reviewer            | To be assigned                             |
| Approval date       | To be recorded                             |
| Validation evidence | To be recorded                             |
| Approved changes    | To be recorded                             |

### Approval decision

The baseline becomes the active implementation reference only after the required validation and approval are recorded.

Approval of this document does not replace the need to approve unresolved business decisions, validate individual vertical slices, test the integrated application, or authorize production release.

## 13. Phase 8 Completion Criteria

Phase 8 — Implementation Planning is ready to close when:

* All eight supporting implementation planning documents are reviewed.
* Cross-document conflicts have been resolved or explicitly assigned.
* Critical design decisions needed for the first implementation slices are resolved.
* The development environment and verification approach are sufficiently defined.
* The backlog and vertical-slice sequence are accepted.
* The AI-assisted workflow and security restrictions are accepted.
* The implementation baseline is validated and approved.

Once these conditions are satisfied, proceed to implementation incrementally, starting with the repository and development foundation. Continue to validate each vertical slice before integrating dependent features.

**Next step:** Review `docs/implementation/implementation-validation.md`, resolve the blockers that affect the first slices, and record approval of this baseline before treating Phase 8 as formally complete.

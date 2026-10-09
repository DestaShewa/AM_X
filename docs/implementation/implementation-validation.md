# AMX Implementation Validation

**Project:** AMX — Arba Minch Experiences
**File:** `docs/implementation/implementation-validation.md`
**Version:** 1.0
**Phase:** 8 — Implementation Planning

## 1. Purpose

Define how AMX implementation planning documents, technical foundations, and development practices are checked for consistency, completeness, security, and readiness.

Validation ensures the implementation plan can be followed without inventing requirements, overlooking dependencies, or introducing avoidable architectural and business risks.

**Important:** This document defines the validation process and checklist. A checklist item must only be marked passed after the required evidence has been reviewed. Creating this document does not mean validation has already passed.

## 2. Validation Objectives

The validation process must establish that:

1. Implementation tasks trace to the requirements and approved designs.
2. The repository structure supports the selected architecture.
3. Development instructions are reproducible.
4. The backlog and vertical slices follow a safe dependency order.
5. Coding standards and AI-agent instructions are consistent.
6. Security, privacy, and financial integrity are addressed.
7. Testing and acceptance criteria are verifiable.
8. Unresolved decisions are documented and assigned.
9. Implementation can proceed without unnecessary rework.

## 3. Validation Scope

| Area                    | Documents or evidence                          |
| ----------------------- | ---------------------------------------------- |
| Implementation strategy | `implementation-plan.md`                       |
| Repository structure    | `repository-structure.md`                      |
| Coding practices        | `coding-standards.md`                          |
| Version control         | `git-workflow.md`                              |
| Development environment | `development-environment.md`                   |
| Task prioritization     | `implementation-backlog.md`                    |
| Vertical-slice delivery | `vertical-slice-plan.md`                       |
| AI-assisted development | `ai-development-workflow.md`                   |
| Requirements            | `docs/requirements/` and `docs/specification/` |
| Architecture            | `docs/architecture/`                           |
| Database design         | `docs/database/`                               |
| API design              | `docs/api/`                                    |
| UI/UX design            | `docs/ui-ux/`                                  |

Validation covers both documentation review and, when available, actual repository checks. A planned configuration is not evidence of a working configuration.

## 4. Validation Method

Use the following process for each validation area.

1. **Inspect:** Read the relevant documents and actual implementation artifacts.
2. **Compare:** Check consistency across requirements, architecture, database, API, UI/UX, and implementation instructions.
3. **Verify:** Run applicable commands, tests, or demonstrations.
4. **Record:** Document the evidence, findings, and unresolved issues.
5. **Correct:** Fix inconsistencies or assign the necessary decision.
6. **Recheck:** Verify the corrections before changing the status.

### Validation status definitions

* `Not Started` — no validation performed.
* `In Progress` — validation is underway.
* `Passed` — evidence confirms the applicable criteria are satisfied.
* `Failed` — a criterion is not satisfied.
* `Blocked` — validation cannot proceed because a dependency or decision is missing.
* `Not Applicable` — the criterion does not apply, with a recorded reason.

Do not use `Passed` based on assumptions, document existence alone, or AI-generated claims.

## 5. Validation Checklist

### A. Requirements and Scope

* [ ] **IMP-VAL-001:** Implementation scope matches the defined AMX MVP.
* [ ] **IMP-VAL-002:** Planned features trace to the relevant SRS requirement IDs.
* [ ] **IMP-VAL-003:** Excluded features are not unintentionally included in the MVP.
* [ ] **IMP-VAL-004:** Business rules and status transitions are consistent across relevant documents.
* [ ] **IMP-VAL-005:** Unresolved business decisions are explicitly recorded.
* [ ] **IMP-VAL-006:** Acceptance criteria are observable and testable.

**Evidence:** Requirements traceability review, scope comparison, and unresolved-decision register.

### B. Architecture and Repository

* [ ] **IMP-VAL-007:** The repository structure supports the modular-monolith architecture.
* [ ] **IMP-VAL-008:** Frontend, backend, shared code, database, infrastructure, and documentation responsibilities are clear.
* [ ] **IMP-VAL-009:** The planned technology stack matches the architecture baseline.
* [ ] **IMP-VAL-010:** Backend ownership of business rules and data access is explicit.
* [ ] **IMP-VAL-011:** No planned component contradicts approved architecture decisions.
* [ ] **IMP-VAL-012:** Repository paths and configuration names are consistent across documents.

**Evidence:** Architecture comparison and, when the repository exists, directory and configuration inspection.

### C. Development Environment

* [ ] **IMP-VAL-013:** Required tools and compatible versions are documented.
* [ ] **IMP-VAL-014:** Local environment setup instructions are reproducible.
* [ ] **IMP-VAL-015:** Frontend, backend, and database configuration requirements are defined.
* [ ] **IMP-VAL-016:** Environment variables and secrets are handled safely.
* [ ] **IMP-VAL-017:** Docker Compose configuration and database persistence instructions are clear.
* [ ] **IMP-VAL-018:** Setup, startup, shutdown, and troubleshooting instructions are documented.
* [ ] **IMP-VAL-019:** Migration and test database initialization procedures are defined.

**Evidence:** A clean local setup, configuration review, successful startup, and documented verification commands.

### D. Coding and Git Workflow

* [ ] **IMP-VAL-020:** Coding standards are consistent with the selected JavaScript stack.
* [ ] **IMP-VAL-021:** Frontend, backend, and database responsibilities are clearly separated.
* [ ] **IMP-VAL-022:** Branch naming and commit conventions are documented.
* [ ] **IMP-VAL-023:** Secret files, generated files, and other excluded artifacts are covered by `.gitignore`.
* [ ] **IMP-VAL-024:** Code review and change acceptance procedures are defined.
* [ ] **IMP-VAL-025:** Database migration changes are version-controlled.
* [ ] **IMP-VAL-026:** The definition of done requires actual verification evidence.

**Evidence:** Coding-standard review, Git configuration review, and sample workflow verification.

### E. Backlog and Vertical Slices

* [ ] **IMP-VAL-027:** Backlog priorities reflect feature dependencies and business importance.
* [ ] **IMP-VAL-028:** Vertical slices deliver complete capabilities across relevant application layers.
* [ ] **IMP-VAL-029:** Each slice has a clear objective and acceptance criteria.
* [ ] **IMP-VAL-030:** Authentication and authorization precede protected administrative operations.
* [ ] **IMP-VAL-031:** Inquiry, quotation, booking, and financial workflows follow the defined business process.
* [ ] **IMP-VAL-032:** Database migrations and API contracts are included where required.
* [ ] **IMP-VAL-033:** Testing and documentation are planned within each relevant slice.
* [ ] **IMP-VAL-034:** High-risk financial and booking decisions are resolved before dependent implementation.
* [ ] **IMP-VAL-035:** Dependencies do not create circular or impossible implementation ordering.

**Evidence:** Backlog-to-slice mapping, dependency review, and requirements traceability.

### F. AI-Assisted Development

* [ ] **IMP-VAL-036:** AI-agent instructions identify the authoritative project documents.
* [ ] **IMP-VAL-037:** AI tasks are scoped, traceable, and include acceptance criteria.
* [ ] **IMP-VAL-038:** The workflow requires analysis before implementation.
* [ ] **IMP-VAL-039:** Agents must report tests actually executed and their results.
* [ ] **IMP-VAL-040:** Agents are prohibited from silently changing approved requirements or business rules.
* [ ] **IMP-VAL-041:** Human review is required for acceptance of AI-generated changes.
* [ ] **IMP-VAL-042:** Destructive operations, production deployment, and sensitive changes require appropriate authorization.
* [ ] **IMP-VAL-043:** Persistent agent instructions avoid conflicting copies of detailed specifications.

**Evidence:** Review of the AI workflow and repository-level instructions, plus a trial task if an agent is available.

### G. Security and Data Integrity

* [ ] **IMP-VAL-044:** Authentication and role-based authorization are included in the implementation plan.
* [ ] **IMP-VAL-045:** Server-side validation and parameterized database access are required.
* [ ] **IMP-VAL-046:** Session security, secrets management, and production HTTPS are addressed.
* [ ] **IMP-VAL-047:** Sensitive customer, provider, and financial information is appropriately protected.
* [ ] **IMP-VAL-048:** Important operations require audit logging.
* [ ] **IMP-VAL-049:** Booking and quotation creation handle transactions and duplicate requests safely.
* [ ] **IMP-VAL-050:** Financial records preserve transaction and refund history.
* [ ] **IMP-VAL-051:** Database backups and recovery procedures are included.
* [ ] **IMP-VAL-052:** Data retention and deletion requirements are documented or explicitly assigned for resolution.

**Evidence:** Security-design review, database/API review, relevant tests, and backup/recovery verification where implemented.

### H. Testing and Release Readiness

* [ ] **IMP-VAL-053:** Unit, integration, workflow, and security testing responsibilities are defined.
* [ ] **IMP-VAL-054:** Test execution commands and required environments are documented.
* [ ] **IMP-VAL-055:** Acceptance criteria have corresponding verification methods.
* [ ] **IMP-VAL-056:** Error handling, validation failures, and authorization failures are covered.
* [ ] **IMP-VAL-057:** Critical end-to-end workflows are included in the release plan.
* [ ] **IMP-VAL-058:** Deployment, rollback, backup, and recovery procedures are addressed.
* [ ] **IMP-VAL-059:** Release approval requires evidence and resolution of release-blocking defects.

**Evidence:** Test strategy, test results, deployment procedure review, and release checklist.

### I. Cross-Document Consistency

* [ ] **IMP-VAL-060:** Requirement IDs and document references are correct.
* [ ] **IMP-VAL-061:** API naming and data-field conventions are consistent.
* [ ] **IMP-VAL-062:** Database entities and relationships align with the API and business workflows.
* [ ] **IMP-VAL-063:** UI screens and flows correspond to planned capabilities.
* [ ] **IMP-VAL-064:** Business status values and allowed transitions are consistent.
* [ ] **IMP-VAL-065:** No proposed design is incorrectly described as formally approved.
* [ ] **IMP-VAL-066:** Known conflicts and unresolved decisions have an owner and next action.

**Evidence:** Cross-document review and an updated decision/issue register.

## 6. Critical AMX Decisions to Reconcile

Before implementing dependent features, verify that the relevant documents agree on the following matters.

| Decision                                                             | Required resolution before                           |
| -------------------------------------------------------------------- | ---------------------------------------------------- |
| Final user roles and permission matrix                               | Protected administrative features                    |
| Staff session expiry and recovery behavior                           | Authentication implementation                        |
| Quotation acceptance method and expiry                               | Quotation acceptance and booking creation            |
| Booking snapshot fields and transaction boundaries                   | Booking creation                                     |
| Booking and service confirmation rules                               | Booking coordination                                 |
| Payment transactions, refunds, adjustments, and balance calculations | Financial implementation                             |
| Deposit, cancellation, and refund policies                           | Relevant booking and finance workflows               |
| Follow-up target relationships                                       | Follow-up implementation                             |
| Review eligibility and duplicate-review policy                       | Review implementation                                |
| Data retention, deletion, and applicable legal obligations           | Affected data collection, publication, and retention |
| Database migration and recovery procedures                           | Database initialization and deployment               |
| Production access, backup, and incident response                     | Pilot deployment                                     |

Record each decision in the appropriate authoritative document. Update affected database, API, UI/UX, and implementation documents where necessary.

## 7. Issue and Decision Register

Maintain a record for every failed or blocked criterion.

| Field                  | Description                                       |
| ---------------------- | ------------------------------------------------- |
| Issue ID               | Unique identifier, such as `IMP-ISS-001`          |
| Related checklist item | Relevant `IMP-VAL` ID                             |
| Description            | What is missing, incorrect, or inconsistent       |
| Severity               | Critical, High, Medium, or Low                    |
| Impact                 | Affected feature, data, security, or release      |
| Owner                  | Person responsible for resolution                 |
| Action                 | Specific corrective action or decision required   |
| Target milestone       | Before which slice or release it must be resolved |
| Status                 | Open, In Progress, Resolved, or Accepted Risk     |
| Evidence               | Reference to the correction and its verification  |

An accepted risk requires an explicit decision by the appropriate owner. AI agents must not accept material business or security risks on the owner's behalf.

## 8. Validation Summary

At the end of each validation review, record:

* **Review date:** `[YYYY-MM-DD]`
* **Reviewer:** `[Name or role]`
* **Scope reviewed:** `[Documents, slices, or artifacts]`
* **Checklist status:** `[Passed / Failed / Blocked / In Progress]`
* **Criteria passed:** `[Count]`
* **Criteria failed:** `[Count]`
* **Criteria blocked:** `[Count]`
* **Open critical/high issues:** `[IDs]`
* **Evidence location:** `[Links or repository paths]`
* **Decision:** `[Proceed / Proceed with restrictions / Blocked]`
* **Required follow-up:** `[Actions and owners]`

Do not calculate or claim a passing result until the checklist has been evaluated against actual evidence.

## 9. Implementation Readiness Criteria

AMX may proceed with a particular slice when:

1. Its requirements and acceptance criteria are clear.
2. Required dependencies are satisfied.
3. The relevant design is approved or sufficiently resolved.
4. Security and data-integrity expectations are understood.
5. The developer can implement and verify the task in the available environment.
6. Any remaining issues do not invalidate the planned behavior.

A slice may be blocked even if the overall implementation plan is sound. Resolve the blocker or select an independent slice that does not rely on the unresolved decision.

### MVP pilot readiness

Before inviting real customers or providers to use AMX, require:

* Critical inquiry-to-booking workflows tested.
* Authentication and permissions verified.
* Booking and financial data integrity tested.
* Relevant legal, privacy, provider-verification, cancellation, and liability questions reviewed.
* Production configuration and access controls reviewed.
* Backups and recovery procedures verified.
* Operational support and incident handling defined.
* Release-blocking defects resolved.
* Explicit pilot approval recorded.

## 10. Final Validation Rule

Validation is an evidence-based control, not a documentation formality. Keep the checklist current as the implementation evolves. Revalidate affected areas whenever requirements, architecture, data models, APIs, security controls, or implementation workflows change.

The implementation phase should proceed incrementally: validate the foundation, implement a vertical slice, test it, review it, and then continue to dependent work.

## 11. Next Document

Create `docs/implementation/implementation-baseline.md` to summarize the implementation planning documents, define the baseline's approval conditions, and record the implementation approach that will guide the AMX development phase.

# AMX Implementation Validation

**Project:** AMX — Arba Minch Experiences
**File:** `docs/implementation/implementation-validation.md`
**Version:** 1.1
**Phase:** 8 — Implementation Planning
**Purpose:** Verify implementation readiness before development proceeds.

## 1. Purpose

This document defines how to validate AMX implementation planning, technical consistency, development procedures, security controls, and readiness.

The objective is to ensure that implementation follows the documented requirements and architecture, avoids conflicting designs, and proceeds through manageable, testable tasks.

**Validation is evidence-based.** A document existing does not prove that its contents are correct, a command being documented does not prove that it works, and a planned test does not prove that it has passed.

This document is a validation checklist and procedure, not a declaration that AMX has already passed validation.

## 2. Validation Scope

Validation covers the following areas:

1. Requirements and implementation scope.
2. Architecture and repository structure.
3. Development environment and configuration.
4. Coding standards and Git workflow.
5. Backlog and vertical-slice dependencies.
6. AI-assisted development controls.
7. Database, API, security, and financial integrity.
8. Testing, deployment, and recovery readiness.
9. Cross-document consistency.
10. Implementation baseline approval.

## 3. Authoritative Documents

Use the following documents when evaluating implementation readiness.

| Area                    | Authoritative documents                          |
| ----------------------- | ------------------------------------------------ |
| Requirements            | `docs/requirements/` and `docs/specification/`   |
| Architecture            | `docs/architecture/`                             |
| Database                | `docs/database/`                                 |
| API                     | `docs/api/`                                      |
| UI/UX                   | `docs/ui-ux/`                                    |
| Implementation strategy | `docs/implementation/implementation-plan.md`     |
| Repository organization | `docs/implementation/repository-structure.md`    |
| Coding rules            | `docs/implementation/coding-standards.md`        |
| Git workflow            | `docs/implementation/git-workflow.md`            |
| Development setup       | `docs/implementation/development-environment.md` |
| Task backlog            | `docs/implementation/implementation-backlog.md`  |
| Vertical slices         | `docs/implementation/vertical-slice-plan.md`     |
| AI workflow             | `docs/implementation/ai-development-workflow.md` |
| Implementation baseline | `docs/implementation/implementation-baseline.md` |

When documents conflict, identify the conflict and resolve it through the appropriate authoritative document. Do not silently choose an implementation that contradicts an approved requirement or architecture decision.

## 4. Validation Status Rules

Use these statuses for every checklist item:

* `Not Started` — validation has not begun.
* `In Progress` — evidence is being collected or reviewed.
* `Passed` — the requirement has been verified with sufficient evidence.
* `Failed` — the requirement does not meet its acceptance criteria.
* `Blocked` — a dependency, decision, or missing resource prevents validation.
* `Not Applicable` — the item does not apply, with a recorded explanation.

For each item, record its status, evidence, and any necessary corrective action.

Do not mark a checklist item as passed merely because the documentation describes the desired behavior.

## 5. Validation Checklist

### A. Requirements and Scope

* [ ] **IMP-VAL-001:** The implementation scope matches the AMX MVP defined in the SRS.
* [ ] **IMP-VAL-002:** Planned features can be traced to the correct requirements.
* [ ] **IMP-VAL-003:** Features explicitly excluded from the MVP remain out of scope unless formally approved.
* [ ] **IMP-VAL-004:** Business rules and status transitions are consistent across specifications.
* [ ] **IMP-VAL-005:** Acceptance criteria describe observable, verifiable outcomes.
* [ ] **IMP-VAL-006:** Unresolved business decisions are recorded with owners and required resolution dates or milestones.

**Evidence required:** SRS comparison, requirement traceability, and the decision register.

### B. Architecture and Repository

* [ ] **IMP-VAL-007:** The repository structure supports the modular-monolith architecture.
* [ ] **IMP-VAL-008:** Frontend, backend, database, shared utilities, infrastructure, and documentation have clear responsibilities.
* [ ] **IMP-VAL-009:** The technology stack matches the architecture baseline.
* [ ] **IMP-VAL-010:** The backend remains responsible for business rules, authorization, and database access.
* [ ] **IMP-VAL-011:** Planned modules do not introduce unapproved architectural changes.
* [ ] **IMP-VAL-012:** Repository paths and configuration names are consistent across implementation documents.

**Evidence required:** Cross-document comparison and, when the repository exists, inspection of the actual directory structure and configuration.

### C. Development Environment

* [ ] **IMP-VAL-013:** Required tools and compatible versions are documented.
* [ ] **IMP-VAL-014:** Local setup instructions can be followed reproducibly.
* [ ] **IMP-VAL-015:** Frontend, backend, and database environment variables are defined.
* [ ] **IMP-VAL-016:** Secrets are excluded from source control and handled safely.
* [ ] **IMP-VAL-017:** Docker Compose configuration and database persistence are understood.
* [ ] **IMP-VAL-018:** Startup, shutdown, troubleshooting, and dependency installation procedures are documented.
* [ ] **IMP-VAL-019:** Database initialization and migration procedures are defined.
* [ ] **IMP-VAL-020:** Test execution instructions identify the necessary environment and dependencies.

**Evidence required:** Setup verification, configuration review, and successful execution of the applicable commands. If the repository is not yet available, record the affected items as not started or blocked.

### D. Coding and Git Workflow

* [ ] **IMP-VAL-021:** Coding standards are consistent with the selected JavaScript stack.
* [ ] **IMP-VAL-022:** Frontend, backend, and database responsibilities are separated appropriately.
* [ ] **IMP-VAL-023:** Branch naming and commit conventions are documented.
* [ ] **IMP-VAL-024:** `.gitignore` excludes environment secrets and appropriate generated artifacts.
* [ ] **IMP-VAL-025:** Code review and change acceptance procedures are defined.
* [ ] **IMP-VAL-026:** Database migrations and relevant documentation changes are version-controlled.
* [ ] **IMP-VAL-027:** The definition of done requires actual testing and review evidence.

**Evidence required:** Standards review and, where available, verification of the actual Git configuration and workflow.

### E. Backlog and Vertical Slices

* [ ] **IMP-VAL-028:** Backlog priorities reflect dependencies and business importance.
* [ ] **IMP-VAL-029:** Each vertical slice has a defined goal and acceptance criteria.
* [ ] **IMP-VAL-030:** Slices integrate all necessary layers to deliver the intended capability.
* [ ] **IMP-VAL-031:** Authentication and authorization precede protected administrative operations.
* [ ] **IMP-VAL-032:** Inquiry, quotation, booking, and payment workflows follow the specified business process.
* [ ] **IMP-VAL-033:** Relevant database migrations, API contracts, UI states, and tests are included.
* [ ] **IMP-VAL-034:** Critical business decisions are resolved before implementing dependent features.
* [ ] **IMP-VAL-035:** Slice dependencies form a feasible implementation sequence.
* [ ] **IMP-VAL-036:** Every implemented task has a clear relationship to the backlog and relevant requirements.

**Evidence required:** Backlog-to-slice mapping, dependency review, and requirement traceability.

### F. AI-Assisted Development

* [ ] **IMP-VAL-037:** AI-agent instructions identify the authoritative project documents.
* [ ] **IMP-VAL-038:** Tasks define objectives, restrictions, and acceptance criteria.
* [ ] **IMP-VAL-039:** Agents must inspect relevant documentation and existing code before editing.
* [ ] **IMP-VAL-040:** Agents must report actual test results and disclose failed or unexecuted checks.
* [ ] **IMP-VAL-041:** Agents cannot silently change approved requirements, architecture, or business rules.
* [ ] **IMP-VAL-042:** Destructive operations and production deployment require appropriate authorization.
* [ ] **IMP-VAL-043:** Human review is required before accepting AI-generated changes.
* [ ] **IMP-VAL-044:** Persistent agent instructions refer to authoritative documents instead of duplicating conflicting specifications.

**Evidence required:** Review of `ai-development-workflow.md` and, when available, repository-level agent instructions and a trial task.

### G. Database and API Integrity

* [ ] **IMP-VAL-045:** Database tables and relationships align with the approved domain model.
* [ ] **IMP-VAL-046:** Database constraints, migrations, and transaction boundaries are documented.
* [ ] **IMP-VAL-047:** API endpoints and request/response formats match the API specification.
* [ ] **IMP-VAL-048:** Server-side validation and standardized error handling are required.
* [ ] **IMP-VAL-049:** Duplicate requests and concurrent operations are handled safely where necessary.
* [ ] **IMP-VAL-050:** Accepted quotations and associated booking terms can be preserved accurately.
* [ ] **IMP-VAL-051:** Payment transactions, refunds, and booking financial summaries follow the approved financial design.
* [ ] **IMP-VAL-052:** Database migration and recovery procedures protect existing records.

**Evidence required:** Database/API cross-review, migration verification, and relevant integration tests when implementation is available.

### H. Security and Privacy

* [ ] **IMP-VAL-053:** Authentication and role-based authorization are included.
* [ ] **IMP-VAL-054:** Session security, secret management, and HTTPS requirements are defined.
* [ ] **IMP-VAL-055:** Input validation and parameterized database access are required.
* [ ] **IMP-VAL-056:** Public endpoints expose only approved public information.
* [ ] **IMP-VAL-057:** Customer, provider, staff, and financial data are protected appropriately.
* [ ] **IMP-VAL-058:** Sensitive business and financial operations are auditable.
* [ ] **IMP-VAL-059:** Data retention, deletion, privacy, and applicable legal requirements are addressed.
* [ ] **IMP-VAL-060:** Backup, recovery, and incident-response responsibilities are defined.

**Evidence required:** Security design review, access-control tests when available, and documented operational procedures.

### I. Testing and Release Readiness

* [ ] **IMP-VAL-061:** Unit, integration, workflow, and relevant UI testing approaches are documented.
* [ ] **IMP-VAL-062:** Test commands and required test environments are defined.
* [ ] **IMP-VAL-063:** Acceptance criteria have corresponding verification methods.
* [ ] **IMP-VAL-064:** Invalid input, failed requests, and unauthorized access are covered.
* [ ] **IMP-VAL-065:** The inquiry-to-booking workflow has an end-to-end test plan.
* [ ] **IMP-VAL-066:** Financial integrity and duplicate-operation scenarios are included in testing.
* [ ] **IMP-VAL-067:** Deployment, rollback, backup, and recovery procedures are documented.
* [ ] **IMP-VAL-068:** Release-blocking defects must be resolved before pilot approval.

**Evidence required:** Test strategy, actual test reports when available, and deployment/recovery verification.

### J. Cross-Document Consistency

* [ ] **IMP-VAL-069:** Requirement IDs and document paths are correct.
* [ ] **IMP-VAL-070:** API naming and data-field conventions are consistent.
* [ ] **IMP-VAL-071:** Data relationships match business workflows and API contracts.
* [ ] **IMP-VAL-072:** UI screens and user flows correspond to planned capabilities.
* [ ] **IMP-VAL-073:** Status values and allowed transitions are consistent.
* [ ] **IMP-VAL-074:** Proposed designs are not incorrectly represented as approved.
* [ ] **IMP-VAL-075:** Conflicts and unresolved decisions have documented next actions.

**Evidence required:** Cross-document review and an updated issue/decision register.

## 6. Critical Decisions That Affect Readiness

The following decisions must be resolved before the affected features are implemented.

| Decision                                                       | Required before                        |
| -------------------------------------------------------------- | -------------------------------------- |
| Final staff roles and permission matrix                        | Administrative features                |
| Session expiry and account recovery                            | Authentication implementation          |
| Quotation acceptance and expiry rules                          | Quotation acceptance                   |
| Booking snapshots and transaction boundaries                   | Booking creation                       |
| Booking and provider-service confirmation rules                | Service coordination                   |
| Deposits, refunds, adjustments, and overpayment handling       | Financial implementation               |
| Follow-up target relationships                                 | Follow-up implementation               |
| Review eligibility and duplicate-review handling               | Review implementation                  |
| Retention, deletion, privacy, and applicable legal obligations | Affected data workflows                |
| Migration tooling and recovery procedures                      | Database initialization and deployment |
| Hosting, secrets, monitoring, and incident response            | Pilot deployment                       |

For every decision:

1. Record the question and available options.
2. Identify affected requirements and documents.
3. Assign a responsible decision-maker.
4. Record the approved decision and rationale.
5. Update the authoritative document.
6. Reconcile affected database, API, UI/UX, and implementation specifications.

Do not implement a critical rule by guessing merely to keep development moving.

## 7. Issue Register

Record every failed or blocked checklist item.

| Field              | Required information                                |
| ------------------ | --------------------------------------------------- |
| Issue ID           | Unique identifier, such as `IMP-ISS-001`            |
| Checklist item     | Relevant `IMP-VAL` identifier                       |
| Description        | What is missing, inconsistent, or incorrect         |
| Severity           | Critical, High, Medium, or Low                      |
| Impact             | Affected functionality, security, data, or schedule |
| Owner              | Person responsible for resolution                   |
| Corrective action  | Specific action needed                              |
| Required milestone | Before which slice or release it must be resolved   |
| Status             | Open, In Progress, Resolved, or Accepted Risk       |
| Evidence           | Reference to the correction and verification        |

Critical security, data-integrity, or business-rule issues must block the affected implementation until resolved. An accepted risk requires explicit authorization from the appropriate owner.

## 8. Validation Execution Record

Complete this record during an actual validation review.

**Review information**

* Review date: `[YYYY-MM-DD]`
* Reviewer: `[Name or role]`
* Scope reviewed: `[Documents, repository areas, or slices]`
* Repository revision, if applicable: `[Commit ID]`

**Results**

* Checklist items passed: `[Count]`
* Checklist items failed: `[Count]`
* Checklist items blocked: `[Count]`
* Checklist items not started: `[Count]`
* Critical/high issues: `[Issue IDs]`
* Evidence location: `[Repository paths or test reports]`

**Decision**

* `Proceed` — the reviewed scope meets its readiness criteria.
* `Proceed with restrictions` — only explicitly identified, non-blocked work may continue.
* `Blocked` — critical issues prevent the affected work from proceeding.

**Required follow-up:** `[Actions, owners, and target milestones]`

Do not fill in successful results before the review is performed.

## 9. Readiness Criteria

### Readiness for a specific vertical slice

A slice may proceed when:

* Its requirements and acceptance criteria are clear.
* Its dependencies are satisfied.
* Required business and design decisions are resolved.
* Database, API, and UI/UX contracts are sufficiently defined.
* Security and data-integrity expectations are understood.
* The development environment supports implementation and verification.

A blocked slice does not automatically prevent independent work that has no dependency on the unresolved issue.

### Readiness for the AMX pilot

Before real customers or providers use the application, verify that:

* Critical workflows have passed end-to-end testing.
* Authentication and permissions have been tested.
* Booking and financial integrity have been verified.
* Provider verification and customer-facing claims are operationally accurate.
* Applicable legal, privacy, cancellation, refund, and liability questions have been reviewed.
* Production configuration and access controls have been checked.
* Backups and recovery have been tested.
* Support and incident-handling responsibilities are defined.
* Release-blocking defects are resolved.
* The pilot has explicit approval.

Planning validation alone does not authorize a production launch.

## 10. Relationship to the Implementation Baseline

This document supplies the validation process for `docs/implementation/implementation-baseline.md`.

Before approving the implementation baseline:

1. Review all implementation planning documents.
2. Complete the applicable documentation consistency checks.
3. Record unresolved issues and decisions.
4. Validate the first implementation dependencies.
5. Record the validation results and reviewer.
6. Obtain the required baseline approval.

If later changes affect the architecture, requirements, database, APIs, security, or development workflow, revalidate the affected areas and update the baseline when necessary.

## 11. Final Rule

AMX implementation must be evidence-driven and incremental.

**Validate the design → implement one vertical slice → run the relevant tests → review the changes → record the evidence → proceed to the next dependent slice.**

This document defines what must be checked. The actual validation status must reflect what has been inspected, tested, and approved—not what is merely planned.

## 12. Next Step

Review this checklist against the current AMX documentation, resolve the blockers affecting the first implementation slices, and record the actual validation results in the issue register and implementation baseline.

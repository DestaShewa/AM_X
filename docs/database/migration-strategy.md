# Database Migration Strategy

**File:** `docs/database/migration-strategy.md`
**Project:** AMX — Arba Minch Experiences
**Phase:** Database & API Design
**Status:** Draft — Requires Validation

## 1. Purpose

Define how AMX database schema changes will be designed, reviewed, applied, tested, and rolled back safely throughout development and production.

## 2. Migration Principles

* All schema changes must be version-controlled.
* Never make undocumented production database changes manually.
* Each migration must have a clear purpose and a unique, ordered identifier.
* Test migrations against a development database before applying them to production.
* Back up production data before risky migrations.
* Preserve existing customer, booking, quotation, payment, and audit history.
* Keep migrations consistent with approved database specifications.
* Do not store database credentials in source code or migration files.

## 3. Technology and Organization

Use PostgreSQL for the database and a migration tool compatible with the chosen Node.js backend stack. The exact tool will be selected during implementation.

Suggested structure:

```text
amx/
├── docs/
│   └── database/
│       └── migration-strategy.md
├── backend/
│   ├── migrations/
│   │   ├── 001_create_roles_and_users.sql
│   │   ├── 002_create_customers_and_providers.sql
│   │   └── ...
│   └── src/
└── ...
```

This is an illustrative structure. The final migration format and execution commands depend on the migration tool selected.

## 4. Migration Naming and Versioning

Use sequential identifiers and descriptive names, for example:

* `001_create_roles_and_users`
* `002_create_customers_and_providers`
* `003_create_packages_and_inquiries`
* `004_create_quotations_and_services`
* `005_create_bookings_and_services`
* `006_create_payments_and_follow_ups`
* `007_create_reviews_and_complaints`
* `008_create_audit_logs`
* `009_add_query_indexes`

Actual migrations may be split into smaller units to manage dependencies and reduce deployment risk.

The migration tool must track which migrations have already been applied. Never edit a migration that has already been applied to a shared or production database; create a new migration to correct or extend it.

## 5. Initial Migration Order

Create database objects in dependency order:

1. Enable only the approved PostgreSQL extensions, if required.
2. Create roles and users.
3. Create customers, providers, and packages.
4. Create inquiries.
5. Create quotations and quotation services.
6. Create bookings and booking services.
7. Create payments and follow-ups.
8. Create reviews and complaints.
9. Create audit logs.
10. Add required constraints, indexes, and supporting database functions or triggers, if approved.

Some constraints may need to be added after the initial table creation to resolve dependency or data-validation requirements.

## 6. Migration Workflow

For every migration:

1. **Specify:** Identify the requirement or defect that justifies the change.
2. **Design:** Update the relevant database specification.
3. **Implement:** Write a small, focused migration.
4. **Review:** Check keys, constraints, indexes, security, and data preservation.
5. **Test:** Apply it to a disposable or development database.
6. **Validate:** Test expected records, constraints, queries, and application behavior.
7. **Back up:** Confirm a recoverable backup before risky production changes.
8. **Apply:** Run the migration through the approved deployment process.
9. **Verify:** Confirm migration status and application health.
10. **Document:** Record the result and any follow-up work.

## 7. Development, Staging, and Production

| Environment | Migration policy                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------- |
| Development | Apply and test migrations frequently using non-production data.                                     |
| Staging     | Test the release process and migrations against a production-like schema.                           |
| Production  | Apply reviewed migrations through a controlled deployment process after backup and recovery checks. |

Use separate database credentials and configurations for each environment. Production data must not be copied into development without an approved privacy-safe process.

## 8. Data Changes and Backward Compatibility

For changes to existing data:

* Define how old records will be transformed.
* Validate the transformation before applying it.
* Preserve historical and financial information.
* Handle null values and duplicate records explicitly.
* Estimate the impact on table size, locks, and application availability.
* Use a staged migration for risky changes.

For changes that affect both schema and application code, prefer a staged approach:

1. Add the new schema without immediately removing the old structure.
2. Deploy code compatible with the transition.
3. Backfill and validate data where needed.
4. Switch application reads and writes.
5. Remove obsolete structures in a later migration after confirming they are no longer used.

## 9. Rollback and Recovery

A migration must have a documented recovery plan.

* Use a tested reverse migration when the change can be safely reversed.
* Do not assume that reversing schema changes restores deleted or transformed data.
* For destructive changes, rely on a verified backup or an explicit data-restoration plan.
* If a migration partially fails, determine whether the database is in a consistent state before retrying.
* Do not automatically roll back important production data changes without understanding their impact.
* Verify application health and data integrity after recovery.

Database backups and point-in-time recovery, where available, are separate from migration rollback and must be designed and tested independently.

## 10. Database Security

* Store database credentials in environment variables or an approved secrets-management mechanism.
* Use a migration account with the privileges required to change the schema.
* Do not use unrestricted administrative credentials for normal application operations.
* Restrict migration execution to authorized deployment personnel or automation.
* Keep secrets and real customer information out of migration files and logs.

## 11. Testing and Acceptance

Before a migration is approved, verify:

* [ ] It applies successfully to the intended database version.
* [ ] Foreign keys and constraints behave as expected.
* [ ] Existing records are preserved or transformed correctly.
* [ ] Unique indexes and constraints do not fail unexpectedly.
* [ ] Application queries continue to work.
* [ ] The migration's performance and locking impact are understood.
* [ ] The recovery procedure is documented for risky changes.
* [ ] The migration is committed to version control.
* [ ] The migration history matches the target database.

## 12. Decision

AMX will manage schema changes through version-controlled, sequential migrations, tested before production deployment. Financial and business history must be preserved, and destructive changes require an explicit recovery plan.

**Next document:** `docs/database/database-security.md`

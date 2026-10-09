# AMX Git Workflow

**Project:** AMX — Arba Minch Experiences
**Document:** `docs/implementation/git-workflow.md`
**Version:** 1.0

## 1. Purpose

Define how AMX source code and documentation are version-controlled, reviewed, tested, and integrated using Git and GitHub.

The workflow supports a solo developer working with AI coding agents while keeping changes traceable, recoverable, and maintainable.

## 2. Repository Strategy

* Use one Git repository for the AMX frontend, backend, database resources, infrastructure, and SDLC documentation.
* Use GitHub as the remote repository.
* Keep `main` as the stable integration branch.
* Use short-lived feature branches for individual tasks.
* Commit documentation changes alongside related implementation changes when appropriate.
* Never commit credentials, production data, or private customer information.

## 3. Branch Naming

Create a separate branch for each feature, fix, documentation task, or maintenance change.

| Branch type   | Naming convention            | Example                     |
| ------------- | ---------------------------- | --------------------------- |
| Feature       | `feat/short-description`     | `feat/public-inquiries`     |
| Bug fix       | `fix/short-description`      | `fix/quotation-total`       |
| Documentation | `docs/short-description`     | `docs/implementation-plan`  |
| Refactoring   | `refactor/short-description` | `refactor/inquiry-service`  |
| Testing       | `test/short-description`     | `test/payment-workflow`     |
| Maintenance   | `chore/short-description`    | `chore/update-dependencies` |

Use lowercase names with hyphens. Keep branches focused and delete merged branches when no longer needed.

## 4. Standard Workflow

1. Start from the latest `main` branch.
2. Create a branch for one clearly defined task.
3. Read the relevant requirements and design documents.
4. Implement the smallest complete change.
5. Run the required tests, linting, and build checks.
6. Review the diff for unintended changes, secrets, and security issues.
7. Commit the changes using the approved message convention.
8. Push the branch to GitHub.
9. Open a pull request or perform a documented self-review for solo development.
10. Merge only after required checks pass and outstanding critical issues are resolved.
11. Delete the merged branch and update the task status.

Do not develop directly on `main` for routine feature work.

## 5. Commit Message Convention

Use a consistent, descriptive format:

```text
type(scope): short description
```

Examples:

```text
docs(implementation): define repository structure
feat(inquiries): add public inquiry submission
feat(auth): add staff login
fix(quotations): prevent duplicate booking creation
test(payments): cover refund calculations
refactor(bookings): simplify status validation
chore(deps): update approved dependencies
```

### Commit rules

* Use imperative, concise descriptions.
* Keep each commit focused on a logical change.
* Avoid vague messages such as `update`, `changes`, or `fix stuff`.
* Do not include secrets, generated build artifacts, or unrelated formatting changes.
* Never rewrite shared history without agreement.

## 6. Pull Request and Review

Every pull request should describe:

* **Purpose:** What problem does this change solve?
* **Requirements:** Which requirement or task IDs does it address?
* **Changes:** What files, modules, or database objects changed?
* **Verification:** Which commands and tests were actually run?
* **Risks:** What security, data, or business-rule impacts exist?
* **Screenshots:** Include UI evidence for meaningful interface changes when useful.

### Review checklist

* [ ] Scope matches the task and approved documentation.
* [ ] Code follows `coding-standards.md`.
* [ ] No secrets or sensitive information are included.
* [ ] Input validation and backend authorization are correct.
* [ ] Business rules and database integrity are preserved.
* [ ] Relevant tests pass.
* [ ] Database migrations are included when required.
* [ ] API and project documentation are updated where necessary.
* [ ] No unrelated or unexplained changes remain.

For a solo developer, self-review is acceptable, but it must be deliberate and documented. Require additional review when collaborators are available, especially for financial logic, authentication, permissions, and migrations.

## 7. Main Branch Protection

Where GitHub settings permit, configure `main` to:

* Require pull requests for routine changes.
* Require configured automated checks to pass.
* Prevent force pushes.
* Restrict branch deletion.
* Require review for sensitive changes when another reviewer is available.

If working alone on a repository without enforced protection, follow the same process manually.

## 8. Git Commands

### Initial repository setup

```bash
git init
git add .
git commit -m "chore: initialize AMX repository"
git branch -M main
git remote add origin <GITHUB_REPOSITORY_URL>
git push -u origin main
```

Replace the placeholder with the actual GitHub repository URL.

### Start a new task

```bash
git switch main
git pull --ff-only origin main
git switch -c feat/public-inquiries
```

### Review and commit

```bash
git status
git diff
git diff --check
git add <FILES_TO_COMMIT>
git commit -m "feat(inquiries): add public inquiry submission"
```

Replace `<FILES_TO_COMMIT>` with the actual paths; inspect staged changes before committing.

### Push the branch

```bash
git push -u origin feat/public-inquiries
```

Then open a pull request on GitHub.

## 9. `.gitignore` Requirements

Ensure the repository excludes at least:

```gitignore
node_modules/
.next/
dist/
build/
coverage/

.env
.env.*
!.env.example

*.log
.DS_Store

# Local database and backup files
*.dump
*.sql.gz
backups/

# Local editor settings
.vscode/
.idea/
```

**Important:** Review these patterns against the actual project. Track legitimate database migrations and safe seed files. Do not exclude the `database/migrations/` directory. Avoid committing real backups or database exports, which may contain personal information.

## 10. Database and Documentation Changes

* Keep every database schema change in a version-controlled migration.
* Never edit an already-applied shared or production migration to change its historical behavior; create a new migration instead.
* Test migrations against a disposable development or test database.
* Document breaking API changes and relevant business-rule changes.
* Update the relevant requirements or design documents when an approved decision changes.
* Keep secrets and production data out of fixtures and examples.
* Review rollback or recovery implications before applying destructive migrations.

## 11. AI Coding Agent Rules

Before using an AI agent:

1. Create or select the correct task branch.
2. Provide the exact task, relevant documentation, and acceptance criteria.
3. Limit changes to the task's scope.
4. Review all modified and newly created files.
5. Inspect commands the agent ran and verify their results.
6. Run required checks yourself when practical.
7. Review dependency changes, security-sensitive code, and database migrations carefully.
8. Commit only reviewed work.

Do not allow an AI agent to push directly to `main`, expose secrets, or perform destructive Git operations without explicit review.

## 12. Recovery and Troubleshooting

* Use `git status` and `git diff` before discarding or resetting changes.
* Prefer `git revert` for undoing changes already shared through the main branch.
* Do not use `git reset --hard` or force-push shared branches casually.
* Resolve merge conflicts carefully and rerun relevant checks.
* Back up important local uncommitted work before major refactoring.
* Treat Git history as source-code history, not as a replacement for secure database backups.

## 13. Definition of Done

A Git task is complete when:

* Changes are committed on the appropriate branch.
* The commit message describes the change clearly.
* Relevant checks have been run and recorded.
* The diff has been reviewed.
* No secrets or unintended files are included.
* Required review and merge steps are complete.
* The task and documentation accurately reflect the final result.

## 14. Next Document

Create `docs/implementation/development-environment.md` to define local prerequisites, application configuration, Docker services, environment variables, and setup verification.

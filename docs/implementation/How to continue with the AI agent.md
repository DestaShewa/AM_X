How to continue with the AI agent

After the initial instruction, don't repeatedly explain the whole project.

For each slice, use this pattern:

Read the relevant documentation first. Inspect the current implementation. We are implementing [SLICE NAME]. Before coding, give me the implementation plan, affected files/modules, database changes, API changes, security rules, validation rules, UI changes, and tests. Do not code yet.

Then after reviewing its plan:

Approved. Implement this slice only. Follow the project documentation and existing architecture. Do not modify unrelated areas.

After implementation:

Now review the implementation against the documentation. Run the relevant tests, identify defects, fix them, and report what remains. Do not start the next slice.

Then manually verify it yourself.

Then:

The slice is verified. Update the relevant implementation documentation and prepare the Git commit.

Then move to the next slice.
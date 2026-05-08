# Ship Verified

Build, verify, ship, and merge a slice using a phased workflow. Stop between each phase and wait for the user.

## Trigger

User says `ship-verified`, `build this slice`, pastes a handoff prompt for a CX-tagged slice, or says `ship it`, `merge it`, or `next slice`.

## Inputs

- `AGENTS.md` — agent-level rules.
- `docs/PLAN.md` — the high-level project plan.
- `docs/CONTEXT.md` — established patterns, conventions, decisions.
- `docs/SLICES.md` — the slice definitions.
- Package scripts and relevant source files.

## Process

### Build phase

Default phase for all implementation requests.

1. Confirm the repo path and inspect `git status`.
2. Check the current branch. If already on a `slice-*` feature branch (e.g. inside a worktree), confirm it matches the target slice and continue. If on `main` or a non-slice branch, start from clean synced `main` and create a feature branch. Do not create a second branch when one already exists for this slice.
3. Read AGENTS.md, docs/PLAN.md, docs/CONTEXT.md, package scripts, and relevant source files.
4. Identify the requested slice/task and state the scope.
5. Make the smallest sufficient change, preserving existing style and avoiding unrelated files.
6. Run the repo's required checks. Prefer package-manager scripts already defined by the project.
7. Verify behavior concretely:
   - Frontend/UI: run the dev server, open the changed route/flow, verify visual state plus interaction.
   - Backend/background: exercise the workflow with fixtures, direct function calls, scripts, API calls, job triggers, logs, database rows, or generated records.
   - Mixed: verify both backend behavior and frontend result.
8. Review the diff. Flag:
   - Files changed that are outside the slice scope
   - Dead code or unused imports added
   - Over-broad refactors not requested
   - Missing error or loading states
9. Run `bun test`.
10. If this slice added new behavior, write tests for it. Colocate test files as `.test.ts` next to the source. If unclear which behavior to test, ask the user.
11. All tests must pass before stopping.
12. Stop before committing. Summarize what changed, checks passed, tests added, tests passing, what the user should review, and known risks.

Do not commit, push, or create a PR during Build Phase unless the user explicitly says to ship.

### Ship phase

Start only when the user says `ship it`, `commit and push`, or `create the PR`.

1. Re-check status and diff.
2. Re-run relevant checks if code changed since the last successful check.
3. Commit only the coherent reviewed change set.
4. Push the feature branch.
5. Create a PR.
6. Stop before merging.
7. Summarize commit, branch, PR link, checks, verification, and risks.

### Merge phase

Start only when the user says `merge it` or explicitly asks to merge.

1. Verify the PR is open and mergeable.
2. Merge through the PR flow, not by pushing directly to `main`.
3. Sync the local `main` ref with origin. If inside a worktree, run `git fetch origin main:main` — do not run `git checkout main` because main is checked out in the primary worktree. If not in a worktree, pull main normally.
4. Confirm the merge landed on origin/main.
5. Shut down any dev or preview server started for the slice unless the user explicitly asks to keep it running.
6. Produce the next-chat handoff prompt unless the user asks not to.

## Output

End of Build Phase: summary of what changed, checks, tests, what to review, risks.

End of Ship Phase: commit hash, branch name, PR link, checks, verification, risks.

End of Merge Phase: confirmation of merge + next-chat handoff prompt using this shape:

```md
We are working in <repo path>.

Current state:
- <previous slice> is complete, merged to main.
- <plan file> is the source of truth.
- Follow AGENTS.md.
- Use ship-verified's phased workflow:
  - Build phase: branch, implement, checks, verify, review diff, stop before commit.
  - Ship phase: commit, push, create PR, stop before merge.
  - Merge phase: merge only if asked, sync main ref, shut down preview, produce next prompt.

Execute only:

#### <Next Slice Title>

Run `/worktree-open <N>` first, then `cd` into the worktree and read <plan file>.
Implement <next slice> only.

Important:
- Build phase only unless I explicitly say "ship it".
- Do not execute future slices.
- Preserve the slice non-goals.
- Use existing project patterns and design/system conventions.
- Run the relevant checks.
- Verify behavior before stopping.

At the end, summarize:
- What changed
- What checks passed
- What behavior was verified
- What I should review manually
- Any known risks
```

## Rules

- Execute only the named/inferred slice. Do not implement future slices.
- Preserve the slice's stated non-goals.
- If "next slice" is ambiguous, inspect the plan and git history, then state the inferred next slice before implementing.
- Use the slice's requested ship message during Ship Phase when one is provided.
- Do not leave localhost servers running after Merge Phase unless the user explicitly asks.

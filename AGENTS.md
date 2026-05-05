## Stack

- SvelteKit + TypeScript + Tailwind v4
- Convex (database + functions)
- Convex Auth (sign in / session)
- Stripe (payments)
- Resend (email)
- Railway (deploy)
- Design system: @askoliveira/ui (imported in src/app.css)

## Rules

- Smallest sufficient change. Follow existing patterns.
- No unrelated files. No new deps unless required.
- Use pnpm, never npm.
- Use design tokens from @askoliveira/ui. Don't introduce new colors,
  fonts, or radii.
- Inspect -> Plan -> Implement -> Review diff -> Run checks -> Fix failures.
- Never claim tests passed if not run.

## Verified Shipping Rhythm

Every meaningful change must be shipped with concrete proof that it works.

### Standard Flow

1. Create or switch to a feature branch before editing.
2. Inspect the relevant files and existing patterns.
3. Plan the smallest sufficient change.
4. Implement only the requested scope.
5. Run required checks.
6. Verify behavior concretely before committing.
7. Review the diff.
8. Commit a coherent change set.
9. Push the branch.
10. Create a PR when requested or expected.

Never push directly to `main`.

### Checks

After every meaningful code change:

1. Run the project typecheck/check command, if available.
2. Run the project lint command, if available.
3. Run tests, if available.
4. Run build, if available.

Never claim a check passed unless it was actually run.

### Frontend/UI Verification

For frontend or UI changes:

1. Start the local dev server.
2. Open the changed route or flow in the in-app browser.
3. Verify the visible states, layout, navigation, and interactions affected by the change.
4. Fix visual issues before committing.
5. Mention what was visually verified in the final summary.

### Backend/Background Verification

For backend, data, API, job, parser, detector, or integration changes:

1. Exercise the changed workflow with fixtures, scripts, endpoint calls, direct function calls, or job triggers.
2. Inspect observable effects: response payloads, logs, generated records, database rows, persisted state, files, or side effects.
3. Verify important empty/error states when they are part of the change.
4. Mention what behavior was verified in the final summary.

### Final Summary

At the end, summarize:

- What changed
- What checks passed
- What behavior was verified
- What was committed/pushed/PR'd
- Any checks not run
- Any known risks

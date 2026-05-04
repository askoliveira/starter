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

## Shipping Protocol

After every meaningful code change:

1. Run `pnpm run check`.
2. Run `pnpm run lint`.
3. Run tests if available.
4. Run build if available.
5. Review the diff.
6. Commit only coherent changes.
7. Never push directly to `main`.
8. Use `./ship "message"` only from a feature branch.

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

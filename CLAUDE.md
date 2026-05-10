# {PROJECT_NAME}

## What this is

{One paragraph. What the app does, who it's for.}

## Stack

SvelteKit, TypeScript, Tailwind CSS, Convex, Railway

## Conventions

- Components: PascalCase, one per file, src/lib/components/
- Stores: camelCase, src/lib/stores/
- Types: src/lib/types.ts — extend, don't duplicate
- Error handling: try/catch at API boundaries, let errors bubble in components
- Tests: colocated .test.ts files

## Commands

- Dev: pnpm dev
- Build: pnpm build
- Check: pnpm check
- Lint: pnpm lint
- Test: pnpm test, when a test script exists
- UI: pnpm ui <brutal|northbound|stratum>

## Design system

Choose exactly one UI system per project: `brutal`, `northbound`, or
`stratum`.

- Select it with `pnpm ui <choice>`.
- The selected system is copied to `src/app.css`.
- Source variants live in `src/lib/styles/design-systems/`.
- Do not invent new colors, fonts, radii, shadows, or spacing tokens. Use the
  selected system.

## Rules

- Read docs/PLAN.md and docs/SLICES.md before acting
- Read docs/CONTEXT.md for current conventions
- Only build what the current slice asks for
- Do not refactor unrelated code
- After integration passes, update docs/CONTEXT.md
- Run tests before stopping when a test script exists
- Write tests for new behavior when building slices

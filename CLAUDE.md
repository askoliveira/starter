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
- Test: bun test
- Lint: pnpm lint

## Design system

@askoliveira/ui tokens. Dark mode. See src/lib/styles/

## Rules

- Read docs/PLAN.md and docs/SLICES.md before acting
- Read docs/CONTEXT.md for current conventions
- Only build what the current slice asks for
- Do not refactor unrelated code
- After integration passes, update docs/CONTEXT.md
- Run bun test before stopping
- Write tests for new behavior when building slices

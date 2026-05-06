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

## Commands

- Dev: pnpm dev
- Build: pnpm build
- Test: bun test

## Design system

@askoliveira/ui tokens. Dark mode. See src/lib/styles/

## Rules

- Read docs/PLAN.md and docs/CONTEXT.md before building
- Only build what the current slice asks for
- Do not refactor unrelated code
- Do not create files outside the slice's file list
- Run dev server and verify before marking done
- When done, summarize what was built and what was skipped

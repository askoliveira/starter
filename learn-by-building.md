# Learn By Building

Teach from the actual code in front of the user. Favor concrete files, route paths, function names, UI states, logs, and small exercises over abstract tutorials.

## Trigger

User says `learn-by-building`, `explain this slice`, `walk me through this`, `teach me what just happened`, or asks to understand a slice, feature, bugfix, pull request, codebase area, framework syntax, folder structure, runtime flow, UI behavior, or backend behavior.

## Inputs

- The learning target: a recent change, slice, route, component, API, job, module, or PR.
- `docs/CONTEXT.md` — established patterns and conventions.
- Relevant source files in the repo.

## Process

1. Identify the learning target from the user's request or the most recent slice.
2. Inspect the relevant files and repo conventions before explaining. Use line numbers for important files.
3. Build a folder map showing only the files that matter for the lesson.
4. Explain the runtime flow: what loads first, what calls what, what renders or runs next, and where data/state enters.
5. Walk file-by-file from outer shell to inner details.
6. Explain framework syntax in context, using the exact code the user is seeing.
7. Connect code to behavior: visual UI, HTTP response, database effect, generated file, logs, or test output.
8. End with one small exercise or prediction prompt that helps the user actively learn.
9. Append a slice log entry to `docs/CONTEXT.md` under the `## Slice log` section:
   ```md
   ### Slice {N} — {title}
   - **Does**: {one sentence}
   - **Flow**: {input → transform → output, with file paths}
   - **Key files**: {file → why it exists}
   - **Connects to**: {what depends on this}
   ```
   Keep it to 3-5 lines. Write for a tool that has never seen this codebase.
10. If this slice established new conventions, also update the Patterns or Conventions sections at the top of CONTEXT.md.

## Output

A layered explanation following this structure:

- **Folder structure** — concise tree of relevant files.
- **Big picture** — one short mental model or diagram.
- **File walkthrough** — why each file exists and what its key lines do.
- **Syntax notes** — framework/language constructs used in those files.
- **Connections** — how route/component/function/state/data flows through the system.
- **Verification** — how to see or test this behavior.
- **Practice** — one tiny next exercise.

For frontend: tie component files to visible regions of the screen. Explain layout, props, slots/snippets, state, events, route state, styling, and design tokens in context. For SvelteKit, emphasize file-based routing, `+layout.svelte`, `+page.svelte`, `$lib`, `$app/state`, and scoped component styles.

For backend: trace one request, job run, or function call from input to output. Show where validation, transformation, persistence, side effects, and errors happen. Include a small command or test the user can run to observe behavior.

## Rules

- Do not edit code unless the user asks for changes.
- Do not turn the lesson into generic docs detached from the codebase.
- Do not overwhelm the user with every file. Select the fundamental files for the learning goal.
- When the user is learning a framework, explain syntax by pointing to concrete local examples first.

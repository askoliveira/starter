# Project Context

Last updated: {date}, after Slice {N}

## Patterns established

- {e.g., "EvidenceEvent is the core type — all parsers output this"}
- UI systems are selected with `pnpm ui <brutal|northbound|stratum>`, which copies a
  source CSS file into `src/app.css`.

## Naming conventions

- {e.g., "Parsers live in src/lib/parsers/, one per filing type"}

## Known quirks

- {e.g., "EDGAR rate limit is 10 req/sec, handled in edgar.ts with delay()"}

## Integration notes

- {e.g., "DigestHeader reads from the digest store, not props"}

## Slice log

Appended by learn-by-building after each slice is verified. Newest at bottom. 3-5 lines max per entry.

This is how the project accumulates knowledge. Both tools read this before acting. Claude Code reads it during seam-check. Codex reads it before ship-verified. You read it when you come back after a week.

### Slice 01 — {title}

- **Does**: {one sentence}
- **Flow**: {input → transform → output, with file paths}
- **Key files**: {file → why it exists}
- **Connects to**: {what depends on this or what this depends on}

### Slice 00 — Selectable UI systems

- **Does**: Lets each new project choose exactly one visual system: brutal, northbound, or stratum.
- **Flow**: `pnpm ui <choice>` → `scripts/select-ui.mjs` → copies `src/lib/styles/design-systems/<choice>.css` into `src/app.css`.
- **Key files**: `scripts/select-ui.mjs` validates choices; `src/lib/styles/design-systems/` stores source variants; `src/app.css` is the active system.
- **Connects to**: `$scaffold`, `$project-spinup`, `AGENTS.md`, and `CLAUDE.md` all expect a UI choice during setup.

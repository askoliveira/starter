#!/usr/bin/env node
// scripts/validate-context.mjs — schema gate for the latest docs/CONTEXT.md slice entry.
//
// Wired as: "validate:context": "node scripts/validate-context.mjs"
//
// Validates that the most recent slice log entry in docs/CONTEXT.md:
//   1. Has a header "### SLICE-NNN — {title}".
//   2. Matches the active slice id in .codex/current-slice.json (if present).
//      This catches the failure mode where the wrong entry was updated, or the
//      entry was not updated at all.
//   3. Contains the seven required sections, in this exact order, with exact
//      names and non-empty content:
//        Does, Flow, Key files, Surface area, Breaking changes,
//        Connects to, Next slice depends on this for
//
// "None" / "Nothing" count as non-empty content.
//
// Exit 0 = valid. Non-zero = stop; fix CONTEXT.md before shipping.

import { readFileSync, existsSync } from 'node:fs';

const CONTEXT_PATH = 'docs/CONTEXT.md';
const STATE_PATH = '.codex/current-slice.json';

const SECTIONS = [
	'Does',
	'Flow',
	'Key files',
	'Surface area',
	'Breaking changes',
	'Connects to',
	'Next slice depends on this for'
];

function fail(msg) {
	console.error('VALIDATE-CONTEXT FAILED:');
	const list = Array.isArray(msg) ? msg : [msg];
	for (const m of list) console.error('  - ' + m);
	process.exit(1);
}

function escapeRe(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

if (!existsSync(CONTEXT_PATH)) fail(`${CONTEXT_PATH} not found`);
const lines = readFileSync(CONTEXT_PATH, 'utf8').split('\n');

// Find all entry headers: ### SLICE-NNN — title  (em dash, en dash, or hyphen)
const headerRe = /^###\s+(SLICE-\d{3})\s+[—–-]\s+(.+?)\s*$/;
const headers = [];
lines.forEach((line, i) => {
	const m = line.match(headerRe);
	if (m) headers.push({ index: i, id: m[1], title: m[2] });
});

if (headers.length === 0) {
	fail("no slice entry found (expected '### SLICE-NNN — title')");
}

const latest = headers[headers.length - 1];

// Cross-check against the active slice id, if a state file exists.
if (existsSync(STATE_PATH)) {
	let expectedId = null;
	try {
		expectedId = JSON.parse(readFileSync(STATE_PATH, 'utf8')).id;
	} catch {
		fail(`${STATE_PATH} is not valid JSON`);
	}
	if (expectedId && latest.id !== expectedId) {
		fail(
			`latest CONTEXT.md entry is ${latest.id}, but the active slice is ${expectedId}. ` +
				`The latest entry must be the slice being shipped — the wrong entry was updated, ` +
				`or the entry for ${expectedId} is missing.`
		);
	}
} else {
	console.log('NOTE: no .codex/current-slice.json — skipping slice-id cross-check');
}

// Body of the latest entry: from its header to the next markdown header (level 1-3) or EOF.
let end = lines.length;
for (let i = latest.index + 1; i < lines.length; i++) {
	if (/^#{1,3}\s/.test(lines[i])) {
		end = i;
		break;
	}
}
const body = lines.slice(latest.index + 1, end);

// Locate each required section: "- **Name**: content"
const problems = [];
const found = [];

for (const name of SECTIONS) {
	const re = new RegExp(`^\\s*-\\s*\\*\\*${escapeRe(name)}\\*\\*\\s*:\\s*(.*)$`);
	let lineInBody = -1;
	let content = '';
	for (let i = 0; i < body.length; i++) {
		const m = body[i].match(re);
		if (m) {
			lineInBody = i;
			content = m[1].trim();
			break;
		}
	}
	if (lineInBody === -1) {
		problems.push(`missing section: **${name}**`);
	} else {
		if (content === '') {
			problems.push(`empty content for section: **${name}** (use "None" if not applicable)`);
		}
		found.push({ name, lineInBody });
	}
}

// Order check: sections must appear in canonical order.
if (found.length === SECTIONS.length) {
	for (let i = 1; i < found.length; i++) {
		if (found[i].lineInBody < found[i - 1].lineInBody) {
			problems.push(
				`section out of order: **${found[i].name}** appears before **${found[i - 1].name}**`
			);
		}
	}
}

if (problems.length) fail(problems);

console.log(
	`VALIDATE-CONTEXT OK — ${latest.id} (${SECTIONS.length}/${SECTIONS.length} sections, in order)`
);

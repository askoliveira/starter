#!/usr/bin/env node
// scripts/diff-guard.mjs — scope guardrail.
//
// Wired as: "diff:guard": "node scripts/diff-guard.mjs"
// Called as: pnpm diff:guard <maxLines> <maxFiles>
//
// Fails if the current branch's diff against main exceeds its width budget.
// The budget comes from the slice's "Width budget" field in PLAN.md; pass it
// as arguments (or via MAX_LINES / MAX_FILES env vars). Defaults are a sane
// tripwire, not a hard rule — tune per project.
//
// Checks SIZE and SCOPE only. It does not judge quality — that is the
// code-reviewer agent's job.
//
// Exit 0 = within budget. Non-zero = scope likely inflated; split the slice.

import { execSync } from 'node:child_process';

const maxLines = Number(process.argv[2] ?? process.env.MAX_LINES ?? 400);
const maxFiles = Number(process.argv[3] ?? process.env.MAX_FILES ?? 15);
const base = process.env.DIFF_BASE ?? 'main';

let numstat = '';
try {
	numstat = execSync(`git diff ${base} --numstat`, { encoding: 'utf8' });
} catch {
	console.error(`diff-guard: could not diff against "${base}"`);
	process.exit(1);
}

let files = 0;
let lines = 0;
for (const row of numstat.trim().split('\n').filter(Boolean)) {
	const [add, del] = row.split('\t');
	files++;
	// binary files report "-" for add/del → Number("-") is NaN → treat as 0
	lines += (Number(add) || 0) + (Number(del) || 0);
}

console.log(
	`diff vs ${base}: ${files} files, ${lines} changed lines ` +
		`(budget: ${maxFiles} files / ${maxLines} lines)`
);

const problems = [];
if (files > maxFiles) problems.push(`too many files changed (${files} > ${maxFiles})`);
if (lines > maxLines) problems.push(`diff too large (${lines} > ${maxLines} lines)`);

if (problems.length) {
	console.error('DIFF-GUARD FAILED — slice scope likely inflated:');
	for (const p of problems) console.error('  - ' + p);
	console.error('Split the slice before proceeding.');
	process.exit(1);
}
console.log('DIFF-GUARD OK');

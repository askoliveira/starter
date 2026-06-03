#!/usr/bin/env node
// scripts/verify.mjs — single verification gate.
//
// Wired as: "verify": "node scripts/verify.mjs"
//
// Runs every check defined in package.json (typecheck, lint, format, build,
// tests) and exits non-zero if any fail. Skips — loudly — any step whose
// script is not defined, so the same gate works across projects.
//
// Exit 0 = accepted. Non-zero = a check failed; the slice is not done.
//
// This is the proof of acceptance. Its output is pasted into the build
// summary. A claim of "checks passed" without this output is not acceptance.

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const scripts = JSON.parse(readFileSync('./package.json', 'utf8')).scripts || {};

// [label, package.json script name]
const steps = [
	['typecheck', 'check'],
	['lint', 'lint'],
	['format', 'format:check'],
	['build', 'build'],
	['tests', 'test']
];

const failed = [];

for (const [label, script] of steps) {
	if (!scripts[script]) {
		console.log(`SKIP: no "${script}" script defined (${label})`);
		continue;
	}
	console.log(`\n── ${label} (pnpm run ${script})`);
	try {
		execSync(`pnpm run ${script}`, { stdio: 'inherit' });
		console.log(`OK: ${label}`);
	} catch {
		console.log(`FAIL: ${label}`);
		failed.push(label);
	}
}

console.log('\n────────────');
if (failed.length) {
	console.error(`VERIFY FAILED: ${failed.join(', ')}`);
	process.exit(1);
}
console.log('VERIFY OK');

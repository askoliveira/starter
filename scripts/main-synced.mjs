#!/usr/bin/env node
// scripts/main-synced.mjs — post-merge sync gate.
//
// Wired as: "main:synced": "node scripts/main-synced.mjs"
//
// Confirms, after merging and pulling: current branch is main, working tree is
// clean, and local HEAD equals origin/main. Exit 0 = local main matches origin.

import { execSync } from 'node:child_process';

function git(cmd) {
	// capture (not inherit) stderr so git's own fatals don't leak; we emit our own messages
	return execSync(`git ${cmd}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

const problems = [];

let branch = '';
try {
	branch = git('rev-parse --abbrev-ref HEAD');
} catch {
	problems.push('not a git repository');
}
if (branch && branch !== 'main') problems.push(`on branch "${branch}", expected "main"`);

try {
	if (git('status --porcelain')) problems.push('working tree is not clean');
} catch {
	/* already reported */
}

try {
	git('fetch origin main --quiet');
	const head = git('rev-parse HEAD');
	const origin = git('rev-parse origin/main');
	if (head !== origin) {
		problems.push(`local main (${head.slice(0, 7)}) != origin/main (${origin.slice(0, 7)})`);
	}
} catch {
	problems.push('could not compare against origin/main');
}

if (problems.length) {
	console.error('MAIN:SYNCED FAILED:');
	for (const p of problems) console.error('  - ' + p);
	process.exit(1);
}
console.log('MAIN:SYNCED OK — local main matches origin/main');

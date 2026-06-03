#!/usr/bin/env node
// scripts/merge-ready.mjs — pre-merge gate.
//
// Wired as: "merge:ready": "node scripts/merge-ready.mjs"
// Called as: pnpm merge:ready <pr-number-or-url>
//
// Uses gh to confirm the PR is safe to merge: open, no conflicts, no
// unresolved "changes requested", and no failing or pending CI checks.
// A PR with no CI checks is allowed but noted. Exit 0 = safe to merge.

import { execSync } from 'node:child_process';

const pr = process.argv[2];
if (!pr) {
	console.error('MERGE:READY FAILED: pass the PR number or URL');
	process.exit(1);
}

let data;
try {
	const out = execSync(`gh pr view ${pr} --json state,mergeable,reviewDecision,statusCheckRollup`, {
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe']
	});
	data = JSON.parse(out);
} catch {
	console.error(`MERGE:READY FAILED: could not read PR ${pr} via gh`);
	process.exit(1);
}

const problems = [];

if (data.state !== 'OPEN') problems.push(`PR state is ${data.state}, expected OPEN`);
if (data.mergeable === 'CONFLICTING') problems.push('PR has merge conflicts');
if (data.mergeable === 'UNKNOWN')
	console.log('NOTE: GitHub is still computing mergeability (UNKNOWN)');
if (data.reviewDecision === 'CHANGES_REQUESTED')
	problems.push("PR has unresolved 'changes requested'");

const checks = data.statusCheckRollup || [];

const bad = (c) => {
	const v = (c.conclusion || c.state || '').toUpperCase();
	return ['FAILURE', 'ERROR', 'CANCELLED', 'TIMED_OUT'].includes(v);
};
const pending = (c) => {
	const status = (c.status || '').toUpperCase();
	const state = (c.state || '').toUpperCase();
	return (status && status !== 'COMPLETED') || state === 'PENDING';
};

const failing = checks.filter(bad);
const inflight = checks.filter(pending);

if (failing.length)
	problems.push(`failing checks: ${failing.map((c) => c.name || c.context).join(', ')}`);
if (inflight.length)
	problems.push(`pending checks: ${inflight.map((c) => c.name || c.context).join(', ')}`);
if (checks.length === 0) console.log('NOTE: PR has no CI checks');

if (problems.length) {
	console.error('MERGE:READY FAILED:');
	for (const p of problems) console.error('  - ' + p);
	process.exit(1);
}
console.log(`MERGE:READY OK — PR ${pr} is mergeable`);

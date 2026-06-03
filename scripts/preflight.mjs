#!/usr/bin/env node
// scripts/preflight.mjs — deterministic preflight gate.
//
// Wired as: "preflight": "node scripts/preflight.mjs"
//
// Rule: every key declared in .env.example must exist in .env.
// A key may be empty in .env ONLY if it is also empty in .env.example.
// This preserves intentionally-empty keys (e.g. KINDE_AUDIENCE, which the
// kinde-supabase-auth skill requires to be empty) while still catching a
// real value that was forgotten.
//
// Also fails if the git working tree is dirty.
//
// Exit 0 = ready to build. Non-zero = stop and fix.

import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

function parseEnv(path) {
	if (!existsSync(path)) return null;
	const out = {};
	for (let line of readFileSync(path, 'utf8').split('\n')) {
		line = line.trim();
		if (!line || line.startsWith('#')) continue;
		line = line.replace(/^export\s+/, '');
		const eq = line.indexOf('=');
		if (eq === -1) continue;
		const key = line.slice(0, eq).trim();
		let val = line.slice(eq + 1).trim();
		if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
			val = val.slice(1, -1);
		}
		out[key] = val;
	}
	return out;
}

const problems = [];

const example = parseEnv('.env.example');
const env = parseEnv('.env');

if (!example) problems.push('.env.example not found');
if (!env) problems.push('.env not found');

if (example && env) {
	for (const [key, exampleVal] of Object.entries(example)) {
		if (!(key in env)) {
			problems.push(`missing key: ${key}`);
		} else if (exampleVal !== '' && env[key] === '') {
			problems.push(`empty value for required key: ${key}`);
		}
		// exampleVal === "" && env[key] === ""  →  intentionally empty, allowed.
	}
}

let dirty = '';
try {
	dirty = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
} catch {
	// not a git repo or git unavailable; skip the clean-tree check
}
if (dirty) problems.push('working tree is not clean (commit or stash first)');

if (problems.length) {
	console.error('PREFLIGHT FAILED:');
	for (const p of problems) console.error('  - ' + p);
	process.exit(1);
}
console.log('PREFLIGHT OK');

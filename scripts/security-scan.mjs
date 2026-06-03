#!/usr/bin/env node
// scripts/security-scan.mjs — deterministic security pre-scan.
//
// Wired as: "security:scan": "node scripts/security-scan.mjs"
//
// Catches the mechanical, always-wrong security mistakes so the
// security-reviewer agent can spend its judgment on logic-level issues
// (authorization, IDOR, data exposure) instead of hunting these by eye.
//
// Checks (SvelteKit + Supabase + Kinde conventions):
//   1. SERVICE_ROLE referenced outside server-only files.
//   2. PUBLIC_ env vars in .env.example whose name implies a secret.
//   3. Tables created in supabase/migrations without RLS enabled.
//      Escape hatch: a SQL comment "-- rls-exempt: <table>" anywhere in the
//      migrations marks a table as a deliberate, git-auditable exception.
//   4. Known secret-prefix literals hardcoded in source.
//
// Exit 0 = clean. Non-zero = stop; these are not judgment calls.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const problems = [];

function walk(dir, exts, out = []) {
	if (!existsSync(dir)) return out;
	for (const entry of readdirSync(dir)) {
		if (['node_modules', '.git', '.svelte-kit', 'build', 'dist'].includes(entry)) continue;
		const p = join(dir, entry);
		const s = statSync(p);
		if (s.isDirectory()) walk(p, exts, out);
		else if (exts.includes(extname(p))) out.push(p);
	}
	return out;
}

// SvelteKit server-only conventions: code that never reaches the client bundle.
function isServerOnly(path) {
	const p = path.replace(/\\/g, '/');
	return (
		p.includes('/lib/server/') ||
		/\.server\.(ts|js)$/.test(p) ||
		/\+server\.(ts|js)$/.test(p) ||
		/hooks\.server\.(ts|js)$/.test(p)
	);
}

const srcFiles = walk('src', ['.ts', '.js', '.svelte']);

// 1. SERVICE_ROLE outside server-only files
for (const f of srcFiles) {
	const text = readFileSync(f, 'utf8');
	if (/SERVICE_ROLE/.test(text) && !isServerOnly(f)) {
		problems.push(`SERVICE_ROLE referenced in non-server file: ${f}`);
	}
}

// 2. secret-like PUBLIC_ vars in .env.example
if (existsSync('.env.example')) {
	const secretWords = /(SECRET|PASSWORD|PRIVATE|SERVICE_ROLE)/;
	for (let line of readFileSync('.env.example', 'utf8').split('\n')) {
		line = line.trim();
		if (!line || line.startsWith('#')) continue;
		const key = line.split('=')[0].trim();
		if (key.startsWith('PUBLIC_') && secretWords.test(key)) {
			problems.push(`secret-like var exposed with PUBLIC_ prefix (bundled to client): ${key}`);
		}
	}
}

// 3. tables without RLS in migrations
const migDir = 'supabase/migrations';
if (existsSync(migDir)) {
	const sql = walk(migDir, ['.sql'])
		.map((f) => readFileSync(f, 'utf8'))
		.join('\n')
		.toLowerCase();

	const exempt = new Set([...sql.matchAll(/--\s*rls-exempt:\s*([a-z0-9_]+)/g)].map((m) => m[1]));

	const created = [
		...sql.matchAll(/create\s+table\s+(?:if\s+not\s+exists\s+)?["`]?([a-z0-9_."]+)["`]?/g)
	].map((m) => m[1].replace(/["`]/g, '').split('.').pop());

	for (const table of new Set(created)) {
		if (exempt.has(table)) continue;
		const rlsRe = new RegExp(
			`alter\\s+table\\s+["\`]?(?:[a-z0-9_]+\\.)?${table}["\`]?\\s+enable\\s+row\\s+level\\s+security`
		);
		if (!rlsRe.test(sql)) {
			problems.push(
				`table "${table}" created without RLS (add "enable row level security", or "-- rls-exempt: ${table}" if intentional)`
			);
		}
	}
}

// 4. hardcoded secret-prefixed literals
const secretPrefixes = /(sk_live_|sk_test_|rk_live_|whsec_|github_pat_|ghp_)[A-Za-z0-9]/;
for (const f of srcFiles) {
	if (secretPrefixes.test(readFileSync(f, 'utf8'))) {
		problems.push(`hardcoded secret-prefixed literal in: ${f}`);
	}
}

if (problems.length) {
	console.error('SECURITY:SCAN FAILED:');
	for (const p of problems) console.error('  - ' + p);
	process.exit(1);
}
console.log('SECURITY:SCAN OK — no mechanical security issues found');

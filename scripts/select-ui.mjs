#!/usr/bin/env node
import { copyFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const choices = new Set(['brutal', 'northbound', 'stratum']);
const choice = process.argv[2];

if (!choices.has(choice)) {
	console.error('Usage: pnpm ui <brutal|northbound|stratum>');
	process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src', 'lib', 'styles', 'design-systems', `${choice}.css`);
const target = path.join(root, 'src', 'app.css');

try {
	await access(source, constants.R_OK);
	await copyFile(source, target);
	console.log(`Selected UI system: ${choice}`);
} catch (error) {
	console.error(`Could not select UI system "${choice}".`);
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
}

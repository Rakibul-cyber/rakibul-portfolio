#!/usr/bin/env node
/**
 * Deploy gate: everything the build-output test checks, plus no `data-todo`
 * markers anywhere in dist/ (e.g. the Impressum postal address placeholder).
 * CI runs this before publishing to gh-pages; it must pass for a deploy.
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
if (!existsSync(dist)) {
  console.error('dist/ missing: run `npm run build` first.');
  process.exit(1);
}

const tests = spawnSync(
  process.execPath,
  [
    '--test',
    'tests/repo-hygiene.test.mjs',
    'tests/build-output.test.mjs',
    'tests/content-preservation.test.mjs',
  ],
  { cwd: root, stdio: 'inherit' },
);
let failed = tests.status !== 0;

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const todos = [];
for (const file of walk(dist).filter((f) => f.endsWith('.html'))) {
  for (const m of readFileSync(file, 'utf8').matchAll(/data-todo="([^"]+)"/g)) {
    todos.push(`${path.relative(dist, file)}: ${m[1]}`);
  }
}
if (todos.length > 0) {
  failed = true;
  console.error('\nDeploy blocked: owner content still missing (data-todo markers):');
  for (const t of todos) console.error(`  - ${t}`);
}

// Files that must never be published, identified by SHA-256 only (no content in the repo).
// aa92128d…: CV version that contains the owner's street address. Replace
// public/CV_MD_Rakibul_Hassan.pdf with the address-free version before deploying.
const BLOCKED = {
  'CV_MD_Rakibul_Hassan.pdf': ['aa92128d171014900049d96408769832843276f710c6974fbeaabf5ed8e6b311'],
};
for (const [file, hashes] of Object.entries(BLOCKED)) {
  const target = path.join(dist, file);
  if (!existsSync(target)) continue;
  const digest = createHash('sha256').update(readFileSync(target)).digest('hex');
  if (hashes.includes(digest)) {
    failed = true;
    console.error(
      `\nDeploy blocked: dist/${file} is a version that must not be published (contains private data).`,
    );
  }
}

if (failed) {
  console.error('\ncheck:deploy FAILED');
  process.exit(1);
}
console.log('\ncheck:deploy passed: the build is ready to publish.');

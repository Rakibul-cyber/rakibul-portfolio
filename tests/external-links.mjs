#!/usr/bin/env node
/**
 * Check every external URL linked from the built site (status < 400).
 * LinkedIn answers automated requests with HTTP 999, so that is reported as a
 * warning to verify by hand rather than a failure. Run after `npm run build`.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const urls = new Map(); // url -> pages
for (const file of walk(dist).filter((f) => f.endsWith('.html'))) {
  for (const m of readFileSync(file, 'utf8').matchAll(/\shref="(https?:\/\/[^"]+)"/g)) {
    const url = m[1].replace(/&amp;/g, '&');
    // Canonical/OG URLs point at the not-yet-deployed site itself; skip them.
    if (url.startsWith('https://rakibul-cyber.github.io/rakibul-portfolio')) continue;
    if (!urls.has(url)) urls.set(url, new Set());
    urls.get(url).add(path.relative(dist, file));
  }
}

async function check(url) {
  const headers = { 'user-agent': 'Mozilla/5.0 (link-check; rakibul-portfolio)' };
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, {
        method,
        headers,
        redirect: 'follow',
        signal: AbortSignal.timeout(15000),
      });
      if (method === 'HEAD' && (res.status === 405 || res.status === 403 || res.status >= 500))
        continue;
      return res.status;
    } catch (err) {
      if (method === 'GET') return `error: ${err.cause?.code ?? err.name}`;
    }
  }
  return 'error';
}

let failures = 0;
let warnings = 0;
const results = await Promise.all([...urls.keys()].map(async (url) => [url, await check(url)]));
for (const [url, status] of results.sort()) {
  const linkedin = /linkedin\.com/.test(url);
  const ok = typeof status === 'number' && status < 400;
  let label = ok ? 'ok  ' : 'FAIL';
  if (!ok && linkedin && status === 999) {
    label = 'WARN';
    warnings += 1;
  } else if (!ok) failures += 1;
  console.log(`${label} ${String(status).padEnd(5)} ${url}`);
}
console.log(
  `\n${urls.size} external URLs: ${urls.size - failures - warnings} ok, ${warnings} warning(s), ${failures} failure(s).`,
);
if (warnings)
  console.log(
    'LinkedIn blocks automated checks (HTTP 999): open the LinkedIn link manually to confirm it.',
  );
process.exit(failures ? 1 : 0);

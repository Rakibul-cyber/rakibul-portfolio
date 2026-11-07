#!/usr/bin/env node
/**
 * Serve dist/ the way GitHub Pages does: under /rakibul-portfolio/, with
 * directory indexes, a 404.html fallback and correct content types.
 * Used by `npm run preview` and the Playwright e2e suite.
 *
 * Usage: node scripts/serve-dist.mjs [--port 4321]
 */
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = '/rakibul-portfolio';
const root = resolve(fileURLToPath(new URL('../dist', import.meta.url)));
const args = process.argv.slice(2);
const port = Number(args.includes('--port') ? args[args.indexOf('--port') + 1] : process.env.PORT ?? 4321);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
};

const fileAt = (p) => {
  try {
    const s = statSync(p);
    if (s.isFile()) return p;
    if (s.isDirectory()) return fileAt(join(p, 'index.html'));
  } catch {
    /* not found */
  }
  return null;
};

const send = (res, status, file) => {
  res.writeHead(status, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
};

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === BASE) {
    res.writeHead(301, { location: `${BASE}/` }).end();
    return;
  }
  if (!pathname.startsWith(`${BASE}/`)) {
    send(res, 404, join(root, '404.html'));
    return;
  }
  pathname = pathname.slice(BASE.length);
  const target = normalize(join(root, pathname));
  if (!target.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  const file = fileAt(target) ?? fileAt(`${target}.html`);
  if (file) send(res, 200, file);
  else {
    const notFound = fileAt(join(root, '404.html'));
    if (notFound) send(res, 404, notFound);
    else res.writeHead(404).end('Not found');
  }
}).listen(port, () => {
  console.log(`Serving dist/ at http://localhost:${port}${BASE}/`);
});

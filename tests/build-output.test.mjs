/**
 * Build-output checks on dist/: paths under the GitHub Pages base, anchors,
 * no third-party requests, SEO files, static output and the JS budget.
 * Run after `npm run build`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const BASE = '/rakibul-portfolio/';
const SITE = 'https://rakibul-cyber.github.io';
const JS_BUDGET_BYTES = 10 * 1024;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
assert.ok(existsSync(path.join(dist, 'index.html')), 'dist/ missing: run `npm run build` first');

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const files = walk(dist);
const pages = files.filter((f) => f.endsWith('.html'));
const read = (f) => readFileSync(f, 'utf8');
const rel = (f) => path.relative(dist, f);

/** Attribute values for href/src/srcset/content(url) in a page. */
function urls(html) {
  const out = [];
  for (const m of html.matchAll(/\s(href|src)="([^"]*)"/g))
    out.push({ attr: m[1], value: m[2].replace(/&amp;/g, '&') });
  for (const m of html.matchAll(/\ssrcset="([^"]*)"/g)) {
    for (const part of m[1].split(','))
      out.push({ attr: 'srcset', value: part.trim().split(/\s+/)[0] });
  }
  return out;
}

/** Map a site URL path to a file in dist/, mirroring GitHub Pages resolution. */
function resolveInDist(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]).slice(BASE.length);
  const target = path.join(dist, clean);
  const candidates = [target, path.join(target, 'index.html'), `${target}.html`];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

const idsByPage = new Map(
  pages.map((p) => [p, new Set([...read(p).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]),
);

// ---------------------------------------------------------------------------

test('dist/ contains only intended static site files', () => {
  // Anything else (OS metadata, source maps, env files, stray copies) must not be published.
  const allowed = [
    /^\.nojekyll$/,
    /^(index|404)\.html$/,
    /^privacy\/index\.html$/,
    /^_astro\/[\w.-]+\.(js|css|woff2)$/,
    /^_astro\/(profile|about)\.[\w-]+\.(avif|webp|jpg)$/,
    // Company logos (src/assets/logos/): PNGs are re-encoded, the SVG is passed through.
    /^_astro\/(enviotech|jgu|louco|teczo)\.[\w-]+\.(webp|png|svg)$/,
    /^projects\/[\w-]+\/[\w-]+\.png$/,
    /^CV_MD_Rakibul_Hassan\.pdf$/,
    /^favicon\.svg$/,
    /^flutter_service_worker\.js$/,
    /^robots\.txt$/,
    /^sitemap-(index|\d+)\.xml$/,
  ];
  const unexpected = files.map(rel).filter((f) => !allowed.some((re) => re.test(f)));
  assert.deepEqual(unexpected, []);
});

test('.nojekyll ships so GitHub Pages serves _astro/', () => {
  assert.ok(existsSync(path.join(dist, '.nojekyll')));
});

test('expected pages exist', () => {
  for (const p of ['index.html', 'privacy/index.html', '404.html']) {
    assert.ok(existsSync(path.join(dist, p)), `missing ${p}`);
  }
});

test('every internal URL is under the base path and resolves to a file in dist', () => {
  const problems = [];
  for (const page of pages) {
    for (const { attr, value } of urls(read(page))) {
      if (/^(https?:|mailto:|tel:|data:)/.test(value) || value.startsWith('#')) continue;
      if (!value.startsWith('/')) {
        problems.push(`${rel(page)}: relative ${attr}="${value}"`);
        continue;
      }
      if (!value.startsWith(BASE)) {
        problems.push(`${rel(page)}: ${attr}="${value}" is outside ${BASE}`);
        continue;
      }
      if (!resolveInDist(value))
        problems.push(`${rel(page)}: ${attr}="${value}" does not resolve in dist/`);
    }
  }
  assert.deepEqual(problems, []);
});

test('every #anchor link has a target', () => {
  const problems = [];
  for (const page of pages) {
    for (const { value } of urls(read(page))) {
      let targetPage;
      let hash;
      if (value.startsWith('#')) {
        targetPage = page;
        hash = value.slice(1);
      } else if (value.startsWith(BASE) && value.includes('#')) {
        hash = value.split('#')[1];
        targetPage = resolveInDist(value);
      } else continue;
      if (!hash) continue;
      if (!targetPage || !idsByPage.get(targetPage)?.has(hash))
        problems.push(`${rel(page)}: ${value}`);
    }
  }
  assert.deepEqual(problems, []);
});

test('no localhost URLs, no Google Fonts, no third-party scripts or styles', () => {
  for (const page of pages) {
    const html = read(page);
    for (const { value } of urls(html))
      assert.ok(!/localhost|127\.0\.0\.1/.test(value), `${rel(page)}: ${value}`);
    assert.ok(
      !/fonts\.(googleapis|gstatic)\.com/.test(html),
      `${rel(page)}: Google Fonts reference`,
    );
    for (const m of html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)) {
      assert.ok(m[1].startsWith(BASE), `${rel(page)}: third-party script ${m[1]}`);
    }
    for (const m of html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)) {
      assert.ok(m[1].startsWith(BASE), `${rel(page)}: third-party stylesheet ${m[1]}`);
    }
  }
  for (const f of files.filter((x) => x.endsWith('.css'))) {
    assert.ok(
      !/fonts\.(googleapis|gstatic)\.com|@import\s+url\(https?:/.test(read(f)),
      `${rel(f)}: remote CSS import`,
    );
  }
});

test('external links that open a new tab use rel="noopener noreferrer"', () => {
  for (const page of pages) {
    for (const m of read(page).matchAll(/<a\s[^>]*target="_blank"[^>]*>/g)) {
      assert.match(m[0], /rel="noopener noreferrer"/, `${rel(page)}: ${m[0].slice(0, 120)}`);
    }
  }
});

test('company cards are static: no links, every logo has a description', () => {
  const section = read(path.join(dist, 'index.html')).match(
    /<section id="companies"[\s\S]*?<\/section>/,
  )?.[0];
  assert.ok(section, 'companies section missing');
  assert.doesNotMatch(section, /<a\s/, 'companies section contains a link');
  const imgs = [...section.matchAll(/<img\s[^>]*>/g)].map((m) => m[0]);
  assert.equal(imgs.length, 4, 'expected all four logos');
  for (const img of imgs) assert.match(img, /alt="[^"]+"/, img.slice(0, 120));
});

test('the CV is a real PDF', () => {
  const buf = readFileSync(path.join(dist, 'CV_MD_Rakibul_Hassan.pdf'));
  assert.equal(buf.subarray(0, 5).toString('latin1'), '%PDF-');
  assert.ok(buf.length > 10_000);
});

test('static output only: no server bundle, no adapter', () => {
  assert.ok(!existsSync(path.join(dist, 'server')));
  assert.ok(
    !files.some((f) => /(^|[\\/])_worker\.js$|[\\/]entry\.mjs$/.test(f)),
    'server entry found in dist',
  );
  const config = read(path.join(root, 'astro.config.mjs'));
  assert.match(config, /output:\s*'static'/);
  assert.ok(!/adapter\s*:/.test(config), 'an adapter is configured');
});

test('runtime dependencies are limited to the allowed set', () => {
  const pkg = JSON.parse(read(path.join(root, 'package.json')));
  const allowed = new Set([
    'astro',
    '@astrojs/sitemap',
    'tailwindcss',
    '@tailwindcss/vite',
    '@fontsource-variable/inter',
    '@fontsource-variable/space-grotesk',
  ]);
  for (const dep of Object.keys(pkg.dependencies))
    assert.ok(allowed.has(dep), `unexpected runtime dependency: ${dep}`);
  for (const [dep, version] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
    assert.match(
      version,
      /^\d+\.\d+\.\d+$/,
      `${dep} is not pinned to an exact version: ${version}`,
    );
  }
});

test('each page has exactly one <h1>, a lang, a title and a canonical URL', () => {
  for (const page of pages) {
    const html = read(page);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${rel(page)}: h1 count`);
    assert.match(html, /<html lang="(en|de)"/, `${rel(page)}: lang`);
    assert.match(html, /<title>[^<]{10,}<\/title>/, `${rel(page)}: title`);
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
    assert.ok(canonical?.startsWith(`${SITE}${BASE}`), `${rel(page)}: canonical ${canonical}`);
  }
});

test('home page SEO: title, description, canonical, Open Graph, JSON-LD Person', () => {
  const html = read(path.join(dist, 'index.html'));
  assert.match(
    html,
    /<title>Md Rakibul Hassan — AI\/ML Engineer &amp; AI-Powered Software Developer<\/title>/,
  );
  const description = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '';
  assert.ok(
    description.length >= 80 && description.length <= 170,
    `description length ${description.length}: ${description}`,
  );
  assert.match(html, new RegExp(`<link rel="canonical" href="${SITE}${BASE}"`));
  assert.match(html, new RegExp(`<meta property="og:url" content="${SITE}${BASE}"`));
  assert.ok(!html.includes('rakibulhassan.dev'), 'legacy og:url domain still present');
  assert.ok(!/name="robots" content="noindex/.test(html), 'home page must be indexable');
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (m) => JSON.parse(m[1]),
  );
  const person = ld.find((d) => d['@type'] === 'Person');
  assert.ok(person, 'Person JSON-LD missing');
  for (const k of [
    'name',
    'jobTitle',
    'url',
    'email',
    'address',
    'alumniOf',
    'knowsAbout',
    'sameAs',
  ]) {
    assert.ok(person[k], `Person.${k} missing`);
  }
  assert.equal(person.url, `${SITE}${BASE}`);
});

test('privacy and 404 are noindex and excluded from the sitemap; no Impressum', () => {
  for (const p of ['privacy/index.html', '404.html']) {
    assert.match(
      read(path.join(dist, p)),
      /<meta name="robots" content="noindex/,
      `${p} must be noindex`,
    );
  }
  const sitemap = read(path.join(dist, 'sitemap-0.xml'));
  assert.ok(sitemap.includes(`<loc>${SITE}${BASE}</loc>`), 'home page missing from sitemap');
  assert.ok(!/privacy|404/.test(sitemap), 'noindex page listed in sitemap');
  // No Impressum by owner decision (2026-11-08): no page and no link to one.
  assert.ok(!existsSync(path.join(dist, 'impressum')), 'impressum page should not exist');
  for (const page of pages)
    assert.ok(!read(page).includes('impressum/'), `${rel(page)} links to an Impressum`);
  assert.ok(read(path.join(dist, 'sitemap-index.xml')).includes(`${SITE}${BASE}sitemap-0.xml`));
});

test('robots.txt allows crawling and points to the sitemap under the base path', () => {
  const robots = read(path.join(dist, 'robots.txt'));
  assert.match(robots, /User-agent: \*/);
  assert.ok(robots.includes(`Sitemap: ${SITE}${BASE}sitemap-index.xml`));
});

test('the legacy Flutter service worker is replaced by a self-unregistering kill switch', () => {
  const sw = read(path.join(dist, 'flutter_service_worker.js'));
  assert.match(sw, /registration\.unregister\(\)/);
  assert.match(sw, /flutter-app-cache/);
  assert.ok(!/addEventListener\(['"]fetch/.test(sw), 'kill switch must not intercept requests');
});

test(`shipped JavaScript stays under ${JS_BUDGET_BYTES / 1024} KB`, (t) => {
  let total = 0;
  // The service-worker kill switch is fetched only by browsers that had the old site.
  const pageJs = files.filter(
    (x) => x.endsWith('.js') && path.basename(x) !== 'flutter_service_worker.js',
  );
  for (const f of pageJs) total += statSync(f).size;
  const html = read(path.join(dist, 'index.html'));
  for (const m of html.matchAll(
    /<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    total += Buffer.byteLength(m[1]);
  }
  t.diagnostic(`JavaScript shipped on the home page: ${total} bytes`);
  assert.ok(total < JS_BUDGET_BYTES, `JS is ${total} bytes`);
});

test('fonts are self-hosted Latin subsets only', () => {
  const fonts = files.filter((f) => f.endsWith('.woff2')).map((f) => path.basename(f));
  assert.ok(fonts.length >= 2, 'fonts missing');
  for (const f of fonts)
    assert.match(f, /-latin-wght-normal\./, `non-Latin or unexpected font file: ${f}`);
});

test('images have alt text', () => {
  // compressHTML writes alt="" as a bare `alt`; both mark a decorative image.
  for (const page of pages) {
    for (const m of read(page).matchAll(/<img\s[^>]*>/g))
      assert.match(m[0], /\salt(="|[\s>])/, `${rel(page)}: ${m[0]}`);
  }
});

test('hero and About photos: decorative vs. described, AVIF + WebP, responsive', () => {
  const html = read(path.join(dist, 'index.html'));
  const pictures = [...html.matchAll(/<picture\b.*?<\/picture>/gs)].map((m) => m[0]);
  const hero = pictures.find((p) => p.includes('hero-photo'));
  const about = pictures.find((p) => p.includes('about-photo'));
  assert.ok(hero, 'hero photo missing');
  assert.ok(about, 'About photo missing');

  const img = (pic) => pic.match(/<img\s[^>]*>/)[0];
  assert.match(img(hero), /\salt(="")?[\s>]/, 'hero photo must be decorative (empty alt)');
  assert.match(img(hero), /loading="eager"/);
  assert.match(img(about), /\salt="Portrait of Md Rakibul Hassan"/);
  assert.match(img(about), /loading="lazy"/);

  for (const pic of [hero, about]) {
    assert.match(pic, /<source\b[^>]*type="image\/avif"/, 'AVIF source missing');
    assert.match(pic, /<source\b[^>]*type="image\/webp"/, 'WebP source missing');
    assert.match(img(pic), /\swidth="\d+" height="\d+"/, 'explicit dimensions missing');
    for (const set of pic.matchAll(/\ssrcset="([^"]*)"/g))
      assert.ok(set[1].split(',').length >= 4, `too few responsive sizes: ${set[1]}`);
  }
});

test('generated photo files carry no EXIF, XMP, IPTC or ICC metadata', () => {
  // Same segment walk as tests/repo-hygiene.test.mjs, applied to the published JPEGs.
  const jpegs = files.filter((f) => /_astro\/(profile|about)\.[\w-]+\.jpg$/.test(f));
  assert.ok(jpegs.length >= 2, 'no generated photo JPEGs found');
  for (const f of jpegs) {
    const b = readFileSync(f);
    for (let i = 2; i + 4 <= b.length && b[i] === 0xff;) {
      const marker = b[i + 1];
      if (marker === 0xda) break;
      assert.ok(
        !((marker >= 0xe1 && marker <= 0xef) || marker === 0xfe),
        `${rel(f)}: metadata segment 0xFF${marker.toString(16).toUpperCase()}`,
      );
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  for (const f of files.filter((f) => /_astro\/(profile|about)\./.test(f))) {
    const latin = readFileSync(f).toString('latin1');
    for (const needle of ['Exif\0', 'Canon', 'EOS ', 'ns.adobe.com'])
      assert.ok(!latin.includes(needle), `${rel(f)} contains "${needle.replace('\0', '')}"`);
  }
});

test('both photo slots keep the "RH" monogram fallback in code', () => {
  for (const c of ['Hero', 'About']) {
    const src = readFileSync(path.join(root, `src/components/sections/${c}.astro`), 'utf8');
    assert.match(
      src,
      /\? \(\s*<Picture[\s\S]*?\) : \([\s\S]*?\{profile\.monogram\}/,
      `${c}: fallback`,
    );
  }
});

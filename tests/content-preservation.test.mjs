/**
 * Content preservation: every piece of legacy content (tests/legacy-inventory.json,
 * extracted from the Flutter source) must survive the migration, either rendered
 * on the built site or, where the brief says so, kept in data. Content the brief
 * removed must be gone. Run after `npm run build`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const legacy = JSON.parse(readFileSync(path.join(root, 'tests', 'legacy-inventory.json'), 'utf8'));
// Node 24 strips TypeScript types natively; portfolio.ts has only type-only imports.
const data = await import(path.join(root, 'src', 'data', 'portfolio.ts'));

assert.ok(
  existsSync(path.join(dist, 'index.html')),
  'dist/index.html missing: run `npm run build` first',
);
const html = readFileSync(path.join(dist, 'index.html'), 'utf8');

/** Visible text of an HTML document, with quotes and whitespace normalised. */
function visibleText(source) {
  return normalise(
    source
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))),
  );
}
/** Typographic quotes count as their straight equivalents (render-time smartQuotes). */
function normalise(s) {
  return s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
}
const text = visibleText(html);
const hrefs = new Set(
  [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&')),
);
const hasText = (s) => text.includes(normalise(s));

const legacyPathToPublic = (p) => p.replace(/^assets\//, '');

// ---------------------------------------------------------------------------

test('inventory is complete (brief §4 counts)', () => {
  assert.equal(legacy.counts.projects, 6);
  assert.equal(legacy.counts.skills, 16);
  assert.equal(legacy.counts.blogPosts, 4);
  assert.equal(legacy.counts.timeline, 4);
  assert.equal(legacy.counts.certifications, 3);
  assert.equal(legacy.counts.learning, 3);
  assert.equal(legacy.counts.languages, 3);
});

test('every legacy project is rendered with title, subtitle, description, status and tags', () => {
  for (const p of legacy.projects) {
    const id = data.projects.find((x) => x.title === p.title)?.id;
    for (const field of ['title', 'subtitle', 'description', 'status']) {
      const corrected = data.contentCorrections.find(
        (c) => c.projectId === id && c.field === field,
      );
      const expected = corrected ? corrected.to : p[field];
      assert.ok(hasText(expected), `${p.title}: ${field} not rendered: "${expected}"`);
      // A superseded description must be gone; short status words may legitimately appear elsewhere.
      if (corrected && field === 'description') {
        assert.ok(!hasText(corrected.from), `${p.title}: superseded text still rendered`);
      }
    }
    for (const tag of p.tags) assert.ok(hasText(tag), `${p.title}: tag "${tag}" not rendered`);
  }
});

test('legacy project fields are kept verbatim in data', () => {
  for (const lp of legacy.projects) {
    const p = data.projects.find((x) => x.title === lp.title);
    assert.ok(p, `project missing from data: ${lp.title}`);
    assert.equal(p.legacy, true);
    assert.equal(p.subtitle, lp.subtitle);
    for (const field of ['description', 'status']) {
      const correction = data.contentCorrections.find(
        (c) => c.projectId === p.id && c.field === field,
      );
      if (correction) {
        assert.equal(
          correction.from,
          lp[field],
          `${lp.title}: correction 'from' must equal legacy ${field}`,
        );
        assert.equal(p[field], correction.to);
        assert.ok(correction.reason.length > 10 && correction.approvedOn);
      } else {
        assert.equal(
          p[field],
          lp[field],
          `${lp.title}: ${field} changed without a contentCorrections entry`,
        );
      }
    }
    assert.deepEqual(p.tags, lp.tags);
    assert.equal(p.liveUrl ?? null, lp.liveUrl);
    assert.equal(p.legacyIcon, lp.icon);
    assert.equal(
      p.coverImagePath ?? null,
      lp.coverImagePath && legacyPathToPublic(lp.coverImagePath),
    );
    assert.deepEqual(p.galleryImagePaths, lp.galleryImagePaths.map(legacyPathToPublic));
  }
});

test('GitHub links are preserved, or changed only through a documented link change', () => {
  for (const lp of legacy.projects) {
    const p = data.projects.find((x) => x.title === lp.title);
    const change = data.linkChanges.find((c) => c.projectId === p.id && c.field === 'githubUrl');
    if (change) {
      assert.equal(
        change.from,
        lp.githubUrl,
        `${lp.title}: link change 'from' must equal the legacy URL`,
      );
      assert.equal(p.githubUrl, change.to);
      assert.ok(hrefs.has(change.to), `${lp.title}: changed link not rendered`);
      assert.ok(change.reason.length > 10);
    } else {
      assert.equal(
        p.githubUrl ?? null,
        lp.githubUrl,
        `${lp.title}: GitHub URL changed without a linkChanges entry`,
      );
      if (lp.githubUrl) assert.ok(hrefs.has(lp.githubUrl), `${lp.title}: GitHub link not rendered`);
    }
  }
});

test('Driver Stress is the flagship and links to its repository', () => {
  assert.equal(data.projects[0].id, 'driver-stress');
  assert.ok(hrefs.has('https://github.com/Rakibul-cyber/driver-stress-monitoring'));
  assert.ok(html.includes('id="project-driver-stress"'));
  assert.ok(hasText('0.897 ± 0.114'), 'LOSO ROC-AUC not shown');
  assert.ok(hasText('0.940'), 'held-out ROC-AUC not shown');
});

test('non-legacy projects: lead-intelligence is kept in data, hidden, and never presented as ML', () => {
  assert.deepEqual(
    data.projects.filter((p) => !p.legacy).map((p) => p.id),
    ['driver-stress', 'lead-intelligence'],
  );
  const lead = data.projects.find((p) => p.id === 'lead-intelligence');
  assert.deepEqual(lead.categories, ['backend-cloud']);
  assert.match(lead.description, /rule-based, not machine learning/);
  // Hidden by owner decision (2026-11-08) until confirmed with Enviotech GmbH.
  assert.equal(lead.hidden, true);
  assert.ok(!hasText(lead.title), 'hidden project is rendered');
  assert.ok(
    !hrefs.has(lead.githubUrl) && !html.includes('project-lead-intelligence'),
    'hidden project is linked',
  );
});

test('project order follows the brief, with owner-approved additions', () => {
  assert.deepEqual(
    data.projects.map((p) => p.id),
    [
      'driver-stress',
      'forest-ai',
      'stock-dashboard',
      'lead-intelligence',
      'louco',
      'steko',
      'xr-hub',
      'automotive-hmi',
    ],
  );
});

test('CV is linked under the legacy URL and shipped as a real PDF', () => {
  const legacyPath = new URL(legacy.cv.url).pathname; // /rakibul-portfolio/CV_MD_Rakibul_Hassan.pdf
  assert.ok(hrefs.has(legacyPath), `CV link ${legacyPath} not found`);
  const file = path.join(dist, 'CV_MD_Rakibul_Hassan.pdf');
  assert.ok(existsSync(file), 'CV missing from dist');
  assert.equal(readFileSync(file).subarray(0, 5).toString('latin1'), '%PDF-');
  assert.deepEqual(
    readFileSync(file),
    readFileSync(path.join(root, 'public', 'CV_MD_Rakibul_Hassan.pdf')),
  );
});

test('all 16 legacy skills are rendered; levels kept in data, not rendered', () => {
  for (const s of legacy.skills) {
    assert.ok(hasText(s.name), `skill not rendered: ${s.name}`);
    const d = data.legacySkills.find((x) => x.name === s.name);
    assert.ok(d, `skill missing from data: ${s.name}`);
    assert.equal(d.level, s.level);
    assert.equal(d.category, s.category);
  }
});

test('contact details are preserved', () => {
  const c = legacy.contact;
  assert.ok(hasText(c.email) && hrefs.has(`mailto:${c.email}`), 'email');
  assert.ok(hasText(c.phone), 'phone');
  assert.ok(hasText(c.location), 'location');
  for (const s of c.social) assert.ok(hrefs.has(s.url), `${s.label} link ${s.url} not rendered`);
});

test('experience follows the resume (authoritative since 2026-11-08) and keeps every legacy organisation', () => {
  // Legacy timeline organisations must still appear; titles and dates now come from the resume.
  const legacyOrgs = [
    'Johannes Gutenberg University Mainz',
    'Louco',
    'Teczo Sdn. Bhd.',
    'International Islamic University Malaysia',
  ];
  assert.equal(legacy.timeline.length, 4);
  for (const org of legacyOrgs) assert.ok(hasText(org), `organisation not rendered: ${org}`);
  const expected = [
    ['Software Developer (Working Student)', 'Enviotech GmbH', 'July 2026 – present'],
    ['Software Developer', 'Louco Event Media GmbH', 'March 2026 – June 2026'],
    [
      'HiWi – Mobile Application Developer',
      'Johannes Gutenberg University Mainz',
      'September 2025 – February 2026',
    ],
    ['Software Developer', 'Teczo Sdn. Bhd.', 'February 2022 – August 2022'],
  ];
  assert.deepEqual(
    data.experience.map((e) => [e.role, e.org, e.period]),
    expected,
  );
  for (const [role, org, period] of expected) {
    assert.ok(
      hasText(role) && hasText(org) && hasText(period),
      `${org} not rendered as in the resume`,
    );
  }
  // Only the current role may say "present".
  assert.deepEqual(
    data.experience.filter((e) => /present/i.test(e.period)).map((e) => e.org),
    ['Enviotech GmbH'],
  );
  for (const e of data.experience) assert.equal(e.source, 'Resume');
  assert.ok(hasText('BSc Computer Science'), 'education entry missing');
});

test('certifications, learning and languages are preserved', () => {
  for (const c of legacy.certifications) assert.ok(hasText(c), `certification: ${c}`);
  // Learning items were lightly reworded ("in prep" → "in preparation", "—" → ",").
  for (const l of legacy.learning) {
    const core = l.replace(/\s*\(in prep\)/, '').split(' — ')[0];
    // Sentence case is applied site-wide, so compare case-insensitively.
    assert.ok(text.toLowerCase().includes(normalise(core).toLowerCase()), `learning item: ${core}`);
  }
  // Language names are preserved; levels come from the resume (Fluent / Basic since 2026-11-08).
  for (const l of legacy.languages) {
    const [name] = l.split(' — ');
    assert.ok(hasText(name), `language: ${name}`);
  }
  assert.deepEqual(
    data.languages.map((l) => `${l.name}:${l.level}`),
    ['Bengali:Native', 'English:Fluent', 'German:Basic'],
  );
});

test('publications: BEST4U.COM links to the journal, STEKO-SD is under review', () => {
  assert.ok(hrefs.has('https://journals.iium.edu.my/kict/index.php/jisdt/article/view/255'));
  const steko = data.publications.find((p) => p.title.startsWith('STEKO-SD'));
  assert.equal(steko.status, 'under review');
  assert.ok(!steko.url);
});

test('blog posts are kept verbatim in data as drafts and not rendered', () => {
  assert.equal(data.articles.length, legacy.blogPosts.length);
  for (const b of legacy.blogPosts) {
    const a = data.articles.find((x) => x.title === b.title);
    assert.ok(a, `article missing: ${b.title}`);
    for (const k of ['excerpt', 'date', 'readTime', 'tag']) assert.equal(a[k], b[k]);
    assert.equal(a.status, 'draft');
    assert.ok(!hasText(b.title), `draft article rendered: ${b.title}`);
  }
  assert.ok(!html.includes('id="writing"'), 'Writing section rendered without published articles');
});

test('removed content is absent: pricing, hire section, fake success, fictional terminal, unverified stats', () => {
  const r = legacy.removed;
  for (const p of r.pricing) {
    assert.ok(!text.includes(p.price), `price still present: ${p.price}`);
    assert.ok(!hasText(p.cta), `pricing CTA still present: ${p.cta}`);
  }
  for (const w of r.hireWhyItems)
    assert.ok(!hasText(w.desc), `hire item still present: ${w.title}`);
  // "Publications" is now a legitimate About heading; only the old stat pairing must be gone.
  const reusedWords = new Set(['Publications']);
  for (const s of r.heroStats) {
    const gone = reusedWords.has(s.label) ? !hasText(`${s.value} ${s.label}`) : !hasText(s.label);
    assert.ok(gone, `unverified stat still present: ${s.value} ${s.label}`);
  }
  for (const line of r.heroTerminalLines)
    assert.ok(!hasText(line.replace(/^[>✓]\s*/, '')), `fake terminal line: ${line}`);
  for (const t of r.contactSuccess) assert.ok(!hasText(t), `fake success text: ${t}`);
  assert.ok(!hasText(r.heroStatus), 'legacy freelance status still present');
  assert.ok(!/Hire Me/i.test(text), '"Hire Me" still present');
  assert.ok(!/€\s?\d/.test(text), 'a euro price is still present');
});

test('every statistic has a source', () => {
  assert.ok(data.stats.length >= 1);
  for (const s of data.stats) {
    assert.ok(
      typeof s.source === 'string' && s.source.length > 10,
      `stat without source: ${s.label}`,
    );
    assert.ok(hasText(s.value) && hasText(s.label), `stat not rendered: ${s.label}`);
  }
  assert.equal(
    data.stats.find((s) => /Projects documented/.test(s.label)).value,
    String(data.visibleProjects.length),
  );
  // Past tense by owner decision (2026-11-08): the roles ended, current use isn't verified.
  const shipped = data.stats.find((s) => s.label === 'Apps shipped to production');
  assert.ok(shipped, '"Apps shipped to production" stat missing');
  assert.equal(shipped.value, '2');
  assert.match(shipped.source, /Louco.*store releases/);
  assert.match(shipped.source, /Forest Tracking.*AWS/);
  assert.ok(!hasText('Apps in production use'), 'old present-tense label still rendered');
});

test('project image files ship in dist but are never rendered', (t) => {
  for (const img of legacy.projectImages) {
    const file = path.join(dist, legacyPathToPublic(img.path));
    if (img.existsInSource) {
      assert.ok(existsSync(file), `image missing from dist: ${img.path}`);
    } else {
      assert.ok(!existsSync(file));
      t.diagnostic(`warning: ${img.path} is referenced by legacy data but never existed`);
    }
  }
  const imgSrcs = [...html.matchAll(/<(?:img|source)[^>]+(?:src|srcset)="([^"]+)"/g)].map(
    (m) => m[1],
  );
  for (const src of imgSrcs)
    assert.ok(!src.includes('/projects/'), `project image rendered: ${src}`);
  assert.ok(!/url\([^)]*\/projects\//.test(html), 'project image used as CSS background');
});

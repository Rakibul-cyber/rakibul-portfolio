#!/usr/bin/env node
/**
 * Extracts the legacy portfolio content from the Flutter source into
 * tests/legacy-inventory.json, which the content-preservation test compares
 * against the new site.
 *
 * It reads the Dart files from the git tag `legacy-flutter-source` (not the
 * working tree), so the inventory stays reproducible after the Flutter source
 * has been deleted from the branch.
 *
 * Usage: node tests/extract-legacy-inventory.mjs [--ref <git-ref>] [--check]
 *   --check  exit 1 if the committed JSON differs from a fresh extraction.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const args = process.argv.slice(2);
const ref = args.includes('--ref') ? args[args.indexOf('--ref') + 1] : 'legacy-flutter-source';
const checkOnly = args.includes('--check');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outFile = path.join(root, 'tests', 'legacy-inventory.json');

const show = (file) =>
  execFileSync('git', ['show', `${ref}:${file}`], { cwd: root, encoding: 'utf8' });
const listTree = () =>
  execFileSync('git', ['ls-tree', '-r', '--name-only', ref], { cwd: root, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);

// ---------------------------------------------------------------------------
// Minimal Dart tokenizer: enough for literal constructor arguments.
// ---------------------------------------------------------------------------

/** Read a quoted string starting at s[i]; returns [value, nextIndex]. */
function readString(s, i) {
  const q = s[i];
  // Triple-quoted strings are not used in the legacy source; fail loudly if they appear.
  if (s.startsWith(q.repeat(3), i)) throw new Error(`Triple-quoted string at ${i}`);
  let out = '';
  let j = i + 1;
  while (j < s.length && s[j] !== q) {
    if (s[j] === '\\') {
      const n = s[j + 1];
      out += n === 'n' ? '\n' : n === 't' ? '\t' : n;
      j += 2;
    } else {
      if (s[j] === '$')
        throw new Error(`String interpolation is not supported: ${s.slice(i, j + 20)}`);
      out += s[j];
      j += 1;
    }
  }
  return [out, j + 1];
}

/** Index of the bracket that closes the one at s[open]. Skips strings and comments. */
function matchBracket(s, open) {
  const pairs = { '(': ')', '[': ']', '{': '}' };
  const stack = [pairs[s[open]]];
  let i = open + 1;
  while (i < s.length) {
    const c = s[i];
    if (c === "'" || c === '"') {
      i = readString(s, i)[1];
      continue;
    }
    if (c === '/' && s[i + 1] === '/') {
      i = s.indexOf('\n', i);
      continue;
    }
    if (pairs[c]) stack.push(pairs[c]);
    else if (c === stack[stack.length - 1]) {
      stack.pop();
      if (stack.length === 0) return i;
    }
    i += 1;
  }
  throw new Error(`Unbalanced bracket at ${open}`);
}

/** Split top-level comma-separated arguments. */
function splitArgs(body) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === "'" || c === '"') {
      i = readString(body, i)[1] - 1;
      continue;
    }
    if (c === '/' && body[i + 1] === '/') {
      i = body.indexOf('\n', i);
      continue;
    }
    if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) depth--;
    else if (c === ',' && depth === 0) {
      parts.push(body.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(body.slice(start));
  return parts.map((p) => stripComments(p).trim()).filter(Boolean);
}

/** Remove `//` line comments that are outside string literals. */
function stripComments(src) {
  let out = '';
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === "'" || c === '"') {
      const end = readString(src, i)[1];
      out += src.slice(i, end);
      i = end - 1;
    } else if (c === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i);
      if (nl < 0) break;
      i = nl - 1;
    } else out += c;
  }
  return out;
}

/** Parse a literal value: adjacent strings, list of literals, number, bool, null. */
function parseValue(src) {
  const v = src.trim();
  if (v.startsWith("'") || v.startsWith('"')) {
    let out = '';
    let i = 0;
    while (i < v.length) {
      while (/\s/.test(v[i] ?? '')) i++;
      if (i >= v.length) break;
      if (v[i] !== "'" && v[i] !== '"') throw new Error(`Not a string literal: ${v}`);
      const [str, next] = readString(v, i);
      out += str;
      i = next;
    }
    return out;
  }
  if (v.startsWith('[')) return splitArgs(v.slice(1, matchBracket(v, 0))).map(parseValue);
  if (v.startsWith('(')) return splitArgs(v.slice(1, matchBracket(v, 0))).map(parseValue);
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if (v === 'true' || v === 'false') return v === 'true';
  if (v === 'null') return null;
  return { expr: v };
}

/** Find every call `name(` in `src` and return its parsed arguments. */
function calls(rawSrc, name) {
  const src = stripComments(rawSrc);
  const re = new RegExp(`(?<![\\w.])${name.replace(/[$]/g, '\\$')}\\(`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(src))) {
    const open = m.index + m[0].length - 1;
    const close = matchBracket(src, open);
    // `Widget _stat(String value, ...)` is a declaration, not a call: the name is
    // preceded by a type rather than by punctuation or a keyword such as `return`.
    const before = /([\w>?]+)\s+$/.exec(src.slice(Math.max(0, m.index - 40), m.index));
    if (before && !['return', 'const', 'new', 'await', 'final', 'var'].includes(before[1] ?? '')) {
      re.lastIndex = close;
      continue;
    }
    const parts = splitArgs(src.slice(open + 1, close));
    const named = {};
    const positional = [];
    for (const p of parts) {
      const nm = /^([A-Za-z_]\w*)\s*:\s*([\s\S]*)$/.exec(p);
      if (nm && !nm[2].startsWith(':')) named[nm[1]] = parseValue(nm[2]);
      else positional.push(parseValue(p));
    }
    out.push({ named, positional });
    re.lastIndex = close;
  }
  return out;
}

/** Text of every `Text("...")` / `Text('...')` literal call, in source order. */
function textLiterals(src) {
  return calls(src, 'Text')
    .map((c) => c.positional[0])
    .filter((v) => typeof v === 'string');
}

/** Body of a top-level `class Name ... {}` declaration. */
function classBody(src, name) {
  const i = src.search(new RegExp(`class ${name}\\b`));
  if (i < 0) throw new Error(`class ${name} not found`);
  const open = src.indexOf('{', i);
  return src.slice(open, matchBracket(src, open) + 1);
}

/** Value of a `const` list/field: `static const ... name = <value>;` */
function constValue(src, name) {
  const m = new RegExp(`\\b${name}\\s*=\\s*`).exec(src);
  if (!m) throw new Error(`const ${name} not found`);
  const start = m.index + m[0].length;
  const c = src[start];
  if (c === '[' || c === '(') return parseValue(src.slice(start, matchBracket(src, start) + 1));
  return parseValue(src.slice(start, src.indexOf(';', start)));
}

// ---------------------------------------------------------------------------
// Extraction
// ---------------------------------------------------------------------------

const commit = execFileSync('git', ['rev-parse', `${ref}^{commit}`], {
  cwd: root,
  encoding: 'utf8',
}).trim();
const data = show('lib/models/portfolio_data.dart');
const page = show('lib/screens/portfolio_page.dart');
const skillsScreen = show('lib/screens/skills_section.dart');
const blogContact = show('lib/screens/blog_contact_section.dart');
const hero = show('lib/screens/hero_section.dart');
const widgets = show('lib/widgets/common_widgets.dart');
const hire = show('lib/screens/hire_section.dart');
const indexHtml = show('web/index.html');
const tree = listTree();

const projectsSrc = classBody(data, 'PortfolioData');
const projects = calls(projectsSrc, 'Project').map(({ named }) => ({
  title: named.title,
  subtitle: named.subtitle,
  description: named.description,
  tags: named.tags,
  status: named.status,
  githubUrl: named.githubUrl ?? null,
  liveUrl: named.liveUrl ?? null,
  icon: named.icon,
  coverImagePath: named.coverImagePath ?? null,
  galleryImagePaths: named.galleryImagePaths ?? [],
}));

const images = projects.flatMap((p) => [p.coverImagePath, ...p.galleryImagePaths].filter(Boolean));
const imageStatus = images.map((p) => ({ path: p, existsInSource: tree.includes(p) }));

const skills = calls(projectsSrc, 'Skill').map(({ named }) => ({
  name: named.name,
  category: named.category,
  level: named.level,
  icon: named.icon,
}));

const pricing = calls(projectsSrc, 'HirePackage').map(({ named }) => ({
  name: named.name,
  price: named.price,
  period: named.period,
  features: named.features,
  cta: named.cta,
}));

const blogPosts = calls(projectsSrc, 'BlogPost').map(({ named }) => ({
  title: named.title,
  excerpt: named.excerpt,
  date: named.date,
  readTime: named.readTime,
  tag: named.tag,
}));

const timeline = calls(page, '_timelineItem')
  .filter((c) => c.positional.length === 3 && c.positional.every((v) => typeof v === 'string'))
  .map(({ positional: [date, title, sub] }) => ({ date, title, sub }));

const aboutSrc = classBody(page, '_AboutSection');
const aboutParagraphs = textLiterals(aboutSrc).filter((t) => t.length > 80);

const certGroups = constValue(skillsScreen, '_certs').map(([heading, items]) => ({
  heading,
  items,
}));
const findGroup = (word) => certGroups.find((g) => g.heading.includes(word))?.items ?? [];

const contactLines = calls(blogContact, '_contactLink').map((c) => c.positional[1]);
const social = calls(blogContact, '_socialBtn').map(({ positional: [label, url] }) => ({
  label,
  url,
}));
const email = contactLines.find((l) => l.includes('@'));
const phone = contactLines.find((l) => /^\+?\d[\d ]+$/.test(l));
const location = contactLines.find((l) => l !== email && l !== phone);

const heroStats = calls(classBody(hero, '_HeroSectionState'), '_stat').map(
  ({ positional: [value, label] }) => ({
    value,
    label,
  }),
);
const heroRoles = constValue(hero, '_roles');
const heroTerminalLines = constValue(hero, '_lines');
const heroTexts = textLiterals(hero);

const navLabels = constValue(widgets, '_labels');
const cvUrl = constValue(widgets, '_cvUrl');

const hireTexts = [
  ...calls(hire, '_whyItem').map(({ positional: [, title, desc] }) => ({ title, desc })),
];

const meta = Object.fromEntries(
  [...indexHtml.matchAll(/<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]*)"/g)].map((m) => [
    m[1],
    m[2],
  ]),
);
const htmlTitle = /<title>([^<]*)<\/title>/.exec(indexHtml)?.[1];

const inventory = {
  $comment:
    'Generated by tests/extract-legacy-inventory.mjs from the Flutter source. Do not edit by hand; re-run the script.',
  source: { ref, commit },
  counts: {
    projects: projects.length,
    skills: skills.length,
    blogPosts: blogPosts.length,
    timeline: timeline.length,
    certifications: findGroup('Certifications').length,
    learning: findGroup('Learning').length,
    languages: findGroup('Languages').length,
    pricingPackages: pricing.length,
    projectImagesReferenced: images.length,
    projectImagesMissing: imageStatus.filter((i) => !i.existsInSource).length,
  },
  projects,
  projectImages: imageStatus,
  skills,
  blogPosts,
  contact: { email, phone, location, social },
  cv: {
    url: cvUrl,
    fileInSource: tree.includes('CV_MD_Rakibul_Hassan.pdf') ? 'CV_MD_Rakibul_Hassan.pdf' : null,
  },
  timeline,
  about: aboutParagraphs,
  certifications: findGroup('Certifications'),
  learning: findGroup('Learning'),
  languages: findGroup('Languages'),
  removed: {
    $comment:
      'Legacy content removed on purpose (brief §4.5). The preservation test asserts it is absent.',
    pricing,
    hireWhyItems: hireTexts,
    heroStats,
    heroRoles,
    heroTerminalLines,
    heroStatus: heroTexts.find((t) => t.startsWith('Available')) ?? null,
    contactSuccess: textLiterals(blogContact).filter((t) => /Message sent|get back to you/.test(t)),
  },
  navigation: navLabels,
  seo: { title: htmlTitle, ...meta },
};

const json = `${JSON.stringify(inventory, null, 2)}\n`;
if (checkOnly) {
  const current = existsSync(outFile) ? readFileSync(outFile, 'utf8') : '';
  if (current !== json) {
    console.error('legacy-inventory.json is out of date. Run: npm run extract:legacy');
    process.exit(1);
  }
  console.log('legacy-inventory.json is up to date.');
} else {
  writeFileSync(outFile, json);
  console.log(`Wrote ${path.relative(root, outFile)} from ${ref} (${commit.slice(0, 7)})`);
  console.log(inventory.counts);
}

/**
 * Repository hygiene: generated output, browser profiles, caches and secrets must
 * never be tracked (also catches `git add -f`), and .gitignore must keep ignoring
 * them. Background: docs/SECURITY_INCIDENT_2026-11-08.md.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' });

const FORBIDDEN = [
  [/(^|\/)\.dart_tool\//, 'Dart/Flutter tool output (incl. the flutter run Chrome profile)'],
  [/(^|\/)build\//, 'build output'],
  [/(^|\/)dist\//, 'Astro build output (published by CI, never committed)'],
  [/(^|\/)\.astro\//, 'Astro cache'],
  [/(^|\/)(test-results|playwright-report|blob-report|coverage)\//, 'test output'],
  [/(^|\/)node_modules\//, 'dependencies'],
  [/(^|\/)chrome-device\//, 'browser profile'],
  [/(^|\/)(Cookies|Login Data|Web Data|History)(-journal)?$/, 'browser profile database'],
  [/(^|\/)\.DS_Store$/, 'macOS metadata'],
  [/(^|\/)\.env(\.(?!example$)[^/]+)?$/, 'environment file (only .env.example is allowed)'],
  [/\.(pem|key|p12|pfx|jks|keystore)$/, 'private key or keystore'],
  [
    /(^|\/)(google-services\.json|GoogleService-Info\.plist|key\.properties)$/,
    'platform credentials',
  ],
  [/(^|\/)(credentials|service-account)[^/]*\.json$/, 'service credentials'],
  [/(^|\/)\.flutter-plugins(-dependencies)?$/, 'Flutter plugin cache'],
  [/^CV_MD_Rakibul_Hassan\.pdf$/, 'root CV copy (the CV is published only from public/)'],
  [/^assets\/images\//, 'original photo (only the cleaned copies in src/assets/ are committed)'],
];

test('no generated, browser-profile or secret files are tracked', () => {
  const tracked = git('ls-files', '-z').split('\0').filter(Boolean);
  const violations = tracked.flatMap((file) =>
    FORBIDDEN.filter(([re]) => re.test(file)).map(([, why]) => `${file}  (${why})`),
  );
  assert.deepEqual(violations, []);
});

test('.gitignore ignores generated output and secrets but allows .env.example', () => {
  const mustIgnore = [
    '.dart_tool/chrome-device/Default/Cookies',
    'build/web/index.html',
    'dist/index.html',
    '.astro/types.d.ts',
    'test-results/x.json',
    'playwright-report/index.html',
    'node_modules/x/index.js',
    '.env',
    '.env.local',
    'secrets/server.pem',
    'android/key.properties',
    'google-services.json',
    '.DS_Store',
    'assets/images/Profile.jpg',
  ];
  // check-ignore exits 1 for non-ignored paths, so query each path individually.
  const notIgnored = mustIgnore.filter((p) => {
    try {
      git('check-ignore', '-q', '--no-index', p);
      return false;
    } catch {
      return true;
    }
  });
  assert.deepEqual(notIgnored, [], 'these paths are not ignored');
  assert.throws(
    () => git('check-ignore', '-q', '--no-index', '.env.example'),
    '.env.example must not be ignored',
  );
});

test('committed JPEG/PNG images carry no metadata (EXIF, GPS, XMP, IPTC, ICC, comments)', () => {
  // Walks the segments before the image data. Only the coding segments may appear: APP0
  // (JFIF) is tolerated, every other APPn (APP1 = EXIF/XMP, APP2 = ICC, APP13 = IPTC) and
  // COM fail. PNGs fail on tEXt/zTXt/iTXt/eXIf chunks.
  const images = git('ls-files', '-z', 'src/assets')
    .split('\0')
    .filter((f) => /\.(jpe?g|png)$/i.test(f));
  assert.ok(images.length >= 2, 'expected the profile and about photos in src/assets/');
  const problems = [];
  for (const file of images) {
    const b = readFileSync(path.join(root, file));
    if (/\.png$/i.test(file)) {
      for (let i = 8; i < b.length;) {
        const len = b.readUInt32BE(i);
        const type = b.toString('latin1', i + 4, i + 8);
        if (['tEXt', 'zTXt', 'iTXt', 'eXIf'].includes(type)) problems.push(`${file}: ${type}`);
        if (type === 'IEND') break;
        i += 12 + len;
      }
      continue;
    }
    assert.equal(b.readUInt16BE(0), 0xffd8, `${file} is not a JPEG`);
    for (let i = 2; i + 4 <= b.length && b[i] === 0xff;) {
      const marker = b[i + 1];
      if (marker === 0xda) break; // start of scan: image data follows
      if ((marker >= 0xe1 && marker <= 0xef) || marker === 0xfe)
        problems.push(`${file}: segment 0xFF${marker.toString(16).toUpperCase()}`);
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  assert.deepEqual(problems, []);
});

/**
 * Repository hygiene: generated output, browser profiles, caches and secrets must
 * never be tracked (also catches `git add -f`), and .gitignore must keep ignoring
 * them. Background: docs/SECURITY_INCIDENT_2026-11-08.md.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
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

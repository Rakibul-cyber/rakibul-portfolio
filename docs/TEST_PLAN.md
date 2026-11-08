# Test plan

All suites run locally with `npm run verify` (type check → lint → format → build → preservation + build-output → e2e incl. axe) and in CI (`.github/workflows/deploy.yml`). Latest real results are recorded at the bottom; nothing here is claimed without a run.

## Suites

| Suite | Command | What it proves |
|---|---|---|
| Type check | `npm run check` | `astro check` + `tsc --noEmit` on strict TypeScript, 0 errors / warnings / hints |
| Lint | `npm run lint` | ESLint (typescript-eslint strict, eslint-plugin-astro) |
| Format | `npm run format:check` | Prettier with Astro + Tailwind class ordering |
| Legacy extraction | `node tests/extract-legacy-inventory.mjs --check` | `tests/legacy-inventory.json` matches a fresh extraction from tag `legacy-flutter-source` |
| Repository hygiene | `npm test` (part 1) | No generated, browser-profile, dependency, test-output, env, key or credential file is tracked (catches `git add -f`); `.gitignore` still ignores them and allows `.env.example` |
| Content preservation | `npm test` (part 2) | Every legacy project/field/tag/link, CV, 16 skills, contact, timeline, certifications, languages present; changed links documented; drafts not rendered; pricing, hire, fake success, fake terminal, unverified stats absent; images shipped but not rendered |
| Build output | `npm test` (part 3) | `dist/` file allowlist; `.nojekyll`; every internal `href`/`src` under `/rakibul-portfolio/` and resolving in `dist/`; every `#anchor` has a target; no localhost; no Google Fonts; no third-party scripts; CV is a PDF; static output; one `<h1>` per page; canonical, JSON-LD, sitemap, robots; allowed runtime deps only; JS budget |
| Deploy gate | `npm run check:deploy` | Hygiene, build-output and preservation tests, **plus** fails on any `data-todo` marker (Impressum address) or a blocked file hash (CV with street address) |
| E2E | `npm run test:e2e` | Playwright at 1440 / 820 / 390, served under the real sub-path: status 200, no overflow, no broken images, no console errors, reduced motion, nav, filters, workflow keyboard, `<details>`, contact form + mailto, mobile menu, CV, legal + 404 pages |
| Accessibility | `npm run test:a11y` (also in e2e) | axe-core on every page and the open mobile menu: 0 serious / critical |
| External links | `npm run test:links` | Every external URL answers < 400 (LinkedIn's 999 is a warning) |
| Lighthouse | see "Lighthouse" below | Mobile scores for the built home page |

The content preservation test was mutation-checked on 2026-11-08. Renaming one legacy tag and injecting "€45/hr" into the built HTML made it fail with exactly those two assertions; restoring the build made it pass again.

## Before / after project inventory

| # | Legacy project (Flutter site order) | Legacy status | Legacy GitHub | New order | Rendered as | New GitHub | Images |
|---|---|---|---|---|---|---|---|
| 1 | Forest Tracking & Environmental Safety System | Live | — | 2 | case highlight + index | — (repo contents don't match; owner decision) | 7 in `public/projects/forest_ai/`, not rendered |
| 2 | Louco Mobile App | Production | — | 5 | case highlight + index | — | 7 in `public/projects/louco/`, not rendered |
| 3 | XR-Hub Condominium Management System | Delivered | — | 7 | index | — (three candidate repos; owner decision) | none |
| 4 | Analyzing Historical Stock & Revenue Data and Building a Dashboard | Project | `…/Analyzing-Historical-Stock-Revenue-Data-and-Building-a-Dashboard` | 3 | case highlight + index | unchanged | 6 referenced, **never existed** (warning) |
| 5 | STEKO Health Checker | Published → **Under review** (approved correction) | `https://github.com/Rakibul-cyber` | 6 | index | `…/FYP-2-Steko-Health-Checker-Application` (approved 2026-11-08) | none |
| 6 | Automotive HMI Dashboard | Demo | `…/automotive-hmi-dashboard` | 8 | index | unchanged | none |
| — | Real-Time Driver Stress & Cognitive Load Monitoring (new) | — | — | 1 | flagship case study + index | `…/driver-stress-monitoring` | none |
| — | Smart Infrastructure Lead Intelligence (new, rule-based, not ML) | — | — | 4 | index (Backend & cloud) | `…/smart-infrastructure-lead-intelligence` | none |

Titles, subtitles, descriptions, statuses and tags of all six legacy projects are byte-identical in `src/data/portfolio.ts` and visible on the page (quotes are typographic at render time). The exceptions are the STEKO description and status badge, where "Published research" became "Research paper (under review)". Both corrections were owner-approved on 2026-11-08 and are recorded in `contentCorrections`; the test asserts the corrected values are shown and the old description is gone.

## Latest results (2026-11-08, local: macOS arm64, Node 24.22.0, Chrome via `PW_CHANNEL=chrome`)

`npm run verify` → **exit 0**.

| Suite | Result |
|---|---|
| `astro check` + `tsc --noEmit` | 46 files: 0 errors, 0 warnings, 0 hints |
| ESLint | 0 problems |
| Prettier | all files formatted |
| Build | 4 pages (home, Impressum, privacy, 404) + robots.txt + sitemap |
| Legacy extraction `--check` | up to date |
| Content preservation | 15 / 15 passed; 6 warnings (Stock Dashboard images that never existed) |
| Build output | 16 / 16 passed; home page ships **5,924 bytes** of JS (budget 10 KB) |
| E2E (Playwright, desktop 1440 / tablet 820 / mobile 390) | **43 / 43 passed** |
| Accessibility (axe, part of e2e) | 0 serious/critical on home, Impressum, privacy, 404, open mobile menu, process + contact error state. A full run at every impact level found **0 violations of any severity**; axe left colour contrast "needs review" items on gradient/translucent text, checked by hand below |
| External links | 9 URLs: 8 OK, 1 warning (LinkedIn HTTP 999 to bots; verify manually), 0 failures |
| Deploy gate `npm run check:deploy` | **fails as intended**: `impressum/index.html: impressum-address` (owner must supply the address) |
| Dependency age | all 486 packages in `package-lock.json` published before 2026-10-25 (≥ 14 days) |

### Manual contrast check (WCAG 2.2 AA)

| Pair | Ratio |
|---|---|
| muted `#5a6072` on canvas / surface / white | 6.11 / 5.85 / 6.27 |
| slate-500 on white (small labels; never used on surface) | 4.76 |
| slate-600 on surface | 7.08 |
| accent on canvas (eyebrows) | 5.90 |
| accent-600 on accent-50 (pills) | 6.59 |
| white on accent (primary button) | 6.04 |
| violet on canvas (end of the headline gradient, large text ≥ 3:1) | 4.27 |
| terminal dim / info / ok / warn on ink | 6.16 / 9.50 / 9.85 / 11.34 |

### Lighthouse 13.5.0 (mobile emulation, simulated throttling, local server)

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Home, run 1 | 96 | 100 | 100 | 100 |
| Home, run 2 | 96 | 100 | 100 | 100 |
| Home, run 3 | 96 | 100 | 100 | 100 |
| Impressum | 100 | 100 | 100 | 63 |
| Privacy | 100 | 100 | 100 | 63 |

Home metrics: FCP 1.8 s, LCP 2.6 s, TBT 20–50 ms, CLS 0, Speed Index 1.8 s. The legal pages score 63 on SEO **by design**: they are `noindex` (brief §6.4), which Lighthouse reports as "page is blocked from indexing". Remaining Performance hints are hosting-side: cache lifetimes and document latency are set by GitHub Pages; the local test server sends no compression, GitHub Pages gzips. An earlier build with external stylesheets scored 96; inlining CSS (`build.inlineStylesheets: 'always'`) removed the render-blocking requests (97 on that dependency tree).

### Reproduce

```bash
export PATH="$HOME/.local/opt/node/bin:$PATH"   # this machine only
npm ci
npx playwright install --with-deps chromium     # or set PW_CHANNEL=chrome to use installed Chrome
npm run verify
npm run test:links
npm run check:deploy                            # expected to fail until the Impressum address is added
node scripts/serve-dist.mjs --port 4323 &
npx lighthouse@13.5.0 http://localhost:4323/rakibul-portfolio/ --view
```

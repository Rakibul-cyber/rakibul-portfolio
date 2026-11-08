# Implementation tasks

Status legend: ✅ done · 🔄 in progress · ⏳ pending · ⚠️ done with caveat. Complexity: S / M / L.

## Phase 0: Audit ✅

| Task | Depends on | Acceptance | Files | Risk | Cx | Status |
|---|---|---|---|---|---|---|
| Git state, branches, tags, remote, history | — | recorded | — | uncommitted work | S | ✅ |
| Read Flutter source, config, README | — | content inventoried | `lib/**` | — | S | ✅ |
| Deployment mechanism + default branch | — | confirmed | — | Pages API needs auth | S | ⚠️ inferred from served content |
| Live defects (`curl`) | — | each verified | — | — | S | ✅ |
| CV text, photo search, article search | — | results recorded | — | — | S | ✅ |
| Clone + read Driver Stress repo; check other repos | — | facts confirmed | — | — | M | ✅ |
| Write audit | all above | complete | `docs/EXISTING_PORTFOLIO_AUDIT.md` | — | M | ✅ |

## Phase 1: Reference analysis ✅

| Task | Acceptance | Files | Cx | Status |
|---|---|---|---|---|
| Screenshots 1440/820/390 + full page (scrolled) | saved (local only since 2026-11-08) | `docs/screenshots/reference-*.png` | S | ✅ |
| Token extraction from compiled CSS | §5.1 confirmed | — | S | ✅ |
| Component measurements + interaction inventory | documented | `docs/REFERENCE_DESIGN_AUDIT.md` | M | ✅ |
| Section mapping | every section mapped or omitted with reason | same | S | ✅ |

## Phase 2: Branch, tags, plan ✅

| Task | Acceptance | Files | Cx | Status |
|---|---|---|---|---|
| Tags `legacy-flutter-source`, `legacy-flutter-deploy` (local) | exist | — | S | ✅ |
| Branch `redesign/ai-ml-astro` from `origin/main`, upstream unset | exists | — | S | ✅ |
| Technical decisions | trade-offs documented | `docs/TECHNICAL_DECISIONS.md` | S | ✅ |
| Project plan | goal, hierarchy, SEO, risks | `docs/REDESIGN_PROJECT_PLAN.md` | S | ✅ |

## Phase 3: Scaffold + design system ✅

| Task | Depends on | Acceptance | Files | Risk | Cx | Status |
|---|---|---|---|---|---|---|
| `package.json` with exact pins, `npm ci` lockfile | Node | install clean | `package.json`, `package-lock.json` | peer conflicts | S | ✅ |
| Astro config (static, base, sitemap) | — | builds under base | `astro.config.mjs` | — | S | ✅ |
| Tailwind v4 + `@theme` tokens + fonts + reduced-motion layer | — | tokens used, no arbitrary colours | `src/styles/global.css` | — | M | ✅ |
| `Base.astro` (SEO, JSON-LD, skip link), `withBase` | — | — | `src/layouts`, `src/lib/url.ts` | — | M | ✅ |
| Primitives: Button, Tag, Icon, SectionHeading, Card | — | prop-typed | `src/components/ui/*` | — | M | ✅ |
| Reveal script | — | once per element, reduced-motion safe | `src/scripts/reveal.ts` | — | S | ✅ |
| ESLint + Prettier configs, npm scripts | — | `lint`, `format:check` pass | configs | plugin compat | S | ✅ |

## Phase 4: Content model + extraction ✅

| Task | Acceptance | Files | Cx | Status |
|---|---|---|---|---|
| Extractor parses Dart at tag `legacy-flutter-source` | 6 projects, 16 skills, 4 posts, contact, 4 timeline, certs, languages | `tests/extract-legacy-inventory.mjs`, `tests/legacy-inventory.json` | M | ✅ |
| Typed `portfolio.ts` (verbatim legacy fields; sourced stats) | type-checks | `src/data/portfolio.ts` | L | ✅ |
| Migration map | every legacy item mapped | `docs/CONTENT_MIGRATION_MAP.md` | M | ✅ |

## Phase 5: Header, hero, stats ✅

| Task | Acceptance | Files | Risk | Cx | Status |
|---|---|---|---|---|---|
| Header: wordmark, anchors, ink CTA, blur on scroll | blur after 8px scroll | `components/sections/Header.astro`, `scripts/header.ts` | — | S | ✅ |
| Full-screen mobile menu | `aria-expanded`, Escape, focus in + trapped, scroll lock (e2e) | `Header.astro`, `scripts/menu.ts` | focus traps | M | ✅ |
| Hero: pill, gradient headline, CTAs, CV, monogram, chips, role line | above the fold at 1440×900; chips never cover the centre; 0 overlap 640–1920px (e2e) | `Hero.astro` | chip geometry | M | ✅ |
| Stats card + marquee | sourced stats; pause on hover/focus; static under reduced motion | `Stats.astro` | — | S | ✅ |

## Phase 6: Expertise, work ✅

| Task | Acceptance | Files | Risk | Cx | Status |
|---|---|---|---|---|---|
| 4 expertise cards + "Shown in" + full toolkit | links resolve (e2e) | `Expertise.astro` | overclaiming | M | ✅ |
| Flagship case study | LOSO next to held-out, architecture, limitations | `work/FlagshipCase.astro` | mobile overflow (fixed) | L | ✅ |
| Highlight cards with `<details>` | opens (e2e) | `work/HighlightCard.astro` | — | S | ✅ |
| Filterable index + live region | 2/1/5/3/7 (e2e); no images rendered (test) | `work/ProjectIndex.astro`, `scripts/filters.ts` | — | M | ✅ |

## Phase 7: Process, experience, about, writing, contact, footer, legal, 404 ✅

| Task | Acceptance | Files | Risk | Cx | Status |
|---|---|---|---|---|---|
| Six-stage ring as ARIA tabs; auto-advance stops on interaction, pauses off-screen | arrows/Home/End/roving tabindex (e2e) | `Process.astro`, `scripts/workflow.ts` | class clash with Tailwind `ring` (fixed) | L | ✅ |
| Terminal replay of real CI steps + training log | full output under reduced motion / no JS (e2e) | `process/Terminal.astro`, `scripts/terminal.ts` | — | M | ✅ |
| Quality gates, quote band | — | `Process.astro` | — | S | ✅ |
| Experience with transition note; education | real titles, CV bullets | `Experience.astro` | — | S | ✅ |
| About + certifications, learning, publications, languages | — | `About.astro` | — | S | ✅ |
| Writing (renders only published articles) | not rendered today (test) | `Writing.astro` | — | S | ✅ |
| Contact: validation + `mailto:` composer | errors on empty; encoded subject/body (e2e) | `Contact.astro`, `scripts/contact.ts` | — | M | ✅ |
| Footer; Impressum (`data-todo`), privacy, 404, robots | pages render; gate fails on todo | `Footer.astro`, `pages/*`, `layouts/Legal.astro` | legal accuracy (owner review) | M | ✅ |

## Phase 8: Preservation test → remove Flutter ✅

| Task | Acceptance | Files | Risk | Cx | Status |
|---|---|---|---|---|---|
| Content preservation test (mutation-checked) | 15/15 | `tests/content-preservation.test.mjs` | false passes | M | ✅ |
| Before/after inventory | table | `docs/TEST_PLAN.md` | — | S | ✅ |
| Remove Flutter source (after the test passed) | dedicated commit `697b211` | `lib/`, `web/`, `pubspec.*` | data loss (mitigated by tag) | S | ✅ |

## Phase 9: Quality ✅

| Task | Result |
|---|---|
| Build-output test | 17/17 |
| Deploy gate | passes as of 2026-11-08 (new CV; no Impressum by owner decision) |
| Playwright e2e at 1440/820/390 | 43/43 |
| axe | 0 violations of any impact |
| External links | 8 ok, 1 LinkedIn warning |
| Lighthouse mobile | 96 / 100 / 100 / 100 (3 runs) |
| Visual QA vs reference | documented in `REFERENCE_DESIGN_AUDIT.md` §9; 8 issues fixed |
| Dependency age | 486/486 packages ≥ 14 days (lockfile regenerated with `--before`) |

## Phase 10: Deployment preparation ✅

| Task | Result |
|---|---|
| `.github/workflows/deploy.yml` | PR: verify only; main: verify → gate → publish tested `dist/` to `gh-pages` (no force); actionlint 1.7.12 clean |
| Legacy service-worker kill switch | verified by upgrade simulation |
| `docs/DEPLOYMENT_PLAN.md`, README, PROJECT_STATUS | written |

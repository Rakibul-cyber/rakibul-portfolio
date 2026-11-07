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
| Screenshots 1440/820/390 + full page (scrolled) | saved | `docs/screenshots/reference-*.png` | S | ✅ |
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

## Phase 5: Header, hero, stats ⏳
## Phase 6: Expertise, work ⏳
## Phase 7: Workflow, experience, about, contact, footer, legal, 404 ⏳
## Phase 8: Preservation test → remove Flutter ⏳
## Phase 9: Quality (build-output, e2e, axe, links, Lighthouse, visual QA) ⏳
## Phase 10: Deploy workflow, docs, final report ⏳

(Tasks for phases 5–10 are expanded as each phase starts.)

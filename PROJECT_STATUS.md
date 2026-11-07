# Project status: portfolio redesign (Flutter Web → Astro)

**Last updated:** 2026-11-07 · **Branch:** `redesign/ai-ml-astro` (local only, no upstream) · **Nothing pushed or deployed.**

## Phases

| Phase | Status | Notes |
|---|---|---|
| 0 Audit | ✅ | `docs/EXISTING_PORTFOLIO_AUDIT.md` |
| 1 Reference analysis | ✅ | `docs/REFERENCE_DESIGN_AUDIT.md`, `docs/screenshots/reference-*` |
| 2 Branch, tags, plan | ✅ | tags `legacy-flutter-source` (2eadadd), `legacy-flutter-deploy` (ae42c32), local only |
| 3 Scaffold | ✅ | build, check, lint, format pass |
| 4 Content model | ✅ | inventory: 6 projects, 16 skills, 4 posts, 4 timeline, 3/3/3 certs/learning/languages; `portfolio.ts` type-checks |
| 5 Header/hero/stats | ⏳ | |
| 6 Expertise/work | ⏳ | |
| 7 Remaining sections + legal | ⏳ | |
| 8 Preservation → remove Flutter | ⏳ | |
| 9 Quality | ⏳ | |
| 10 Deploy prep | ⏳ | |

## Blocking items

- **Deployment only:** Impressum postal address (see decision 1). `npm run check:deploy` fails until it's provided.
- Nothing blocks implementation.

## Decisions needed from the owner

1. **Impressum postal address** (blocks deployment only).
2. **Profile photo:** none exists in the repo, history or CV. A monogram ("RH") is used until one is added.
3. **LinkedIn URL:** `/in/rakibulhassan-dev/` (legacy site, kept for now) or `/in/rakibul-hassan-33a2771b2/` (CV and the older React site).
4. **STEKO-SD publication status:** the site said "published", the CV says "ongoing". Shown without a status.
5. **XR-Hub repository link:** `XRHub-project-master-2`, `real-estate-condominium-management-system`, `flutter-web-project_Teczo` (third candidate found in the audit), or none.
6. **Repository links awaiting approval:** see the next section.
7. **Blog articles:** none of the 4 posts has a body. Provide the bodies or keep them hidden (currently hidden, status `draft`).
8. **Candidate AI-related repos** to add as projects (none added): `Text-Summarizer-Using-NLP`, `USING-ANIMAL-CLASSFY-MACHINE-LEARNING`, `aws-satellite-data-pipeline`, `careerpilot-ai.`, `smart-infrastructure-lead-intelligence`, `phitron-ai-ml-journey`, `Analysing-student-interest-in-Science-Subject-By-Using-EEG-Signals`.
9. **The CV PDF contains your street address** and will be publicly downloadable (as the legacy site intended). Keep it, or supply a version without the address?
10. **Forest AI repository:** `Forest-Tracking-Environmental-Safety-System` contains a Figma Make UI bundle (React/TypeScript), not the Flutter + AWS app, so it is **not linked**. Link it anyway (labelled as UI prototype), or leave it out?
11. **Reference screenshots** in `docs/screenshots/reference-*` show a third party's site (portrait, client logos). Keep them in the public repo or remove them before pushing?
12. **Legal texts** (Impressum, Privacy) are templates. Please review them, ideally with a qualified adviser.

## Changes awaiting approval (each a one-line revert in `src/data/portfolio.ts`)

- STEKO Health Checker GitHub link: `https://github.com/Rakibul-cyber` → `https://github.com/Rakibul-cyber/FYP-2-Steko-Health-Checker-Application` (repo verified: Dart FYP, matching features).
- (Forest AI link was **not** added; see decision 10.)

## Known warnings

- Six Stock Dashboard images referenced by the legacy data never existed in the repository (paths kept in data; preservation test warns).
- LinkedIn returns HTTP 999 to automated checks; verify manually.
- Pages source setting could not be read without authentication; inferred to be `gh-pages` / root from served content.
- Pre-existing uncommitted `.DS_Store` changes (Finder metadata) were not touched.

## Environment notes

- Node.js was not installed. v24.22.0 LTS was installed user-locally at `~/.local/opt/node` (checksum-verified official tarball). To use it: `export PATH="$HOME/.local/opt/node/bin:$PATH"`. Remove with `rm -rf ~/.local/opt/node*`.

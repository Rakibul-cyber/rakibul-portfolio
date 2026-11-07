# Project status: portfolio redesign (Flutter Web → Astro)

**Last updated:** 2026-11-08 · **Branch:** `redesign/ai-ml-astro` (local only, no upstream) · **Nothing pushed, merged or deployed.**

## Phases

| Phase | Status | Evidence |
|---|---|---|
| 0 Audit | ✅ | `docs/EXISTING_PORTFOLIO_AUDIT.md` |
| 1 Reference analysis | ✅ | `docs/REFERENCE_DESIGN_AUDIT.md`, `docs/screenshots/reference-*` |
| 2 Branch, tags, plan | ✅ | local tags `legacy-flutter-source` (2eadadd), `legacy-flutter-deploy` (ae42c32) |
| 3 Scaffold + design system | ✅ | Astro 7.4.2, TS strict, Tailwind 4.3.3 `@theme` tokens |
| 4 Content model + extraction | ✅ | `tests/legacy-inventory.json` (6 projects, 16 skills, 4 posts, 4 timeline, 3/3/3), `src/data/portfolio.ts` |
| 5 Header, hero, stats | ✅ | |
| 6 Expertise, work | ✅ | 7 projects; filters 2/1/5/3/7 |
| 7 Process, experience, about, contact, footer, legal, 404 | ✅ | |
| 8 Preservation → remove Flutter | ✅ | preservation 15/15 passed **before** `697b211` removed `lib/`, `web/`, `pubspec.*` |
| 9 Quality | ✅ | `npm run verify` exit 0: check 0/0/0, lint, format, 32/32 node tests, 43/43 e2e incl. axe; Lighthouse mobile 96/100/100/100 |
| 10 Deploy prep | ✅ | `.github/workflows/deploy.yml` (actionlint clean), `docs/DEPLOYMENT_PLAN.md`, README |

## Blocking items

- **Deployment only:** the Impressum postal address (decision 1). `npm run check:deploy` fails until it's added, so the first deploy job will stop at the gate.
- Nothing else blocks.

## Decisions needed from the owner

1. **Impressum postal address** (blocks deployment). Replace the placeholder in `src/pages/impressum.astro`.
2. **Profile photo:** none exists in the repo, its history or the CV. The site shows an "RH" monogram; see README → "Add a profile photo".
3. **LinkedIn URL:** `/in/rakibulhassan-dev/` (legacy site, currently used) or `/in/rakibul-hassan-33a2771b2/` (CV and the older React site). Both return HTTP 999 to bots; please open them to confirm which is yours. One-line change: `profile.linkedin`.
4. **STEKO-SD publication status:** the legacy site said "published", the CV says "ongoing". It's shown without a status. (The STEKO project's legacy status "Published" and description are kept verbatim.)
5. **XR-Hub repository link:** `XRHub-project-master-2`, `real-estate-condominium-management-system`, `flutter-web-project_Teczo` (a third candidate found in the audit), or none (current).
6. **Approve the repository link changes** listed below.
7. **Blog articles:** none of the 4 has a body anywhere. Provide the bodies (they'll be published as pages) or keep them hidden (current; all `status: 'draft'`).
8. **AI-related candidate repositories** to add as projects (none added): `Text-Summarizer-Using-NLP`, `USING-ANIMAL-CLASSFY-MACHINE-LEARNING`, `aws-satellite-data-pipeline`, `careerpilot-ai.`, `smart-infrastructure-lead-intelligence`, `phitron-ai-ml-journey`, `Analysing-student-interest-in-Science-Subject-By-Using-EEG-Signals`.
9. **The CV PDF contains your street address** and will be publicly downloadable once deployed (as the legacy site intended). Keep it, or supply a CV without the address?
10. **Forest AI repository:** `Forest-Tracking-Environmental-Safety-System` contains a Figma Make UI bundle (React/TypeScript, "Forester App Design"), not the Flutter + AWS app, so it is **not linked**. Link it anyway (labelled as a UI prototype), or leave it out?
11. **Reference screenshots** (`docs/screenshots/reference-*`) show a third party's site, including his portrait and client logos. Keep them in the public repo or delete them before pushing?
12. **Legal texts** (Impressum, privacy policy) are templates. Please review them, ideally with a qualified adviser.
13. **Optional cleanup:** `assets/projects/**` and the root `CV_MD_Rakibul_Hassan.pdf` duplicate the deployed copies in `public/`. They were kept because the brief didn't list them for removal.

## Changes awaiting approval (each a one-line revert in `src/data/portfolio.ts`)

- **STEKO Health Checker GitHub link:** `https://github.com/Rakibul-cyber` → `https://github.com/Rakibul-cyber/FYP-2-Steko-Health-Checker-Application` (repo verified: Dart final-year project with the matching features). To revert, set `githubUrl` back and remove the `linkChanges` entry.
- (Forest AI link was **not** added; see decision 10.)

## Known warnings

- Six Stock Dashboard images referenced by the legacy data never existed (paths kept in data; preservation test prints a warning for each).
- LinkedIn returns HTTP 999 to automated checks; verify manually.
- Lighthouse SEO is 63 on the Impressum and privacy pages because they are `noindex` by design.
- `robots.txt` is served under `/rakibul-portfolio/`; crawlers only read it at the domain root, so it's advisory (TD-15).
- The Pages source setting could not be read without authentication; inferred as `gh-pages` / root from the served content.
- Pre-existing `.DS_Store` files were never committed or discarded. The tracked root `.DS_Store` was untracked in `697b211` (local file kept) and is now git-ignored. Untracked `lib/.DS_Store` and `assets/.DS_Store` remain on disk, as do the ignored `build/` and `.dart_tool/` folders.
- The legacy Flutter service worker is neutralised by a kill switch at the same URL (verified with a local upgrade simulation).

## Environment notes

- Node.js was not installed. v24.22.0 LTS was installed user-locally at `~/.local/opt/node` (checksum-verified official tarball, no sudo, no shell-profile change). Use it with `export PATH="$HOME/.local/opt/node/bin:$PATH"`; remove it with `rm -rf ~/.local/opt/node*`.
- Local e2e runs used the installed Google Chrome (`PW_CHANNEL=chrome`); CI installs Playwright's Chromium.
- Astro collects anonymous telemetry by default; CI sets `ASTRO_TELEMETRY_DISABLED=1`. Locally you can run `npx astro telemetry disable`.

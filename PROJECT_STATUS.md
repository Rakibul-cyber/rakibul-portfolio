# Project status: portfolio redesign (Flutter Web → Astro)

**Last updated:** 2026-11-08 · **Branch:** `redesign/ai-ml-astro` (pushed by the owner to `origin/redesign/ai-ml-astro`; later commits are local) · **Not merged or deployed by me.**

## Phases

| Phase | Status | Evidence |
|---|---|---|
| 0 Audit | ✅ | `docs/EXISTING_PORTFOLIO_AUDIT.md` |
| 1 Reference analysis | ✅ | `docs/REFERENCE_DESIGN_AUDIT.md`; `docs/screenshots/reference-*` now local only (git-ignored) |
| 2 Branch, tags, plan | ✅ | tags `legacy-flutter-source` (2eadadd), `legacy-flutter-deploy` (ae42c32), **still local only** (not on origin) |
| 3 Scaffold + design system | ✅ | Astro 7.4.2, TS strict, Tailwind 4.3.3 `@theme` tokens |
| 4 Content model + extraction | ✅ | `tests/legacy-inventory.json` (6 projects, 16 skills, 4 posts, 4 timeline, 3/3/3), `src/data/portfolio.ts` |
| 5 Header, hero, stats | ✅ | |
| 6 Expertise, work | ✅ | 7 projects; filters 2/1/5/3/7 |
| 7 Process, experience, about, contact, footer, legal, 404 | ✅ | |
| 8 Preservation → remove Flutter | ✅ | preservation 15/15 passed **before** `697b211` removed `lib/`, `web/`, `pubspec.*` |
| 9 Quality | ✅ | `npm run verify` exit 0: check 0/0/0, lint, format, 32/32 node tests, 43/43 e2e incl. axe; Lighthouse mobile 96/100/100/100 |
| 10 Deploy prep | ✅ | `.github/workflows/deploy.yml` (actionlint clean), `docs/DEPLOYMENT_PLAN.md`, README |

## Urgent: found on `gh-pages` (2026-11-08)

Commit `869072a` "Add new images and sitemap files for project updates" (made outside this branch and already pushed to the **public** `gh-pages`) contains 328 build and cache files. Among them:

- **`.dart_tool/chrome-device/`**: a complete Chrome profile from `flutter run -d chrome`, including `Cookies`, `Login Data`, `History`, `Web Data` and session files. They are downloadable from `raw.githubusercontent.com` (HTTP 200). GitHub Pages itself returns 404 because Jekyll skips dot-folders. A local inspection that printed counts and hostnames only found 2 cookies, both for github.com and **encrypted** with the macOS Keychain key, 0 saved logins, no autofill/addresses/cards, and 10 history entries (9 localhost, 1 github.com). The risk is low, but this does not belong in a public repo.
- `dist/` (the redesign build) served at `/rakibul-portfolio/dist/`, where its asset paths don't resolve, plus `build/`, `.astro/`, `test-results/` and `.DS_Store` files.
- `dist/CV_MD_Rakibul_Hassan.pdf`, **the CV with your street address**, now live at `https://rakibul-cyber.github.io/rakibul-portfolio/dist/CV_MD_Rakibul_Hassan.pdf` (HTTP 200).

Recommended (owner action, not done):

1. Optional extra safety: sign out of GitHub sessions you don't recognise (GitHub → Settings → Sessions).
2. Remove these files from `gh-pages` with a normal commit. This stops serving them, but they stay in history. Merging the redesign and letting the deploy workflow publish will also replace the whole `gh-pages` tree.
3. To erase them from history as well, `gh-pages` must be rewritten and **force-pushed**, e.g. reset it to `ae42c32` (the legacy build): `git push --force-with-lease origin ae42c32:gh-pages`. Cached copies on GitHub may persist until GitHub support purges them. This needs your explicit go-ahead.

## Blocking items

- **Deployment only:** the Impressum postal address. In the 2026-11-08 round you chose "I'll type my address", but no address came through, so the placeholder remains and `npm run check:deploy` still fails. Send the address, or decide to drop the Impressum.

## Resolved owner decisions (2026-11-08)

| # | Decision | Applied |
|---|---|---|
| LinkedIn | `https://www.linkedin.com/in/rakibulhassan-dev/` | already in `profile.linkedin`; no change |
| STEKO-SD | under review | publication shows "(under review)"; STEKO description corrected (see `docs/CONTENT_MIGRATION_MAP.md` → Owner-approved corrections) |
| STEKO repo link | approved | `linkChanges` status `approved` |
| XR-Hub | leave unlinked | no change |
| Blog | keep hidden | all 4 articles stay `draft` |
| Profile photo | no photo supplied | the "RH" monogram stays |
| Reference screenshots | remove from branch | untracked and git-ignored; files kept locally. **They remain in the history of the already-pushed `origin/redesign/ai-ml-astro`** (commit `c2ca139`) |
| CV | owner will supply a PDF without the street address at `public/CV_MD_Rakibul_Hassan.pdf` (same filename) | **pending:** the file is still the old 205,078-byte CV. Older versions remain in Git history (and on `main`, the pushed redesign branch and `gh-pages`), so they stay downloadable from the repository even after replacement |

## Decisions still open

1. **Impressum address** (blocks deployment).
2. **STEKO project status field.** The legacy status badge still says "Published" (verbatim legacy field), which reads oddly next to "paper under review". Options: keep it (it can be read as the app being delivered), or change it to e.g. "Delivered" as another recorded correction.
3. **Root `CV_MD_Rakibul_Hassan.pdf`** (old version with the street address) is still tracked at the repository root as a duplicate; only `public/` is deployed. Remove it from the branch once the new CV is in `public/`?
4. **gh-pages cleanup** (see Urgent above).
5. **Forest AI repository:** not linked (the repo is a Figma Make UI bundle). Link as a UI prototype, or leave it out?
6. **Legal texts** (Impressum, privacy policy) are templates; please review.
7. **AI candidate repositories:** assessment below; none added.
8. Optional cleanup: `assets/projects/**` duplicates `public/projects/**`.

## AI candidate repositories: assessment (2026-11-08)

Bar: the Driver Stress project. That means real code, a README that explains the approach, honest measured results, and tests and CI where relevant. All seven were shallow-cloned and read.

| Repository | What is actually there | Verdict |
|---|---|---|
| `smart-infrastructure-lead-intelligence` | ~5,900 lines of Python, 378 test functions, Docker + Compose, GitHub Actions CI green on `main` (26 Oct 2026), a long README with architecture, limitations and a GDPR/robots note. Scoring is **rule-based** (keyword signals → 0–100 score), not ML | **Recommend (1).** Strongest engineering evidence after Driver Stress. Present it under backend/automation as "rule-based lead scoring pipeline", **not** as AI/ML. It scrapes public business contact data, so keep the legal note visible |
| `USING-ANIMAL-CLASSFY-MACHINE-LEARNING` | 2022 coursework: pandas + scikit-learn Random Forest with GridSearchCV on the Austin shelter-outcomes dataset; predicts **adoption vs. not**. The README claims it classifies animals into mammals/birds/reptiles, which the code does not do. Random split without a seed; accuracy only printed, no recorded results, no tests | **Recommend (2), only after fixes.** It is real supervised ML, but first rewrite the README to match the code, fix the seed, use a stratified split, add a baseline and record the metrics. As it stands it fails the honesty bar |
| `Text-Summarizer-Using-NLP` | Two notebooks: spaCy word-frequency extractive summariser with a tkinter UI, and TextBlob sentiment on tweets (tweepy), plus a PDF report. No evaluation (no ROUGE). The README claims optional transformer summarisation that isn't in the code | Not now. Classic NLP coursework with no measured results and an overclaiming README |
| `aws-satellite-data-pipeline` | 60-line boto3 script. The "AI processing" is `time.sleep(2)`, random coordinates and a hard-coded `"ai_confidence_score": "98.5%"` | **Do not add.** Showing a fabricated confidence score would undermine the honest framing of the site. It could be reframed as a plain EC2/S3/IAM exercise, but adds little |
| `careerpilot-ai.` | Only `Readme.Md`, which is actually a Word `.docx` renamed; no code | Do not add |
| `phitron-ai-ml-journey` | README only (43 words), no notebooks yet | Do not add (course log) |
| `Analysing-student-interest-…-EEG-Signals` | README + a PDF report; no code or data | Do not add unless the code is published |

## Known warnings

- Six Stock Dashboard images referenced by the legacy data never existed (paths kept in data; preservation test prints a warning for each).
- LinkedIn returns HTTP 999 to automated checks; verify manually.
- Lighthouse SEO is 63 on the Impressum and privacy pages because they are `noindex` by design.
- `robots.txt` is served under `/rakibul-portfolio/`; crawlers only read it at the domain root, so it's advisory (TD-15).
- The Pages source setting could not be read without authentication; inferred as `gh-pages` / root from the served content.
- On this branch, pre-existing `.DS_Store` files were never committed or discarded. The tracked root `.DS_Store` was untracked in `697b211` (local file kept) and is now git-ignored. Untracked `lib/.DS_Store` and `assets/.DS_Store` remain on disk, as do the ignored `build/` and `.dart_tool/` folders.
- The legacy Flutter service worker is neutralised by a kill switch at the same URL (verified with a local upgrade simulation).

## Environment notes

- Node.js was not installed. v24.22.0 LTS was installed user-locally at `~/.local/opt/node` (checksum-verified official tarball, no sudo, no shell-profile change). Use it with `export PATH="$HOME/.local/opt/node/bin:$PATH"`; remove it with `rm -rf ~/.local/opt/node*`.
- Local e2e runs used the installed Google Chrome (`PW_CHANNEL=chrome`); CI installs Playwright's Chromium.
- Astro collects anonymous telemetry by default; CI sets `ASTRO_TELEMETRY_DISABLED=1`. Locally you can run `npx astro telemetry disable`.

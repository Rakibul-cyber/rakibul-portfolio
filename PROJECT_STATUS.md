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
| 6 Expertise, work | ✅ | 8 projects (7 + lead-intelligence added 2026-11-08); filters 2/1/5/4/8 |
| 7 Process, experience, about, contact, footer, legal, 404 | ✅ | |
| 8 Preservation → remove Flutter | ✅ | preservation 15/15 passed **before** `697b211` removed `lib/`, `web/`, `pubspec.*` |
| 9 Quality | ✅ | `npm run verify` exit 0: check 0/0/0, lint, format, 32/32 node tests, 43/43 e2e incl. axe; Lighthouse mobile 96/100/100/100 |
| 10 Deploy prep | ✅ | `.github/workflows/deploy.yml` (actionlint clean), `docs/DEPLOYMENT_PLAN.md`, README |

## Security incident (2026-11-08): see `docs/SECURITY_INCIDENT_2026-11-08.md`

- The flagged key is Chrome's built-in key, cached in a `flutter run -d chrome` profile that `gh-pages` commit `869072a` committed by accident.
- **Cleanup pushed** (owner-approved, normal push): `869072a..d7b23a7`.
- **History not rewritten** (owner decision); the remaining exposure is documented. The GitHub alert is left for the owner to close.
- Hardening: repo-hygiene test, `dist/` allowlist, CV hash block in the deploy gate, `persist-credentials: false`.
- **Old CV with the street address**: 4 public copies (live `/dist/` path, `main`, the pushed redesign branch, Google Drive) plus history. Plan in `docs/CV_PRIVACY_PLAN.md`.

## Blocking items

- **Deployment only:**
  1. A CV without the street address at `public/CV_MD_Rakibul_Hassan.pdf`. The deploy gate blocks the current file by hash. **The 2026-11-08 instruction still had the placeholder `[path]`, so no file has been supplied yet.**
  2. The Impressum postal address. **That instruction also still had the placeholder `[type it here]`.**

## Waiting for owner approval

- **Push `gh-pages` commit `f336f14`** (prepared locally, not pushed): deletes the 28 files under `dist/` and nothing else. This takes down the live old-CV copy. (`.dart_tool/` and `build/` were already removed by the pushed `d7b23a7`.)
- **History purge:** a full written procedure is in `docs/HISTORY_PURGE_PLAN.md`; nothing has been executed. The legacy tags stay local until this is decided.
- **PR #1** (`redesign/ai-ml-astro` → `main`, opened 2026-11-07) is open. Merging it would trigger the deploy workflow, which would then stop at the deploy gate while the CV and Impressum items are open.

## Resolved owner decisions (2026-11-08)

| Decision | Applied |
|---|---|
| LinkedIn `https://www.linkedin.com/in/rakibulhassan-dev/` | already in use |
| STEKO-SD under review | publication "(under review)"; description corrected; **status badge "Under review"** (both in `contentCorrections`, enforced by the preservation test) |
| STEKO repo link | approved |
| XR-Hub | left unlinked |
| Blog | hidden |
| Profile photo | monogram kept |
| Reference screenshots | untracked and git-ignored, kept locally |
| **smart-infrastructure-lead-intelligence** | added as project 4 of 8 under Backend & cloud, described as rule-based lead scoring (not ML), facts from its README, scorer code, tests and CI; also listed under "Shown in" on the MLOps/backend card |
| Root CV duplicate | untracked (local file kept, git-ignored; the hygiene test blocks re-adding it) |
| Git history | not rewritten; no force-push (plan prepared) |
| Security alert | owner closes it manually |

## Decisions still open

1. Impressum address (blocks deployment).
2. New CV file (blocks deployment).
3. Approve the `f336f14` push; restrict or replace the Google Drive CV.
4. History purge: yes/no (see plan).
5. Forest AI repository: not linked (a Figma Make UI bundle). Link it as a UI prototype, or leave it out?
6. Legal texts (Impressum, privacy policy) are templates; please review.
7. Optional cleanup: `assets/projects/**` duplicates `public/projects/**`.

## AI candidate repositories: assessment (2026-11-08)

Bar: the Driver Stress project. That means real code, a README that explains the approach, honest measured results, and tests and CI where relevant. All seven were shallow-cloned and read.

| Repository | What is actually there | Verdict |
|---|---|---|
| `smart-infrastructure-lead-intelligence` | ~5,900 lines of Python, 378 test functions, Docker + Compose, GitHub Actions CI green on `main` (26 Oct 2026), a long README with architecture, limitations and a GDPR/robots note. Scoring is **rule-based** (keyword signals → 0–100 score), not ML | **Added 2026-11-08** (owner decision). Strongest engineering evidence after Driver Stress. Present it under backend/automation as "rule-based lead scoring pipeline", **not** as AI/ML. It scrapes public business contact data, so keep the legal note visible |
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

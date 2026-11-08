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
| 6 Expertise, work | ✅ | 7 visible projects (lead-intelligence in data, hidden); filters 2/1/5/3/7 |
| 7 Process, experience, about, contact, footer, legal, 404 | ✅ | |
| 8 Preservation → remove Flutter | ✅ | preservation 15/15 passed **before** `697b211` removed `lib/`, `web/`, `pubspec.*` |
| 9 Quality | ✅ | `npm run verify` exit 0: check 0/0/0, lint, format, 32/32 node tests, 43/43 e2e incl. axe; Lighthouse mobile 96/100/100/100 |
| 10 Deploy prep | ✅ | `.github/workflows/deploy.yml` (actionlint clean), `docs/DEPLOYMENT_PLAN.md`, README |

## Security incident (2026-11-08): see `docs/SECURITY_INCIDENT_2026-11-08.md`

- The flagged key is Chrome's built-in key, cached in a `flutter run -d chrome` profile that `gh-pages` commit `869072a` committed by accident.
- **Cleanup pushed** (owner-approved, normal push): `869072a..d7b23a7`.
- **History not rewritten** (owner decision); the remaining exposure is documented. The GitHub alert is left for the owner to close.
- Hardening: repo-hygiene test, `dist/` allowlist, CV hash block in the deploy gate, `persist-credentials: false`.
- **Old CV with the street address:** live copy removed (`f336f14`); still on `main`, in history and on Google Drive. See `docs/CV_PRIVACY_PLAN.md`.

## Blocking items

- **None for deployment.** `npm run check:deploy` passes (2026-11-08): the address-free CV is in `public/` and there is no Impressum (owner decision).
- **Note:** PR #1 (`redesign/ai-ml-astro` → `main`) is open. Once this branch is pushed, **merging PR #1 would deploy the redesign**. Publication still needs the owner's explicit approval.

## Owner decisions applied (2026-11-08)

| Decision | Applied |
|---|---|
| Push `f336f14` | pushed (`d7b23a7..f336f14`); live `/rakibul-portfolio/dist/CV_MD_Rakibul_Hassan.pdf` → 404 |
| New CV | `~/Desktop/Rakibul_Hassan_Resume.pdf` → `public/CV_MD_Rakibul_Hassan.pdf`; no street address or postcode in text, document info or XMP; author metadata is the owner's name |
| Resume authoritative for experience | Enviotech (new, current), Louco Event Media GmbH (Mar–Jun 2026), JGU (Sep 2025 – Feb 2026), Teczo (Feb–Aug 2022); resume titles and bullets only; "present" only on Enviotech |
| Languages | English Fluent, German Basic |
| Publications | BEST4U.COM linked to the IIUM journal; STEKO-SD under review |
| Skills | resume-only skills (incl. NLP, XGBoost, Azure, C++) in the full toolkit only |
| smart-infrastructure-lead-intelligence | **hidden** via `hidden: true` until confirmed with Enviotech; kept in data |
| Impressum | **removed** (page, footer link, `data-todo` gate check) |
| History purge | **no**; plan kept for reference, marked decided-against; history (incl. `869072a` and the old CV) remains |
| Earlier: STEKO badge "Under review", STEKO repo link, LinkedIn, XR-Hub unlinked, blog hidden, monogram, reference screenshots untracked, root CV untracked, alert closed manually by owner | applied |

## Decisions still open

1. **Publishing the redesign** (push the branch, merge PR #1): needs explicit approval.
2. **Google Drive copy** of the old CV (with street address) is still public: restrict it or replace it with the new file (owner, in Drive).
3. **"2 apps in production use" statistic:** based on the legacy statuses of Louco ("Production") and Forest AI ("Live"). Both roles have ended; please confirm both apps are still in production use, or the statistic should change.
4. **Enviotech confirmation** for the lead-intelligence project (then remove `hidden: true`).
5. Forest AI repository link: not linked (a Figma Make UI bundle).
6. The privacy policy is a template; please review. Without an Impressum, the controller is identified by name, city, email and phone.
7. The resume lists a "Scalable Data Pipeline for Satellite & GPS Telemetry" project. The matching repo (`aws-satellite-data-pipeline`) produces random coordinates and a hard-coded confidence score (see the assessment below), so it is **not** on the site; consider revising that resume entry.
8. Optional cleanup: `assets/projects/**` duplicates `public/projects/**`.

## AI candidate repositories: assessment (2026-11-08)

Bar: the Driver Stress project. That means real code, a README that explains the approach, honest measured results, and tests and CI where relevant. All seven were shallow-cloned and read.

| Repository | What is actually there | Verdict |
|---|---|---|
| `smart-infrastructure-lead-intelligence` | ~5,900 lines of Python, 378 test functions, Docker + Compose, GitHub Actions CI green on `main` (26 Oct 2026), a long README with architecture, limitations and a GDPR/robots note. Scoring is **rule-based** (keyword signals → 0–100 score), not ML | **Added, then hidden 2026-11-08** (owner decision, pending Enviotech confirmation). Strongest engineering evidence after Driver Stress. Present it under backend/automation as "rule-based lead scoring pipeline", **not** as AI/ML. It scrapes public business contact data, so keep the legal note visible |
| `USING-ANIMAL-CLASSFY-MACHINE-LEARNING` | 2022 coursework: pandas + scikit-learn Random Forest with GridSearchCV on the Austin shelter-outcomes dataset; predicts **adoption vs. not**. The README claims it classifies animals into mammals/birds/reptiles, which the code does not do. Random split without a seed; accuracy only printed, no recorded results, no tests | **Recommend (2), only after fixes.** It is real supervised ML, but first rewrite the README to match the code, fix the seed, use a stratified split, add a baseline and record the metrics. As it stands it fails the honesty bar |
| `Text-Summarizer-Using-NLP` | Two notebooks: spaCy word-frequency extractive summariser with a tkinter UI, and TextBlob sentiment on tweets (tweepy), plus a PDF report. No evaluation (no ROUGE). The README claims optional transformer summarisation that isn't in the code | Not now. Classic NLP coursework with no measured results and an overclaiming README |
| `aws-satellite-data-pipeline` | 60-line boto3 script. The "AI processing" is `time.sleep(2)`, random coordinates and a hard-coded `"ai_confidence_score": "98.5%"` | **Do not add.** Showing a fabricated confidence score would undermine the honest framing of the site. It could be reframed as a plain EC2/S3/IAM exercise, but adds little |
| `careerpilot-ai.` | Only `Readme.Md`, which is actually a Word `.docx` renamed; no code | Do not add |
| `phitron-ai-ml-journey` | README only (43 words), no notebooks yet | Do not add (course log) |
| `Analysing-student-interest-…-EEG-Signals` | README + a PDF report; no code or data | Do not add unless the code is published |

## Known warnings

- Six Stock Dashboard images referenced by the legacy data never existed (paths kept in data; preservation test prints a warning for each).
- LinkedIn returns HTTP 999 to automated checks; verify manually.
- Lighthouse SEO is 63 on the privacy page because it is `noindex` by design.
- `robots.txt` is served under `/rakibul-portfolio/`; crawlers only read it at the domain root, so it's advisory (TD-15).
- The Pages source setting could not be read without authentication; inferred as `gh-pages` / root from the served content.
- On this branch, pre-existing `.DS_Store` files were never committed or discarded. The tracked root `.DS_Store` was untracked in `697b211` (local file kept) and is now git-ignored. Untracked `lib/.DS_Store` and `assets/.DS_Store` remain on disk, as do the ignored `build/` and `.dart_tool/` folders.
- The legacy Flutter service worker is neutralised by a kill switch at the same URL (verified with a local upgrade simulation).

## Environment notes

- Node.js was not installed. v24.22.0 LTS was installed user-locally at `~/.local/opt/node` (checksum-verified official tarball, no sudo, no shell-profile change). Use it with `export PATH="$HOME/.local/opt/node/bin:$PATH"`; remove it with `rm -rf ~/.local/opt/node*`.
- Local e2e runs used the installed Google Chrome (`PW_CHANNEL=chrome`); CI installs Playwright's Chromium.
- Astro collects anonymous telemetry by default; CI sets `ASTRO_TELEMETRY_DISABLED=1`. Locally you can run `npx astro telemetry disable`.

# Existing portfolio audit

Phase 0 deliverable. Audit run on **2026-11-07** against `origin/main` @ `2eadadd` and `origin/gh-pages` @ `ae42c32`. All findings below came from commands that were actually run (git, `curl`, the public GitHub REST API, `pypdf` on the CV). Nothing in the repository was changed during the audit.

## 1. Workspace and repository state

| Item | Observed |
|---|---|
| Local path | `/Users/rakibulhassan/rakibul-portfolio` |
| Current branch | `main`, up to date with `origin/main` |
| Remote | `origin` → `https://github.com/Rakibul-cyber/rakibul-portfolio.git` |
| Branches | `main`, `gh-pages` (local and remote, identical SHAs). **No `redesign/ai-ml-astro` branch exists** locally or on the remote, so the redesign is built from `origin/main` (prompt §1.3, "if it does not exist"). |
| Tags | none |
| Stashes | none |
| Default branch (GitHub API) | **`gh-pages`** (confirmed) |
| `has_pages` | `true`. The Pages settings endpoint needs authentication, so the source is inferred: the live `index.html` is byte-for-byte the `gh-pages` root `index.html` (same `<base href="/rakibul-portfolio/">`, same `og:url`), so Pages serves `gh-pages` / root. |
| Uncommitted changes not made by me | `M .DS_Store` (6 KB → 14 KB), `?? assets/.DS_Store`, `?? lib/.DS_Store`. These are macOS Finder metadata, not work. They are left untouched (never staged, committed or discarded). Judged non-blocking; see §9. |
| Ignored build artefacts in the working tree | `build/`, `.dart_tool/` (local Flutter build output, git-ignored) |
| Tooling on this machine | Python 3.13.3, Docker, Google Chrome. **Node.js/npm are not installed** (no nvm/volta/fnm/Homebrew node). No `pdftotext`, `gh` or `actionlint`. See §9. |

### History

- `main` has 15 commits. The first seven (`1aaf643` … `2acb58c`, 2026-01-21) are **an earlier React (Create React App) portfolio build**, committed as compiled output including `node_modules/.cache/gh-pages/...`. `443deec` (2026-06-12) replaced it with Flutter; later commits added project images.
- `gh-pages` has two commits: `eb65ffe Deploy Flutter web` and `ae42c32 Add version.json`.

## 2. `main`: Flutter source

```
.DS_Store  .flutter-plugins-dependencies  .gitignore  CV_MD_Rakibul_Hassan.pdf  README.md
pubspec.yaml  pubspec.lock  web/index.html
lib/main.dart
lib/models/portfolio_data.dart        projects, skills, pricing packages, blog posts
lib/screens/hero_section.dart         status badge, name, rotating roles, intro, stats, terminal animation
lib/screens/portfolio_page.dart       page assembly, About text + timeline
lib/screens/skills_section.dart       skills grid, certifications, learning, languages
lib/screens/projects_section.dart     project showcase grid (display order: Louco, Forest, Stock, then rest)
lib/screens/hire_section.dart         pricing + "why hire me"
lib/screens/blog_contact_section.dart blog cards, contact form, contact details, footer
lib/theme/app_theme.dart              dark theme (#0A0F1E bg, #00D4FF cyan, #FFB347 amber)
lib/utils/responsive.dart             layout helpers (no content)
lib/widgets/common_widgets.dart       nav (labels About/Skills/Work/Hire Me/Blog/Contact), CV URL, buttons, cards
assets/projects/louco/       7 PNGs
assets/projects/forest_ai/   7 PNGs
assets/projects/stock-dashboard/.gitkeep   (no images)
```

`.gitignore` contains only `build/`, `.dart_tool/`, `.flutter-plugins-dependencies` (the last is nonetheless tracked). No tests, no `.github/workflows`.

## 3. `gh-pages`: deployed build

- 95 files: a `flutter build web` output at the root **plus stray copies** under `build/web/` (29 files) and `.dart_tool/` (34 files, including a 36.5 MB `app.dill`).
- `index.html` has `<base href="/rakibul-portfolio/">`, Google Fonts `<link>`s, `og:url = https://rakibulhassan.dev`.
- Payload: `main.dart.js` 2.40 MB, plus CanvasKit/skwasm WASM files of 5–7 MB each.
- **No project images and no CV PDF** are in `gh-pages`; the asset manifest contains only fonts/shaders.
- Last-Modified on the live site: Fri, 12 Jun 2026 21:10:53 GMT.

## 4. Live-site defects (prompt §1.2), verified

| Defect | Verification | Result |
|---|---|---|
| Stale deploy | `curl …/assets/assets/projects/louco/louco-cover.png` | **404**; images added on `main` after 12 Jun were never deployed. Confirmed. |
| CV download 404 | `curl …/rakibul-portfolio/CV_MD_Rakibul_Hassan.pdf` | **404**. Confirmed. The URL is hard-coded in `common_widgets.dart` (`_cvUrl`). |
| Missing Stock Dashboard images | `portfolio_data.dart` lines 172–180 vs. repo tree | 6 paths referenced (1 cover + 5 gallery), **0 exist** in any commit. Confirmed. |
| Contact form fake success | `blog_contact_section.dart:241`: `onTap: () => setState(() => _sent = true)` | No submit handler; shows "Message sent!". Confirmed. |
| Dead blog links | `blog_contact_section.dart:33` `onTap: () {}`; "Read more →" is plain text | No targets. Confirmed. |
| Canvas rendering | CanvasKit renderer, no DOM text | Confirmed (2.4 MB JS + multi-MB WASM). |
| Wrong `og:url` | live HTML | `https://rakibulhassan.dev`; that domain **does not resolve** (curl status 000). Confirmed. |

Additional defects found:

- Social buttons (GitHub, LinkedIn) in the contact section have no tap handler (`_socialBtn` builds a `Container` only).
- The About text says "**Previously** at Johannes Gutenberg University Mainz (HiWi)" while the timeline says "2025 – Present" for the same role.
- `hire_section.dart` says "MSc Computer Science"; the actual programme is MSc High Integrity Systems (section is removed anyway).
- Footer copyright year is hard-coded "© 2025".

## 5. Per-project inventory (legacy `portfolio_data.dart`, in declaration order)

Display order on the legacy page: Louco → Forest → Stock Dashboard → XR-Hub → STEKO → Automotive HMI (`projects_section.dart` `_arrangedProjects`).

| # | Title | Subtitle | Status | Tags | GitHub | Live | Images | Public repo found |
|---|---|---|---|---|---|---|---|---|
| 1 | Forest Tracking & Environmental Safety System | Production · Full-Stack + Cloud | Live | Flutter, AWS EC2, PostgreSQL, Python, AI/ML, GPS/Satellite | — | — | cover `forest_ai/forest-map.png` + 6 gallery (all exist) | `Forest-Tracking-Environmental-Safety-System`: **does not match** (see below) |
| 2 | Louco Mobile App | Production · Flutter Mobile | Production | Flutter, Dart, GetX, Firebase, REST API, Push Notifications, Google Auth, Apple Auth, Android, iOS, TestFlight, Play Console | — | — | cover `louco/louco-cover.png` + 6 gallery (all exist) | none (client code) |
| 3 | XR-Hub Condominium Management System | Flutter Web & Mobile | Delivered | Flutter Web, Flutter Mobile, Node.js, PostgreSQL, Dashboard | — | — | none | three candidates (see below); not linked |
| 4 | Analyzing Historical Stock & Revenue Data and Building a Dashboard | Stock Revenue Dashboard | Project | Python, Pandas, NumPy, Matplotlib, Plotly, Dash, Streamlit, Jupyter Notebook, Data Analysis, Data Visualization | `…/Analyzing-Historical-Stock-Revenue-Data-and-Building-a-Dashboard` | — | 6 referenced, **0 exist** | yes: `README.md` + `Final Assignment-v2.ipynb` |
| 5 | STEKO Health Checker | Final Year Project · mHealth | Published | Flutter, Node.js, Firebase, Health Tech, Research | `https://github.com/Rakibul-cyber` (profile only) | — | none | `FYP-2-Steko-Health-Checker-Application` (Dart, matches) |
| 6 | Automotive HMI Dashboard | Android Automotive · Jetpack Compose | Demo | Android Automotive, Jetpack Compose, WebSocket, Kotlin, HMI | `…/automotive-hmi-dashboard` | — | none | yes (Kotlin; no README) |

Full descriptions are preserved verbatim by the extractor (`tests/legacy-inventory.json`, Phase 4).

### Repository checks

- **Forest AI → `Forest-Tracking-Environmental-Safety-System`.** The GitHub description matches the project ("production-deployed, full-stack mobile application built with Flutter and AWS…"), but the **contents do not**: the repo is a Figma Make code bundle titled "Forester App Design" (React/TypeScript/Vite, 75 files, no Flutter, no AWS, no Python). Linking it as "the source" would misrepresent it. **Decision: not linked.** Listed as an owner decision.
- **STEKO → `FYP-2-Steko-Health-Checker-Application`.** Dart/Flutter final-year project with the matching feature set. Its README's tech-stack section still contains template placeholders ("[Specify e.g., React, Flutter…]"). Upgrade from profile URL to this repo is applied **as a change awaiting approval** (one-line revert).
- **XR-Hub.** Three candidates, all Flutter condominium systems: `XRHub-project-master-2` ("improvement phase v2"), `real-estate-condominium-management-system` ("dashboard … improvement phase"), and **`flutter-web-project_Teczo`** (not named in the prompt; "Teczo – Condominium Management System"). Not linked; owner decision.
- **Stock Dashboard.** Repo exists; contains one notebook. The README lists Dash/Streamlit as dashboard options; the legacy tags list both. Kept verbatim.
- **Automotive HMI.** Repo exists (Kotlin 51.9 KB, plus JS/CSS/HTML); no README.

## 6. Driver Stress repository (new flagship), verified

Cloned `https://github.com/Rakibul-cyber/driver-stress-monitoring` @ `9b289b2`. Read `README.md`, `models/model_metadata.json`, `reports/train_log.txt`, `.github/workflows/ci.yml`, `src/*.py`, `tests/test_pipeline.py`, `requirements.txt`, `Dockerfile`.

Every fact in prompt §4.3 is **confirmed**:

- Rows 196,978 → 184,276 after dedup (S10 duplicated); 15 subjects (S2–S11, S13–S17); 30 base HRV features; exclusions as stated (transforms, `KURT_REL_RR`/`SKEW_REL_RR` duplicates, `Time`, `SSSQ`).
- `Pipeline(SimpleImputer(median) → RandomForestClassifier(n_estimators=200, max_depth=20, min_samples_leaf=5, class_weight="balanced", random_state=42))`.
- Held out S15/S16/S17 (35,707 windows); LOSO on 12; training stride 4 (1 Hz), 37,147 training rows.
- Held-out: acc 0.8811, precision 0.7452, recall 0.7692, F1 0.757, macro-F1 0.8392, ROC-AUC 0.9396; confusion `[[24850, 2261], [1984, 6612]]`.
- LOSO: acc 0.830 ± 0.153, precision 0.690 ± 0.310, recall 0.655 ± 0.297, F1 0.622 ± 0.248, macro-F1 0.745 ± 0.177, **ROC-AUC 0.897 ± 0.114**.
- Per-subject LOSO F1: max 0.942 (S7), min 0.000 (S5); S10 accuracy 0.364.
- FastAPI `/health`, `/model-info`, `/predict`; 422 on invalid input (`src/api.py:96`), 503 when no model (`src/api.py:69`).
- CI steps: checkout → setup-python 3.12 → install → cache dataset → download → train → `pytest -q` → `docker build` → API smoke test (`/health`, `/model-info`, `/predict`). Latest run on `main` (`9b289b2`, 2026-11-06): **completed / success**.
- Limitations section exists and matches the prompt, plus: pre-computed features (no raw-signal stage), overlapping windows overstate independent observations, fixed 0.5 threshold, not a medical/safety-certified system.

Small differences from the prompt:

- README says `pytest -q # 10 tests`; `tests/test_pipeline.py` defines **9** test functions and no parametrisation. The site will not state a test count.
- `train_log.txt` contains an absolute local path (`/Users/rakibulhassan/driver-stress-monitoring/models/…`). The terminal replay will show the path relative to the repo.
- README reports inference latency "roughly 5–10 ms … on an Apple-silicon Mac". Usable as a quoted, scoped figure; not used as a hero statistic.
- CI/Docker numbers differ by about 0.005 from the macOS numbers (README "Reproducibility"). The site uses the committed `model_metadata.json` values and says so.

## 7. Contact, CV and other content

| Item | Legacy site | CV (`CV_MD_Rakibul_Hassan.pdf`, 2 pages, created 2026-01-21) | Note |
|---|---|---|---|
| Name | "Md. Rakibul Hassan" | "MD RAKIBUL HASSAN" | New site uses "Md Rakibul Hassan" (prompt §3.1) |
| Email | hassanrakibul029@gmail.com | same | ✔ |
| Phone | +49 1521 4837797 | same | ✔ |
| Location | Frankfurt am Main, Germany | Frankfurt am Main + **street address** | Street address must not be published (prompt §6.6). **The CV PDF itself contains it**; flagged. |
| GitHub | github.com/Rakibul-cyber | same | ✔ |
| LinkedIn | `/in/rakibulhassan-dev/` | `/in/rakibul-hassan-33a2771b2/` | **Discrepancy**; the older React site also used the CV URL. Both return 999 to bots. Owner decision. |
| CV URL | `https://rakibul-cyber.github.io/rakibul-portfolio/CV_MD_Rakibul_Hassan.pdf` | — | 404 today; will be fixed by serving it from `public/`. |

**Timeline (legacy `portfolio_page.dart`):** 2025 – Present HiWi · JGU Mainz (Flutter + AWS, Environmental Monitoring App); 2025 – Present Freelance · Louco GmbH (Flutter Developer · Frankfurt); 2023 Flutter Dev · Teczo Sdn. Bhd. (XR-Hub · Kuala Lumpur); 2023 BSc Computer Science (IIUM Malaysia — Software Engineering).

- CV titles: "HiWi – Mobile Application Developer | Johannes Gutenberg University Mainz | Mainz, Germany | Present" (no start year) and "Flutter Developer | Teczo Sdn. Bhd. | Kuala Lumpur, Malaysia | 2023". **Louco is not on the CV**; it comes only from the legacy site.
- The older React site (history, Jan 2026) showed "2024 – Present" for one role and "2022 – Present" for another. Not a primary source; the Flutter values (2025) are kept and the discrepancy is recorded.
- CV responsibilities available: 5 bullets for JGU, 3 for Teczo. No Louco bullets on the CV; Louco responsibilities come from the legacy project description.

**Education:** MSc High Integrity Systems, Frankfurt UAS (ongoing; CV "Majors: Computer Science"); BSc Computer Science (Software Engineering), IIUM, August 2023.

**Skills:** 16, as in the prompt (names, categories and 1–5 levels).

**Certifications / learning / languages** (`skills_section.dart`): Google Data Analytics, Google AI Essentials, Business Analytics with Excel / AWS Certified Cloud Practitioner (in prep), MSc High Integrity Systems — Frankfurt UAS, Advanced DevOps Practices / Bengali — Native, English — Professional, German — Learning. The CV lists only the AWS item under certifications.

**Publications:** STEKO-SD (site: "Published research"; CV: "(On going)") → **conflict**, shown without status. BEST4U.COM (CV: May 2022).

**Blog:** 4 posts (title, excerpt, date, read time, tag). **No bodies or URLs exist anywhere**: searched the working tree (including ignored `build/`, `.dart_tool/`), all 17 commits on both branches, and the old React bundle. The only matches for article titles are `portfolio_data.dart` and compiled copies of it. → All four become `draft`; no Writing section.

**Profile photo:** **none found.** Searched every image in the working tree (including ignored dirs) and every image path ever committed. Candidates: only project screenshots. `forest_ai/profile.png` is a screenshot of the Forest app's profile screen (green "H" avatar), not a portrait. The old React build had only CRA default logos. → Monogram fallback; "profile photo needed".

**Unverified legacy statistics** (not used): "3+ Years Experience", "10+ Projects Shipped", "3 Countries Worked", "2 Publications". The old React bundle also contained "reducing admin overhead by 40%" (not used).

**Legacy text to remove (approved):** Hire section (3 packages: €45/hr, €60/hr, €3,200/mo; "why hire me" ×4), fake "Message sent!" state, fictional terminal (`flutter build web`, `aws s3 sync`, "Available for hire 🚀"), rotating role list (Flutter Developer / DevOps Engineer / Cloud Architect / Full-Stack Developer), status "Available for freelance & part-time".

## 8. Other public repositories (candidates only, not added)

35 public, non-fork repos. AI/ML-adjacent candidates (prompt §4.6), metadata only:

| Repo | Language | Last push | Note |
|---|---|---|---|
| `Text-Summarizer-Using-NLP` | Jupyter | 2025-08-16 | |
| `USING-ANIMAL-CLASSFY-MACHINE-LEARNING` | Python | 2025-08-21 | |
| `aws-satellite-data-pipeline` | Python | 2026-03-08 | EC2/S3/IAM pipeline |
| `careerpilot-ai.` | — | 2026-07-07 | empty description |
| `smart-infrastructure-lead-intelligence` | Python | 2026-10-26 | empty description |
| `phitron-ai-ml-journey` | — | 2026-10-31 | course journal |
| `Analysing-student-interest-in-Science-Subject-By-Using-EEG-Signals` | — | 2025-08-27 | EEG project |

## 9. Differences from the prompt and issues to carry forward

1. **No `redesign/ai-ml-astro` branch.** Working branch will be `redesign/ai-ml-astro`, created from `origin/main`.
2. **Node.js is not installed** on this machine. Astro needs Node ≥ 18.20.8/20.3/22 (to be confirmed against current docs). A user-local Node LTS is installed under `~/.local` from the official nodejs.org tarball (no sudo, no global system changes, removable by deleting one folder). Recorded in `PROJECT_STATUS.md`.
3. **`.DS_Store` changes** pre-existed and are Finder metadata. They are not touched. In Phase 8 the tracked root `.DS_Store` is removed from the index only (`git rm --cached`), and `.DS_Store` is added to `.gitignore`, so the local files stay.
4. **Forest AI repo link is not added** (contents don't match, §5). The prompt anticipated adding it; this is an owner decision instead.
5. **Third XR-Hub candidate** `flutter-web-project_Teczo`.
6. **CV PDF contains the owner's street address** and will be publicly served (as the legacy site intended). Owner decision: keep, or supply a CV without the address.
7. The old React site in git history used the CV's LinkedIn URL, which slightly favours `/in/rakibul-hassan-33a2771b2/`. Still an owner decision; the legacy value is kept.
8. Pages source cannot be read without authentication; inferred from served content (§1).

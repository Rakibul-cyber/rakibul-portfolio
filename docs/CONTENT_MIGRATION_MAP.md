# Content migration map

Every legacy content item → where it lives now → what changed. Source of the legacy items: `tests/legacy-inventory.json`, extracted programmatically by `tests/extract-legacy-inventory.mjs` from tag `legacy-flutter-source` (commit `2eadadd`). New-site data: `src/data/portfolio.ts`.

**Typography rule:** legacy strings are stored verbatim (including straight quotes `"` `'`). At render time, a small `smartQuotes()` helper turns them into typographic quotes (“ ” ’). The preservation test normalises quotes before comparing, so this is not counted as a text change.

## Projects

| Legacy project | New `id` | Rendered in | Fields preserved verbatim | Changes |
|---|---|---|---|---|
| Forest Tracking & Environmental Safety System | `forest-ai` | Case highlight + project index | title, subtitle, description, tags (6), status "Live" | Order 1 → 2. New highlight summary and "How it was built" (problem, role, approach from CV, outcome). No metrics added. **No repo link** (repo contents don't match; owner decision 10). Images: paths moved `assets/projects/forest_ai/*` → `public/projects/forest_ai/*`; deployed, not rendered. |
| Louco Mobile App | `louco` | Case highlight + project index | title, subtitle, description, tags (12), status "Production" | Order 2 → 4. Highlight with architecture (Flutter UI → GetX → REST → Firebase), features and release from the legacy description. No user numbers. Images moved to `public/projects/louco/*`; deployed, not rendered. |
| XR-Hub Condominium Management System | `xr-hub` | Project index | all | Order 3 → 6. No repo link (three candidate repos; owner decision 5). |
| Analyzing Historical Stock & Revenue Data and Building a Dashboard | `stock-dashboard` | Case highlight + project index | all, incl. GitHub URL | Order 4 → 3. Highlight from the legacy description and tags only. The 6 referenced images never existed; paths kept in data (`projects/stock-dashboard/*`) and reported as a warning. |
| STEKO Health Checker | `steko` | Project index | title, subtitle, description, tags, status "Published" | Order 5 → 5. **GitHub URL changed** `https://github.com/Rakibul-cyber` → `…/FYP-2-Steko-Health-Checker-Application` (awaiting approval; `linkChanges` in data). |
| Automotive HMI Dashboard | `automotive-hmi` | Project index | all, incl. GitHub URL | Order 6 → 7. |
| — (new) | `driver-stress` | Flagship case study + project index | — | New project from `github.com/Rakibul-cyber/driver-stress-monitoring`; all facts from its README, `model_metadata.json`, `train_log.txt`, `ci.yml`, `src/`, `tests/`. |

Legacy emoji icons are kept in data as `legacyIcon` (not rendered). Legacy `liveUrl` was `null` for every project, so none is set.

## Profile, hero and statistics

| Legacy | New | Change |
|---|---|---|
| Name "Md. Rakibul Hassan" | "Md Rakibul Hassan" | Brief §3.1 |
| Rotating roles (Flutter Developer / DevOps Engineer / Cloud Architect / Full-Stack Developer) | Role line "AI/ML Engineer \| AI-Powered Software Developer" | Repositioning (brief §3.2). Removed. |
| Status "Available for freelance & part-time" | "Open to AI/ML and software engineering roles" | Brief §3.2 |
| Hero intro (MSc student … Flutter apps and AWS …) | Brief §3.2 introduction | Rewritten |
| Stats 3+ years / 10+ projects / 3 countries / 2 publications | 0.90 LOSO ROC-AUC · 2 apps in production use · 7 projects | Unverified figures dropped; each new stat has `source` |
| CTAs "Hire Me →", "View My Work" | "See my work", "Get in touch", "Download CV" | Hire removed |
| Terminal animation (`flutter build`, `aws s3 sync`, "Available for hire 🚀") | Removed; the process section replays the **real** Driver Stress CI + training log | Fictional output removed (brief §4.5) |

## Skills, certifications, learning, languages

| Legacy | New location | Change |
|---|---|---|
| 16 skills with levels 1–5 | `legacySkills` → "Full toolkit" row under Expertise | All names rendered; levels kept in data, **not rendered** |
| Section "Technical Arsenal / Skills & Stack" | Expertise section (4 cards) + Full toolkit | Restructured around the AI/ML positioning |
| Certifications: Google Data Analytics, Google AI Essentials, Business Analytics with Excel | About → Certifications | unchanged |
| Learning: AWS Certified Cloud Practitioner (in prep) · MSc High Integrity Systems — Frankfurt UAS · Advanced DevOps Practices | About → Currently learning | "(in prep)" → "(in preparation)"; "—" → ","; sentence case |
| Languages: Bengali — Native · English — Professional · German — Learning | About → Languages | Rendered as name + level |

## About and timeline

| Legacy | New | Change |
|---|---|---|
| About paragraph 1 ("I'm a Flutter developer and aspiring DevOps engineer…") | About | Rewritten for AI/ML positioning (brief §4.4) |
| About paragraph 2 ("Previously at JGU Mainz (HiWi)…") | About + Experience | Rewritten. Also fixes the legacy contradiction ("previously" vs. "present") |
| About paragraph 3 ("Outside code: Bengali literature enthusiast, published researcher in mobile health…") | About (last sentence) | Bengali literature kept; "published researcher" dropped (publication status unconfirmed, owner decision 4) |
| Timeline 2025 – Present · HiWi · JGU Mainz | Experience: Mobile Application Developer (HiWi), JGU Mainz | Real title from CV; 5 CV bullets |
| Timeline 2025 – Present · Freelance · Louco GmbH | Experience: Flutter Developer (freelance), Louco GmbH, Frankfurt | Bullets from the legacy Louco description (Louco is not on the CV) |
| Timeline 2023 · Flutter Dev · Teczo Sdn. Bhd. | Experience: Flutter Developer, Teczo Sdn. Bhd., Kuala Lumpur | 3 CV bullets |
| Timeline 2023 · BSc Computer Science | Experience → Education: BSc Computer Science (Software Engineering), IIUM, 2023 | Added MSc High Integrity Systems (in progress) from the CV |
| — | Experience intro: transition note | New, factual (brief §4.4) |
| — | Publications: STEKO-SD (no status), BEST4U.COM (2022) | New from CV; STEKO status conflict flagged |

## Writing

| Legacy | New | Change |
|---|---|---|
| 4 blog posts (title, excerpt, date, read time, tag) | `articles` in data, `status: 'draft'` | No bodies or URLs exist anywhere, so the **Writing section is not rendered**. "All Posts" and "Read more" (dead links) removed |

## Contact and footer

| Legacy | New | Change |
|---|---|---|
| Email, phone, location | Contact section + footer + Impressum | unchanged; email and phone are now `mailto:` / `tel:` links |
| GitHub `https://github.com/Rakibul-cyber` | Contact, footer, JSON-LD `sameAs` | Now an actual link (legacy button had no handler) |
| LinkedIn `https://www.linkedin.com/in/rakibulhassan-dev/` | same places | Kept; the CV lists a different URL (owner decision 3) |
| Contact form (no handler, fake "Message sent!") | Form that validates and opens a composed `mailto:` | Fake success removed; note says nothing is sent or stored |
| "Let's Build Something." / "I respond within 24 hours." | New contact heading and lead | The response-time promise is dropped (not verifiable) |
| Footer "© 2025 … · Built with Flutter 💙" | Footer with dynamic year, Impressum, Privacy | Rewritten |

## CV

| Legacy | New | Change |
|---|---|---|
| `https://rakibul-cyber.github.io/rakibul-portfolio/CV_MD_Rakibul_Hassan.pdf` (404 in production) | `public/CV_MD_Rakibul_Hassan.pdf` → same URL | Fixed: the file now ships with the build |

## Removed (approved, brief §4.5)

Hire section ("Work With Me / Hire Me"), 3 pricing packages (€45/hr, €60/hr, €3,200/mo) with features and CTAs, 4 "why hire me" items (incl. "MSc Computer Science", which was inaccurate), fake contact success state, fictional terminal, rotating roles, unverified stats. The preservation test asserts these are absent from the build.

## SEO

| Legacy | New |
|---|---|
| `<title>` "Rakibul Hassan — Flutter & DevOps Developer" | "Md Rakibul Hassan — AI/ML Engineer & AI-Powered Software Developer" |
| `og:url` `https://rakibulhassan.dev` (domain does not resolve) | canonical `https://rakibul-cyber.github.io/rakibul-portfolio/` |
| Google Fonts `<link>`s | self-hosted Latin variable fonts |
| keywords meta | dropped (ignored by search engines); keywords used in copy instead |

# Md Rakibul Hassan: portfolio

Personal portfolio of **Md Rakibul Hassan, AI/ML Engineer | AI-Powered Software Developer**, Frankfurt am Main.

Live: <https://rakibul-cyber.github.io/rakibul-portfolio/>

A fully static site built with [Astro](https://astro.build), TypeScript (strict) and Tailwind CSS v4. There's no backend, no database, no cookies and no analytics. It's hosted for free on GitHub Pages from the `gh-pages` branch. All content lives in one typed file: [`src/data/portfolio.ts`](src/data/portfolio.ts).

## Requirements

- Node.js **24 LTS** (≥ 22.23.4, required by Astro 7)
- npm 11

## Develop

```bash
npm ci
npm run dev        # http://localhost:4321/rakibul-portfolio/
```

## Build and preview

```bash
npm run build      # → dist/
npm run preview    # serves dist/ under /rakibul-portfolio/ like GitHub Pages: http://localhost:4321/rakibul-portfolio/
```

## Test

```bash
npx playwright install --with-deps chromium   # once (or set PW_CHANNEL=chrome to use an installed Chrome)
npm run verify       # type check → lint → format check → build → unit/build-output tests → e2e + axe
npm run test:links   # checks every external link
npm run check:deploy # deploy gate: hygiene, build-output and preservation tests; blocks files that must never be published
```

What each suite covers, plus the latest real results and Lighthouse scores, is in [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md).

## Edit content

Everything visible comes from [`src/data/portfolio.ts`](src/data/portfolio.ts):

| To… | Edit |
| --- | --- |
| Change hero text, contact details, LinkedIn URL | `profile` |
| Add, reorder or hide a project | `projects` (array order = display order; `hidden: true` keeps it in data but off the site). Give it `categories` for the filters; add `highlight` for a case card or `caseStudy` for a full case study |
| Change a statistic | `stats`. Every stat needs a `source` |
| Change the expertise cards | `expertise` (`shownIn` must list existing project ids) |
| Publish an article | set `status: 'published'` and a `url` in `articles`. The Writing section appears automatically |
| Change the workflow ring or terminal | `workflow`, `ciTranscript`, `qualityGates` |

Legacy fields (titles, descriptions, tags of the six original projects) are checked byte-for-byte by `tests/content-preservation.test.mjs`. If you change one on purpose, update the test's expectations. A changed GitHub link must also be recorded in `linkChanges`.

## Profile photos

The hero uses `src/assets/profile.jpg` (decorative, `alt=""`: the name is the heading next to it) and the About section `src/assets/about.jpg` (`alt="Portrait of Md Rakibul Hassan"`). Both are wired in `profile.photo` / `profile.aboutPhoto` in `src/data/portfolio.ts`; remove either and that slot falls back to the "RH" monogram. Astro generates AVIF and WebP in several widths (JPEG fallback) with explicit dimensions.

The files in `src/assets/` are **cleaned copies**, not the camera originals:

- cropped to a square around the face (1200 × 1200 px), so the circle needs no `object-position`; the optional `position` field is there for fine-tuning;
- re-encoded with sharp without metadata: no EXIF (camera, settings), GPS, XMP, IPTC, ICC or comments. `tests/repo-hygiene.test.mjs` fails if a committed image in `src/assets/` carries any of them, and `tests/build-output.test.mjs` checks the generated files;
- the About crop deliberately leaves out a bystander (a child) in the right half of the original frame. Keep it that way if you re-crop.

The hero photo was colour-corrected on 2026-11-12 from the 4000 × 4000 original (`Profile.jpg`), with global adjustments only: no retouching, smoothing or generated content.

- crop `2150 × 2150` at `(707, 273)`, about 20% tighter than before, so the face reads larger in the circle;
- white balance warmed slightly (R ×1.018, B ×0.972) so the grey wall reads neutral; near-white tones are excluded so the shirt stays white;
- a gentle S-curve for depth with a slight highlight shoulder (output range 1–251);
- a soft falloff toward the frame edge (−7% brightness, −28% saturation) to quieten the background; the face is unaffected;
- light sharpening (σ 0.7) after resizing to 1200 × 1200, saved as JPEG quality 88 (mozjpeg) without metadata.

The About photo is unchanged.

The originals stay outside Git: `/assets/images/` is git-ignored and the hygiene test fails if anything there is tracked. To replace a photo, crop and re-encode it the same way, e.g. with sharp from this repo:

```bash
node -e "require('sharp')('IN.jpg').rotate().extract({left:L,top:T,width:S,height:S}).resize(1200,1200).toColourspace('srgb').jpeg({quality:86,mozjpeg:true}).toFile('src/assets/profile.jpg')"
```

## Deploy

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). It verifies everything, runs the deploy gate and publishes `dist/` to `gh-pages` as a normal commit. Pull requests are verified but never deployed. Full procedure, checks and rollback: [`docs/DEPLOYMENT_PLAN.md`](docs/DEPLOYMENT_PLAN.md).

## Project layout

```text
src/data/portfolio.ts      all content (typed)
src/components/sections/   one component per page section
src/components/work/       flagship case study, highlight cards, project index
src/components/ui/         Button, Card, Tag, Icon, SectionHeading
src/scripts/               small vanilla TS modules (header, menu, filters, workflow tabs, terminal, contact form, reveal)
src/styles/global.css      Tailwind import, @theme tokens, reduced-motion rules
src/pages/                 index, privacy, 404, robots.txt (no Impressum: owner decision 2026-11-08)
public/                    CV, favicon, .nojekyll, legacy project images (deployed, not displayed), service-worker kill switch
tests/                     legacy extractor + inventory, preservation, build-output, link check, e2e/
scripts/                   sub-path preview server, screenshot capture, deploy gate
docs/                      audit, design reference, decisions, migration map, tasks, test plan, deployment plan
```

## History

The previous Flutter Web version is preserved at tag `legacy-flutter-source` (source) and `legacy-flutter-deploy` (deployed build). [`docs/CONTENT_MIGRATION_MAP.md`](docs/CONTENT_MIGRATION_MAP.md) maps every legacy item to its new place.

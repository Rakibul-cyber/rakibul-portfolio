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

The hero uses `src/assets/profile.jpg` (decorative, `alt=""`: the name is the heading next to it) and the About section `src/assets/about.jpg` (`alt="Md Rakibul Hassan in a white shirt, smiling and looking down at a phone"`). Both are wired in `profile.photo` / `profile.aboutPhoto` in `src/data/portfolio.ts`; remove either and that slot falls back to the "RH" monogram. Astro generates AVIF and WebP in several widths (JPEG fallback) with explicit dimensions.

The files in `src/assets/` are **cleaned copies**, not the camera originals:

- the hero photo is cropped to a square around the face (1200 × 1200 px), so the circle needs no `object-position`; the About photo is a 3:4 portrait (see below) placed with `position` (`45% 30%`);
- re-encoded with sharp without metadata: no EXIF (camera, settings), GPS, XMP, IPTC, ICC or comments. `tests/repo-hygiene.test.mjs` fails if a committed image in `src/assets/` carries any of them, and `tests/build-output.test.mjs` checks the generated files;

The hero photo was re-edited on 2026-11-15 from the 4000 × 4000 original (`Profile.jpg`): a natural colour grade plus subtle, localized facial retouching. It replaces the 2026-11-12 version, which used global adjustments only. The original background is preserved: nothing was cut out, replaced, blurred or generated, and no generative model was involved. The background differs from the original only in colour and tone. Lightness figures below are CIELAB L units (0–100).

- **Crop:** `2340 × 2340` at `(640, 230)`, slightly looser than the previous `2150 × 2150`, downscaled to 1200 × 1200 (no upscaling).
- **Facial retouching (localized):**
  - 18 small temporary marks on the cheek, temple and nose were healed by blending in adjacent skin texture. A 2020 full-resolution photo was used to check that they are not permanent features;
  - the under-eye area and the shadow side of the face were lifted gently (about 6 L), in the low frequencies only, so the stubble and jawline keep their definition;
  - blotchy skin tone was evened in the mid frequencies only (22% in lightness, 36% in colour), which leaves pores, fine texture and facial structure as photographed;
  - shine on the forehead and nose was reduced by compressing skin highlights;
  - the eyes received light local sharpening;
  - not done: no skin-smoothing filter, no whitening (the lit cheek is within about 1 L of the original), no reshaping or warping of any facial feature.
- **Lighting and contrast:** white balance warmed slightly in linear light (R ×1.020, B ×0.974) with clipped whites excluded; a gentle S-curve with blacks and whites anchored, so hair and deep shadows stay dark; a highlight shoulder so the shirt, which is blown out in the original, stays plain white with no invented detail.
- **Background colour grading:** applied through a soft subject mask, so background and subject can be graded slightly differently without cutting anything out. Background brightness stays close to the original (the grey wall is about 1.5 L lighter) with a little more contrast and depth. Colour strength is raised moderately (measured against the original: greens about +34%, roof tiles about +35%) and the olive greens are shifted slightly toward a fresher green. The grey wall stays grey.
- **Output:** light sharpening (σ 0.8) after resizing, saved as JPEG quality 90 (mozjpeg, 4:4:4) without metadata.

The edit is scripted (Python with OpenCV and NumPy; Apple's on-device Vision framework supplies the subject mask and face landmarks). The scripts, masters and review comparisons are kept with the originals in the git-ignored `/assets/images/hero-portrait-enhancement/`.

The About photo was replaced on 2026-11-14 with `1000002840.jpeg` (960 × 1280, used at native size: no crop, no resize, no upscaling). It is shown as a rectangle with rounded corners that fills the height of the intro row on desktop and is a 4:5 portrait above the text on tablet and mobile. Global adjustments only: white balance slightly cooled (R ×0.99, B ×1.016) with near-white tones excluded so the shirt stays neutral, a gentle S-curve, saturation ×0.97, very light sharpening (σ 0.4), JPEG quality 88 (mozjpeg) without metadata.

The originals stay outside Git: `/assets/images/` is git-ignored and the hygiene test fails if anything there is tracked. To replace a photo, crop and re-encode it the same way, e.g. with sharp from this repo:

```bash
node -e "require('sharp')('IN.jpg').rotate().extract({left:L,top:T,width:S,height:S}).resize(1200,1200).toColourspace('srgb').jpeg({quality:86,mozjpeg:true}).toFile('src/assets/profile.jpg')"
```

## Sports photos

The "Sports & Teamwork" section (`sports` in `src/data/portfolio.ts`) uses two of the owner's photos in `src/assets/sports/`. Like the profile photos, they are cleaned copies; the originals stay in the git-ignored `/assets/images/`.

- `match.jpg` (from `1000009702.jpeg`, replacing `1000009713.jpeg` on 2026-11-14): 880 × 1100 crop at native resolution that trims the goalpost at the left edge and keeps both players head to toe, a slight warm-up of the overcast light, a gentle S-curve.
- `team.jpg` (from `1000006294.jpeg`): 1050 × 700 crop that leaves out a gift bag with a handwritten name, midtones lifted (the room was dim), warm cast slightly tempered.
- Global adjustments only, no upscaling, light sharpening, JPEG quality 86 (mozjpeg) without metadata. Faces, people and backgrounds are unaltered.

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

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

## Add a profile photo

1. Save the photo as `src/assets/profile.jpg` (square, at least 800 × 800 px).
2. In `src/data/portfolio.ts`:

   ```ts
   import profilePhoto from '../assets/profile.jpg';
   // …
   export const profile: Profile = {
     // …
     photo: { src: profilePhoto, alt: 'Md Rakibul Hassan' },
   };
   ```

The hero and About section switch from the "RH" monogram to the photo. Astro generates responsive AVIF/WebP sizes with explicit dimensions.

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

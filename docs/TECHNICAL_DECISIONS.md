# Technical decisions

Each entry: decision, alternatives considered, trade-offs. Decisions marked *(approved)* were fixed by the owner's brief; the rest were made during implementation and can be revisited.

## TD-01 Astro instead of keeping Flutter Web *(approved)*

- **Decision:** rebuild the site as static HTML with Astro 7 and TypeScript (strict).
- **Why:** the Flutter build renders to a canvas (CanvasKit), so there is no indexable text and weak screen-reader support, and the first load is 2.4 MB of JS plus multi-MB WASM. A portfolio is static content. Astro renders it to plain HTML at build time and ships no JS by default.
- **Alternatives:** Flutter with the HTML renderer (deprecated, still heavy); Next.js static export (React runtime we don't need); plain HTML (no components, no type-checked content model).
- **Trade-off:** the owner's Flutter skills are no longer *demonstrated by the site itself*. They are demonstrated by the projects instead (Louco, Forest AI).

## TD-02 Tailwind CSS v4 via `@tailwindcss/vite` *(approved)*

- Astro's styling guide (checked 2026-11-07) recommends `astro add tailwind`, which installs the official Vite plugin for Astro ≥ 5.2. We install the same packages by hand so the versions can be pinned exactly.
- Design tokens live in one `@theme` block in `src/styles/global.css` (colours, fonts, easing). Tailwind's default radius, container and breakpoint scales already match the reference (`lg`/`xl`/`2xl`/`3xl`, `6xl = 72rem`, `40/48/64rem`), so they are not redefined.
- **Utility rule:** markup uses utilities. Repeated patterns become **components** (`Button`, `Card`, `Tag`, `SectionHeading`), not `@apply` chains. Complex one-off visuals (hero grid mask, marquee keyframes, orbit geometry, terminal colours) live in a component's scoped `<style>` block or a small CSS layer, because utilities would hurt readability there. Arbitrary values (`[…]`) are allowed only for geometry (e.g. a 368 px portrait), never for colour, which must come from tokens.

## TD-03 No UI framework runtime

- Interactivity is small and local: header state, mobile menu, filters, a tab widget, a terminal replay, a form that composes a `mailto:`, and scroll reveals. Each is a vanilla TypeScript module under `src/scripts/`, bundled by Astro/Vite and loaded once. Budget: **< 10 KB JS (uncompressed)**.
- **Alternatives:** React/Preact islands like the reference uses. Rejected: a runtime plus hydration costs more than the code it replaces.
- Every module is idempotent and null-safe (returns early if its root element is missing) and respects `prefers-reduced-motion`.

## TD-04 Self-hosted fonts *(approved)*

- `@fontsource-variable/inter` and `@fontsource-variable/space-grotesk`, importing **only the Latin `wght` subsets**, so no request goes to Google Fonts (GDPR) and there's no third-party connection.
- `font-display: swap` with metric-matched system fallbacks to limit layout shift. The one above-the-fold display face is preloaded.
- Mono stays the system `ui-monospace` stack (as in the reference).

## TD-05 Fully static, no backend *(approved)*

- `output: 'static'`, no adapter, no serverless, no database, no analytics, no cookies.
- Contact is `mailto:`. The form validates input client-side and builds a `mailto:` URL; the site never sends or stores anything. Without JS the form posts to nothing: it uses `action="mailto:…"` with `method="post" enctype="text/plain"` as a graceful fallback, and the plain email link is always visible.

## TD-06 Data-driven content

- One typed module, `src/data/portfolio.ts`, is the single source of truth. Components map over it; no repeated hand-written markup.
- Every content type has an interface. Optional fields stay optional, and components never render empty wrappers or "undefined".
- Statistics carry a mandatory `source` field (enforced by the type).
- Legacy fields are copied verbatim, and `tests/content-preservation.test.mjs` checks them against `tests/legacy-inventory.json`, which is **extracted programmatically** from the Flutter source at tag `legacy-flutter-source`.
- Hiding a section or adding a project is a data change (`visible` flags, arrays).

## TD-07 Base path handling

- `site: 'https://rakibul-cyber.github.io'`, `base: '/rakibul-portfolio'`, `trailingSlash: 'ignore'`.
- Every internal URL goes through `withBase()` in `src/lib/url.ts` (built on `import.meta.env.BASE_URL`). No hard-coded root-relative `/` paths. The build-output test enforces this.
- `public/.nojekyll` ships in the output so GitHub Pages serves `_astro/`.

## TD-08 Deployment: keep the existing `gh-pages` branch *(approved)*

- GitHub Pages keeps serving `gh-pages` / root at the same URL, so no repository settings change.
- `.github/workflows/deploy.yml`:
  - On pull requests: install, build, check, lint, tests, upload `dist/` as an artifact. **No deploy.**
  - On push to `main` (and manual dispatch): the same, plus the deploy gate (`npm run check:deploy`), then `peaceiris/actions-gh-pages` publishes `dist/` to `gh-pages` as a **normal new commit**: `force_orphan: false`, no force-push, history preserved. Write permission is granted only to the deploy job; `concurrency` prevents overlapping deploys.
- **Alternative considered:** `actions/deploy-pages` (Pages "GitHub Actions" source). Rejected because it requires changing the Pages source setting.
- Rollback = revert on `main` (the workflow redeploys), or restore the legacy build from tag `legacy-flutter-deploy` onto `gh-pages` as a normal commit.

## TD-09 Image policy

- **Project images:** copied from `assets/projects/**` to `public/projects/**` so they keep deploying, with their paths kept in data. They are **not rendered** *(approved)*.
- **Profile photo:** none exists. `profile.photo` is optional in data; when absent, a designed "RH" monogram renders instead. When a photo is added (see `README.md`), it is optimised through `astro:assets` (responsive widths, AVIF/WebP, explicit dimensions).
- No raster image is rendered above the fold today, so there is no LCP image to optimise.

## TD-10 Tooling and versions

- **Node 24 LTS** (v24.22.0) for local work and CI. Astro 7.4.2 requires Node ≥ 22.23.4. This machine had no Node, so v24.22.0 was installed user-locally under `~/.local/opt/node` from the checksum-verified nodejs.org tarball (no sudo, no shell-profile change).
- All dependencies are pinned to **exact** versions published ≥ 14 days before 2026-11-07 (selection script: newest stable release older than the cutoff).
- **TypeScript 6.0.3**, not 7.0.x: `typescript-eslint@8.72.0` requires `typescript < 6.1.0` and `@astrojs/check@0.9.12` accepts `^5 || ^6`.
- ESLint 10 (flat config) + `typescript-eslint` + `eslint-plugin-astro`; Prettier 3 + `prettier-plugin-astro` + `prettier-plugin-tailwindcss`.
- Tests: Node's built-in `node:test` for content preservation and build output (no extra dependency); `@playwright/test` + `@axe-core/playwright` for e2e and accessibility.

## TD-13 Performance choices found during Phase 9

- **Inline CSS** (`build.inlineStylesheets: 'always'`): the page is a single long document, so inlining its ~50 KB of CSS removes two render-blocking requests. Lighthouse mobile Performance went from 96 to 97 on the same dependency tree.
- **No images above the fold.** The hero uses a CSS/SVG monogram; LCP is the headline text.
- **Fonts:** two Latin variable WOFF2 files (48 KB + 22 KB), preloaded, `font-display: swap`. CLS measured at 0.

## TD-14 Dependency age is enforced for the whole tree

Direct dependencies are pinned exactly, but their own caret ranges pulled in 69 packages published in the last 14 days (including Vite 8.3.6 and a newer `playwright-core` that also caused duplicate-type errors). The lockfile was therefore regenerated with `npm install --before=2026-10-25`, and `playwright-core` is pinned via `overrides` to the version `@playwright/test` uses. Result: 486 / 486 packages are at least 14 days old. CI installs with `npm ci`, so the lockfile is authoritative. To update later: bump the pins, then run `npm install --before=<today − 14 days>`.

## TD-15 robots.txt on a project site

A GitHub Pages *project* site lives under `/rakibul-portfolio/`, but crawlers only read `robots.txt` at the domain root (`rakibul-cyber.github.io/robots.txt`, owned by the user site). The generated `/rakibul-portfolio/robots.txt` (requested by the brief) is harmless but advisory. The sitemap is also linked from every page (`<link rel="sitemap">`) and can be submitted in Google Search Console.

## TD-11 Legal pages

- **Privacy policy** (English, `noindex`, excluded from the sitemap), a template for the owner to review.
- **No Impressum** (owner decision, 2026-11-08). The page, its footer link and the `data-todo` deploy-gate check were removed. Earlier, a placeholder blocked deployment until a postal address was supplied. Whether a German personal site needs an Impressum under § 5 DDG is the owner's legal assessment; re-adding one is a single page plus a footer link.

## TD-12 What we deliberately did not build

A chat-style "AI builder" mock, a client-logo grid and a cookie banner (see `REFERENCE_DESIGN_AUDIT.md` §7), plus a language switch, analytics, a CMS and a blog engine (no complete articles exist).

The "Selected companies" grid added on 2026-11-11 is not a client grid: it lists the four employers and research organisations from `experience` (`companies` in `src/data/portfolio.ts`). A logo is shown only when it is an unmodified file from the organisation's own website and no policy forbids it (Enviotech and Louco, with permission confirmed by the owner; Teczo, the 1017×225 wordmark from the media library of teczo.co); otherwise the name is set in type (JGU's logo policy requires written permission). The Louco and Teczo wordmarks are drawn for dark backgrounds and sit on an ink plate. The cards are static: no links, no hover states (owner decision, 2026-11-11).

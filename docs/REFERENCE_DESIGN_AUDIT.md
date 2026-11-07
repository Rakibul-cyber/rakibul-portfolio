# Reference design audit

Phase 1 deliverable. Reference: https://matthias-eymers.de/ inspected on **2026-11-07** with Playwright 1.64.1 driving Google Chrome (scripted; the page was scrolled top to bottom before every full-page capture so scroll reveals fire).

**Rule:** we adopt the reference's *design language* (composition, spacing, type scale, colour system, interaction patterns). We do **not** copy its images, logos, photos, copy or code. Every asset and sentence on the redesigned site belongs to Md Rakibul Hassan.

> The screenshots below show a third party's site, including his portrait and client logos. They are internal design-review material, live under `docs/` and are never deployed (`docs/` is outside `public/`). Before the branch is pushed to the public repo, the owner may prefer to drop them; see `PROJECT_STATUS.md`.

## 1. Captures

| File | Viewport | Notes |
|---|---|---|
| `docs/screenshots/reference-desktop.png` / `-full.png` | 1440×900 | full page 8,833 px tall |
| `docs/screenshots/reference-tablet.png` / `-full.png` | 820×1180 | full page 11,737 px |
| `docs/screenshots/reference-mobile.png` / `-full.png` | 390×844 | full page 15,542 px |
| `docs/screenshots/reference-desktop-header-scrolled.png` | 1440 | header after scrolling (blur state) |
| `docs/screenshots/reference-desktop-pipeline.png` | 1440 | ring + terminal at start of replay |
| `docs/screenshots/reference-mobile-menu.png` | 390 | open mobile menu |

No horizontal overflow at any of the three widths.

## 2. Stack observed

Astro (islands, `client:visible` hydration), Tailwind CSS v4 (one compiled stylesheet `/_astro/index.*.css`, 52 KB), Fontsource variable fonts self-hosted under `/_astro/`. Only two CSS keyframes (`logo-marquee`, `ping`); everything else animates through a hydrated JS component. Our implementation reproduces the motion with CSS plus small vanilla TS modules instead (see `TECHNICAL_DECISIONS.md`).

## 3. Design tokens, re-extracted from the compiled CSS

All values from prompt §5.1 are **confirmed** exactly.

| Token | Value | Tailwind `@theme` name in our build |
|---|---|---|
| canvas | `#fcfcfd` | `--color-canvas` |
| surface | `#f6f7fb` | `--color-surface` |
| ink | `#0b1020` | `--color-ink` |
| muted | `#5a6072` | `--color-muted` |
| accent / 600 / 50 | `#5b4bdb` / `#4a3cc4` / `#eeecfb` | `--color-accent`, `--color-accent-600`, `--color-accent-50` |
| violet | `#7c5cfc` | `--color-violet` |
| display font | `"Space Grotesk Variable", "Inter Variable", sans-serif` | `--font-display` |
| body font | `"Inter Variable", ui-sans-serif, system-ui, sans-serif` | `--font-sans` |
| mono | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` | `--font-mono` |
| easing | `cubic-bezier(.16, 1, .3, 1)` (`--ease-out-expo`) | `--ease-out-expo` |
| radii used | `.5rem` (lg), `.75rem` (xl, chips), `1rem` (2xl, cards), `1.5rem` (3xl, stats card), full | Tailwind defaults + project names |
| container | `72rem` (`max-w-6xl`) with `px-8` at desktop (content 1088 px wide at 1440) | `--container-6xl` (default) |
| breakpoints | `40rem` / `48rem` / `64rem` (Tailwind `sm`/`md`/`lg` defaults) | defaults |
| greys | Tailwind `slate-100…600` in oklch (borders `slate-200/70–80`) | Tailwind defaults |
| status green | `emerald-400/500` | Tailwind defaults |

Derived visuals (re-implemented, not copied):

- **Hero grid:** 54 px square grid lines in ink at 5 % opacity, radially masked from the top centre.
- **Hero glow:** two radial gradients, accent at 16 % top centre and violet at 12 % top right.
- **Text gradient:** 100° linear accent → violet, clipped to text.
- **Marquee:** 60 s linear translate −50 % of a duplicated track; 8 % edge fade mask; paused on hover; `animation: none` under reduced motion.

## 4. Type scale (computed at 1440 px)

| Element | Font | Size / line-height | Weight | Tracking |
|---|---|---|---|---|
| H1 | Space Grotesk | 54.4 px / 59.84 px (3.4rem / 1.1) | 700 | −1.36 px (−0.025em) |
| H2 (section) | Space Grotesk | 36 px / 40 px | 700 | −0.9 px |
| H3 service card | Space Grotesk | 20 px / 28 px | 600 | normal |
| H3 case / process | Space Grotesk | 18 px / 24.75–28 px | 600 | normal |
| H3 small cards / ring | Space Grotesk | 16 px / 24 px | 600 | normal |
| Eyebrow | Space Grotesk | 14 px | 600 | 0.16em (2.24 px), uppercase, accent |
| Small label ("BUILT FOR", "CASE HIGHLIGHTS") | Space Grotesk | 12 px | 600 | 0.18em, uppercase, slate at 70 % |
| Lead paragraph | Inter | 18 px / 29.25 px | 400 | muted |
| Body small | Inter | 14 px / 22.75 px | 400 | muted |
| Nav link | Inter | 14 px | 500 | muted |
| Stat value | Space Grotesk | 36 px / 40 px | 700 | −0.9 px |
| Wordmark | Space Grotesk | 18 px | 700 | −0.45 px; dot in accent |

## 5. Components and measurements

| Component | Measured |
|---|---|
| Header | fixed, 65 px tall; transparent at top; after scroll: `bg canvas/80`, `backdrop-filter: blur(24px)`, bottom border `slate-200/70` |
| Nav | centred anchor links, 14 px, gap about 32 px; right side: language pill (not reproduced) and ink pill CTA |
| Primary button | `rounded-full bg-accent px-6 py-3` 16 px semibold white, `shadow-lg shadow-accent/25`, hover `accent-600` and stronger shadow, arrow icon nudges right |
| Secondary button | white, `rounded-full`, 1 px slate border, ink text |
| Status pill | white, rounded-full, 1 px border, emerald dot with `ping` halo |
| Portrait | 368 px circle, `ring-4 ring-white`, `shadow-2xl shadow-slate-300/50` |
| Hero chips | `rounded-xl border-slate-200/80 bg-white/85 px-3 py-2 text-sm font-medium shadow-lg shadow-slate-300/30 backdrop-blur`, absolutely positioned around the portrait (6 chips, 3 per side, offset outward) from `sm` up; below `sm` they become a centred wrap of small `rounded-full text-xs` pills under the role line |
| Role line under portrait | Space Grotesk 20 px semibold, two roles separated by a small accent diamond |
| Stats card | one `rounded-3xl` bordered white card; 4 stats in a row (2×2 on mobile); hairline divider; "BUILT FOR" label and logo marquee below |
| Service card | `rounded-2xl border-slate-200/80 bg-white p-7 shadow-sm`, hover `shadow-xl shadow-slate-200/60`; 48 px `accent-50` icon tile with accent icon; accent kicker sentence (14 px semibold); H3; muted summary; hairline; check-mark list |
| Section rhythm | `py-24 sm:py-32`; alternating canvas and `bg-surface` sections separated by `border-slate-200/70` hairlines; section intro = eyebrow + H2 + lead (max about 42rem) |
| Case card | `<article>` like the service card, with domain pill (`accent-50` bg, accent text, 12 px) and a corner `↗` arrow in slate-300 that turns accent on hover |
| Client grid | 5-column bordered grid of greyscale logos; last cell "Your project next" |
| Process (How I work) | 4 columns: icon tile + "01" counter + hairline, H3, muted text; dashed accent-bordered info note under it |
| Pipeline ring | about 390 px ring, dotted accent stroke (SVG circles); 5 nodes (white 56 px rounded-xl tiles with accent icon, small ink number badge, label below); central white circle about 200 px with icon tile, title and caption; a dot travels around the ring. On mobile: centre card on top, then a vertical list of nodes with descriptions |
| Terminal | ink (`#0b1020`) `rounded-2xl` window, traffic-light dots, title `agent · delivery`, "● live" in emerald; mono 13–14 px; lines appear one by one when scrolled into view; prompt `$` lines in white, progress `▸` lines in slate, `✓` lines in emerald, final waiting line in amber with block cursor |
| Quality card | white rounded card, small uppercase label, row of `accent-50` pills with check icons |
| Quote band | `rounded-2xl bg-ink p-8 sm:p-12`, accent quote icon, Space Grotesk 28 px white text, soft accent radial glow on the right |
| About | left: portrait cut-out on a faded grid with soft glow; right: eyebrow, H2 name, accent role line, 3 muted paragraphs |
| Contact | left: eyebrow, H2, lead, email link with envelope icon; right: white rounded-2xl form card with rounded inputs (canvas bg, slate border), full-width primary button, small privacy note |
| Footer | `bg-surface`, top hairline; wordmark + tagline; three columns with 12 px uppercase tracked labels (Navigation / Legal / Connect); bottom hairline; copyright left, small note right |
| Mobile menu | below `lg` a hamburger; opens a panel under the header with stacked links and a full-width ink CTA. The reference's toggle has `aria-label="Toggle menu"` but **no `aria-expanded`** |
| Cookie banner | bottom-left card; not reproduced (we set no cookies) |

Hover effects are wrapped in `@media (hover: hover)` in the reference; we do the same.

## 6. Interaction inventory

| Interaction | Reference behaviour | Ours |
|---|---|---|
| Scroll reveal | elements fade/slide in once | IntersectionObserver, once per element, `ease-out-expo`; content visible without JS |
| Status dot | `animate-ping` halo | same (CSS) |
| Hero chips | gentle float | CSS keyframes, staggered delays |
| Marquee | 60 s loop, pause on hover | same; static wrapped list under reduced motion |
| Ring | dotted ring, travelling dot, stage highlight | SVG ring + CSS-rotated dot; nodes are ARIA tabs with auto-advance that stops on first interaction and pauses off-screen |
| Terminal | line-by-line replay when visible | same, starting when visible; full output under reduced motion and without JS |
| Buttons | lift + arrow nudge | same |
| Cards | shadow lift on hover-capable devices | same, `@media (hover: hover)` |
| Header | blur after scroll | same |
| Mobile menu | drop-down panel | **full-screen** overlay (prompt §5.2), `aria-expanded`, Escape, focus moved in, body scroll lock |

## 7. Section mapping (prompt §5.2)

| # | Reference section | Implementation | Status |
|---|---|---|---|
| 1 | Header | Wordmark "Rakibul Hassan." with accent dot; nav Expertise · Work · Process · Experience · About · Contact; ink pill CTA "Get in touch" | adopt |
| 2 | Hero (`#top`) | status pill "Open to AI/ML and software engineering roles"; headline with accent→violet gradient on its second half; intro; CTAs "See my work" / "Get in touch"; "Download CV" link; **monogram "RH" circle** (no photo exists) with 6 verified skill chips; role line "AI/ML Engineer ◆ AI-Powered Software Developer" | adopt |
| 3 | Stats + "Built for" logos | 3 verified stats with sources; "Built with" **technology** marquee (text pills; no client logos) | adapt |
| 4 | What I do (3 cards) | 4 expertise cards in the order given, each ending with "Shown in" project links; "Full toolkit" row with all 16 legacy skills | adapt |
| 5 | Selected work: case highlights + client grid | flagship Driver Stress case study → 3 highlight cards with `<details>` → filterable index of all 7 projects | adapt; client grid **omitted** (no verifiable clients) |
| 5b | How I work (4 steps + note) | merged into row 6: the six-stage ring *is* the process; the dashed info-note pattern is reused under it ("Evaluation gate" explanation) | merged |
| 6 | Agentic pipeline (ring + terminal + quality card) | six-stage AI/ML workflow ring (Define → Prepare → Develop → Evaluate → Integrate → Ship), centre "Evaluation gate", ARIA tabs with Driver Stress examples; terminal replays the real CI steps and training log; quality-gates pill card | adapt |
| 6b | "AI software builder" chat mock + "What that means for you" cards | **omitted**: it would imply agent work the owner hasn't done | omit |
| 7 | Quote band | "Evaluation decides whether a model moves forward. The pipeline decides whether it ships." | adopt |
| 8 | (none) | Experience: sticky intro with the transition note + timeline + education | new |
| 9 | About | monogram on the soft grid glow (no photo), eyebrow, name, role, paragraphs; plus certifications, learning, publications, languages | adapt |
| 10 | (none) | Writing: not rendered (no complete articles; see audit) | new, hidden |
| 11 | Contact | text + email/phone/LinkedIn/GitHub/CV on the left; `mailto:` composer form on the right with the "nothing is sent or stored" note | adapt |
| 12 | Footer | wordmark + tagline; Navigation / Legal (Impressum, Privacy) / Connect; copyright | adopt |
| — | Language switch (DE) | omitted: single-language English site (legal pages: Impressum in German, Privacy in English) | omit |
| — | Cookie banner | omitted: no cookies are set | omit |

## 8. Intentional differences

Kept current through Phase 9 (§9 below is filled after the visual comparison).

1. Monogram instead of portrait (no photo available; prompt §6.9).
2. Technology marquee instead of client logos.
3. Six ring stages instead of five, with an evaluation gate in the centre instead of "human in the loop".
4. The ring is keyboard-operable (ARIA tabs) with a detail panel; the reference's nodes are decorative.
5. Full-screen mobile menu instead of a drop-down panel.
6. Additional sections (Experience, project index) that the reference does not have.
7. No language switch, no cookie banner, no chat mock, no client grid.

## 9. Fidelity check (redesign vs. reference)

_Filled in Phase 9._

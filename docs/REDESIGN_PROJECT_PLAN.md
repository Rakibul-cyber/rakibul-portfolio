# Redesign project plan

## Goal

Redesign https://rakibul-cyber.github.io/rakibul-portfolio/ in place (same repo, same `gh-pages` hosting, same URL) as a fast, accessible, indexable static site. It should position Md Rakibul Hassan as an **AI/ML Engineer | AI-Powered Software Developer**, with mobile application architecture, backend and MLOps as supporting strengths. All existing projects stay, and nothing is invented.

## Audience

Engineering recruiters and hiring managers for AI/ML and software engineering roles in Germany and the EU, plus engineers who review the work. They skim first, so the hero, stats and the flagship case study must carry the positioning. Then they verify: links to real repositories, real metrics with stated limitations, and a clear timeline.

## Positioning

- **Lead with evidence, not titles.** The owner's employment titles were mobile/software roles. The site does not claim an AI/ML job title. It shows AI/ML capability through the Driver Stress project (leakage-aware evaluation, subject-independent CV, an inference API, CI) and explains the transition honestly.
- **Supporting strengths** are the owner's verifiable history: production Flutter apps (Louco, Forest AI), AWS, REST backends, CI/CD.
- **Honesty signals maturity:** LOSO numbers shown next to held-out numbers, limitations listed on the page, legacy statistics dropped because they can't be verified.

## Content hierarchy (page order)

1. Header: wordmark, anchors, "Get in touch".
2. Hero: status, headline, intro, CTAs, CV, monogram with verified skill chips, role line.
3. Stats card: 0.90 LOSO ROC-AUC · 2 apps in production use · 7 projects, plus a technology marquee.
4. Expertise: AI & ML engineering → AI-powered software development → Mobile application architecture → MLOps, backend & DevOps; then the full toolkit (16 legacy skills).
5. Work: Driver Stress case study (flagship) → highlights (Forest AI, Louco, Stock Dashboard) → filterable index of all 7 projects.
6. Process: six-stage AI/ML workflow ring with Driver Stress examples, CI terminal replay, quality gates.
7. Quote band.
8. Experience: transition note, timeline, education.
9. About: bio, certifications, learning, publications, languages.
10. (Writing: hidden until complete articles exist.)
11. Contact: `mailto:` composer, phone, LinkedIn, GitHub, CV.
12. Footer: navigation, Privacy, connect (Impressum removed by owner decision, 2026-11-08).

## SEO strategy

- Real HTML text (the main gain over the canvas site), one `<h1>`, a logical heading order.
- Title "Md Rakibul Hassan — AI/ML Engineer & AI-Powered Software Developer" and a natural meta description.
- Keywords used naturally in headings and copy: AI/ML Engineer, Machine Learning Engineer, AI-Powered Software Developer, Python Developer, AI Application Developer, Mobile Application Architecture, MLOps, Software Engineer.
- Canonical URL, Open Graph/Twitter tags with the correct `og:url`, `Person` JSON-LD, `sitemap.xml` and `robots.txt` under the base path; legal pages `noindex`.
- Performance (Lighthouse ≥ 95) is itself a ranking and UX signal.

## Milestones

| Phase | Output |
|---|---|
| 0 | Audit (`EXISTING_PORTFOLIO_AUDIT.md`) |
| 1 | Reference analysis (`REFERENCE_DESIGN_AUDIT.md`, screenshots) |
| 2 | Tags, branch, decisions, this plan |
| 3 | Scaffold + design system; build/check/lint green |
| 4 | Legacy extractor + typed content model + migration map |
| 5 | Header, hero, stats, marquee |
| 6 | Expertise + work |
| 7 | Workflow, experience, about, contact, footer, legal, 404 |
| 8 | Content preservation test passes → Flutter source removed |
| 9 | Build-output, e2e, axe, links, Lighthouse, visual QA |
| 10 | Deploy workflow, deployment plan, README, final status |

## Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Losing legacy content in migration | M | H | Programmatic extraction from the tagged source; preservation test must pass before Flutter is deleted; tags keep everything reachable |
| Overclaiming AI/ML experience | M | H | Content rules (§7 of the brief) encoded in data review; no LLM/RAG/agents/DL/K8s claims; every stat sourced; limitations rendered |
| Breaking paths under `/rakibul-portfolio/` | M | H | `withBase()` everywhere; build-output test checks every internal URL resolves in `dist/`; e2e served under the real sub-path |
| Publishing the owner's home address | L | H | No Impressum; deploy gate blocks the old address-containing CV by hash; new CV verified address-free; flagged that the CV PDF itself contains the address |
| Accidental push/deploy | L | H | No upstream on the working branch; no push commands run; deploy only on push to `main` after the gate |
| Reference fidelity vs. owner's content (no photo, no clients) | H | M | Monogram and technology marquee designed to fill the same visual slots; differences documented |
| Accessibility regressions from motion | M | M | Reduced-motion layer in CSS and JS; content visible without JS; axe in e2e |
| Dependency churn (new majors: Astro 7, ESLint 10) | M | L | Exact pins ≥ 14 days old; `npm ci` in CI |
| Lighthouse < 95 from fonts or JS | L | M | Latin-only variable fonts, preload, < 10 KB JS, no images above the fold |
| Tooling missing locally (Node) | — | — | Installed user-locally, documented |

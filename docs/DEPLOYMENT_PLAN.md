# Deployment plan

Nothing has been pushed or deployed. Every step below is for the owner to run. The live site stays on the legacy Flutter build until the PR is merged into `main`.

## How deployment works after the merge

```
push to main ──► .github/workflows/deploy.yml
                 ├─ verify: npm ci → check → lint → format → build → tests → e2e + axe → upload dist/
                 └─ deploy (main only): download the tested dist/ → npm run check:deploy
                                         → peaceiris/actions-gh-pages pushes dist/ to gh-pages
                                           as a normal new commit (no force-push, no orphan history)
GitHub Pages (unchanged settings: branch gh-pages, folder /) ──► https://rakibul-cyber.github.io/rakibul-portfolio/
```

- Pull requests run **verify only**. They never deploy.
- The deploy job is the only job with `contents: write`. `concurrency: deploy-gh-pages` prevents overlapping deploys.
- `check:deploy` runs the hygiene, build-output and preservation tests, and blocks files that must never be published (the old CV with the street address, by hash). As of 2026-11-08 it **passes** on the current branch: the new CV is in place and there is no Impressum (owner decision). **A merge to `main` would therefore deploy.**
- The first deploy commit replaces the Flutter files on `gh-pages`, including the stray `build/` and `.dart_tool/` folders, in a normal commit. History is kept, and the old build stays reachable at tag `legacy-flutter-deploy`.
- Returning visitors who have the old Flutter service worker get `flutter_service_worker.js`, a kill switch that deletes the Flutter caches, unregisters itself and reloads the tab. Verified locally with an upgrade simulation: 1 registration and 2 caches before, 0 and 0 after, new site rendered.

## Before merging

1. ~~Impressum address~~: no longer applicable (no Impressum, owner decision 2026-11-08).
2. Decide the other open items in `PROJECT_STATUS.md` (none of them blocks the deploy).
3. Optional: run `npm run verify` locally.

## Push and open the PR (owner runs these)

```bash
cd ~/rakibul-portfolio
git switch redesign/ai-ml-astro
git push -u origin redesign/ai-ml-astro
git push origin legacy-flutter-source legacy-flutter-deploy
```

Open the PR **against `main`**. The repository's default branch is `gh-pages`, so the base must be chosen explicitly:

- Web: https://github.com/Rakibul-cyber/rakibul-portfolio/compare/main...redesign/ai-ml-astro?expand=1
- or with the GitHub CLI: `gh pr create --base main --head redesign/ai-ml-astro --title "Redesign: Astro + Tailwind, AI/ML positioning" --body-file docs/DEPLOYMENT_PLAN.md`

Wait for the **Verify** job to pass on the PR.

## Read-only checks before merging

- **Pages source** stays *Deploy from a branch → `gh-pages` / (root)*: Settings → Pages, or `gh api repos/Rakibul-cyber/rakibul-portfolio/pages --jq '.source'` → `{"branch":"gh-pages","path":"/"}`. Do not change it.
- **Actions** are enabled (Settings → Actions → General). The deploy job requests `contents: write` itself; if an organisation policy caps tokens at read-only, the publish step fails with HTTP 403. In that case enable *Read and write permissions* under *Workflow permissions*.

## Merge = approval

Merging the PR into `main` triggers the workflow. Watch *Actions → Build, test and deploy*. After the deploy job, GitHub runs its own *pages-build-deployment*; the site updates within a few minutes.

## Post-deploy checks

1. https://rakibul-cyber.github.io/rakibul-portfolio/ returns the new site. View source should show HTML text, not `flutter_bootstrap.js`.
2. https://rakibul-cyber.github.io/rakibul-portfolio/CV_MD_Rakibul_Hassan.pdf downloads the PDF (it was 404 before).
3. On a phone that visited the old site: open the URL and hard-refresh once if the old app shows. The kill switch should then take over.
4. The privacy page loads. A random path shows the 404 page with a working home link.
5. Click the LinkedIn link by hand (automated checks get HTTP 999).
6. Optional: submit `https://rakibul-cyber.github.io/rakibul-portfolio/sitemap-index.xml` in Google Search Console.

## Rollback

**For a bad change after the first successful deploy:** revert it on `main` (`git revert <commit>`, push, or merge a revert PR). The workflow verifies and redeploys the previous state.

**To restore the legacy Flutter site** (e.g. right after the first deploy). This is a normal fast-forward commit on `gh-pages`, never a force-push:

```bash
git fetch origin --tags
git switch -c restore-legacy origin/gh-pages
git rm -r -q .
git checkout legacy-flutter-deploy -- .
git commit -m "revert: restore legacy Flutter build on gh-pages"
git push origin restore-legacy:gh-pages
```

To stop further automatic deploys while rolled back, disable the workflow (Actions → *Build, test and deploy* → ⋯ → Disable workflow) or revert the merge on `main`.

# History purge plan (not executed)

**Status:** plan only. Nothing here has been run. Every force-push and the tag push need the owner's explicit approval. The legacy tags stay local until the owner decides.

## Goal

Remove from **all history** of `main`, `gh-pages` and `redesign/ai-ml-astro`, including the two legacy tags:

1. every CV PDF containing the street address (one blob, used under three paths),
2. `.dart_tool/` (including the Chrome profile with Chrome's built-in Google API key from `869072a`),
3. `docs/screenshots/reference-*` (third-party site captures).

## What is affected (measured 2026-11-08)

| Item | Identifier | Where in history |
|---|---|---|
| CV with street address | blob `c281c08001fe75d72dc79f058ecc3e58482da367`, paths `CV_MD_Rakibul_Hassan.pdf`, `public/CV_MD_Rakibul_Hassan.pdf`, `dist/CV_MD_Rakibul_Hassan.pdf` | `main` since `774a794` (2026-01-21), `gh-pages` (`869072a`), redesign (`8fc43fd` onwards), tag `legacy-flutter-source` |
| `.dart_tool/` | path | `main` (4 commits), `gh-pages` (3 commits, incl. the June deploy and `869072a`), redesign (4 inherited commits), tag `legacy-flutter-deploy` (37 build-cache files) |
| `docs/screenshots/reference-*` | path glob | redesign only (added in `c2ca139`, untracked in `2fb1ef8`) |

Remote tips at the time of writing: `main` `2eadadd…`, `gh-pages` `d7b23a7…` (local `f336f14` prepared, not pushed), `redesign/ai-ml-astro` `9ba30ba…` (local has further unpushed commits). Repository: public, 0 forks, 0 stars, **1 open pull request (#1, `redesign/ai-ml-astro` → `main`)**.

## Why blob IDs, not paths, for the CV

The new address-free CV will use the **same filename** in `public/`. Removing by path would also delete the new CV from every commit, so the purge strips **only the old blob** by its ID. Commit the new CV before running the purge; it has a different blob ID and survives.

## Procedure

### 0. Preconditions

- The new CV (without the street address) is committed on `redesign/ai-ml-astro`.
- The owner has decided what to do with PR #1. A force-push updates it, but GitHub keeps the old commits referenced from the PR's history (see step 6).
- No one else pushes to the repository during the procedure.
- Install the tool: `python3 -m pip install --user git-filter-repo==2.47.0` (newest release older than 14 days as of today; re-check at execution time).

### 1. Back up first (keep offline; never push it)

```bash
cd ~
git clone --mirror https://github.com/Rakibul-cyber/rakibul-portfolio.git rakibul-portfolio-backup-$(date +%F).git
git clone --mirror ~/rakibul-portfolio rakibul-portfolio-local-backup-$(date +%F).git   # includes local-only commits and the legacy tags
```

### 2. Rewrite in a fresh mirror of the *local* repository

The local repository has commits and tags the remote doesn't, so mirror the local one:

```bash
cd ~
git clone --no-local --mirror ~/rakibul-portfolio rakibul-portfolio-purge.git
cd rakibul-portfolio-purge.git
printf '%s\n' c281c08001fe75d72dc79f058ecc3e58482da367 > ../blobs-to-strip.txt

git filter-repo \
  --strip-blobs-with-ids ../blobs-to-strip.txt \
  --path .dart_tool/ \
  --path-glob 'docs/screenshots/reference-*' \
  --invert-paths
```

`--invert-paths` applies to the `--path`/`--path-glob` options (removes them); `--strip-blobs-with-ids` removes the old CV wherever it occurs. If the tool rejects the combination, run the blob strip first and the path removal second, adding `--force` to the second run.

filter-repo rewrites `refs/heads/*` **and `refs/tags/*`**: the annotated tags `legacy-flutter-source` and `legacy-flutter-deploy` are rewritten automatically to point at the rewritten equivalents of `2eadadd` and `ae42c32`. It also writes `filter-repo/commit-map` (old → new SHA) and removes the `origin` remote.

### 3. Verify before any push

```bash
# nothing of the three targets is left anywhere
git rev-list --all --objects | grep -c c281c08001fe75d72dc79f058ecc3e58482da367            # expect 0
git log --all --oneline -- .dart_tool 'docs/screenshots/reference-*' | wc -l                 # expect 0
for c in $(git rev-list --all); do git grep -a -l -E 'AIza[0-9A-Za-z_-]{35}' $c; done | wc -l  # expect 0

# tags still point at the right content
git show --stat legacy-flutter-source | head
git ls-tree --name-only legacy-flutter-deploy        # Flutter build files, without .dart_tool/

# the published site and the new CV are unaffected
git ls-tree -r --name-only gh-pages | head
git ls-tree -r redesign/ai-ml-astro -- public/CV_MD_Rakibul_Hassan.pdf    # must be the NEW blob
```

Then, in a temporary working clone of the rewritten `redesign/ai-ml-astro`: `npm ci && npm run verify`.

Expected follow-up: the CV is gone from the tag `legacy-flutter-source`, so the legacy inventory field `cv.fileInSource` becomes `null`. Run `node tests/extract-legacy-inventory.mjs` and commit the regenerated `tests/legacy-inventory.json`. Commit SHAs quoted in `docs/` and `PROJECT_STATUS.md` (e.g. `869072a`, `697b211`) become stale; translate them with `filter-repo/commit-map` and update the docs in the same follow-up commit.

### 4. Force-push (requires explicit approval)

Use `--force-with-lease` pinned to the remote SHAs you expect, so the push fails if anything changed in the meantime. Replace the values with the current ones at execution time (`git ls-remote origin`):

```bash
git remote add origin https://github.com/Rakibul-cyber/rakibul-portfolio.git

git push --force-with-lease=refs/heads/main:2eadaddd5be7d9f66d1c95ae4af37d4afd2ffe7c \
  origin refs/heads/main:refs/heads/main

git push --force-with-lease=refs/heads/gh-pages:d7b23a79e239c62bab1b2af956809f6d8f70803c \
  origin refs/heads/gh-pages:refs/heads/gh-pages

git push --force-with-lease=refs/heads/redesign/ai-ml-astro:9ba30bae246ad96787286d194db06f8881f74181 \
  origin refs/heads/redesign/ai-ml-astro:refs/heads/redesign/ai-ml-astro
```

`gh-pages` is the default branch and the Pages source. After the push, Pages rebuilds from the rewritten tip; check the live site.

### 5. Recreate the legacy tags on GitHub

They have never been pushed, so nothing needs deleting remotely. Push the rewritten tags from the purge mirror:

```bash
git push origin refs/tags/legacy-flutter-source refs/tags/legacy-flutter-deploy
```

If they need recreating by hand (for example the rewrite was done without tags):

```bash
NEW_SOURCE=$(awk '$1 ~ /^2eadadd/ {print $2}' filter-repo/commit-map)
NEW_DEPLOY=$(awk '$1 ~ /^ae42c32/ {print $2}' filter-repo/commit-map)
git tag -a legacy-flutter-source $NEW_SOURCE -m "Legacy Flutter source (rewritten 2026-xx-xx; was 2eadadd)"
git tag -a legacy-flutter-deploy $NEW_DEPLOY -m "Legacy Flutter web build (rewritten 2026-xx-xx; was ae42c32)"
git push origin legacy-flutter-source legacy-flutter-deploy
```

### 6. Ask GitHub Support to purge cached data

A force-push doesn't remove old commits from GitHub immediately. They stay reachable by SHA, in cached views and through **PR #1's history**. Open a request at <https://support.github.com/contact> (category: *Removing sensitive data*), including:

- repository `Rakibul-cyber/rakibul-portfolio`;
- that history was rewritten with git-filter-repo to remove personal data (a CV with a home address) and a committed browser profile;
- the affected old commit SHAs (from `filter-repo/commit-map`: every commit whose tree contained blob `c281c08…`, `.dart_tool/` or `docs/screenshots/reference-*`; at minimum `869072a`, `774a794` and their descendants on all three branches);
- the request to remove cached views and dangling commits, and to drop references from pull request #1;
- that there are no forks.

GitHub documents this in "Removing sensitive data from a repository".

### 7. Re-sync local working copies

Every existing clone still has the old history. Don't merge or push from them. Either move your local-only, git-ignored files (e.g. `.env` files and `docs/screenshots/reference-*`; `node_modules` can simply be reinstalled) into a fresh clone, or run per branch `git fetch origin && git switch <branch> && git reset --hard origin/<branch>`, then `git reflog expire --expire=now --all && git gc --prune=now`. Keep the offline backup mirror (step 1) until you're satisfied, then delete it securely.

## What the purge cannot fix

- **Existing clones and downloads:** anyone who cloned or downloaded the repository, the CV or the raw files keeps them. Unknowable, though the repository currently has 0 forks and 0 stars.
- **Forks:** none today. A fork created before the purge would keep the old history and isn't affected by the force-push.
- **Caches and archives outside GitHub's control:** search-engine caches, the Wayback Machine (e.g. the live `/dist/CV_MD_Rakibul_Hassan.pdf` URL), Software Heritage and similar archives, CDN caches until they expire.
- **The Google Drive copy of the old CV:** not in Git. Restrict or replace it in Drive.
- **The GitHub secret-scanning alert record:** stays in the Security tab until the owner closes it. The key itself is Google Chrome's public built-in key and can't be revoked by the owner, so the purge doesn't change its risk.
- **Commit SHAs referenced elsewhere:** in docs, issues, notes or messages they will point to nothing.

## Lower-risk alternative

Leave history as is (the current decision) and rely on:
- `f336f14` (once pushed) and the redesign deploy to remove the old CV from the live site;
- restricting the Drive file;
- the deploy gate that blocks the old CV by hash.

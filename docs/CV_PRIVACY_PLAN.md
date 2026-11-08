# CV privacy: inventory and remediation plan

**Issue:** the CV in use since January 2026 contains the owner's **street address and postcode** in its header. Phone number and email are also in it; those are intentionally public on the site. All copies below were identified by file hash; the address itself is not written in this repository.

Checked 2026-11-08. Nothing has been deleted and Git history is untouched.

## Inventory

| # | Where | Publicly reachable | Source | Same file? |
|---|---|---|---|---|
| 1 | **Live site** `https://rakibul-cyber.github.io/rakibul-portfolio/dist/CV_MD_Rakibul_Hassan.pdf` | **yes (HTTP 200)** | `gh-pages`: `dist/` was committed by hand in `869072a` (a copy of the redesign build output, which copies `public/`) | yes, blob `c281c08` |
| 2 | Repository `main`: `CV_MD_Rakibul_Hassan.pdf` (root) | yes, via GitHub web and raw | added in `774a794` (2026-01-21) for the old sites | yes |
| 3 | Repository `redesign/ai-ml-astro` (pushed): root `CV_MD_Rakibul_Hassan.pdf` and `public/CV_MD_Rakibul_Hassan.pdf` | yes, via GitHub web and raw | root: inherited from `main`; `public/`: copied in `8fc43fd` for the redesign's download link | yes |
| 4 | **Google Drive** share `…/uc?export=download&id=1OVBTGAk…` | **yes (HTTP 200, PDF)** | the owner's Drive. The link is embedded in the old React build in `main`'s history (Jan 2026) | different file (205,935 B), **same street address line** |
| 5 | Git history | yes (any commit since `774a794`, plus `869072a` and the redesign commits) | as above | yes |
| 6 | Local files: root and `public/` | no | working copy | yes (sha256 `aa92128d…`) |

The URL the new site links to, `/rakibul-portfolio/CV_MD_Rakibul_Hassan.pdf`, currently returns **404**, because the redesign isn't deployed.

Other things noticed in the PDF: author metadata "hloom.com" (the Word template, harmless) and the creation date. No other private data beyond the address was found.

## Safeguard already in place (local, committed)

`npm run check:deploy` now refuses to publish `dist/CV_MD_Rakibul_Hassan.pdf` if its SHA-256 matches the address-containing version (`aa92128d…`). The redesign can't go live with the old CV, even by accident. Only the hash is stored in the repo.

## Remediation plan (each step needs the stated approval)

| Step | Action | Effect | Approval needed |
|---|---|---|---|
| A | Owner exports a new CV **without the street address** (keep "Frankfurt am Main, Germany"), ideally with the PDF author/title metadata cleared, and saves it as `public/CV_MD_Rakibul_Hassan.pdf` | the legitimate download keeps the same URL and filename | owner provides the file |
| B | Commit the new `public/` CV on the redesign branch; untrack the root duplicate `CV_MD_Rakibul_Hassan.pdf` with `git rm --cached` (the local file stays) and git-ignore it | the branch carries one address-free CV | none (local commit); pushing the branch is the owner's call |
| C | Remove `dist/` (or at least `dist/CV_MD_Rakibul_Hassan.pdf`) from `gh-pages` with a **normal commit and normal push**. `dist/` there is an accidental preview whose asset paths don't resolve | removes the live copy (#1) | **explicit approval to push to `gh-pages`** |
| D | Google Drive: set the file's sharing to *Restricted*, or upload the new CV as a new version of the same file (Manage versions) so the old link serves the clean CV | removes or replaces copy #4 | owner, in Google Drive |
| E | `main` stops carrying the root CV when the redesign PR is merged (step B removes it) | removes #2 from the default view | the owner's merge |
| F | Optional: rewrite history to purge old CV blobs | removes #5; requires force-push, and clones or caches may keep copies | **explicit approval** (currently declined) |

After A–E, the only published CV is the address-free `public/` copy, served at the URL the site links to. The old version would still exist in Git history (F not done) and in any third-party caches.

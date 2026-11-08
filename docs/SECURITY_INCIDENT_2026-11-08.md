# Security incident 2026-11-08: Google API key in `gh-pages`

**Status:** contained locally, awaiting owner actions (push the fix; decide on history rewrite; handle the GitHub alert). Nothing has been pushed, force-pushed, merged or deployed.

## Summary

GitHub secret scanning raised *Google API Key #1* on `Rakibul-cyber/rakibul-portfolio`. The key is **Google Chrome's own built-in API key**, not a key from any of the owner's Google Cloud projects. A throwaway Chrome profile created by `flutter run -d chrome` had cached it, and that profile was committed to the public `gh-pages` branch.

## Where it is

One distinct key (SHA-256 fingerprint prefix `53fe277c7b48`; the key itself is never printed) in three files, matching GitHub's three locations:

- `.dart_tool/chrome-device/Default/shared_proto_db/000003.log`
- `.dart_tool/chrome-device/Default/shared_proto_db/000004.log`
- `.dart_tool/chrome-device/Default/shared_proto_db/000005.ldb`

All 37 commits on all branches and tags were scanned. The files exist in **one commit only**: `869072a` "Add new images and sitemap files for project updates" (2026-11-08 00:55 +0100, parent `ae42c32`), the current tip of `origin/gh-pages`. `main`, `redesign/ai-ml-astro` and both legacy tags never contained them.

## Whose key it is (evidence, without using the key)

1. In the cache, Chrome stored the key as the `X-Goog-Api-Key` header of its own background requests to `optimizationguide-pa.googleapis.com` (downloading the language-detection, omnibox-scoring and client-side-phishing models).
2. The identical string occurs twice inside the installed **Google Chrome Framework** binary (Chrome 156.0.8078.81 on this Mac). It ships with every official Chrome build.
3. This repository's own code, across its whole history, never references a Google API key, Firebase config, `google-services.json` or `GoogleService-Info.plist`.

So the owner cannot revoke it (it belongs to Google's Chrome project, not to the owner's Google Cloud account), and the exposure gives nobody access to the owner's resources.

## Root cause

`869072a` was created on `gh-pages` with every file in the working directory staged. That branch's new `.gitignore` contained only `node_modules`, so Flutter/Dart tooling output was committed with it: 324 generated files plus the intended `dist/` (28 files).

| Path | Files | What it is |
|---|---|---|
| `.dart_tool/chrome-device/` | 207 | Chrome profile from `flutter run -d chrome`: cookies, history, sessions, preferences, caches |
| `.dart_tool/` (other) | 35 | Dart/Flutter build caches |
| `build/` | 50 | Flutter build output |
| `.astro/`, `test-results/`, `.flutter-plugins-dependencies`, `.DS_Store` ×4 | 9 | tool output, OS metadata |

The Chrome profile also contained 2 github.com cookies (encrypted with the macOS Keychain key), 0 saved logins, no autofill data, and device-local Chrome preference values (`media_router` token, `webauthn.touchid` secret, `enterprise_signin` token). It held 10 history entries: 9 localhost, 1 github.com. None of these works without this Mac's Keychain. They were inspected only as counts and hostnames.

Exposure: downloadable via the public repository (`raw.githubusercontent.com`, HTTP 200). GitHub Pages does not serve them, because Jekyll skips dot-folders (HTTP 404).

## Remediation completed locally

| Change | Where | Commit |
|---|---|---|
| Untracked `.dart_tool/`, `build/`, `.astro/`, `test-results/`, `.flutter-plugins-dependencies` and all `.DS_Store` (365 files). The served Flutter files are byte-identical to tag `legacy-flutter-deploy`; `dist/` is unchanged | `gh-pages` (local, 1 ahead of origin) | `d7b23a7` |
| `.gitignore` for `gh-pages`: tooling output, `.env*` (with `!.env.example`), key and credential files | `gh-pages` | `d7b23a7` |
| Hardened `.gitignore`: `.env*` with `!.env.example`, `*.pem/*.key/*.p12/*.jks/*.keystore`, `key.properties`, service-account/credentials JSON, `google-services.json`, `GoogleService-Info.plist`, Flutter/Dart output, `coverage/` | `redesign/ai-ml-astro` | this commit |

The owner's local working files were not deleted: `.dart_tool/` (including `chrome-device/`) and `build/` remain on disk, now ignored. The `gh-pages` change was made in a temporary worktree, so the main working directory was untouched.

## Secret scan (pattern-based, local)

Patterns: Google API key, AWS access key, GitHub/GitLab/Slack/npm tokens, Stripe live keys, OpenAI/Anthropic keys, PEM private keys, generic `api_key/secret/password/token = "…"` assignments. Results:

| Tree | Result |
|---|---|
| Working tree, `redesign/ai-ml-astro`, `main`, `legacy-flutter-source` | clean |
| `gh-pages` (local, after `d7b23a7`) | no Google key; one case-insensitive "AWS" hit in compiled `main.dart.js` (also present in the June deploy): **false positive**, 0 case-sensitive matches |
| `legacy-flutter-deploy` (June build) | "AWS"/"OpenAI" hits in compiled `main.dart.js` and `app.dill`: **false positives** (0 case-sensitive AWS matches; the "OpenAI" hit is a 1,901-char slice of minified code) |
| History | Google key only in `869072a`; Chrome preference values only in `869072a`; 0 real-format AWS, OpenAI, Anthropic, GitHub or private-key matches in any of the 37 commits |
| `.env` / key / credential files | none ever committed |

Limitations: regex scan, not a dedicated scanner such as gitleaks or trufflehog. Compiled and binary files can't be fully ruled out by pattern matching.

## Remaining actions for the owner

1. **Push the cleanup** (normal push, no force): `git push origin gh-pages`. This removes the files from the published branch tip. They remain in history.
2. **Decide on history.** The key is Google's public Chrome key, so a rewrite is optional hygiene. If you want `869072a` gone from the branch (requires a force-push), and you still have `dist/`:

   ```bash
   git switch gh-pages
   git reset --soft ae42c32          # keep d7b23a7's tree, drop 869072a from the branch
   git commit -m "Add dist preview (without generated tooling files)"
   git push --force-with-lease=gh-pages:869072a origin gh-pages
   ```

   GitHub may keep the old commit reachable by SHA for some time; ask GitHub Support to purge cached views if needed. Anyone who already cloned or forked keeps a copy.
3. **GitHub alert.** Revocation is not possible: the key belongs to Google Chrome, not to your Google Cloud account. If you want to double-check, look for a matching key at Google Cloud Console → APIs & Services → Credentials in each of your projects. The expected result is none. Then close the alert as **False positive** (or *Won't fix*), with a note linking this document. I have not closed it.
4. **Optional:** delete the local throwaway profile (`rm -rf .dart_tool/chrome-device`); Flutter recreates it.
5. **Prevention:**
   - Don't commit to `gh-pages` by hand. Let `.github/workflows/deploy.yml` publish `dist/`.
   - Avoid `git add .` / `git add -A` in a directory holding build output.
   - Enable GitHub secret-scanning **push protection** (Settings → Code security).
6. Related, not a credential: `dist/CV_MD_Rakibul_Hassan.pdf` in `gh-pages` (the CV with your street address) is still served at `/rakibul-portfolio/dist/CV_MD_Rakibul_Hassan.pdf`. Replacing the CV in `public/` doesn't change that copy. See `PROJECT_STATUS.md`.

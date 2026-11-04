# Releasing

How a version of `@matita/ui` goes out. A release is one PR and one tag, in this order.

Only maintainers with write access do the steps marked **manual**. `main` requires a PR and the `test` check.
On Windows PowerShell 5.1 run one command per line (no `&&`).

## Pre-release checklist

Run in `ui/` on a branch from an up-to-date `main`:

- [ ] `npm run build` is clean.
- [ ] `npm test` passes (behavior tests and the type check).
- [ ] `package.json` and `package-lock.json` have the same new version (two fields in the lock).
- [ ] `CHANGELOG.md` has `## x.y.z — YYYY-MM-DD` with the real release date, not "unreleased".
- [ ] New or changed components and props are in `src/index.d.ts`, the README component list and the CHANGELOG.
- [ ] Anything that breaks existing code (a renamed prop, a changed callback) is called out in the CHANGELOG.
- [ ] `@matita/icons` peer range still matches what the components use. Run the tests against the newest icons release.
- [ ] No other component or icon library is named anywhere (code, docs, comments, package.json, commit messages).

## Steps

| # | Step | Who | Command / action |
|---|---|---|---|
| 1 | Branch `release-x.y.z` from up-to-date `main` | manual | `git checkout main`, `git pull`, `git checkout -b release-x.y.z` |
| 2 | Bump the version without a commit or tag | manual | `npm version minor --no-git-tag-version` (`patch` for fixes). Never plain `npm version`: it commits and tags. |
| 3 | Set the CHANGELOG date, run the checklist above | manual | edit `CHANGELOG.md`, `npm run build`, `npm test` |
| 4 | Commit `package.json`, `package-lock.json`, `CHANGELOG.md`, push, open PR | manual | `git push -u origin release-x.y.z` |
| 5 | CI: `test` (build and tests) | automated | wait for green, then merge the PR |
| 6 | Pull the merge | manual | `git checkout main`, `git pull`, then `git log --oneline -1` must show the PR's merge commit |
| 7 | Tag **only now** | manual | `git tag vx.y.z`, `git push origin vx.y.z` |
| 8 | Release workflow: checks the tag equals `package.json`, builds, tests, `npm publish --provenance` (trusted publishing, no token) | automated | watch Actions, Release |
| 9 | Confirm it is live | manual | `npm view @matita/ui@x.y.z version --prefer-online`. The registry can lag a few minutes, poll instead of trusting the first answer. |

## Commonly missed

- **Tagging before the merge (step 6 to 7).** The tag then points at the old `main`; the workflow's version guard
  stops it and nothing is published. Fix: `git push origin :refs/tags/vx.y.z`, `git tag -d vx.y.z`, `git pull`,
  tag again, push.
- **CHANGELOG still "unreleased".** Date it in the release PR.
- **Lock file.** `npm version` updates both `package.json` and `package-lock.json`; commit both.
- **Trusted publishing.** The workflow publishes without a token. If it fails with an auth error, check the Trusted
  Publisher settings of `@matita/ui` on npmjs.com (organization `matita-dev`, repository `ui`, workflow `release.yml`).

## 0.1.0 was published by hand

npm only accepts a trusted-publisher setup for a package that already exists, so 0.1.0 was published from a
maintainer's machine (`npm publish --access public`). The `v0.1.0` tag therefore has a failed Release run: the workflow
tried to publish a version that was already there. From the next release on, steps 7 and 8 publish it.

## Rolling back

A published version cannot be replaced. Fix forward with a patch release. `npm deprecate @matita/ui@x.y.z "message"`
marks a bad version if needed (manual, owner only).

# CI/CD Pipeline & Versioning

This document describes the automated CI/CD pipeline and versioning system for deltachat.wiki.

## Overview

The project uses two GitHub Actions workflows:

| Workflow | File | Purpose |
|----------|------|---------|
| **CI Pipeline** | `.github/workflows/ci.yml` | Lint, build, and release |
| **Deploy** | `.github/workflows/deploy.yml` | Deploy to Cloudflare Pages |

## CI Pipeline (`.github/workflows/ci.yml`)

### Triggers

- **Push** to `main` or `dev` branches
- **Pull requests** targeting `main`

### Jobs

```
┌─────────────────┐
│  Lint & Build   │  ← Runs on all pushes & PRs
│                 │
│ • Install deps  │
│ • Type check    │
│ • Build site    │
│ • Build .xdc    │
│ • Upload artifacts │
└────────┬────────┘
         │ (main branch only)
         ▼
┌─────────────────┐
│ Semantic Release │  ← Runs only on push to main
│                  │
│ • Download build │
│ • Package tarball│
│ • Analyze commits│
│ • Create release │
│ • Push version   │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│ Build Summary   │  ← Always runs
│                 │
│ • Status table  │
│ • Links         │
└─────────────────┘
```

#### 1. Lint & Build

Runs on **every push and PR**. Steps:

1. Checkout code
2. Setup Bun
3. `bun install --frozen-lockfile`
4. `bun run prepare` (SvelteKit sync)
5. `bun run check` (type checking via `svelte-check`)
6. `bun --bun run build` (production build → `build/`)
7. `bun run build:xdc` (Webxdc packaging → `dist/deltachat-wiki.xdc`)
8. Upload `build/` and `dist/deltachat-wiki.xdc` as artifacts (main branch only)

#### 2. Semantic Release

Runs **only on pushes to `main`**, after Lint & Build passes. Steps:

1. Checkout with full history (`fetch-depth: 0`)
2. Setup Bun + Node.js 24
3. Download build artifacts from the previous job
4. Package the site as `dist/deltachat-wiki-site.tar.gz`
5. Install semantic-release plugins
6. Run `npx semantic-release`

#### 3. Build Summary

Always runs. Generates a GitHub Step Summary with a status table.

---

## Semantic Versioning

We use [semantic-release](https://github.com/semantic-release/semantic-release) to automate versioning based on [Conventional Commits](https://www.conventionalcommits.org/).

### Version Format

Versions follow [SemVer](https://semver.org/): `MAJOR.MINOR.PATCH`

Tags are prefixed with `v`: `v1.0.0`, `v1.1.0`, `v1.1.1`, etc.

### Commit Conventions

| Prefix | Bump | When to use |
|--------|------|-------------|
| `fix:` | **Patch** (`0.0.x`) | Bug fixes, content corrections, broken links |
| `feat:` | **Minor** (`0.x.0`) | New pages, new languages, new features |
| `feat!:` | **Major** (`x.0.0`) | Breaking changes (URL restructuring, removed pages) |
| `BREAKING CHANGE:` (in body) | **Major** (`x.0.0`) | Same as above, alternative syntax |
| `docs:` | None | Documentation-only changes (README, CONTRIBUTING) |
| `chore:` | None | Dependency updates, config changes |
| `style:` | None | CSS/styling changes that don't affect functionality |
| `refactor:` | None | Code refactoring |
| `i18n:` | None | Translation additions/fixes |

### Examples

```bash
# Patch release (e.g., v1.0.0 → v1.0.1)
git commit -m "fix: correct broken link in encryption guide"
git commit -m "fix: fix RTL layout issue in Persian sidebar"

# Minor release (e.g., v1.0.1 → v1.1.0)
git commit -m "feat: add German language support"
git commit -m "feat: add chatmail setup documentation section"

# Major release (e.g., v1.1.0 → v2.0.0)
git commit -m "feat!: restructure URL paths for all documentation"

# No release triggered
git commit -m "docs: update contributing guidelines"
git commit -m "chore: update svelte to v5.46"
git commit -m "i18n: translate bot section to Russian"
```

> **Tip:** If a translation or docs commit *should* trigger a release (e.g., it meaningfully affects the published site content), use `fix:` or `feat:` instead.

---

## Release Configuration (`.releaserc.json`)

The release pipeline runs these plugins in order:

| # | Plugin | Purpose |
|---|--------|---------|
| 1 | `@semantic-release/commit-analyzer` | Analyzes commits to determine version bump |
| 2 | `@semantic-release/release-notes-generator` | Generates release notes from commits |
| 3 | `@semantic-release/changelog` | Updates `CHANGELOG.md` |
| 4 | `@semantic-release/npm` | Bumps `version` in `package.json` (no npm publish) |
| 5 | `@semantic-release/exec` | Writes version to `.version` file |
| 6 | `@semantic-release/github` | Creates GitHub Release with assets |
| 7 | `@semantic-release/git` | Commits version bump back to `main` |

### Release Assets

Each release includes these downloadable files:

| Asset | Description |
|-------|-------------|
| `deltachat-wiki-v{version}.xdc` | Webxdc package — send in Delta Chat for offline docs |
| `deltachat-wiki-v{version}-site.tar.gz` | Static site build — for self-hosting |

---

## Files Managed by CI

These files are **automatically updated** by the release process. Do not edit them manually:

| File | Updated by | Content |
|------|-----------|---------|
| `.version` | `@semantic-release/exec` | Plain text version number |
| `CHANGELOG.md` | `@semantic-release/changelog` | Auto-generated changelog |
| `package.json` (`version` field) | `@semantic-release/npm` | Version in package manifest |

---

## Troubleshooting

### Release not triggered

- Only commits pushed to `main` trigger releases
- Only `fix:`, `feat:`, `perf:`, and breaking changes trigger version bumps
- Commits with `docs:`, `chore:`, `i18n:`, `style:`, `refactor:` do **not** trigger releases
- The commit message must follow the exact format: `type: description` (note the space after the colon)

### Build fails

- Check the Actions tab for error logs
- Common issues:
  - Missing `bun.lock` (run `bun install` and commit `bun.lock`)
  - Type errors (run `bun run check` locally)
  - Missing `manifest.toml` or `icon.png` for Webxdc build

### Assets missing from release

- The `.xdc` and tarball are built in the Lint & Build job and passed via artifacts
- If the build job fails, the release job is skipped entirely
- Check that `dist/deltachat-wiki.xdc` is being generated by `bun run build:xdc`

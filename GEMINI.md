# Gemini Guidelines — deltachat.wiki

## Project Overview

This is **deltachat.wiki**, an unofficial documentation website for Delta Chat built with **SvelteKit** and **Svelte 5**. It supports multiple languages (EN, FA, RU, ES), RTL layouts, light/dark themes, and can be packaged as a Webxdc app.

## Tech Stack

- **Framework**: SvelteKit (Svelte 5 with runes: `$state`, `$derived`, `$effect`, `$props`)
- **Styling**: Vanilla CSS with CSS custom properties (no Tailwind utility classes in components)
- **Language**: TypeScript
- **Package Manager**: Bun
- **Deployment**: Cloudflare Pages + Webxdc (.xdc) package
- **Versioning**: semantic-release (automated from commit messages)

## Commit Convention

This project uses **Conventional Commits** with **semantic-release**. Commit messages directly control versioning and changelog generation.

### Commit Format

```
<type>(<optional scope>): <description>

<optional body>
```

### Types — STRICT Rules

| Type | When to Use | Version Bump |
|------|------------|--------------|
| `feat` | **Only** for significant new features or major additions (e.g., adding zen mode, adding a new page type, adding webxdc support) | MINOR (1.x.0) |
| `fix` | Everything else — bug fixes, small improvements, refactors, styling tweaks, translation updates, typo fixes, dependency updates | PATCH (1.0.x) |
| `chore` | Non-code changes (CI, tooling, config) — does **NOT** trigger a release | None |
| `docs` | Documentation-only changes (README, CONTRIBUTING) — does **NOT** trigger a release | None |

### Critical Rule

> **`feat` is reserved for big, user-facing features.** Do NOT use `feat` for small fixes, styling tweaks, translation additions, refactors, or minor improvements. When in doubt, use `fix`.

### Examples

```bash
# ✅ Correct — big new feature
feat: add zen mode for distraction-free documentation reading

# ✅ Correct — preserving a feature behavior is a fix
fix(zen): preserve zen mode across page navigation

# ✅ Correct — translation updates are fixes
fix(i18n): add zen mode translations for all languages

# ✅ Correct — styling and UI tweaks are fixes
fix(ui): improve heading spacing in zen mode

# ✅ Correct — bug fix
fix: resolve hydration mismatch in language selector

# ✅ Correct — refactor
fix: simplify sidebar scroll logic

# ❌ Wrong — this is just a small fix, not a feature
feat(i18n): add missing translation key

# ❌ Wrong — styling tweaks are not features
feat(ui): adjust button padding
```

### Scopes (Optional)

Use a scope to indicate the area of the change:

- `zen` — Zen mode
- `i18n` — Translations / internationalization
- `ui` — UI components, styling, layout
- `a11y` — Accessibility
- `seo` — SEO improvements
- `webxdc` — Webxdc-specific changes
- `sidebar` — Sidebar navigation
- `search` — Search functionality

## Git Workflow

- **Branch**: `main` (single branch)
- **Push**: Always push to `main` directly
- **Pull before push**: If push is rejected, run `git pull --rebase` then push again
- **GPG signing**: All commits must be GPG-signed (handled automatically by git config)
- **No squash needed**: Each commit should be atomic and meaningful

## Code Style

### Svelte 5 Patterns

- Use runes: `$state()`, `$derived()`, `$effect()`, `$props()`
- Use `{@render children()}` instead of `<slot />`
- Use `onclick` instead of `on:click`
- Reactive stores use `.svelte.ts` file extension

### CSS

- Use CSS custom properties from `layout.css` (e.g., `var(--bg)`, `var(--text)`, `var(--primary)`)
- Always support both light and dark themes using `[data-theme="light"]` selectors
- Support RTL using logical properties (`inset-inline-start`, `padding-inline-start`, etc.)

### i18n

- All user-facing strings must go through `i18n.t("key")`
- Translations live in `src/lib/i18n/{lang}.json`
- Always add translations for **all 4 languages**: EN, FA, RU, ES

## File Structure

```
src/
├── lib/
│   ├── components/     # Reusable Svelte components
│   ├── i18n/           # Translation JSON files (en, fa, ru, es)
│   ├── layouts/        # Layout components (DocLayout)
│   ├── theme.svelte.ts # Theme store (light/dark)
│   └── zen.svelte.ts   # Zen mode store
├── routes/
│   ├── +layout.svelte  # Root layout (footer, theme init)
│   ├── layout.css      # Global CSS variables and base styles
│   └── [lang]/
│       └── (docs)/     # Documentation route group
│           ├── +layout.svelte  # Docs layout (header, sidebar, nav)
│           └── docs/[...path]/ # Dynamic doc pages
└── docs/               # Markdown documentation content
```

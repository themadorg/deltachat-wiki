# Code Review Style Guide — deltachat.wiki

## Commit Messages

### CRITICAL: Commit Type Rules

This project uses semantic-release. Commit types directly affect versioning:

- **`feat`** → MINOR bump (1.x.0) — **ONLY** for significant new features
- **`fix`** → PATCH bump (1.0.x) — for everything else (bug fixes, refactors, styling, translations, small improvements)
- **`chore`** / **`docs`** → No release

**If a PR commit uses `feat` for something that is NOT a major new feature, flag it.** Examples of changes that should be `fix`, NOT `feat`:
- Adding or updating translations
- Tweaking CSS / styling
- Refactoring existing code
- Adding missing error handling
- Updating dependencies
- Small UI improvements

## Code Review Checklist

### Svelte 5
- Must use Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`)
- No legacy `on:click` — use `onclick`
- No `<slot />` — use `{@render children()}`
- Reactive stores must use `.svelte.ts` extension

### Internationalization
- All user-facing strings must use `i18n.t("key")`
- New strings must be added to ALL 4 language files: `en.json`, `fa.json`, `ru.json`, `es.json`
- Flag any hardcoded user-visible English text

### Theming
- CSS must work in both light and dark modes
- Use CSS custom properties (`var(--bg)`, `var(--text)`, etc.)
- Use `[data-theme="light"]` for light-mode overrides
- Use logical properties for RTL support (`inset-inline-start`, `padding-inline-start`)

### Accessibility
- Interactive elements must have accessible labels or titles
- Buttons must be keyboard-accessible
- Images should have alt text

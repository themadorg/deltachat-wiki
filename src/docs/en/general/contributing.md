---
title: Contributing to deltachat.wiki
description: How to contribute to the Delta Chat wiki — fix errors, add content, and help translate documentation into more languages.
category: Getting Started
order: 6
---

# Contributing to deltachat.wiki

Thank you for your interest in contributing to **deltachat.wiki**! This is an unofficial, community-driven documentation project for [Delta Chat](https://delta.chat), and every contribution helps make it better for everyone.

This project is licensed under **GNU GPLv3 (Copyleft)** — you are free to use, modify, and share it.

---

## How to Contribute

### 1. Fork the Repository

All contributions go through **Pull Requests**. Start by forking the project:

1. Visit [github.com/themadorg/deltachat-wiki](https://github.com/themadorg/deltachat-wiki)
2. Click the **Fork** button in the top-right corner
3. Clone your fork locally:
   ```sh
   git clone https://github.com/YOUR_USERNAME/deltachat-wiki.git
   cd deltachat-wiki
   ```
4. Install dependencies:
   ```sh
   bun install
   ```
5. Start the development server:
   ```sh
   bun run dev
   ```

### 2. Make Your Changes

Create a new branch, make your edits, and commit:

```sh
git checkout -b my-contribution
# ... make your changes ...
git add .
git commit -m "docs: describe what you changed"
```

### 3. Submit a Pull Request

Push your branch and open a PR against the `main` branch:

```sh
git push origin my-contribution
```

Then go to your fork on GitHub and click **"Compare & pull request"**.

---

## Reporting & Fixing Errors

### Factual or Conceptual Errors

If you find content that is **factually incorrect** or describes a concept wrongly:

1. **Fix it in the English (`en`) version first** — English is the primary source language
2. In your PR description, **clearly explain what was wrong and what you corrected**
3. **Request the fix to be applied across all other languages** by adding a note like:

> ⚠️ This PR fixes a factual error in `src/docs/en/general/privacy.md`. The same correction needs to be applied to the `fa`, `ru`, and `es` versions of this page.

This ensures that incorrect information doesn't persist in translated versions.

### Translation Errors

If you notice that a **translation doesn't match the meaning** of the English source:

1. **Open an issue** or submit a PR
2. Clearly specify:
   - Which file is affected
   - Which language has the error
   - What the text currently says
   - What it should say instead

**Example issue:**

> 🌐 Translation error in `src/docs/fa/general/privacy.md`  
> The paragraph about end-to-end encryption currently says "..." but the English source says "...". The correct Persian translation should be "..."

### Typos and Grammar

- **English typos:** Fix them directly and submit a PR
- **Other languages:** If you speak the language, fix them directly. If not, open an issue describing what looks wrong and in which file/language

---

## Writing Documentation

### File Structure

Documentation pages are Markdown files with YAML frontmatter:

```markdown
---
title: Page Title
description: Brief description of the page content
category: Category Name
order: 1
---

Your content goes here...
```

### Where to Put Files

```
src/docs/
├── en/          ← English (primary source)
│   ├── general/
│   ├── webxdc/
│   ├── bot/
│   └── servers/
├── fa/          ← Persian translations
├── ru/          ← Russian translations
└── es/          ← Spanish translations
```

### Sidebar Navigation

Each section has a `config.ts` that defines the page order in the sidebar:

```typescript
export const sidebarConfig = [
    { title: "Introduction", slug: "general/introduction" },
    { title: "Features", slug: "general/features" },
    // Add your new page here
];
```

**Don't forget to update `config.ts`** when adding a new page!

---

## Translation Guidelines

This wiki is available in **English**, **Persian (فارسی)**, **Russian (Русский)**, and **Spanish (Español)**.

### Rules for Translators

1. **Always translate from the English source** — never translate from another translation
2. **Keep the same file path** — `en/general/features.md` → `fa/general/features.md`
3. **Translate frontmatter values** — translate `title` and `description`, keep other keys as-is
4. **Don't translate code blocks** — code examples stay in their original form
5. **Keep technical terms** in their original form unless there's a widely accepted local equivalent
6. **Keep URL slugs in English** — paths must remain consistent across languages
7. **Update UI strings** — if you add new keys to `en.json`, add them to the other language files too

### UI Translation Files

The site interface (navigation, buttons, footer, etc.) is translated via JSON files:

```
src/lib/i18n/
├── en.json    ← Source
├── fa.json
├── ru.json
└── es.json
```

---

## Adding a New Language

Want to add support for a new language? Here's how:

1. Add the language to `src/lib/languages.ts`:
   ```typescript
   { code: 'de', name: 'Deutsch', dir: 'ltr' }
   ```
2. Create `src/lib/i18n/de.json` — copy from `en.json` and translate
3. Register the translation in `src/lib/i18n.svelte.ts`
4. Start translating docs under `src/docs/de/`
5. Create `config.ts` sidebar files for each section

The build system will automatically pick up the new language for routing, prerendering, and the language switcher.

---

## Pull Request Guidelines

### PR Title Convention

Use clear, conventional prefixes:

| Prefix | Use For |
|--------|---------|
| `docs:` | Adding or updating documentation content |
| `fix:` | Correcting factual errors or bugs |
| `i18n:` | Adding new translations |
| `i18n-fix:` | Fixing translation errors |
| `feat:` | Adding new features or functionality |

### Checklist Before Submitting

- [ ] Changes build without errors (`bun run build`)
- [ ] Content is accurate and well-written
- [ ] Frontmatter (`title`, `description`, `category`, `order`) is correct
- [ ] Sidebar `config.ts` is updated (if adding a new page)
- [ ] If fixing a content error, other languages are flagged for update
- [ ] PR description explains what changed and why

---

## Questions?

- Open an [issue on GitHub](https://github.com/themadorg/deltachat-wiki/issues)
- Join the [Delta Chat Support Forum](https://support.delta.chat/)

Thank you for helping make Delta Chat documentation accessible to everyone! ❤️

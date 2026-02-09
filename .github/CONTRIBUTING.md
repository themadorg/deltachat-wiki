# Contributing to deltachat.wiki

Thank you for your interest in contributing to **deltachat.wiki** — an unofficial, community-driven guide to [Delta Chat](https://delta.chat), the secure and open source decentralized messaging platform.

This project is licensed under **GPLv3 (Copyleft)** — everyone is free to use, modify, and share it.

## Table of Contents

- [How to Contribute](#how-to-contribute)
- [Project Structure](#project-structure)
- [Supported Languages](#supported-languages)
- [Writing Documentation](#writing-documentation)
- [Fixing Content Errors](#fixing-content-errors)
- [Translation Guidelines](#translation-guidelines)
- [Adding a New Language](#adding-a-new-language)
- [Development Setup](#development-setup)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Code of Conduct](#code-of-conduct)

## How to Contribute

1. **Fork** this repository
2. **Clone** your fork locally
3. **Create a branch** for your changes (`git checkout -b my-contribution`)
4. **Make your changes**
5. **Commit** with a clear, descriptive message
6. **Push** to your fork and **open a Pull Request**

## Project Structure

```
src/
├── docs/                  # All documentation content
│   ├── en/                # English (primary language)
│   │   ├── general/       # General Delta Chat docs
│   │   ├── webxdc/        # Webxdc app development
│   │   ├── bot/           # Bot development
│   │   └── servers/       # Server setup & management
│   ├── fa/                # Persian translations
│   ├── ru/                # Russian translations
│   └── es/                # Spanish translations
├── lib/
│   ├── i18n/              # UI translation strings (en.json, fa.json, etc.)
│   ├── languages.ts       # Centralized language configuration
│   └── components/        # Svelte components
├── routes/                # SvelteKit route pages
└── config.ts              # Site configuration
```

### Documentation Files

Each documentation page is a Markdown file (`.md`) with YAML frontmatter:

```markdown
---
title: Page Title
description: A brief description of the page
category: Category Name
order: 1
---

Your content here...
```

### Sidebar Configuration

Each documentation section has a `config.ts` file that defines the sidebar navigation order:

```typescript
export const sidebarConfig = [
    { title: "Introduction", slug: "general/introduction" },
    { title: "Features", slug: "general/features" },
];
```

## Supported Languages

| Code | Language | Direction |
|------|----------|-----------|
| `en` | English | LTR |
| `fa` | فارسی (Persian) | RTL |
| `ru` | Русский (Russian) | LTR |
| `es` | Español (Spanish) | LTR |

**English is the primary (source) language.** All other languages are translations of the English content.

## Writing Documentation

- Write clearly and concisely
- Use proper Markdown formatting
- Include code examples where appropriate
- Add the correct frontmatter (`title`, `description`, `category`, `order`)
- Place images in an `images/` folder next to your Markdown file
- Update the section's `config.ts` to include your new page in the sidebar

## Fixing Content Errors

### Factual or Conceptual Errors

If you find content that is **factually incorrect** or contains a **wrong concept**:

1. **Fix it in the English (`en`) version first** — English is the source language
2. In your Pull Request, **clearly note which concept was wrong** and explain the correction
3. **Request that the fix be applied across all other languages** by adding a comment like:
   > ⚠️ This PR fixes a factual error in `src/docs/en/...`. The same correction should be applied to: `fa`, `ru`, `es`.

This helps maintainers ensure consistency across all translations.

### Typos and Grammar

- For English typos: fix them directly
- For typos in other languages: if you speak the language, fix them directly. Otherwise, **open an issue** explaining what looks wrong and in which language

### Translation Errors

If you notice a **translation error** (the translated text doesn't match the meaning of the English source):

1. **Open an issue** or PR describing the problem
2. Specify: which file, which language, and what the correct translation should be
3. Example:
   > 🌐 Translation error in `src/docs/fa/general/introduction.md`
   > The paragraph about encryption incorrectly says "..." — it should say "..."

## Translation Guidelines

When translating content:

1. **Always translate from the English source** — don't translate from another translation
2. **Keep the same file structure** — the translated file must be at the same path under the language directory
3. **Preserve all frontmatter keys** — translate the `title` and `description` values only
4. **Don't translate code blocks** — keep code examples in their original form
5. **Don't translate technical terms** unless there's a widely accepted translation in the target language
6. **Keep link slugs in English** — URL paths should remain consistent across languages
7. **Copy the section's `config.ts`** and translate the `title` values
8. **Update UI strings** in `src/lib/i18n/<lang>.json` if you add new UI keys

### UI Translations

The site interface (navigation, buttons, footer, etc.) is translated via JSON files in `src/lib/i18n/`:

```
src/lib/i18n/
├── en.json    # English (source)
├── fa.json    # Persian
├── ru.json    # Russian
└── es.json    # Spanish
```

If you add a new UI string key in `en.json`, please add the corresponding translation in all other language files (or leave a note in your PR asking for help with translations you can't do yourself).

## Adding a New Language

To add support for a new language:

1. Add the language to `src/lib/languages.ts`:
   ```typescript
   { code: 'de', name: 'Deutsch', dir: 'ltr' }
   ```
2. Create a new translation file `src/lib/i18n/de.json` (copy from `en.json` and translate)
3. Import and register the new translation in `src/lib/i18n.svelte.ts`
4. Start translating documentation pages under `src/docs/de/`
5. Create `config.ts` sidebar files for each translated section

The build system, routing, sitemap, and prerendering will automatically pick up the new language.

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- Git

### Getting Started

```sh
# Clone your fork
git clone https://github.com/YOUR_USERNAME/deltachat-wiki.git
cd deltachat-wiki

# Install dependencies
bun install

# Start development server
bun run dev
```

The site will be available at `http://localhost:5173`.

### Building

```sh
# Production build
bun run build

# Webxdc build (produces dist/deltachat-how.xdc)
bun run build:xdc
```

## Submitting a Pull Request

1. Make sure your changes build without errors (`bun run build`)
2. Write a clear PR title and description
3. If fixing a content error, explain what was wrong and what you corrected
4. If adding/updating translations, list which languages are affected
5. If adding a new feature or page, include a screenshot if applicable
6. Reference any related issues

### PR Title Convention

- `docs: add guide for setting up chatmail`
- `fix: correct encryption explanation in privacy page`
- `i18n: add Russian translation for bot section`
- `i18n-fix: fix Persian translation in introduction`
- `feat: add search functionality`

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers and help them get started
- Focus on the content, not the person
- Remember that this is a volunteer-driven project

---

**Questions?** Open an issue or join the [Delta Chat support forum](https://support.delta.chat/).

Thank you for helping make Delta Chat documentation accessible to everyone! ❤️

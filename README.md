# deltachat.wiki

An unofficial, community-driven documentation wiki for [Delta Chat](https://delta.chat) — the secure and open source decentralized messaging platform.

Also ships as a **Webxdc** app that runs directly inside Delta Chat.

## Topics Covered

- **General** — Introduction, privacy, security, comparison tables
- **Webxdc** — App development, shared state, CRDTs, real-time data
- **Bots** — Building and deploying Delta Chat bots
- **Servers** — Chatmail, Madmail, self-hosting guides

## Languages

Documentation is available in **English**, **Persian (فارسی)**, **Russian (Русский)**, and **Spanish (Español)**.

## Contributing

We welcome contributions from everyone! Whether it's fixing a typo, correcting a translation, or adding entirely new content — every contribution matters.

**Please read the full [Contributing Guide](.github/CONTRIBUTING.md) before submitting a PR.**

### Quick Start

1. **Fork** this repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/deltachat-wiki.git`
3. **Install** dependencies: `bun install`
4. **Start** local dev server: `bun run dev`
5. **Make** your changes and submit a Pull Request

### Reporting Errors

- **Wrong concept or fact?** Fix it in the English version first, then request the fix be applied to all other languages.
- **Translation mistake?** Open an issue or PR specifying the file, language, and the correct translation.
- **Typo?** Just fix it and submit a PR!

See the [Contributing Guide](.github/CONTRIBUTING.md) for full details.

## Stack

- [SvelteKit](https://kit.svelte.dev) + [mdsvex](https://mdsvex.com)
- Multilingual i18n with URL-based language routing (`/en`, `/fa`, `/ru`, `/es`)
- Static adapter for deployment & Webxdc packaging

## Development

```sh
bun install
bun run dev
```

## Webxdc Build

```sh
bun run build:xdc
```

Produces `dist/deltachat-how.xdc`.

## License

[GPLv3](LICENSE) — Copyleft. Free to use, modify and share.

# Delta Chat Wiki

An independent, bilingual (English / Persian) documentation wiki for [Delta Chat](https://delta.chat) — the decentralized messenger built on email.

Also ships as a **Webxdc** app that runs directly inside Delta Chat.

## Topics Covered

- **General** — Introduction, privacy, security, comparison tables
- **Webxdc** — App development, shared state, CRDTs, real-time data
- **Bots** — Building and deploying Delta Chat bots
- **Servers** — Chatmail, Madmail, self-hosting guides

## Stack

- [SvelteKit](https://kit.svelte.dev) + [mdsvex](https://mdsvex.com)
- Bilingual i18n with URL-based language routing (`/en`, `/fa`)
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

[GPLv3](LICENSE)

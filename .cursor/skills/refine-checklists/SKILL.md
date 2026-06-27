---
name: refine-checklists
description: Refine building checklist YAML and info markdown for deltachat.wiki. Use when editing src/lib/checklists/*.yml, src/lib/checklists/info/**/*.md, adding checklist items, fixing checklist pages, or when the user mentions building checklists, essential items, or checklist info modals.
---

# Refine Building Checklists

Interactive readiness checklists for Core, Desktop, Mobile, and Relay. Data lives in YAML; item details live in linked markdown files shown in a modal.

## File map

| Path | Role |
|------|------|
| `src/lib/checklists/{core,desktop,mobile,server}.yml` | Checklist structure and item metadata |
| `src/lib/checklists/info/{checklist-id}/{item-id}.md` | Info modal content (mdsvex) |
| `src/lib/checklists/load.ts` | Parser, scoring, info loader — edit only when adding a new checklist type |
| `src/lib/components/Checklist.svelte` | Checklist UI |
| `src/lib/layouts/ChecklistInfoLayout.svelte` | Info modal prose styling |
| `src/docs/en/building/*.md` | Doc pages embedding `<Checklist />` |
| `src/docs/en/building/rfcs.md` | Local RFC index for Relay implementers |
| `static/rfcs/*.txt` | Offline RFC plain-text copies (`/rfcs/rfcXXXX.txt`) |

Checklist type `server` is labeled **Relay** in the UI.

## Label rules (read first)

Labels are **exact, implementable deliverables** — not planning homework.

| Bad | Good |
|-----|------|
| Requirements understood | JIT registration can be disabled |
| Key RFCs identified | Submission listener on port 587 (STARTTLS) |
| Installer / AppImage / DMG builds | macOS DMG builds (`pnpm pack:mac`) |
| Valid TLS for SMTP, IMAP, and HTTPS | Valid TLS on SMTP listeners |

**One checkbox = one thing.** Split bundled items:

- Separate ports (587 vs 465, 143 vs 993)
- Separate platforms (Windows / macOS / Linux pack or test)
- Separate toggles (JIT disable vs `/new` disable)
- Separate protocol extensions (each IMAP capability or METADATA key)
- Separate quality gates (`check:types`, `check:lint`, `check:format`)

Use backticks in labels for **commands and paths** (`pnpm -w build:electron`, `POST /mxdeliv`).

Never add meta **Specification** sections (“read docs first”, “study reference implementations”) — put concrete features in the right functional section or link docs from the building page intro.

## Relay (`server.yml`) section patterns

For mail protocols and operator-facing features, use **three subsection types** when it fits:

| Subsection suffix | Purpose | Examples |
|-------------------|---------|----------|
| `- Connect` | Listeners, ports, TLS handshake | Submission listener on port 587 (STARTTLS) |
| `- Functionality` | Protocol behaviour after connect | SMTP AUTH after TLS on submission ports |
| `- Customizability` | Operator config without code changes | Submission on port 587 (STARTTLS) can be disabled |

Title format: `SMTP - Connect` (ASCII hyphen `-`, not em dash `—`). Use **Customizability**, not “Customization”.

Other Relay sections stay topical: Accounts, Message Policy, Federation, HTTP & Discovery, Administration, Verification, etc.

**Accounts** can mirror the same split:

- `Accounts - Functionality` — JIT create, `/new`, blocklist, credential limits
- `Accounts - Customizability` — JIT can be disabled, `/new` can be disabled

**RFC links** in info modals: local only — `[RFC 5321](/rfcs/rfc5321.txt)`. Full index: [Protocol RFCs](/en/docs/building/rfcs).

## Desktop / Core / Mobile patterns

**Desktop** — **client functionality**, not Node.js/Electron toolchain:

- Ground items in `context/deltachat-desktop/docs/ui/` (symlink to upstream repo) — component names and real behaviour, not generic messenger guesses
- One row per user-visible feature: send text, reply, bubbles, gallery, webxdc window, connectivity states, QR flows
- Sections: Account, Multiple Accounts (optional), Chat List, Search, Message List, Messaging, Composer, Media, Apps & Media Gallery, Contacts/Groups/Channels, QR & Invites, Encryption, Webxdc, Settings & UX, Verification
- Labels describe what the **user** can do; match deltachat-desktop wording (e.g. protection info message, not “encryption broken banner”; gallery tabs, not “image gallery only”)
- Info modals: behaviour from UI docs + **Verify:** manual test; cite real paths (`AccountListSidebar`, `FullscreenMedia`) where helpful
- Link [deltachat-desktop UI index](https://github.com/deltachat/deltachat-desktop/blob/main/docs/ui/README.md) from `desktop.md` intro
- Do not put dev-environment, lint, or installer steps on the desktop checklist

**Core** — toolchain + `cargo` commands + system deps; the Rust library checklist.

**Mobile** — **client functionality**, same rules as Desktop:

- One row per user-visible feature; not Android Studio, Xcode, Gradle, ProGuard, or store listing
- Mirror Desktop sections where behaviour matches; add **Mobile Platform** for push, background sync, share intent, launcher badge, offline queue, pull-to-refresh
- Labels describe what the **user** can do on a phone or tablet
- Info modals: behaviour + **Verify:** with a manual test on device or emulator
- Link [Delta Chat features](/en/docs/general/features) from `mobile.md` intro

## Workflow: add or edit an item

1. Edit the checklist YAML (`src/lib/checklists/{type}.yml`).
2. Create or update `src/lib/checklists/info/{type}/{item-id}.md`.
3. Set `info: {type}/{item-id}` on the YAML item (must match the markdown path without `.md`).
4. Run validation (see below).
5. Keep changes scoped — do not edit unrelated checklist types unless asked.

## Workflow: add a new section

```yaml
- id: smtp-connect
  title: SMTP - Connect
  description: Listeners, ports, and TLS so clients can reach the server.
  items:
    - id: smtp-submission-587
      label: Submission listener on port 587 (STARTTLS)
      essential: true
      info: server/smtp-submission-587
```

Then create `src/lib/checklists/info/server/smtp-submission-587.md`.

## YAML rules

- `id` on checklist must be one of: `core`, `desktop`, `mobile`, `server`
- Item `id` must be unique within the checklist, kebab-case, stable (localStorage keys use it)
- `repo_url` in YAML becomes `repoUrl` in code
- `essential: true` marks minimum required steps; shown as a badge, scored separately
- `href` is optional link on the item row (opens in new tab) — use for external URLs or `/en/docs/building/rfcs`
- `info` is a slug path, **not** inline text — always `{checklist-id}/{item-id}`
- `description` on **sections** — short helper under the section title; always add for new Relay/Desktop sections

### YAML pitfalls

Quote values that contain `: ` (colon + space) or start with `Example:`:

```yaml
label: "`cargo build --release` succeeds"
info: "On Debian/Ubuntu: libsqlite3-dev"
```

Unquoted colons break parsing and can crash the checklist page at load time.

## Info markdown rules

Every info file:

```markdown
---
layout: checklist-info
---

# Submission listener on port 587 (STARTTLS)

Bind and accept connections on submission port 587 (RFC 6409, RFC 3207 STARTTLS).

**Verify:** Delta Chat send succeeds on port 587; autoconfig lists STARTTLS submission.
```

- **One `#` heading only** — must match the item `label` (strip surrounding backticks)
- Do not duplicate the title in the body
- Structure: what to implement → requirements table or list → **Verify:** step
- Use fenced or inline code for commands
- For Relay protocol items: link RFCs locally (`/rfcs/rfcXXXX.txt`)
- For Desktop: cite real repo paths (`packages/target-electron`) and upstream doc URLs
- Content renders in a modal — keep paragraphs short; tables are fine

## Essential vs optional

Mark `essential: true` only for steps required before a working build or minimum client-compatible relay. Optional services (WebIMAP, TURN, etc.) stay optional unless the user asks otherwise.

## Validation

After edits, run from repo root:

```bash
node .cursor/skills/refine-checklists/scripts/validate-checklists.mjs
```

Fix all reported errors before finishing. Common failures:

- YAML parse error (usually unquoted colon)
- `info` slug with no matching `.md` file
- Orphan info markdown with no YAML reference
- Duplicate item ids within a checklist
- `#` heading does not match YAML `label`

## Adding a new checklist type

Rare — requires code changes:

1. Add `{type}.yml` and register in `load.ts` (`ChecklistId`, `rawById`, `checklistEntries`)
2. Add `src/docs/en/building/{type}.md` with `<Checklist {checklist} />`
3. Add sidebar entry in `src/docs/en/building/config.ts`
4. Add `src/lib/checklists/info/{type}/` directory

## Do not

- Put info body text inline in YAML — use markdown files
- Add checklist section to top subnav without user request (Building subnav is intentional)
- Rename item `id` without understanding localStorage progress keys (`build-checklist:{type}`)
- Edit `Checklist.svelte` for content-only changes
- Bundle multiple ports, platforms, or toggles in one label
- Add “understood / studied / identified” checklist rows
- Link RFCs only to IETF Datatracker in Relay info modals — use local `/rfcs/` copies

## Additional resources

- Schema and examples: [reference.md](reference.md)
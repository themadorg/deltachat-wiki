# Checklist reference

## Checklist YAML schema

```yaml
id: server
title: Relay
description: Language-agnostic feature checklist for a Chatmail-compatible mail relay.
repo_url: https://github.com/chatmail/relay
sections:
  - id: smtp-connect
    title: SMTP - Connect
    description: Listeners, ports, and TLS so clients and MTAs can reach the server.
    items:
      - id: smtp-submission-587
        label: Submission listener on port 587 (STARTTLS)
        essential: true
        info: server/smtp-submission-587
  - id: smtp-functionality
    title: SMTP - Functionality
    description: Protocol behaviour after a connection is established.
    items:
      - id: smtp-authentication
        label: SMTP AUTH after TLS on submission ports
        essential: true
        info: server/smtp-authentication
  - id: smtp-customizability
    title: SMTP - Customizability
    description: Operator-tunable SMTP settings without code changes.
    items:
      - id: smtp-submission-587-disable
        label: Submission on port 587 (STARTTLS) can be disabled
        info: server/smtp-submission-587-disable
```

### Item fields

| Field | Required | Notes |
|-------|----------|-------|
| `id` | yes | kebab-case, unique per checklist |
| `label` | yes | Exact deliverable; one thing per row |
| `description` | no | Rare subtext under label in UI |
| `href` | no | External or internal doc link button |
| `essential` | no | `true` for required steps |
| `info` | no | Slug → `info/{slug}.md` |

### Section fields

| Field | Required | Notes |
|-------|----------|-------|
| `id` | yes | kebab-case, unique per checklist |
| `title` | yes | Use `Protocol - Connect` hyphen form for Relay subsections |
| `description` | recommended | One line under section title |
| `items` | yes | Array of items |

## Label patterns by checklist

### Relay (`server`)

| Pattern | Example label |
|---------|----------------|
| Listener / port | `IMAP listener on port 993 (IMAPS)` |
| Extension | `IMAP IDLE — notify clients of new mail without polling (RFC 2177)` |
| HTTP endpoint | `HTTP POST /mxdeliv receives federated mail` |
| Disable toggle | `JIT registration can be disabled` |
| Customizability | `SMTP listener ports changeable via config or admin API` |

Split **connect** (bind + TLS) from **function** (accept mail, AUTH, policy).

### Desktop (`desktop`)

User-facing messenger features — same spirit as Relay protocol checklist:

| Pattern | Example label |
|---------|----------------|
| Chat UI | `Message bubbles for sent and received text` |
| Messaging | `Reply quotes a specific message` |
| Media | `Image viewer opens full-size with zoom` |
| Groups | `Create group chat with multiple members` |
| Encryption | `Verify contact by scanning QR code` |
| Verification | `Two accounts exchange messages on desktop` |

```yaml
- id: messaging
  title: Messaging
  description: Compose, replies, reactions, and message lifecycle.
  items:
    - id: reply-to-message
      label: Reply quotes a specific message
      essential: true
      info: desktop/reply-to-message
```

Do **not** use desktop checklist for `pnpm`, Node.js, electron-builder, or CI rows.

### Core (`core`)

Keep Rust/cargo-specific commands; essential = builds and tests that gate all clients.

## Info markdown template

### Relay protocol item

```markdown
---
layout: checklist-info
---

# Submission listener on port 587 (STARTTLS)

Bind and accept connections on submission port 587 ([RFC 6409](/rfcs/rfc6409.txt), [RFC 3207](/rfcs/rfc3207.txt) STARTTLS):

1. Client connects on cleartext port 587
2. `STARTTLS` upgrade
3. `AUTH` then `MAIL FROM` / `RCPT TO` / `DATA`

TLS must be enforced before credentials or message data.

**Verify:** Delta Chat send succeeds on port 587; autoconfig lists STARTTLS submission.
```

### Relay optional HTTP service

```markdown
---
layout: checklist-info
---

# WebIMAP REST access

HTTP JSON API for a browser-friendly IMAP subset ([RFC 9110](/rfcs/rfc9110.txt)).

## Authentication

| Header | Value |
|--------|--------|
| `X-Email` | Full address |
| `X-Password` | Account password |

## REST routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/webimap/mailboxes` | Login / mailbox list |

**Verify:** valid credentials return **200**; disabled service returns **404**.
```

### Desktop feature item

```markdown
---
layout: checklist-info
---

# Image viewer opens full-size with zoom

Click a thumbnail in the chat bubble to open a lightbox. Support zoom in/out, pan when zoomed, and close with ESC or click outside.

**Verify:** send a large image; open viewer; zoom does not clip; close returns to chat at same scroll position.
```

Prefer inline code for single commands; fenced blocks for multi-line shell snippets.

## Slug convention

| YAML `info` value | File path |
|-------------------|-----------|
| `server/smtp-submission-587` | `src/lib/checklists/info/server/smtp-submission-587.md` |
| `desktop/pack-macos` | `src/lib/checklists/info/desktop/pack-macos.md` |
| `core/rust-toolchain` | `src/lib/checklists/info/core/rust-toolchain.md` |

Pattern: `{checklist-id}/{item-id}` where checklist-id matches the YAML file name (without `.yml`).

## RFC library (Relay only)

| Asset | Path |
|-------|------|
| Index page | `src/docs/en/building/rfcs.md` |
| Plain-text files | `static/rfcs/rfc*.txt` → served at `/rfcs/rfc5321.txt` |
| Refresh script | `static/rfcs/download-rfcs.sh` |

In info modals link `[RFC NNNN](/rfcs/rfcNNNN.txt)` — not Datatracker as primary.

## Building doc pages

Each checklist type has `src/docs/en/building/{type}.md`:

```svelte
<script>
  import Checklist from '$lib/components/Checklist.svelte';
  import { loadChecklist } from '$lib/checklists/load';
  const checklist = loadChecklist('server');
</script>

# Relay Build Checklist

Short intro: what the checklist covers + links to RFC library or upstream docs.

<Checklist {checklist} />
```

Sidebar: `src/docs/en/building/config.ts`.

## Scoring (read-only for editors)

- Overall score = checked items / total items
- Essential score = checked essential / total essential
- Progress stored in browser: `localStorage` key `build-checklist:{checklist-id}`

Rating bands: 0–25, 26–50, 51–75, 76–99, 100.

## Checklist files

| File | UI name |
|------|---------|
| `core.yml` | Core Library |
| `desktop.yml` | Desktop Application |
| `mobile.yml` | Mobile Application |
| `server.yml` | Relay |

## Splitting checklist items (checklist)

When editing an existing bundled row, also:

1. Add new YAML items with new `id`s
2. Create matching info `.md` files (or split content from the old file)
3. Delete orphan info markdown
4. Run `validate-checklists.mjs`

Renaming `id` resets browser progress for that row — acceptable when the label meaning changed.

## Anti-patterns

```yaml
# BAD — meta, not implementable
- label: Chatmail requirements understood

# BAD — two ports in one row
- label: Submission on ports 587 (STARTTLS) and 465 (SMTPS)

# GOOD
- label: Submission listener on port 587 (STARTTLS)
- label: Submission listener on port 465 (SMTPS)
```

```yaml
# BAD — section title
title: SMTP — Customization

# GOOD
title: SMTP - Customizability
```
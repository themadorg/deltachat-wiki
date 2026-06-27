---
layout: checklist-info
---

# WebIMAP REST access

HTTP JSON API that exposes a browser-friendly subset of IMAP over HTTPS ([RFC 9110](/rfcs/rfc9110.txt)). Used by the Delta Chat web app (`/app`), bots, and integration tests when raw IMAP from the browser is impractical.

**Typical base path:** `/webimap/*` on the relay HTTPS listener (port 443).

## Enable / disable

Disabled by default on most Chatmail relays. When off, all `/webimap/*` REST routes return **404** (route hidden, not an auth error). Operators enable via admin API service toggle or config — same pattern as other optional services.

## Authentication

| Header | Value |
|--------|--------|
| `X-Email` | Full address (`user@domain`) |
| `X-Password` | Account password |

Validate credentials the same way as IMAP LOGIN. Reject blocked usernames before any mailbox access. CORS: allow browser clients (`Access-Control-Allow-Origin: *`); answer `OPTIONS` with **204** and allowed methods/headers.

## REST routes to implement

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/webimap/mailboxes` | List mailboxes (INBOX-centric); used as login/connect check |
| GET | `/webimap/messages?mailbox=&since_uid=&wait=` | List messages; optional long-poll up to `wait` seconds (cap ~120s) |
| GET | `/webimap/message/{uid}?mailbox=` | Fetch full message body and envelope |
| DELETE | `/webimap/message/{uid}` | Delete message by UID |
| DELETE | `/webimap/messages/{mailbox}/{uid}` | Delete alias (web app compatibility) |
| POST | `/webimap/message/flags` | Flag updates (may ack-only if storage has no persistent flags yet) |

Message format on fetch/send paths: [RFC 5322](/rfcs/rfc5322.txt). UID semantics align with [RFC 3501](/rfcs/rfc3501.txt) where applicable.

## Behaviour notes

- **INBOX-first:** many reference implementations back WebIMAP with a single primary mailbox until multi-folder storage is complete.
- **Long-poll:** `GET /webimap/messages` with `wait=` blocks until new mail or timeout — REST alternative to WebSocket push.
- **Not a full IMAP replacement:** no requirement to expose every IMAP command over HTTP; parity with the web client flow matters more than complete command coverage.

**Verify:** `GET /webimap/mailboxes` with valid `X-Email` / `X-Password` returns **200** and INBOX metadata; with service disabled returns **404**.
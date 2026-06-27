---
layout: checklist-info
---

# WebIMAP WebSocket access

Bidirectional WebSocket on `GET /webimap/ws` (WSS on HTTPS) for long-lived sync without polling. Pair with WebIMAP REST for connect + fetch; WebSocket handles live updates and interactive commands.

Gated by the same **WebIMAP enabled** toggle as REST — disabled service returns **404** on upgrade.

## Authentication

Pass credentials on the upgrade URL (browser WebSocket cannot set arbitrary headers easily):

```
GET /webimap/ws?email=user@domain&password=SECRET
```

Optional: `mailbox`, `since_uid` to scope the session.

## Client → server envelope

```json
{ "req_id": "1", "action": "list_mailboxes", "data": {} }
```

## Server → client reply

```json
{ "req_id": "1", "action": "result", "data": [ ... ] }
```

## Actions (WebIMAP gate)

| Action | Purpose |
|--------|---------|
| `list_mailboxes` | Mailbox list (typically INBOX) |
| `list_messages` | Messages since UID |
| `fetch` | Full message by UID |
| `delete` | Delete by UID |
| `flags` | Flag update (may ack-only) |

Unsupported in INBOX-only storage (return clear error, do not hang): `move`, `copy`, `search`, arbitrary mailbox CRUD.

## Server push (no `req_id`)

Notify clients of new mail without polling:

```json
{ "action": "new_message", "data": { "uid": 123, "envelope": { ... } } }
```

Wake waiters on delivery (mailbox events) and/or poll on an interval (reference implementations often use ~2s fallback).

## WebSMTP over WebSocket

Action `send` is gated separately by **WebSMTP enabled** — same PGP-only and From=authenticated-user rules as `POST /webimap/send`.

**Verify:** open WSS with valid credentials, send `list_mailboxes`, receive `result`; inject mail to INBOX and receive `new_message` push (or timely `list_messages` update).
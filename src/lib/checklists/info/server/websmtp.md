---
layout: checklist-info
---

# WebSMTP HTTP submit API

JSON HTTP endpoint to submit outbound mail with the **same policy as SMTP submission** ([RFC 5321](/rfcs/rfc5321.txt), [RFC 6409](/rfcs/rfc6409.txt)) — without a raw SMTP socket from the client. Disabled by default on most Chatmail deployments.

## Enable / disable

Separate toggle from WebIMAP read paths. When off:

- `POST /webimap/send` rejected
- `POST /websmtp/send` rejected
- WebSocket action `send` rejected

Prefer **404** when disabled (hidden route), consistent with other optional HTTP services.

## Endpoints

| Method | Path | Notes |
|--------|------|-------|
| POST | `/webimap/send` | Primary path used by the Delta Chat web app |
| POST | `/websmtp/send` | Legacy alias — same handler |

## Authentication

Same as WebIMAP REST:

| Header | Value |
|--------|--------|
| `X-Email` | Full address |
| `X-Password` | Account password |

## Request body

```json
{
  "from": "user@domain",
  "to": ["peer@domain"],
  "body": "<complete RFC 5322 message>"
}
```

Force `from` to the authenticated user — reject From/Sender mismatches (same as SMTP submission envelope checks).

## Processing order

1. Authenticate `X-Email` / `X-Password`
2. Validate headers — `from` must match authenticated address
3. **PGP-only enforcement** ([RFC 3156](/rfcs/rfc3156.txt)) — accept `multipart/encrypted` and Secure Join handshakes; reject plaintext
4. **Route message** — local recipients to maildir; remote domains to outbound queue (HTTPS `/mxdeliv` then SMTP fallback)

Return JSON success/error with HTTP status; do not leak whether a remote recipient exists on rejected federation mail.

## Relation to WebIMAP REST

WebIMAP REST covers read/sync; WebSMTP covers write/send. Implementations often share one HTTP router but gate read vs send independently so operators can enable inbox access without HTTP submission.

**Verify:** `POST /webimap/send` with valid PGP/MIME body returns **200** and message appears in recipient INBOX; plaintext body returns rejection; with WebSMTP disabled returns **404**.
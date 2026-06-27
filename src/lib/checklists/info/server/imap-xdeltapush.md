---
layout: checklist-info
---

# IMAP capability XDELTAPUSH and device token storage

Mobile clients register push tokens over IMAP when `XDELTAPUSH` is advertised:

```
SETMETADATA INBOX (/private/devicetoken "openpgp:…")
```

Store tokens per user (multiple devices allowed). On inbound local delivery, POST the raw token string to the central notification service — **no mail content** in the push request.

Hide `XDELTAPUSH` from CAPABILITY when push is disabled so clients do not attempt registration against a dead endpoint.
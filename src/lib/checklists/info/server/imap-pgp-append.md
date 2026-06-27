---
layout: checklist-info
---

# PGP-only policy enforced on IMAP APPEND

PGP enforcement applies to **all** user-submitted mail paths — not only SMTP submission. IMAP `APPEND` must run the same policy gate as SMTP `DATA` and inbound `/mxdeliv`.

Reject non-conforming messages before they enter storage. Accept the same exemptions as submission (Secure Join handshakes, certain automated bounces).

**Verify:** attempt APPEND of a plaintext message via IMAP — it must fail. APPEND of valid `multipart/encrypted` PGP/MIME must succeed.
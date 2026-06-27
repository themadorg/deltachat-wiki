---
layout: checklist-info
---

# Valid TLS on IMAP listeners

Loaded certificate material for all IMAP TLS paths ([RFC 8446](/rfcs/rfc8446.txt)):

| Listener | Mode |
|----------|------|
| Port 993 | Implicit TLS (IMAPS) |
| Port 143 | STARTTLS ([RFC 2595](/rfcs/rfc2595.txt)) |

STARTTLS on 143 needs certs even when the initial socket is cleartext.
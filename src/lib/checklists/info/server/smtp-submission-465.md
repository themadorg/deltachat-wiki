---
layout: checklist-info
---

# Submission listener on port 465 (SMTPS)

Bind and accept connections on port 465 with **implicit TLS** ([RFC 8314](/rfcs/rfc8314.txt) SMTPS):

1. TLS from the first byte
2. `AUTH` then `MAIL FROM` / `RCPT TO` / `DATA`

Do not offer AUTH on an unencrypted socket. Advertise this port in autoconfig with `socketType` `SSL` when the listener is active.

**Verify:** Delta Chat send succeeds on port 465; autoconfig lists the correct SMTPS entry.
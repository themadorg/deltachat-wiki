---
layout: checklist-info
---

# Submission listener on port 587 (STARTTLS)

Bind and accept connections on submission port 587 ([RFC 6409](/rfcs/rfc6409.txt), [RFC 3207](/rfcs/rfc3207.txt) STARTTLS):

1. Client connects on cleartext port 587
2. `STARTTLS` upgrade
3. `AUTH` then `MAIL FROM` / `RCPT TO` / `DATA`

TLS must be enforced before credentials or message data. Advertise this port in autoconfig with `socketType` `STARTTLS` when the listener is active.

**Verify:** Delta Chat send succeeds on port 587; autoconfig lists the correct submission STARTTLS entry.
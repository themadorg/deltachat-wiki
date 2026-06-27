---
layout: checklist-info
---

# IMAP listener on port 143 (STARTTLS)

Bind and accept connections on port 143 with STARTTLS upgrade ([RFC 2595](/rfcs/rfc2595.txt)):

1. Client connects on port 143
2. `STARTTLS` upgrade
3. `LOGIN` / `AUTH` and sync commands

Certificate material must be loaded for the STARTTLS upgrade even though the initial socket is cleartext. Advertise in autoconfig with `socketType` `STARTTLS` when bound.

**Verify:** Delta Chat login succeeds on port 143 with STARTTLS when autoconfig advertises it.
---
layout: checklist-info
---

# IMAP listener ports changeable via config or admin API

Operators must change IMAP ports without editing code:

| Service | Typical default |
|---------|-----------------|
| IMAP STARTTLS | 143 |
| IMAPS | 993 |

Expose `imap_port`, `imap_tls_port` (or equivalent) in config and/or admin API. Rebind listeners on change. Autoconfig and dclogin must advertise effective IMAP ports.

**Verify:** set IMAPS to a non-default port, reload, fetch autoconfig — `<incomingServer port="…">` matches.
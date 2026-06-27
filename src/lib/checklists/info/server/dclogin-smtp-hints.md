---
layout: checklist-info
---

# dclogin URLs include correct SMTP host, port, and security hints

dclogin query parameters for outgoing mail:

| Param | Meaning |
|-------|---------|
| `sh` | SMTP host |
| `sp` | SMTP port |
| `ss` | `ssl` or `starttls` |

Must match autoconfig `<outgoingServer>` entries. `/new` JSON and QR homepage must generate identical SMTP hint shapes.
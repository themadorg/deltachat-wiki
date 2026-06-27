---
layout: checklist-info
---

# dclogin URLs include correct IMAP host, port, and security hints

dclogin query parameters for incoming mail:

| Param | Meaning |
|-------|---------|
| `ih` | IMAP host |
| `ip` | IMAP port |
| `is` | `ssl` or `starttls` |

Wrong `is=ssl` vs `is=starttls` breaks automatic setup — especially on IP relays. `/new` JSON and QR homepage must generate identical IMAP hint shapes.
---
layout: checklist-info
---

# Per-domain ACCEPT/REJECT federation policy on all paths

| Mode | Inbound behaviour |
|------|-------------------|
| ACCEPT | Allow all sender domains except explicit blocklist entries |
| REJECT | Deny all except explicit allowlist entries |

Evaluate on **every** inbound SMTP `MAIL FROM`, inbound `/mxdeliv`, and outbound delivery attempt. Per-domain rules override or refine the global mode.

Policy must live in fast memory (with DB backing) — do not query disk per message at scale.
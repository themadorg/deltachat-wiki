---
layout: checklist-info
---

# Outbound delivery via SMTP fallback on port 25

When HTTP `/mxdeliv` is unreachable, fall back to SMTP on port 25 (direct or via MX lookup). Required for interoperability with non-Chatmail MTAs and as federation backup.

Apply the same federation policy and PGP rules as HTTP delivery. Endpoint overrides may route IP-only peers without public MX records.
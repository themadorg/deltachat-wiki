---
layout: checklist-info
---

# Outbound delivery via HTTPS `/mxdeliv`

Primary federation path for remote Chatmail domains:

1. `POST https://recipient-domain/mxdeliv`
2. `POST http://recipient-domain/mxdeliv` if HTTPS fails

Accept self-signed peer certificates for IP-only relays when configured. Apply federation policy and body size limits before delivery. Track per-domain success/failure stats.
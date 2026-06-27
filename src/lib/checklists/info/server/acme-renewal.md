---
layout: checklist-info
---

# TLS certificates obtainable and renewable (e.g. ACME)

Production relays automate TLS via [RFC 8555](/rfcs/rfc8555.txt) ACME (Let's Encrypt HTTP-01 is common). Plan for:

- Initial issuance (port 80 reachable during setup)
- Renewal before expiry (30 days for domain certs; ~4 days for short-lived IP certs)
- Reload listeners after cert rotation without long downtime

Operator-provided PEM files (certbot, Caddy, manual) are equally valid if renewal is documented.
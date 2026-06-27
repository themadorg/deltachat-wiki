---
layout: checklist-info
---

# DNS/endpoint overrides for routing to specific peers

Map a mail domain to a concrete IP or relay hostname — bypassing normal MX/HTTPS discovery. Required for:

- IP-only Chatmail peers (`[203.0.113.50]` domains)
- Migration cutovers
- Routing through exchanger proxies

Overrides must be checked on every outbound delivery attempt before MX lookup. Admin API should expose list/set/delete.
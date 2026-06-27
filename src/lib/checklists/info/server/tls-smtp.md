---
layout: checklist-info
---

# Valid TLS on SMTP listeners

Loaded certificate material for all SMTP TLS paths ([RFC 8446](/rfcs/rfc8446.txt)):

| Listener | Mode |
|----------|------|
| Port 587 | STARTTLS ([RFC 3207](/rfcs/rfc3207.txt)) |
| Port 465 | Implicit TLS ([RFC 8314](/rfcs/rfc8314.txt)) |
| Port 25 | STARTTLS if offered |

STARTTLS ports need certs even when the initial socket is cleartext. IP relays may use self-signed or short-lived public CA IP certificates.
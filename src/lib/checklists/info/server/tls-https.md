---
layout: checklist-info
---

# Valid TLS on HTTPS (port 443)

TLS on port 443 for WWW, `POST /mxdeliv`, admin API, and autoconfig over HTTPS ([RFC 8446](/rfcs/rfc8446.txt)). Certificate SAN must cover the relay hostname clients use for discovery.

IP relays may use self-signed or short-lived public CA IP certificates when documented for operators.
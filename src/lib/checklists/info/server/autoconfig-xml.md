---
layout: checklist-info
---

# Autoconfig served at /.well-known/autoconfig/mail/config-v1.1.xml

Mozilla ISPDB format (not an IETF RFC). `/.well-known/` prefix: [RFC 8615](/rfcs/rfc8615.txt). Delta Chat fetches this on account setup:

```http
GET /.well-known/autoconfig/mail/config-v1.1.xml
```

Must include `<incomingServer>` and `<outgoingServer>` entries for IMAP and SMTP with correct host, port, and `ssl` vs `starttls` socket types. List **both** SSL and STARTTLS entries when you bind both listener types.

Must **not** advertise fake IMAP-over-HTTPS ALPN on 443 unless you actually implement it.
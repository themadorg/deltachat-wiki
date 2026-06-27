---
layout: checklist-info
---

# SMTP EHLO hostname matches the relay's public mail identity

The name announced in `EHLO`/`HELO` should match what clients and remote MTAs expect — your mail domain or public hostname. Mismatches cause TLS certificate name checks, autoconfig hints, and reverse-DNS alignment to fail.

**Verify:** connect to port 25 or 587 with STARTTLS and read the `250` EHLO response line. Compare with your HTTPS certificate SAN and autoconfig `<hostname>` entries.

**IP relays:** bracketed IP domains (e.g. `[203.0.113.50]`) are valid Chatmail local domains; EHLO often uses the bare IP.
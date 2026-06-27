---
layout: checklist-info
---

# IMAP listener on port 993 (IMAPS)

Bind and accept connections on port 993 with implicit TLS from the first byte. Clients expect `socketType` `SSL` in autoconfig for this listener.

**Verify:** Delta Chat login and sync succeed on port 993; autoconfig `<incomingServer port="993">` matches your effective listener.
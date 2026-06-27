---
layout: checklist-info
---

# Inbound SMTP listener on port 25

Bind and accept TCP connections on port 25 ([RFC 5321](/rfcs/rfc5321.txt)). Port 25 is the SMTP fallback path when HTTP `/mxdeliv` is unreachable.

**Verify:** external host can open port 25 and receive a valid SMTP greeting (EHLO/HELO).
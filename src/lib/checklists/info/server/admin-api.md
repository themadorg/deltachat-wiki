---
layout: checklist-info
---

# Authenticated admin API for accounts, services, and settings

Single authenticated endpoint (commonly `POST /api/admin`) with JSON-RPC-style envelope. HTTP: [RFC 9110](/rfcs/rfc9110.txt); JSON: [RFC 8259](/rfcs/rfc8259.txt); Bearer auth: [RFC 6750](/rfcs/rfc6750.txt).

**Minimum resource areas:**
- Server status and overview
- Account list/delete
- Registration and JIT toggles
- Federation policy and rules
- Service toggles (TURN, push, WebIMAP, …)
- Port and settings overrides
- Queue purge and maintenance triggers

Always return HTTP 200 with real status in JSON body if following Chatmail anti-enumeration pattern. Never return passwords or private keys.
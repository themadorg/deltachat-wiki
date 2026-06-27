---
layout: checklist-info
---

# HTTP POST /new creates accounts when registration is open

HTTP registration is separate from JIT:

```
POST /new
→ { "email": "…", "password": "…", "dclogin_url": "…" }
```

Generates random localpart/password when registration is open. Response must include a ready-to-open `dclogin_url` with correct host and TLS hints.

Default Chatmail policy: registration **closed**, JIT **enabled** — `/new` returns error until operator opens registration.
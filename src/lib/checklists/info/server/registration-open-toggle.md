---
layout: checklist-info
---

# HTTP `POST /new` registration can be disabled

Control whether `POST /new` creates accounts:

| State | Effect |
|-------|--------|
| Open | `/new` accepts signups |
| Closed | `/new` rejected |

Typical production: closed `/new` with JIT enabled for invite flows. Toggle should apply at runtime without redeploying static config.
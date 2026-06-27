---
layout: checklist-info
---

# Optional registration tokens for gated signup

When token-required mode is on, `POST /new` must include a valid token (query param or JSON field per your API design). Tokens can be single-use or expire after N days.

Allows invite-only growth: operator generates tokens, distributes offline, revokes unused tokens. Pair with registration open — tokens are meaningless if `/new` is already fully open.
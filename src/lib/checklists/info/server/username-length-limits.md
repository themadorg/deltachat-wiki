---
layout: checklist-info
---

# Username length limits enforced on create

Typical Chatmail defaults (configurable):

| Limit | Typical value |
|-------|----------------|
| Min localpart length | 8 characters |
| Max localpart length | 20 characters |
| Auto-generated localpart | 8 characters |

Apply on JIT create, `/new`, and admin-created accounts. Reject out-of-range localparts before hashing — do not truncate silently.
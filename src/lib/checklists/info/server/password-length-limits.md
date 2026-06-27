---
layout: checklist-info
---

# Password length limits enforced on create

Typical Chatmail defaults (configurable):

| Limit | Typical value |
|-------|----------------|
| Min password length | 8 characters |
| Auto-generated password | 16 characters |

Apply on JIT create, `/new`, and admin-created accounts. Reject out-of-range passwords before hashing — do not truncate silently.
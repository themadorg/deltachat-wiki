---
layout: checklist-info
---

# JIT registration can be disabled

Operators may turn off just-in-time account creation so unknown localparts cannot authenticate:

| State | Effect |
|-------|--------|
| Enabled | First successful IMAP LOGIN or SMTP AUTH creates the mailbox |
| Disabled | Unknown users cannot log in or send mail |

Independent from `POST /new` open/closed. Toggle via config or admin API; changes should apply at runtime without redeploying static config.

**Verify:** disable JIT, attempt first login for a new localpart — authentication fails; existing accounts still work.
---
layout: checklist-info
---

# Multiple concurrent IMAP sessions per account work

Delta Chat may hold several IMAP connections: IDLE on INBOX, background sync, second profile on same device. Your server must handle concurrent LOGIN sessions for one account without corrupting UID state or deadlocking IDLE notify channels.

**Verify:** open two IMAP sessions as the same user — one in IDLE, one FETCHing — and deliver a message; both sessions should observe correct behaviour without auth errors or stuck IDLE.
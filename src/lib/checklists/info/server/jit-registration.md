---
layout: checklist-info
---

# Just-in-time account creation on first login

JIT is the default Chatmail onboarding model:

1. User picks a localpart + password in Delta Chat (or scans QR for server only)
2. First successful IMAP LOGIN or SMTP AUTH creates the account
3. Mailbox is provisioned lazily on first delivery or folder access

**Concurrency:** two simultaneous first logins for the same localpart must coalesce to one account — no duplicate rows or race errors.

**Toggle:** operators can disable JIT while keeping `/new` closed to freeze new accounts entirely.
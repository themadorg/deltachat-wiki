---
layout: checklist-info
---

# Storage quota enforced on mail delivery

Default quotas are often ~1 GB per mailbox (operator-configurable). Reject new mail when full at:

- Local SMTP delivery
- `/mxdeliv` local recipient delivery

Return clear SMTP or HTTP errors — do not silently drop. Works together with IMAP QUOTA for client-visible usage.
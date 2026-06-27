---
layout: checklist-info
---

# IMAP QUOTA — per-user storage limits (RFC 2087)

QUOTA ([RFC 2087](/rfcs/rfc2087.txt)) lets clients display storage usage. Implement `GETQUOTA` and `GETQUOTAROOT` on INBOX (or the quota root your design uses).

**Enforcement points:**
- SMTP/local delivery — reject or bounce when over quota
- IMAP APPEND — reject oversized additions
- Federation delivery — same quota accounting as local SMTP

Report consistent byte counts between QUOTA responses and actual disk usage.
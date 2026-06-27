---
layout: checklist-info
---

# IMAP METADATA `/shared/comment` and `/shared/admin` keys

Optional server-wide metadata ([RFC 5464](/rfcs/rfc5464.txt)):

| Key | Purpose |
|-----|---------|
| `/shared/comment` | Human-readable server description |
| `/shared/admin` | Admin contact hint |

Clients may display these in server info UI. Advertise `METADATA` in CAPABILITY.
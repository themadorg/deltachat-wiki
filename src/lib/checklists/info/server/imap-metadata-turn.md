---
layout: checklist-info
---

# IMAP METADATA `/shared/vendor/deltachat/turn` key (RFC 5464)

Expose TURN host, port, credential expiry, and HMAC password under `/shared/vendor/deltachat/turn` ([RFC 5464](/rfcs/rfc5464.txt)). Delta Chat reads this after LOGIN for WebRTC calls.

Advertise `METADATA` in CAPABILITY. Credentials must use the TURN REST time-limited pattern.
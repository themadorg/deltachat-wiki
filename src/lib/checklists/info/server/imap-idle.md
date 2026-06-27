---
layout: checklist-info
---

# IMAP IDLE notifies clients of new mail promptly

IDLE ([RFC 2177](/rfcs/rfc2177.txt)) lets a client wait on the server for `EXISTS` / `RECENT` updates instead of polling. Delta Chat keeps IDLE open on INBOX while the app is foregrounded.

**Target:** new mail visible within a few seconds of delivery.

**Implementation notes:** IDLE must not block other commands on different sessions. Waking IDLE on delivery requires a per-mailbox notify mechanism. Broken IDLE forces clients into slow polling and feels like a "stuck" chat.
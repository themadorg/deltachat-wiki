---
layout: checklist-info
---

# IMAP special-use `\Inbox` folder attribute

Advertise `\Inbox` on the primary mailbox in LIST responses ([RFC 6154](/rfcs/rfc6154.txt)). Delta Chat SELECTs INBOX for all chat sync.

**Verify:** `LIST` returns `\Inbox` on the expected folder; client sync starts without manual folder selection.
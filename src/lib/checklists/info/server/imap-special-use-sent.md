---
layout: checklist-info
---

# IMAP special-use `\Sent` folder attribute

Advertise `\Sent` on the outgoing-mail folder ([RFC 6154](/rfcs/rfc6154.txt)). Delta Chat stores copies of sent messages here.

**Verify:** `LIST` returns `\Sent`; sent messages appear in the Sent folder after submission.
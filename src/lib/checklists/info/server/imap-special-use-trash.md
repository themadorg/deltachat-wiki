---
layout: checklist-info
---

# IMAP special-use `\Trash` folder attribute

Advertise `\Trash` on the deleted-messages folder ([RFC 6154](/rfcs/rfc6154.txt)). Delta Chat moves deleted chats here.

**Verify:** `LIST` returns `\Trash`; deleted messages relocate to trash via MOVE or equivalent.
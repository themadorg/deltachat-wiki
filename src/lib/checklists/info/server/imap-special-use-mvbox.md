---
layout: checklist-info
---

# IMAP special-use mvbox (saved messages) folder attribute

Chatmail relays expose a saved-messages folder (mvbox) with a implementation-specific name and special-use hint. Delta Chat archives chats here.

**Verify:** client can save a message to mvbox; folder is discoverable via LIST and MOVE works atomically.
---
layout: checklist-info
---

# IMAP MOVE extension for mvbox and trash

MOVE ([RFC 6851](/rfcs/rfc6851.txt)) atomically relocates messages. Delta Chat uses MOVE instead of COPY+DELETE+EXPUNGE for mvbox (saved messages) and trash operations.

Without MOVE, clients fall back to slower paths or break on servers that do not support atomic move. Advertise `MOVE` in CAPABILITY when implemented.
---
layout: checklist-info
---

# IMAP4rev1 — mailbox sync

Delta Chat treats IMAP as its sync transport ([RFC 3501](/rfcs/rfc3501.txt)). Minimum command set:

| Command | Use |
|---------|-----|
| LOGIN / AUTH | Session start |
| LIST / LSUB | Folder discovery |
| SELECT / EXAMINE | Open INBOX |
| FETCH | Download messages by UID |
| STORE | Flag updates |
| APPEND | Upload outgoing copies (PGP-checked) |
| UID SEARCH / STATUS | Sync state |
| LOGOUT | Clean disconnect |

UIDs must be stable per mailbox across sessions.
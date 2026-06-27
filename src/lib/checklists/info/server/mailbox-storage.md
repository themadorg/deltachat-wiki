---
layout: checklist-info
---

# Per-user mailboxes store and retrieve messages reliably

Each account needs isolated durable storage. Maildir (`cur/new/tmp`) is the common Chatmail layout; other designs are fine if they preserve atomic delivery and UID stability.

**Requirements:**
- Crash-safe writes (fsync policy documented)
- Concurrent readers (IMAP FETCH) while delivery writes
- UID assignment monotonic per folder
- Delete/expunge actually frees quota

Mailboxes may be created lazily on first access after JIT account creation.
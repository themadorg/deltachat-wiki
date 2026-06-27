---
layout: checklist-info
---

# Submission on port 587 (STARTTLS) can be disabled

Operators may turn off the port 587 STARTTLS submission listener when only SMTPS (465) is wanted — or to avoid exposing cleartext-upgrade sockets.

**Requirements:**

1. Config or admin API toggle (or port `0` / unset) stops binding port 587 without breaking other listeners.
2. Autoconfig and dclogin omit the STARTTLS `<outgoingServer>` entry when 587 is disabled.
3. At least one submission listener (587 or 465) must stay enabled for Delta Chat send to work.

**Verify:** disable 587, reload listeners — port closed, autoconfig lists only the remaining submission path, send still succeeds on 465.
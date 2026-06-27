---
layout: checklist-info
---

# Submission on port 465 (SMTPS) can be disabled

Operators may turn off the port 465 implicit-TLS listener when only STARTTLS submission (587) is wanted.

**Requirements:**

1. Config or admin API toggle (or port `0` / unset) stops binding port 465 without breaking other listeners.
2. Autoconfig and dclogin omit the SSL `<outgoingServer>` entry when 465 is disabled.
3. At least one submission listener (587 or 465) must stay enabled for Delta Chat send to work.

**Verify:** disable 465, reload listeners — port closed, autoconfig lists only the remaining submission path, send still succeeds on 587.
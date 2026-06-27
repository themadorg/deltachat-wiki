---
layout: checklist-info
---

# Per-username blocklist prevents login and JIT create

Blocked localparts fail authentication identically to wrong passwords — no "account suspended" message that enables enumeration.

**Blocked user effects:**
- LOGIN and AUTH rejected
- JIT create skipped even if JIT is globally enabled
- Existing mail may remain on disk until operator deletes the account

Expose add/remove/list via admin API. Blocklist should load into memory at boot for hot-path performance.
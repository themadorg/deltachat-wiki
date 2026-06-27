---
layout: checklist-info
---

# Plaintext rejected with SMTP code 523 Encryption Needed

Use SMTP extended status code **523** (or equivalent permanent failure with clear text) when rejecting unencrypted user submission. Generic `550` confuses clients into retry loops.

**Verify:** submit plaintext via port 587 after AUTH — must fail with 523, message must not appear in recipient INBOX. Same rejection path for invalid PGP structure.
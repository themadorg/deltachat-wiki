---
layout: checklist-info
---

# Maximum SMTP message size limit enforced

Enforce a maximum `DATA` size on inbound SMTP and submission paths. Reject oversize messages with an appropriate SMTP error before accepting the full body.

Document the limit for operators. Delta Chat file sharing needs multi-megabyte headroom on submission.
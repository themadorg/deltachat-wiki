---
layout: checklist-info
---

# Maximum /mxdeliv HTTP body size enforced (large attachments)

Federation HTTP uses a separate body limit from SMTP — commonly **70 MB** default. Delta Chat large posts and multi-megabyte attachments exceed small default HTTP limits (2 MB) if not configured.

Return **413 Payload Too Large** when exceeded. Align your HTTP server body limit with the configured federation cap — middleware defaults often block before your handler runs.
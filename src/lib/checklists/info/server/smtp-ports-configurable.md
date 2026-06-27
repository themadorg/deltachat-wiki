---
layout: checklist-info
---

# SMTP listener ports changeable via config or admin API

Operators must change SMTP ports without editing code:

| Service | Typical default |
|---------|-----------------|
| Inbound SMTP | 25 |
| Submission STARTTLS | 587 |
| Submission SMTPS | 465 |

Expose `smtp_port`, `submission_port`, `submission_tls_port` (or equivalent) in config and/or admin API. Rebind listeners on change. Autoconfig and dclogin must advertise effective SMTP ports.
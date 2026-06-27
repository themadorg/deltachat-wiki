---
layout: checklist-info
---

# Inbound SMTP accepts federated and external mail

After connection on port 25, accept [RFC 5322](/rfcs/rfc5322.txt) mail via `MAIL FROM` / `RCPT TO` / `DATA`.

**Required checks on inbound DATA:**
1. Federation policy on sender domain
2. PGP policy (same rules as submission for user-origin mail; federation mail is already encrypted)
3. Valid local recipients (silent drop for unknown users on federation paths — no enumeration)
4. Quota before final delivery

**Verify:** send test mail with `swaks` from a remote host; reject policy-blocked senders with appropriate SMTP codes.
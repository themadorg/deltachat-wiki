---
layout: checklist-info
---

# SMTP AUTH after TLS on submission ports

Submission requires authenticated SMTP after encryption ([RFC 4954](/rfcs/rfc4954.txt); [RFC 4616](/rfcs/rfc4616.txt) PLAIN):

1. Client connects (STARTTLS upgrade on 587, or TLS immediately on 465)
2. `AUTH PLAIN` or `AUTH LOGIN` with full email address + password
3. `MAIL FROM` / `RCPT TO` / `DATA`

**JIT:** if the account does not exist and JIT is enabled, create it on first successful AUTH (same password the user chose in Delta Chat).

**Security:** do not offer AUTH on unencrypted 587 without STARTTLS. Rate-limit failed AUTH attempts. Use constant-time password comparison.
---
layout: checklist-info
---

# Only PGP/MIME encrypted user mail accepted on submission

PGP/MIME format: [RFC 3156](/rfcs/rfc3156.txt); OpenPGP: [RFC 9580](/rfcs/rfc9580.txt).

**Accepted:**
- Well-formed `multipart/encrypted` PGP/MIME (`application/pgp-encrypted` + encrypted part)
- `Secure-Join: vc-request` handshake messages
- Some `multipart/report` bounces from `mailer-daemon@`

**Rejected:**
- Plain text bodies
- Broken PGP structure
- MIME From ≠ envelope From mismatches

Check at SMTP DATA, IMAP APPEND, and inbound `/mxdeliv` before storage. This is non-negotiable for Chatmail — not configurable per user.
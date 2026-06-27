---
layout: checklist-info
---

# Maximum IMAP APPEND size limit enforced

Enforce a maximum size on IMAP `APPEND` uploads. Reject oversize additions with an IMAP error before storage.

May differ from SMTP limits; use the effective minimum across upload paths. Consider `APPENDLIMIT` ([RFC 7889](/rfcs/rfc7889.txt)) if advertising that extension.
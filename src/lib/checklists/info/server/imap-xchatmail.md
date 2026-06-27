---
layout: checklist-info
---

# IMAP capability XCHATMAIL advertised

`XCHATMAIL` in the `CAPABILITY` response signals a Chatmail-compatible server. Delta Chat enables Chatmail-specific code paths when this capability is present — different sync assumptions, METADATA usage, and encryption policy expectations.

**Verify:** after LOGIN, `CAPABILITY` includes `XCHATMAIL` alongside `IMAP4rev1`, `IDLE`, and `METADATA`. Without it, clients may treat the server as generic IMAP and misbehave.
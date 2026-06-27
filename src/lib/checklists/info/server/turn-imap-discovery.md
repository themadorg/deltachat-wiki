---
layout: checklist-info
---

# TURN credentials exposed via IMAP METADATA

After IMAP LOGIN, client reads:

```
GETMETADATA "" /shared/vendor/deltachat/turn
→ "203.0.113.50:3478:1758650868:8Dqkyyu11MVESBqjbIylmB06rv8="
```

Delta Chat core parses this into `ice_servers()` JSON for WebRTC. Credentials refresh when expiry is within ~12 hours. Hostnames in metadata should resolve to IPs for desktop clients.

Without working METADATA + TURN, calls fall back to public STUN only and often fail behind NAT.
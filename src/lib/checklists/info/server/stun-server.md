---
layout: checklist-info
---

# STUN server for reflexive address discovery

STUN ([RFC 8489](/rfcs/rfc8489.txt)) lets WebRTC clients discover reflexive addresses via UDP binding (port 3478 typical).

Firewall must allow UDP/TCP on the configured STUN port from the internet. Often co-located with TURN on the same host.
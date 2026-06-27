---
layout: checklist-info
---

# Secure Join handshake messages accepted without full encryption

Contact verification sends specially tagged messages before full PGP contact setup. The relay must recognize `Secure-Join: vc-request` (and related handshake headers) and allow them through the PGP gate.

Without this exemption, two new users cannot complete QR verification. After handshake completes, normal PGP-only rules apply to all chat messages.
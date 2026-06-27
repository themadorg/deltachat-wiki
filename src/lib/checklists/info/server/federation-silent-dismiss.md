---
layout: checklist-info
---

# Silent dismiss suppresses delivery to problematic outbound domains

Silent dismiss lets operators accept mail **to** a remote domain locally (no user-visible send failure) while **not** actually delivering remotely — useful when a peer is down but you want to avoid endless queue retries.

Distinct from federation REJECT (which blocks inbound). Managed per outbound domain via admin API or operator tooling.

**Use case:** migration, known-dead peers, testing. Document which domains are dismissed so operators do not confuse it with deliverability bugs.
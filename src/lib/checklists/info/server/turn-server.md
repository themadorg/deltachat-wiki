---
layout: checklist-info
---

# TURN server with time-limited credentials

TURN ([RFC 8656](/rfcs/rfc8656.txt)) relays media when P2P fails (UDP and TCP relay). Credentials expire via TURN REST ([draft](/rfcs/draft-uberti-behave-turn-rest-00.txt)):

```
username = <unix_expiry_timestamp>
password = base64(HMAC-SHA1(secret, username))
```

Firewall must allow UDP/TCP on the configured TURN port from the internet.
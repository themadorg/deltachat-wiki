---
layout: checklist-info
---

# Connectivity status shown (connected / updating / connecting / offline)

`ConnectivityToast` shows four states: connected, working/updating, connecting, not connected. **Try now** / **F5** calls `maybeNetwork()`. Detail log in `ConnectivityDialog`.

**Verify:** disconnect network; toast shows offline; reconnect; state returns to connected.

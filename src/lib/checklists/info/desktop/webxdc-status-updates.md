---
layout: checklist-info
---

# Webxdc summary updates live in chat

Listens for `WebxdcStatusUpdate`; refreshes `getWebxdcInfo` (500 ms debounce) so summary/name update in bubble while app runs.

**Verify:** run webxdc app; summary line in chat updates when app state changes.

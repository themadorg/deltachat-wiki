---
layout: checklist-info
---

# Runtime settings changeable without full restart

These should apply via reload or soft listener rebind:

- Port overrides
- Service enable/disable toggles
- Federation policy mode
- Registration open/closed
- Push mode
- Language

Static config (filesystem paths, initial hostname) may still need full restart. Document which settings are hot-reloadable in your design.
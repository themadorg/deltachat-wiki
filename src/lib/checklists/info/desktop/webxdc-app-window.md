---
layout: checklist-info
---

# Webxdc app opens in separate sandboxed window

`runtime.openWebxdc()` → sandboxed `BrowserWindow` (Electron/Tauri). `webxdc://` protocol serves archive. Per-account session; network blocked unless app declares `internetAccess`.

**Verify:** click Start app; separate window opens; app UI loads and runs.

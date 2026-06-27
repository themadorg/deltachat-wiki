---
layout: checklist-info
---

# HTTPS homepage with QR code for onboarding

Public `https://your-relay/` should render a page with:

- QR code encoding server invite (dcaccount/dclogin URL)
- Human-readable server name and language
- Links to privacy policy

For IP relays the QR encodes bracketed IP host hints. Page must load with valid TLS (or documented self-signed acceptance flow for testing).
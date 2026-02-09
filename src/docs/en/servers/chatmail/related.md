---
title: Community developments
description: Related projects and alternative implementations of chatmail.
category: Servers
---

# Community developments

Active development takes place in the [chatmail/relay](https://github.com/chatmail/relay) GitHub repository.

You can check out the ['chatmail' tag in the support.delta.chat forum](https://support.delta.chat/tag/chatmail) and ask to get added to a non-public support chat for debugging issues.

We know of three work-in-progress alternative implementation efforts:

- **[Mox](https://github.com/mjl-/mox)**: A Golang email server. Work is in progress to support all features and configuration settings required to operate as a chatmail relay.
- **[Madmail](https://github.com/omidz4t/madmail)**: An experimental fork of the [Maddy Mail Server](https://maddy.email/) optimized for chatmail deployments. It provides a single-binary solution.
- **[Chatmail Cookbook](https://github.com/feld/chatmail-cookbook)**: A Chef Cookbook for implementing a relay server. It supports FreeBSD and uses DNS-01 for certificate validation.

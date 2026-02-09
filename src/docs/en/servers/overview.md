---
title: Servers
description: Explore the different server options for Delta Chat — from easy-to-run relays to full-featured mail servers.
category: servers
---

<script>
  import ToolCard from '$lib/components/ToolCard.svelte';
  import ToolGrid from '$lib/components/ToolGrid.svelte';
</script>

# Delta Chat Servers

Delta Chat works with standard email servers, but we also provide specialized server software designed specifically for messaging performance, privacy, and ease of use.

## Main Server Options

<ToolGrid cols={2}>
  <ToolCard
    title="Chatmail Relay"
    description="A lightweight, ultra-fast email relay designed specifically for Delta Chat. Perfect for communities and small groups."
    icon="Zap"
    href="servers/chatmail/overview"
  />
  <ToolCard
    title="Madmail"
    description="A full-featured, zero-configuration mail server with a focus on simplicity, privacy, and performance."
    icon="Shield"
    href="servers/madmail/overview"
  />
  <ToolCard
    title="Email Providers"
    description="Delta Chat works with almost any existing email provider. Learn how to choose the right one for you."
    icon="Globe"
    href="servers/providers"
  />
</ToolGrid>

## Why a specialized server?

While Delta Chat can use any email server, specialized solutions like Chatmail and Madmail offer:

- **Instant Messaging Performance** — Optimized for small, frequent messages.
- **Privacy** — No logs, no tracking, and minimal metadata storage.
- **Easy Setup** — Get your own messaging server running in minutes.
- **Automatic Configuration** — Delta Chat clients can often configure themselves automatically with these servers.

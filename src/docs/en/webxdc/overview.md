---
title: Webxdc Apps
description: Build and share mini web apps that run inside Delta Chat — private, offline, and without tracking.
category: webxdc
---

<script>
  import ToolCard from '$lib/components/ToolCard.svelte';
  import ToolGrid from '$lib/components/ToolGrid.svelte';
</script>

# Webxdc Apps

Webxdc apps are small web applications that run directly inside Delta Chat conversations. They are shared as `.xdc` files — simple ZIP archives containing HTML, CSS, and JavaScript. No servers, no tracking, no app stores.

## Explore the Docs

<ToolGrid cols={2}>
  <ToolCard
    title="Getting Started"
    description="Create your first webxdc app in minutes. Learn the basics of building, testing, and sharing."
    icon="Rocket"
    href="webxdc/get-started"
  />
  <ToolCard
    title="API Specification"
    description="Full reference for the webxdc API — sendUpdate, setUpdateListener, sendToChat, and more."
    icon="FileCode"
    href="webxdc/specification/overview"
  />
  <ToolCard
    title="Shared State"
    description="Learn how to sync data between users with CRDTs, conflict resolution, and practical patterns."
    icon="RefreshCw"
    href="webxdc/shared-state/overview"
  />
  <ToolCard
    title="FAQ"
    description="Common questions about compatibility, debugging, packaging, storage, and TypeScript support."
    icon="HelpCircle"
    href="webxdc/faq/overview"
  />
</ToolGrid>

## What Makes Webxdc Special?

**Privacy by design** — Webxdc apps have zero network access. They cannot phone home, track users, or leak data. Everything stays inside the chat.

**Works offline** — Since there's no server dependency, apps work even without internet after they are received.

**Cross-platform** — Webxdc apps run on every Delta Chat client: Android, iOS, Windows, macOS, and Linux.

**Easy to share** — Just send a `.xdc` file in any chat. The recipient can open and use it immediately.

**Realtime collaboration** — Using `sendUpdate` and `setUpdateListener`, apps can sync state between all participants in a chat in real time.

## Examples

There is a growing collection of webxdc apps available at the [Webxdc App Store](https://webxdc.org/apps), including:

- 🎮 **Games** — Chess, Tic-tac-toe, 2048, and more
- 📊 **Polls** — Create and vote on polls within a chat
- 📝 **Editors** — Collaborative note-taking and to-do lists
- 🗺️ **Maps** — Share and view locations
- 📅 **Scheduling** — Coordinate events and availability

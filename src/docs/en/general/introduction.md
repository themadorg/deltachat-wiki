---
title: Introduction to Delta Chat
description: What is Delta Chat, how does it work, and why should you try it?
category: Getting Started
order: 1
---

<script>
  import DCFeatureCard from '$lib/components/DCFeatureCard.svelte';
  import ToolCard from '$lib/components/ToolCard.svelte';
  import ToolGrid from '$lib/components/ToolGrid.svelte';
</script>

# What is Delta Chat?

Delta Chat is a reliable, decentralized, and secure instant messaging app that looks and works like WhatsApp or Signal. You can send text messages, photos, videos, voice notes, and files. You can create groups and add emoji reactions. It feels familiar from the very first moment.

But Delta Chat is **fundamentally different** from all other messengers. Here's why:

**Delta Chat does not have its own servers.** Instead, it uses the existing email network — the largest and most open messaging system in the world. Anyone with an email address can chat with you.

<DCFeatureCard title="No Phone Number Needed" icon="Smartphone">

You don't need a phone number to use Delta Chat. Just open the app, create a profile, and start chatting. It uses secure and interoperable [chatmail relays](https://chatmail.at/relays) to get you started instantly.

</DCFeatureCard>

## How Does It Work?

When you send a message in Delta Chat, it travels through email servers. But you never see any email — the app handles everything automatically with a modern chat interface.

- If **both people** use Delta Chat, messages are **end-to-end encrypted** automatically using the OpenPGP standard.
- If the other person **doesn't use** Delta Chat, they receive your message as a normal email. Your reply appears as a chat message in your app.

This means you can reach **anyone with an email address**, even if they have never heard of Delta Chat.

## What Makes Delta Chat Special?

### Decentralized & Standardized
There is no central company controlling your messages. No single server that can be shut down. Delta Chat is built on [Internet Standards](https://github.com/chatmail/core/blob/main/standards.md#standards-used-in-delta-chat), ensuring it works across different providers and apps.

### Multi-Profile & Multi-Device
You can use the same profile on [multiple devices](https://delta.chat/en/help#multiclient), and even have [multiple profiles](https://delta.chat/en/help#multiple-accounts) on the same device (e.g., for work, family, or political activities).

### You Own Your Data
Your messages are stored on **your device**, not on a company's cloud. No corporation reads your messages, sells your data, or changes the rules on you.

### Open Source and Audited
All of Delta Chat's code is [publicly available on GitHub](https://github.com/deltachat). The app and its encryption have undergone [six independent security audits](https://delta.chat/en/help#security-audits) between 2019 and 2024 to ensure safety against network and server attacks.

### Free — in Every Way
Delta Chat is completely free. No subscriptions, no premium tiers, and no ads. Ever.

## Who Is Behind Delta Chat?

Delta Chat was started in 2017 by Bjoern Petersen from northern Germany as an Android Telegram fork, using email servers as the backend instead of centralized servers. The effort evolved into a large community effort rooted in the European FOSS hacker community. Today, contributors on all continents produce Delta Chat apps on all platforms, develop [chatmail relays](https://chatmail.at) and the [webxdc](/webxdc/overview) ecosystem. There are well over 150 community-operated email server relays, with a fraction publicly listed at [chatmail.at](https://chatmail.at).

## Ready to Try It?

Getting started takes less than two minutes:

1. **Download** Delta Chat from [delta.chat](https://delta.chat/en) — available for Android, iOS, Windows, macOS, and Linux.
2. **Open the app** and tap "Create New Profile."
3. **Enter a name or nickname** — no personal data required.
4. **Start chatting!** Add contacts by scanning QR codes or sharing invite links.

That's it. You're in.

## Explore the Guide

<ToolGrid cols={2}>
  <ToolCard
    title="Installation"
    description="Step-by-step guide to setting up Delta Chat on mobile and desktop."
    icon="Download"
    href="general/installation"
  />
  <ToolCard
    title="Features"
    description="Discover everything you can do, from groups to disappearing messages."
    icon="MessageSquare"
    href="general/features"
  />
  <ToolCard
    title="Privacy & Security"
    description="Learn how Delta Chat protects your data with end-to-end encryption."
    icon="Shield"
    href="general/privacy"
  />
  <ToolCard
    title="Webxdc Apps"
    description="Explore the world of mini-apps that run directly inside your chats."
    icon="Box"
    href="webxdc/overview"
  />
</ToolGrid>

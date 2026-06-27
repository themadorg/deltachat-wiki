---
title: Mobile Build Checklist
description: Feature checklist for Delta Chat Android and iOS clients — chat, media, groups, encryption, and device integration.
category: Building
order: 3
---

<script>
  import Checklist from '$lib/components/Checklist.svelte';
  import { loadChecklist } from '$lib/checklists/load';

  const checklist = loadChecklist('mobile');
</script>

# Mobile Build Checklist

Feature checklist for implementing or porting **Delta Chat mobile clients** (Android and iOS). One checkbox per user-visible capability: chat list, message bubbles, send/reply, image viewer, groups, encryption, webxdc, push notifications, and mobile UX.

This is not an Android Studio, Xcode, or store-publishing guide — it tracks **bare-metal messenger functionality** clients must provide on top of the shared core.

Reference: [Delta Chat features](/en/docs/general/features) · [deltachat-android](https://github.com/deltachat/deltachat-android) · [deltachat-ios](https://github.com/deltachat/deltachat-ios)

Progress is saved locally in your browser.

<Checklist {checklist} />

## How the score works

| Score | Rating |
|-------|--------|
| 0–25% | Just Starting |
| 26–50% | Getting There |
| 51–75% | Good Progress |
| 76–99% | Nearly Ready |
| 100% | Ready to Ship |
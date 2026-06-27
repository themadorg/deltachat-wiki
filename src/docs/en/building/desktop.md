---
title: Desktop Build Checklist
description: Feature checklist for the Delta Chat desktop client — chat, media, groups, and encryption.
category: Building
order: 2
---

<script>
  import Checklist from '$lib/components/Checklist.svelte';
  import { loadChecklist } from '$lib/checklists/load';

  const checklist = loadChecklist('desktop');
</script>

# Desktop Build Checklist

Feature checklist for implementing or porting a **Delta Chat desktop client** (Electron, Tauri, or browser edition). Items are aligned with the [deltachat-desktop UI docs](https://github.com/deltachat/deltachat-desktop/tree/main/docs/ui) — one checkbox per user-visible capability.

This is not a Node.js or packaging guide — it tracks **bare-metal messenger functionality** on top of the shared core.

Reference: [Delta Chat features](/en/docs/general/features) · [deltachat-desktop UI index](https://github.com/deltachat/deltachat-desktop/blob/main/docs/ui/README.md)

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
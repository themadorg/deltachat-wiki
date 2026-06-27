---
title: Core Build Checklist
description: Checklist for creating a new Delta Chat core — track your build progress step by step.
category: Building
order: 1
---

<script>
  import Checklist from '$lib/components/Checklist.svelte';
  import { loadChecklist } from '$lib/checklists/load';

  const checklist = loadChecklist('core');
</script>

# Core Build Checklist

This checklist helps you create a new Delta Chat core. Work through each section and track your build progress as your readiness score updates.

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

---
title: Relay Build Checklist
description: Language-agnostic feature checklist for implementing a Chatmail-compatible relay.
category: Building
order: 4
---

<script>
  import Checklist from '$lib/components/Checklist.svelte';
  import { loadChecklist } from '$lib/checklists/load';

  const checklist = loadChecklist('server');
</script>

# Relay Build Checklist

This checklist lists the features a Chatmail relay must provide — SMTP, IMAP, federation, registration, and Delta Chat client compatibility — regardless of programming language or codebase. Track implementation progress as your readiness score updates.

Normative protocol specs are in the [Protocol RFCs](/en/docs/building/rfcs) library (offline plain-text copies on this site).

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

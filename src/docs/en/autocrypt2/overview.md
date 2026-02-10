---
title: Autocrypt v2
description: Learn about Autocrypt v2 — the next generation of automatic email encryption with post-quantum security and reliable key deletion.
category: autocrypt2
---

<script>
  import ToolCard from '$lib/components/ToolCard.svelte';
  import ToolGrid from '$lib/components/ToolGrid.svelte';
</script>

# Autocrypt v2

Autocrypt v2 is the next version of the Autocrypt email encryption standard. It brings **post-quantum cryptography**, **automatic key rotation**, and **reliable deletion** of old encryption keys. It is designed so that any email app can use it — even apps that only support basic OpenPGP.

## What is Autocrypt?

Autocrypt is a system that makes end-to-end email encryption automatic. With Autocrypt, you do not need to understand keys, fingerprints, or key servers. Your email app handles everything for you.

- **Autocrypt v1** uses classic OpenPGP keys (RSA or Curve25519). It works well but does not protect against future quantum computers.
- **Autocrypt v2** upgrades to **post-quantum hybrid encryption** (ML-KEM-768 combined with X25519) and adds **automatic key rotation** to limit damage if a key is ever stolen.

## Why Autocrypt v2?

### Post-Quantum Security

Quantum computers may one day break today's encryption. Autocrypt v2 uses **ML-KEM-768+X25519** — a hybrid algorithm that combines a quantum-resistant algorithm (ML-KEM) with a well-tested classical algorithm (X25519). This means your messages are protected both today and in the future.

### Reliable Deletion

Old encryption keys are automatically destroyed after a set time period. This means that even if someone gets access to your device later, they cannot read old messages whose keys have already been deleted. This property is called **forward secrecy**.

### No Extra Coordination

The key rotation system is **deterministic** — all your devices can generate the same new keys independently, without needing to talk to each other. This makes it simple and reliable, even when devices are offline.

### Works With Existing OpenPGP

Autocrypt v2 certificates are standard OpenPGP v6 certificates. Any email app that supports OpenPGP v6 can already encrypt to an Autocrypt v2 key, even without knowing anything about Autocrypt v2 specifically.

## Explore the Docs

<ToolGrid cols={2}>
  <ToolCard
    title="Certificate Structure"
    description="Understand what an Autocrypt v2 certificate looks like and how its parts work together."
    icon="Key"
    href="autocrypt2/certificate-structure"
  />
  <ToolCard
    title="Key Rotation & Ratcheting"
    description="Learn how encryption keys are automatically rotated and old keys are securely destroyed."
    icon="RefreshCw"
    href="autocrypt2/key-rotation"
  />
  <ToolCard
    title="Reliable Deletion"
    description="Understand how old key material is reliably deleted to protect past messages."
    icon="Trash2"
    href="autocrypt2/reliable-deletion"
  />
  <ToolCard
    title="Security"
    description="Review the security properties, threat model, and protections of Autocrypt v2."
    icon="Shield"
    href="autocrypt2/security"
  />
  <ToolCard
    title="Comparisons"
    description="See how Autocrypt v2 compares to Signal, the Double Ratchet, and other E2E encryption systems."
    icon="GitCompare"
    href="autocrypt2/comparisons"
  />
  <ToolCard
    title="Reference Implementations"
    description="Explore the Rust and Python reference implementations for creating Autocrypt v2 certificates."
    icon="Code"
    href="autocrypt2/implementations"
  />
  <ToolCard
    title="Design Choices"
    description="Learn why specific algorithms, parameters, and structures were chosen for Autocrypt v2."
    icon="Lightbulb"
    href="autocrypt2/design-choices"
  />
</ToolGrid>

## Key Concepts at a Glance

| Concept | What It Means |
|---------|--------------|
| **Primary Key** | The main signing key (Ed25519). It signs everything else and never expires. |
| **Fallback Subkey** | A long-lived encryption key (ML-KEM-768+X25519). Used when the sender has an outdated copy of your certificate. |
| **Rotating Subkey** | A short-lived encryption key that changes regularly. Provides forward secrecy. |
| **Ratcheting** | The process of generating a new rotating subkey from the old one, then destroying the old one. |
| **Forward Secrecy** | The guarantee that past messages stay safe even if current keys are compromised. |
| **Post-Quantum** | Protection against attacks from future quantum computers. |

## Status

Autocrypt v2 is currently an **Internet-Draft** submitted to the IETF (Internet Engineering Task Force). The specification document is:

- **Title**: *Autocrypt v2 OpenPGP Certificates and Transferable Secret Keys*
- **Authors**: Daniel Kahn Gillmor (ACLU), Holger Krekel, Azul (pep.foundation)
- **Document**: `draft-autocrypt-openpgp-v2-cert-02`
- **Links**: [Editor's Copy](https://autocrypt2.codeberg.page/autocrypt-v2-cert/) · [IETF Datatracker](https://datatracker.ietf.org/doc/draft-autocrypt-openpgp-v2-cert/)

---
title: Frequently asked questions
description: Common questions about chatmail relays and their operation.
category: Servers
---

# Frequently asked questions

## What is the difference between chatmail relays and classic email servers?

A chatmail relay is a minimal Mail Transport Agent (MTA) setup that goes beyond what classic email servers offer:

- **Zero State:** No private data or metadata collected, messages are auto-deleted, low disk usage.
- **Instant/Realtime:** Sub-second message delivery, realtime P2P streaming, privacy-preserving Push Notifications for Apple, Google, and [Ubuntu Touch](https://docs.ubports.com/en/latest/appdev/guides/pushnotifications.html).
- **Security Enforcement:** Only strict TLS, DKIM, and OpenPGP with minimized metadata accepted.
- **Reliable Federation and Decentralization:** No spam or IP reputation checks; federation depends on established IETF standards and protocols.

## How about interoperability with classic email servers?

Generally, chatmail relays interoperate well with classic email servers. However, some chatmail relays may be blocked by Big-Tech email providers that use non-transparent and proprietary techniques for scanning cleartext emails, or because they use questionable IP-reputation systems.

**Chatmail relays instead use and require strong cryptography, allowing anyone to participate without having to submit to Big-Tech restrictions.**

## How are chatmail relays run? Can I run one myself?

Chatmail relays are designed to be very cheap to run and are generally self-funded. All relays are automatically deployed and updated using the [chatmail/relay repository](https://github.com/chatmail/relay). They are composed of standard components (Postfix, Dovecot) and designed to run unattended. They can run on low-end hardware like a Raspberry Pi.

## How trustable are chatmail relays?

Chatmail relays enforce end-to-end encryption, and clients like [Delta Chat](https://delta.chat) enforce it on their own. The protection includes attached media, user display names, avatars, and group names. What is visible to operators is the message date, sender, and receiver addresses.

Please see the [Delta Chat FAQ on encryption and security](https://delta.chat/en/help#e2ee) for further info.

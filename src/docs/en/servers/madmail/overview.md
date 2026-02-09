---
title: Introduction to Madmail
description: Overview of the Madmail project, a fork of Maddy optimized for Delta Chat.
category: Servers
---

# Madmail

**Madmail** is a specialized fork of the [Maddy Mail Server](https://maddy.email/), specifically optimized to serve as a high-performance, easy-to-deploy **Chatmail** server for Delta Chat.

Unlike the standard Chatmail relay (which uses a combination of Postfix, Dovecot, and Python scripts), Madmail provides a **single-binary solution** that integrates all necessary components.

## Key Features

- **Single Binary**: No need to manage separate Dovecot, Postfix, and Nginx installations.
- **Auto-Registration**: "Just-in-time" account creation during the first login.
- **Integrated TURN**: Built-in support for WebRTC calls.
- **Shadowsocks Proxy**: Integrated restricted proxy for improved connectivity.
- **No Log Policy**: Deeply integrated privacy mechanisms to minimize metadata storage.
- **PGP-Only Policy**: Optional enforcement of end-to-end encryption for all incoming/outgoing mail.

## Why Madmail?

Madmail is designed for users who want a **"batteries-included"** server that is extremely easy to install and maintain, especially on resources-limited hardware like Raspberry Pi or small VPS instances.

## Resources
- [GitHub Repository](https://github.com/themadorg/madmail)
- [Releases & Binaries](https://github.com/themadorg/madmail/releases)

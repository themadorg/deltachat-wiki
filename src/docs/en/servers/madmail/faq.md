---
title: Madmail FAQ
description: Frequently asked questions about running a Madmail server.
category: Servers
---

# Frequently Asked Questions

## What is the resource usage of Madmail?
For a small personal server, you don't need much more than **1 GiB of RAM** and minimal disk space. It is extremely lightweight and can run on a Raspberry Pi.

## How does Madmail compare to MailCow or Mail-In-The-Box?
MailCow and MIAB are bundles of many separate software components (Dovecot, Postfix, etc.) managed together. Madmail is a **single binary** implementing a subset of those features. It is much easier to deploy and has no dependency on Docker.

## Is there a Web interface for administration?
Most administration is done via the command-line interface (`maddy` command). However, Madmail includes a simple web-based onboarding and registration UI.

## Can I use a custom domain?
Yes, you can use a custom domain. During installation, simply provide your domain instead of your IP address.

## Why is my mail going to spam on GMail/Outlook?
Big-tech providers use opaque reputation systems. Ensure you have:
1. **rDNS (Reverse DNS)** correctly set for your IP.
2. **Valid DKIM/SPF/DMARC** records (Madmail handles DKIM for you).
3. A clean IP that isn't on any blacklists.

## Does Madmail support Spam filtering?
By default, Madmail is a minimal relay that focuses on sender policy enforcement (DKIM/TLS). However, you can integrate [rspamd](https://rspamd.com/) for more advanced filtering.

## Is it production-ready?
Madmail is considered "beta" but stable enough for many personal and community servers. It is actively used by hundreds of Delta Chat users worldwide.

---
title: Privacy & Security
description: How Delta Chat protects your messages, your data, and your identity.
---

<script>
  import DCFeatureCard from '$lib/components/DCFeatureCard.svelte';
  import ComparisonTable from '$lib/components/ComparisonTable.svelte';

  const messengerHeaders = ["Feature", "Delta Chat", "WhatsApp", "Telegram", "Signal"];
  const messengerRows = [
    { feature: "No phone number needed", cols: [
      { status: 'yes' }, { status: 'no' }, { status: 'no' }, { status: 'no' }
    ]},
    { feature: "Minimal metadata", cols: [
      { status: 'yes' }, { status: 'no', text: 'Extensive' }, { status: 'no', text: 'Extensive' }, { status: 'warn', text: 'Some' }
    ]},
    { feature: "No messages on company servers", cols: [
      { status: 'yes' }, { status: 'warn', text: 'Backups' }, { status: 'no' }, { status: 'yes' }
    ]},
    { feature: "Fully open source", cols: [
      { status: 'yes' }, { status: 'no' }, { status: 'warn', text: 'Partial' }, { status: 'yes' }
    ]},
    { feature: "Decentralized", cols: [
      { status: 'yes' }, { status: 'no' }, { status: 'no' }, { status: 'no' }
    ]},
    { feature: "Works without app on other side", cols: [
      { status: 'yes' }, { status: 'no' }, { status: 'no' }, { status: 'no' }
    ]},
  ];

  const e2eeHeaders = ["Feature", "Autocrypt v2", "Signal", "Matrix", "MLS"];
  const e2eeRows = [
    { feature: "Post-Quantum", cols: [
      { status: 'yes' }, { status: 'yes' }, { status: 'dev', text: 'In-dev' }, { status: 'yes' }
    ]},
    { feature: "Reliable Deletion", cols: [
      { status: 'yes' }, { status: 'yes' }, { status: 'yes', text: '+ UTD' }, { status: 'yes' }
    ]},
    { feature: "Minimal metadata", cols: [
      { status: 'yes' }, { status: 'warn', text: 'Binding' }, { status: 'warn', text: 'servers' }, { status: 'warn', text: 'Binding' }
    ]},
    { feature: "Decentralized", cols: [
      { status: 'yes' }, { status: 'no' }, { status: 'yes' }, { status: 'dev', text: 'in-dev' }
    ]},
    { feature: "Formal specification", cols: [
      { status: 'yes' }, { status: 'no' }, { status: 'yes' }, { status: 'yes' }
    ]},
    { feature: "Simple implementation", cols: [
      { status: 'yes' }, { status: 'no' }, { status: 'no' }, { status: 'no' }
    ]},
  ];
</script>

# Privacy & Security

Delta Chat is designed from the ground up to respect your privacy and protect your communication. Here's how.

## No Personal Data Required

<DCFeatureCard title="Anonymous by Default" icon="Shield">

Delta Chat does not ask for your phone number, real name, or any personal information. When you create a profile using a Chatmail server, the app generates a random username and password — with no connection to your real identity.

</DCFeatureCard>

Compare this to WhatsApp, which requires your phone number. Or to Telegram, which also requires a phone number and stores your contacts on their servers. Delta Chat requires **nothing**.

## End-to-End Encryption Standards

All messages between Delta Chat users are encrypted using the well-established **OpenPGP** standard.

- **Autocrypt** — Establishes encryption automatically between contacts and group members.
- **[Autocrypt v2](https://autocrypt2.org)** — Scheduled for full implementation in 2026, bringing post-quantum resistant encryption and forward secrecy.
- **Secure-Join** — Uses QR codes or invite links to exchange encryption setup information securely.
- **[Sharing a contact](https://github.com/chatmail/core/blob/main/spec.md#attaching-a-contact-to-a-message)** — Enables receivers to use encryption with a shared contact instantly.
- **Audited** — The app and its encryption have undergone [six independent security audits](https://delta.chat/en/help#security-audits) between 2019 and 2024.

Since the Delta Chat Version 2 release (July 2025), encryption is so central that **there are no lock icons or markers** — everything between Delta Chat users is simply encrypted by default, and if you use [chatmail relays](https://chatmail.at/relays), it is technically impossible to send or receive unencrypted messages.

## Metadata Protection

Unlike most messengers, Delta Chat does not store metadata about your contacts or groups on servers. Instead, all group metadata is end-to-end encrypted and stored only on your devices.

Servers can only see:
- Sender and receiver addresses (which are random by default).
- Message size.

Everything else — message content, **attachments (including filenames)**, contact names, and group members — is completely encrypted.

## Future-Proof Security (2026 Roadmap)

We are actively working on implementing **Autocrypt v2**, which will bring:
- **Perfect Forward Secrecy (PFS)** — Automatic key rotation to protect past messages if a key is leaked.
- **Post-Quantum Cryptography (PQC)** — Protection against future quantum computer attacks.

These features are scheduled for full implementation in 2026.

## Protection against Device Seizure

Delta Chat helps protect you even if your device is seized. By using [short-lived profiles](https://delta.chat/en/help#device-seizure) and random addresses, your identity and contacts remain hidden. You can also set a self-destruct timer for all messages on your device.

## Your IP Address

Like most internet apps, the relay server needs to know your IP address to deliver messages. IP addresses are used for connectivity only and are not persisted or exposed. For maximum privacy, we recommend using Delta Chat with a **VPN**.

## Your Messages, Your Device

Delta Chat stores encrypted messages **only on your device**. There is no cloud backup controlled by a company. 

On Chatmail servers, messages are held **only temporarily** for delivery — usually just a few hours. After delivery, they are removed from the server. This is fundamentally different from services like Telegram, where all regular messages and groups are stored on their servers permanently.

## Verified Contacts

For maximum security, Delta Chat supports **verified contacts**. When you meet someone in person and scan each other's QR codes, you create a cryptographic bond that protects your conversation against advanced attacks like man-in-the-middle interception.

Verified groups take this further — every member must be verified, creating a truly trusted communication channel.

## Decentralization = Resilience

Because Delta Chat uses the email network, there is **no single point of failure**:

- If one server goes down, only its users are affected. Everyone else keeps chatting.
- No company can shut down the entire network with one decision.
- If a government blocks one server, you can switch to another or run your own.
- Even setting up your own server is simple and costs less than €10 per month.

This makes Delta Chat extremely **resistant to censorship and outages**.

## Open Source = Trust

All Delta Chat code is open source. Security experts can **audit** the code, and there are **no hidden features** or secret data collection. You don't have to trust a company's promises — you can verify everything yourself.

## How It Compares

<ComparisonTable 
  title="Delta Chat vs Other Messengers"
  headers={messengerHeaders}
  rows={messengerRows}
/>

<ComparisonTable 
  title="Comparisons with other E2E efforts" 
  headers={e2eeHeaders}
  rows={e2eeRows} 
/>

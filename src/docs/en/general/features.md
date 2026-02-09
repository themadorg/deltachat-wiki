---
title: Features
description: Everything Delta Chat can do — messaging, groups, encryption, and more.
---

<script>
  import DCFeatureCard from '$lib/components/DCFeatureCard.svelte';
</script>

# Delta Chat Features

Delta Chat has everything you expect from a modern messenger — and some unique features that no other app offers.

## Messaging

<DCFeatureCard title="Organizing Your Chats" icon="Layers">

Keep your chat list clean and organized:
- **Pin** important chats to the top for quick access.
- **Mute** chats if you don't want notifications.
- **Archive** chats to hide them from the main list. They will pop back out when a new message arrives (unless muted).

</DCFeatureCard>

<DCFeatureCard title="Saved Messages & Notes" icon="Bookmark">

Use the **Saved Messages** chat to keep track of important info or take personal notes. You can save messages from any chat, and they will be synced across all your devices.

</DCFeatureCard>

<DCFeatureCard title="Text, Photos, Videos & Files" icon="MessageSquare">

Send photos, videos, voice notes, and documents. By default, images are optimized for performance, but you can send them as a "file" to preserve original quality.

</DCFeatureCard>

<DCFeatureCard title="Reactions, Replies & Edits" icon="Heart">

React with emojis, reply to specific messages, and even **edit your messages** after sending to fix typos.

</DCFeatureCard>

<DCFeatureCard title="Disappearing Messages" icon="Clock">

Set messages to automatically delete after a chosen time (from 5 minutes to 1 year). The timer starts when the recipient first sees the message.

</DCFeatureCard>

## Groups

- **Group chats** — Create groups with as many people as you want.
- **Verified groups** — Extra security with verified encryption. Members join by scanning a QR code, making it impossible for outsiders to sneak in.
- **Add and introduce** — Easily add contacts to existing groups or share a contact to a chat to introduce friends to each other.

## Knowing the Status

Delta Chat uses simple tick marks to show the status of your messages:
- **One tick (✓)** — Message sent successfully to the relay server.
- **Two ticks (✓✓)** — Recipient has read the message (requires both sides to have Read Receipts enabled).
- **Green dot** — Indicates a contact was recently active (within the last 10 minutes).

## Encryption

<DCFeatureCard title="End-to-End Encryption" icon="Lock">

Messages between Delta Chat users are automatically encrypted using the OpenPGP standard and [Autocrypt](https://autocrypt.org) protocol. [Autocrypt v2](https://autocrypt2.org), scheduled for 2026, will bring post-quantum resistant encryption and forward secrecy. Only you and the other person can read them.

</DCFeatureCard>

The encryption is fully automatic. You don't need to manage keys. For maximum security, you can verify contacts by scanning QR codes in person.

## Works With Anyone

This is Delta Chat's most unique feature. Because it uses the email network:
- You can **message anyone with an email address**, even if they don't have Delta Chat.
- They receive your message as a normal email, and their reply appears in your chat.

## Webxdc Apps

<DCFeatureCard title="In-Chat Apps" icon="Box">

Delta Chat supports **webxdc** — small web apps that run directly inside your chat. Play games, share polls, and collaborate on lists — all without any tracking.

</DCFeatureCard>

Webxdc apps are small files you can share in any chat. They work offline, have no tracking, and your data stays on your device. There is a growing collection of apps in the [Webxdc App Store](https://webxdc.org/apps).

## Multi-Device Support

Use Delta Chat on **multiple devices at the same time** (phone, tablet, computer). Your messages and Saved Messages sync seamlessly. Adding a new device is as easy as scanning a QR code.

## Chatmail Servers

When you create a profile with "Instant Setup," Delta Chat connects you to a **Chatmail server**. These are special servers optimized for chat:

- **Anonymous sign-up** — No personal information required.
- **Messages are not stored permanently** — They are deleted from the server as soon as they are delivered to your device (usually within hours, maximum 40 days).
- **Very fast** — Designed specifically for instant messaging.
- **Extremely efficient** — About 100,000 users can be served for roughly €500 per year in operating costs.

You can also run your own Chatmail server if you want full control.

## Video Calls

While Delta Chat does not have built-in video calling, you can easily integrate open-source tools like **Jitsi Meet**. Just add a Jitsi server URL in the settings, and you can start video calls directly from any chat.

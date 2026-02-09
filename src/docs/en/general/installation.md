---
title: Installation and Setup
description: How to install Delta Chat on your phone or computer and start chatting in minutes.
category: Getting Started
order: 2
---

<script>
  import DCFeatureCard from '$lib/components/DCFeatureCard.svelte';
  import Step from '$lib/components/Step.svelte';
  import DownloadCard from '$lib/components/DownloadCard.svelte';
  import DownloadGrid from '$lib/components/DownloadGrid.svelte';
</script>

# Installing Delta Chat

Delta Chat is available on every major platform. It is free to download from official app stores and directly from the developer's website. The desktop versions do not require Delta Chat to be installed on a phone.

## Where to Get It

<DownloadGrid>
  <DownloadCard 
    platform="Android" 
    icon="Smartphone" 
    description="Phones and Tablets"
    links={[
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=chat.delta", type: "primary" },
      { label: "Download APK", href: "https://download.delta.chat/android/deltachat-gplay-release-2.35.0.apk", type: "secondary" },
      { label: "F-Droid", href: "https://f-droid.org/en/packages/chat.delta/", type: "secondary" },
      { label: "Source Code", href: "https://github.com/deltachat/deltachat-android", type: "code" }
    ]}
  />

  <DownloadCard 
    platform="iOS / iPhone" 
    icon="Smartphone" 
    description="iPhone and iPad"
    links={[
      { label: "App Store", href: "https://apps.apple.com/app/delta-chat/id1333069216", type: "primary" },
      { label: "Source Code", href: "https://github.com/deltachat/deltachat-ios", type: "code" }
    ]}
  />

  <DownloadCard 
    platform="Windows" 
    icon="Monitor" 
    description="Desktop and Laptop"
    links={[
      { label: "Download Setup.exe", href: "https://download.delta.chat/desktop/v2.35.0/DeltaChat-2.35.0-Setup.x64.exe", type: "primary" },
      { label: "Portable Version", href: "https://download.delta.chat/desktop/v2.35.0/DeltaChat-2.35.0-Portable.x64.exe", type: "secondary" }
    ]}
    commands={["winget install 9PJTXX7HN3PK"]}
  />

  <DownloadCard 
    platform="macOS" 
    icon="Monitor" 
    description="Intel and Apple Silicon"
    links={[
      { label: "Universal .dmg", href: "https://download.delta.chat/desktop/v2.35.0/DeltaChat-2.35.0-universal.dmg", type: "primary" },
      { label: "Apple Silicon", href: "https://download.delta.chat/desktop/v2.35.0/DeltaChat-2.35.0-arm64.dmg", type: "secondary" }
    ]}
    commands={["brew install --cask deltachat"]}
  />

  <DownloadCard 
    platform="Linux" 
    icon="Monitor" 
    description="Flatpak, AppImage, DEB, RPM"
    links={[
      { label: "Download AppImage", href: "https://download.delta.chat/desktop/v2.35.0/DeltaChat-2.35.0-x86_64.AppImage", type: "primary" },
      { label: "Debian / Ubuntu", href: "https://download.delta.chat/desktop/v2.35.0/deltachat-desktop_2.35.0_amd64.deb", type: "secondary" },
      { label: "Fedora / RPM", href: "https://download.delta.chat/desktop/v2.35.0/deltachat-desktop-2.35.0.x86_64.rpm", type: "secondary" }
    ]}
    commands={["flatpak install flathub chat.delta.desktop"]}
  />
</DownloadGrid>

👉 Visit the official [Delta Chat Download Page](https://delta.chat/en/download) for all links, checksums, and technical details.

## Setting Up Your Account

There are two ways to get started with Delta Chat:

### Option 1: Instant Setup (Recommended)

This is the fastest and most private way to start. No existing email needed.

<Step number={1}>

  Open the app and tap **"Create New Profile."**

</Step>

<Step number={2}>

  Type a **name or nickname**. This is what your contacts will see.

</Step>

<Step number={3} isLast={true}>

  Tap **"Agree & Create Profile."** Done! The app automatically creates a random account on a Chatmail server.

</Step>

That's it — **no email, no phone number, no password** to remember. The app stores your credentials securely on your device.

### Option 2: Use Your Existing Email

If you already have an email address and want to use it:

<Step number={1}>

  Open the app and choose **"Use Other Server"** or **"Log In With Email."**

</Step>

<Step number={2}>

  Enter your **email address** and **password**.

</Step>

<Step number={3} isLast={true}>

  The app will detect your email server automatically. Some providers (like Gmail) require an **App Password** instead of your regular password.

</Step>

> **Tip from the developers:** *"We recommend getting a separate email address for chatting with Delta Chat, as mixing regular email with instant chat can be confusing."*

## Adding Contacts

After setup, you can connect with people in several ways:

- **Scan a QR code** — The most secure way. Meet in person and scan each other's QR codes. This exchanges encryption keys directly.
- **Share an invite link** — Send your link through any channel (another messenger, email, social media).
- **Enter an email address** — If you know someone's email, you can message them directly. They'll receive your message even if they don't use Delta Chat.

## Using Multiple Devices

Want Delta Chat on your phone AND your computer? Adding a second device is easy:

1. On your new device, choose **"Add as Second Device."**
2. On your existing device, go to **Settings → Add Second Device.**
3. **Scan the QR code** shown on screen.

Your messages and contacts will sync to the new device.

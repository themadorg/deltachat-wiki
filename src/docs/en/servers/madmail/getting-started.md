---
title: Getting Started with Madmail
description: How to deploy your own Madmail server for Delta Chat.
category: Servers
---

<script>
    import Steps from '$lib/components/Steps.svelte';
    import Step from '$lib/components/Step.svelte';
</script>

# Setting up a Madmail Server

Madmail is designed for rapid deployment, especially in restricted network environments. This guide explains how to get your server up and running quickly.

## Minimal Requirements

- A clean **Debian 12** or **Ubuntu** server.
- A public IP address (IPv4 or IPv6).
- 1GB RAM and 5-10GB of storage is usually sufficient.

## Fast Deployment (IP-Based)

Madmail supports direct IP-based deployment to bypass DNS-related issues.

<Steps>
<Step number="1" title="Automated Installation">

Run the following command on your server to install Madmail rapidly using your public IP:

```bash
wget https://github.com/themadorg/madmail/releases/latest/download/madmail && \
chmod +x madmail && \
sudo ./madmail install --simple --ip [YOUR_PUBLIC_IP] && \
sudo systemctl start maddy
```

</Step>
<Step number="2" title="Manual Binary Installation" isLast={true}>

If you have the `madmail` binary locally:

1. **Upload the binary**:
   ```bash
   scp madmail root@[YOUR_SERVER_IP]:/root/
   ```
2. **Run the installation**:
   ```bash
   ssh root@[YOUR_SERVER_IP] "chmod +x /root/madmail && ./root/madmail install --simple --ip [YOUR_SERVER_IP] && systemctl start maddy"
   ```

</Step>
</Steps>

*Replace `[YOUR_SERVER_IP]` with your actual server IP.*

## Advanced Configuration

### Managing Auto-Registration (JIT)
JIT (Just-In-Time) registration allows accounts to be created automatically when a user first logs in.

```bash
# Enable automatic account creation
sudo maddy --config /etc/maddy/maddy.conf creds jit enable

# Disable automatic account creation
sudo maddy --config /etc/maddy/maddy.conf creds jit disable

# Check status
sudo maddy --config /etc/maddy/maddy.conf creds jit status
```

### Required Ports
Ensure the following ports are open in your firewall:
- **80 / 443**: Web registration and onboarding UI.
- **25**: SMTP (Federation with other servers).
- **465 / 587**: SMTP Submission (Sending messages).
- **143 / 993**: IMAP (Receiving messages).
- **3340**: Iroh Relay (Required for Webxdc real-time features).

## Updating Madmail
The built-in `update` command automatically verifies digital signatures:

```bash
sudo maddy update https://github.com/themadorg/madmail/releases/latest/download/madmail
```

## Community Support
For the latest binaries and tips:
👉 [Madmail Telegram Channel](https://t.me/the_madmail)

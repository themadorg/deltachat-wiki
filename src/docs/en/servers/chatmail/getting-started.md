---
title: Setting up a chatmail relay
description: Everything needed to setup a ready-to-use chatmail relay.
category: Servers
---

<script>
    import Steps from '$lib/components/Steps.svelte';
    import Step from '$lib/components/Step.svelte';
</script>

# Setting up a chatmail relay

This section contains everything needed to setup a ready-to-use chatmail relay.
The automated setup is designed and optimized for providing chatmail addresses for immediate permission-free onboarding through chat apps and bots.
Chatmail addresses are automatically created at first login, after which the initially specified password is required for sending and receiving messages through them.

## Minimal requirements and prerequisites

You will need the following:

- **Control over a domain** through a DNS provider of your choice.
- A **Debian 12 deployment server** with reachable SMTP/SUBMISSIONS/IMAPS/HTTPS ports. IPv6 is encouraged if available. Chatmail relay servers only require 1GB RAM, one CPU, and perhaps 10GB storage for a few thousand active chatmail addresses.
- A **Linux or Unix build machine** with key-based SSH access to the root user of the deployment server. You must add a passphrase-protected private key to your local ssh-agent because you can’t type in your passphrase during deployment. (An ed25519 private key is required due to an [upstream bug in paramiko](https://github.com/paramiko/paramiko/issues/2191))

## Setup with scripts/cmdeploy

We use `chat.example.org` as the chatmail domain in the following steps. Please substitute it with your own domain.

<Steps>
<Step number="1" title="Setup the initial DNS records">

Setup the initial DNS records for your deployment server. The following is an example in the familiar BIND zone file format with a TTL of 1 hour (3600 seconds). Please substitute your domain and IP addresses.

```text
chat.example.org. 3600 IN A 198.51.100.5
chat.example.org. 3600 IN AAAA 2001:db8::5
www.chat.example.org. 3600 IN CNAME chat.example.org.
mta-sts.chat.example.org. 3600 IN CNAME chat.example.org.
```

</Step>
<Step number="2" title="Clone the repository">

Clone the repository and bootstrap the Python virtualenv on your local PC:

```sh
git clone https://github.com/chatmail/relay
cd relay
scripts/initenv.sh
```

</Step>
<Step number="3" title="Create a configuration file">

Create a chatmail configuration file `chatmail.ini` on your local build machine:

```sh
scripts/cmdeploy init chat.example.org  # <-- use your domain
```

</Step>
<Step number="4" title="Verify SSH root login">

Verify SSH root login to the deployment server works:

```sh
ssh root@chat.example.org  # <-- use your domain
```

</Step>
<Step number="5" title="Setup and configure" isLast={true}>

Setup and configure the remote deployment server:

```sh
scripts/cmdeploy run
```

This script will also check that you have all necessary DNS records. If DNS records are missing, it will recommend which you should configure at your DNS provider.

</Step>
</Steps>

## Other helpful commands

To check the status of your deployment server:
```sh
scripts/cmdeploy status
```

To display and check all recommended DNS records:
```sh
scripts/cmdeploy dns
```

To test whether your chatmail service is working correctly:
```sh
scripts/cmdeploy test
```

To measure the performance of your chatmail service:
```sh
scripts/cmdeploy bench
```

## Modifying the home page

`cmdeploy run` also creates default static web pages and deploys them to an Nginx web server:
- `index.html`: default home page with a QR code for easy onboarding.
- `info.html`: linked from the home page.
- `policy.html`: privacy policy page.

All `.html` files are generated from the corresponding markdown `.md` files in the `www/src` directory.

## Refining the web pages

```sh
scripts/cmdeploy webdev
```
This starts a local live development cycle for chatmail web pages, allowing you to preview changes in real-time.

## Custom web pages

You can skip uploading a web page by setting `www_folder=disabled` in `chatmail.ini`.
To use a custom directory for your web pages, set `www_folder` to that directory. `cmdeploy run` will upload it as the server’s home page.

## Disable automatic address creation

If you need to stop address creation, login via SSH to the deployment machine and run:
```sh
touch /etc/chatmail-nocreate
```

## Migrating to a new build machine

To move or add a build machine, clone the repository on the new machine and copy the `chatmail.ini` file from the old one. Make sure `rsync` is installed, then:

```sh
./scripts/initenv.sh
./scripts/cmdeploy dns
./scripts/cmdeploy status
```

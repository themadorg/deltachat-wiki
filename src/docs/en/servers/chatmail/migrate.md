---
title: Migrating to a new machine
description: Step-by-step approach to safely migrate a chatmail relay.
category: Servers
---

<script>
    import Steps from '$lib/components/Steps.svelte';
    import Step from '$lib/components/Step.svelte';
</script>

# Migrating to a new machine

This migration tutorial provides a step-wise approach to safely migrate a chatmail relay from one remote machine to another.

## Preliminary notes and assumptions

- If the migration is a planned move, it's recommended to lower the Time To Live (TTL) of your DNS records to a value such as 300 (5 minutes), at best much earlier than the actual planned migration. This speeds up propagation of DNS changes in the Internet after the migration is complete.
- The migration steps were tested with a Linux laptop; you might need to adjust some of the steps to your local environment.
- Your `mail_domain` is `mail.example.org`.
- All remote machines run Debian 12.
- The old site’s IP version 4 address is `$OLD_IP4`.
- The new site’s IP addresses are `$NEW_IP4` and `$NEW_IPV6`.

## The six steps to migrate

Note that during some of the following steps you might get a warning about changed SSH Host keys; in this case, just run `ssh-keygen -R "mail.example.org"` as recommended.

<Steps>
<Step number="1" title="Initially transfer mailboxes">

Login to old site, forwarding your ssh-agent with `ssh -A` to allow using ssh to directly copy files from old to new site.

```sh
ssh -A root@$OLD_IP4
tar c /home/vmail/mail | ssh root@$NEW_IP4 "tar x -C /"
```

</Step>
<Step number="2" title="Pre-configure the new site">

Pre-configure the new site but keep it inactive until step 6:

```sh
CMDEPLOY_STAGES=install,configure scripts/cmdeploy run --ssh-host $NEW_IP4
```

</Step>
<Step number="3" title="Disable mail services on old site">

Disable mail services on the old site. Users will not be able to send or receive messages until all steps are completed. Other relays and mail servers will retry delivering messages from time to time, so nothing is lost for users.

```sh
scripts/cmdeploy run --disable-mail --ssh-host $OLD_IP4
```

</Step>
<Step number="4" title="Final synchronization">

Final synchronization of TLS/DKIM secrets, mail queues and mailboxes. Again we use ssh-agent forwarding (`-A`) to allow transferring all important data directly from the old to the new site.

```sh
ssh -A root@$OLD_IP4
tar c /var/lib/acme /etc/dkimkeys /var/spool/postfix | ssh root@$NEW_IP4 "tar x -C /"
rsync -azH /home/vmail/mail root@$NEW_IP4:/home/vmail/
```

Login to the new site and ensure file ownerships are correctly set:

```sh
ssh root@$NEW_IP4
chown root: -R /var/lib/acme
chown opendkim: -R /etc/dkimkeys
chown vmail: -R /home/vmail/mail
```

</Step>
<Step number="5" title="Update DNS entries">

Update the DNS entries to point to the new site. You only need to change the `A` and `AAAA` records, for example:

```text
mail.example.org.    IN A    $NEW_IP4
mail.example.org.    IN AAAA $NEW_IP6
```

</Step>
<Step number="6" title="Activate relay on new site" isLast={true}>

Activate chatmail relay on new site:

```sh
CMDEPLOY_STAGES=activate scripts/cmdeploy run --ssh-host $NEW_IP4
```

</Step>
</Steps>

Voilà! Users will be able to use the relay as soon as the DNS changes have propagated.

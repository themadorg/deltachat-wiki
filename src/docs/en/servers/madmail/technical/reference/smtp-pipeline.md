---
title: SMTP Pipeline
category: Reference
---

# SMTP message routing (pipeline)

A message pipeline is a set of module references and associated rules that describe how to handle messages.

The pipeline is responsible for:

- Running message filters (called "checks"), (e.g. DKIM signature verification, DNSBL lookup, etc.).
- Running message modifiers (e.g. DKIM signature creation).
- Associating each message recipient with one or more delivery targets.

A delivery target is a module that does the final processing (delivery) of the message.

## Message Handling Flow

1. Execute checks referenced in top-level `check` blocks (if any).
2. Execute modifiers referenced in top-level `modify` blocks (if any).
3. If there are `source` blocks – select one that matches the message sender (as specified in `MAIL FROM`). If there are no `source` blocks – the entire configuration is assumed to be the `default_source` block.
4. Execute checks referenced in `check` blocks inside the selected `source` block (if any).
5. Execute modifiers referenced in `modify` blocks inside the selected `source` block (if any).

**Then, for each recipient:**

1. Select the `destination` block that matches it. If there are no `destination` blocks – the entire used `source` block is interpreted as if it was a `default_destination` block.
2. Execute checks referenced in the `check` block inside the selected `destination` block (if any).
3. Execute modifiers referenced in `modify` block inside the selected `destination` block (if any).
4. If the used block contains the `reject` directive – reject the recipient with the specified SMTP status code.
5. If the used block contains the `deliver_to` directive – pass the message to the specified target module. Only recipients that are handled by the used block are visible to the target.

Each recipient is handled only by a single `destination` block; in case of overlapping `destination` rules – the first one takes priority.

```
destination example.org {
    deliver_to targetA
}
destination example.org { # ambiguous and thus not allowed
    deliver_to targetB
}
```

Same goes for `source` blocks, each message is handled only by a single block.

Each recipient block should contain at least one `deliver_to` directive or `reject` directive. If `destination` blocks are used, then `default_destination` block should also be used to specify behavior for unmatched recipients. Same goes for source blocks: `default_source` should be used if `source` is used.

The pipeline configuration should explicitly specify behavior for each possible sender/recipient combination.

Directives that specify final handling decisions (`deliver_to`, `reject`) cannot be used at the same level as `source`/`destination` rules.

## Directives

### `check { ... }`
**Context:** pipeline configuration, source block, destination block

List of the module references for checks that should be executed on messages handled by the block where `check` is placed.

Message body checks placed in destination blocks are currently ignored. Due to the way the SMTP protocol is defined, they would cause the message to be rejected for all recipients, which is usually not desired in these configurations.

```
check {
    # Reference implicitly defined default configuration for check.
    spf

    # Inline definition of custom config.
    spf {
         permerr_action reject
    }
}
```

### `modify { ... }`
**Context:** pipeline configuration, source block, destination block

List of the module references for modifiers that should be executed on messages handled by the block where `modify` is placed.

Modifiers process the message and its metadata before final delivery. For example, a modifier can replace recipient addresses or add a DKIM signature.

**Note:** Modifiers affecting the source address can be used only globally or on per-source basis; they are no-op inside destination blocks.

```
modifiers local_modifiers {
    replace_rcpt file /etc/maddy/aliases
}

# ... somewhere else ...
{
    modify &local_modifiers
}
```

### `reject [code] [enhanced-code] [description]`
**Context:** destination block

Rejects the message with the specified SMTP error. If arguments are omitted, the default is "message is rejected due to policy reasons."

```
reject 541 5.4.0 "We don't like example.org, go away"
```

### `deliver_to [target]`
**Context:** pipeline configuration, source block, destination block

Delivers the message to the referenced delivery target. Inside a `destination` block, only matching recipients are passed.

### `source_in [table] { ... }`
**Context:** pipeline configuration

Handles messages with envelope senders present in the specified table. Takes precedence over `source` directives.

### `source [rules...] { ... }`
**Context:** pipeline configuration

Handles messages matching sender address rules. Rules can be a domain or a complete address. Matching is case-insensitive.

```
source example.org {
    deliver_to &local_mailboxes
}
default_source {
    reject 521 5.0.0 "Forbidden"
}
```

### `reroute { ... }`
**Context:** pipeline, source, destination

Allows routing decisions based on the result of modifiers (e.g., after alias expansion).

```
destination example.org {
    modify {
        replace_rcpt file /etc/maddy/aliases
    }
    reroute {
        destination example.org {
            deliver_to &local_mailboxes
        }
        default_destination {
            deliver_to &remote_queue
        }
    }
}
```

### `destination_in [table] { ... }`
**Context:** pipeline, source

Handles envelope recipients present in a table. Takes precedence over `destination` rules.

### `destination [rules...] { ... }`
**Context:** pipeline, source

Handles recipients matching rules (domain or full address).

## Reusable Snippets (`msgpipeline`)

The message pipeline can be used independently of the SMTP module via the `msgpipeline` module.

```
msgpipeline local_routing {
    destination whatever.com {
        deliver_to dummy
    }
}

# ... somewhere else ...
deliver_to &local_routing
```

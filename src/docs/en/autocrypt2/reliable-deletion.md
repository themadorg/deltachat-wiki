---
title: Reliable Deletion
description: How Autocrypt v2 ensures old encryption keys are reliably destroyed, providing forward secrecy.
category: autocrypt2
order: 4
---

# Reliable Deletion

Reliable deletion is the process of making sure that old encryption keys are truly destroyed and cannot be recovered. This is how Autocrypt v2 provides **forward secrecy** — the guarantee that past messages stay protected even if your device is compromised later.

## Why Reliable Deletion Matters

Imagine someone steals your phone today. Without reliable deletion, the thief could:

1. Extract all your encryption keys from the device.
2. Read not only your current messages, but also **every message you've ever received** — even months or years of conversation history.

With reliable deletion:

1. Old encryption keys were already destroyed.
2. The thief can only read messages encrypted to the **current** rotating subkey.
3. All older messages are permanently unreadable.

## How It Works

### The Deletion Schedule

Autocrypt v2 follows a simple time-based deletion schedule:

1. **New rotating subkey is created** at regular intervals (every ~30 days by default).
2. **Old rotating subkey expires** after `max_rd` (~60 days by default).
3. **Old rotating subkey's secret material is destroyed** on all devices.

```
Time →

[ K0 active ][ K0 expired but kept briefly ][ K0 secret DESTROYED ]
              [ K1 active ][ K1 expired but kept briefly ][ K1 secret DESTROYED ]
                            [ K2 active ]...
```

### What Gets Destroyed

When a key is "destroyed," the following secret material is deleted:

- The **32-byte X25519 secret key** of the rotating subkey.
- The **64-byte ML-KEM-768 seed** of the rotating subkey.
- Any **derived key material** stored in memory.

The **public** parts of old rotating subkeys can remain on the certificate. They are harmless without the secret material — nobody can decrypt anything with only the public key.

### What Stays

These parts are **never destroyed**:

| Key | Why It's Kept |
|-----|--------------|
| **Primary key (Ed25519)** | Needed to sign new rotating subkeys and certify the certificate. Without it, the certificate cannot evolve. |
| **Fallback subkey (ML-KEM-768+X25519)** | Needed as a last resort for encryption when no valid rotating subkey is available. |
| **Current rotating subkey** | Needed to decrypt messages arriving right now and to derive the next rotating subkey. |

## Reliable Deletion Across Multiple Devices

One of the challenges of reliable deletion is that a user may have **multiple devices** (phone, laptop, tablet). All devices need to destroy old keys at the same time.

### How It Works with UMAs

In Autocrypt v2, each device is called a **UMA** (User-Managed Agent). All UMAs for the same user share the same certificate and key material.

Because the ratchet is **deterministic** (see [Key Rotation](/autocrypt2/key-rotation)):

1. All UMAs can independently calculate when to ratchet.
2. All UMAs generate the **exact same** new rotating subkey.
3. All UMAs can destroy the old rotating subkey's secret material at the same time.

No communication between devices is needed for this coordination. Each device just needs:
- The current rotating subkey's secret material.
- An accurate clock.

### Clock Requirements

All devices need a roughly accurate clock. The specification recommends that if a device's clock is more than `min_rd/2` (about 15 days) off from reality, the ratcheting might not work correctly.

In practice, most modern devices keep their clocks synchronized automatically via NTP (Network Time Protocol), so this is rarely a problem.

## The Fallback Subkey and Deletion

The **fallback subkey** is intentionally **never deleted**. This creates a trade-off:

- **Advantage**: Messages can always be decrypted, even if the sender used an old certificate without a valid rotating subkey.
- **Disadvantage**: If someone gets the fallback subkey's secret material, they can decrypt any message that was encrypted to it.

However, the fallback subkey should be used **rarely** in practice:

- Well-behaved senders always prefer the rotating subkey.
- The fallback is only used when the sender has a very outdated certificate or when their software does not properly select the rotating subkey.

### Hardware-Backed Key Storage

For extra security, the specification suggests storing the primary key and fallback subkey on a **hardware security device** (like a YubiKey or a Trusted Platform Module). This makes them resistant to software-based key extraction.

Since the rotating subkeys are derived from the previous rotating subkey (not from the primary key or fallback key), a thief who captures the primary key or fallback key **cannot** ratchet forward or backward. The ratchet chain is independent.

## Time-Based vs. Message-Based Deletion

There are two main approaches to scheduling key deletion:

### Time-Based (Autocrypt v2)

- Keys are rotated at fixed time intervals (~30-60 days).
- Simple to implement.
- Works even when devices are offline.
- Does not require counting messages.
- Provides forward secrecy at the granularity of the rotation period.

### Message-Based (Double Ratchet / Signal)

- Keys are rotated with every message (or nearly every message).
- Provides finer-grained forward secrecy.
- Requires active network coordination between sender and receiver.
- More complex to implement.
- Does not work well with offline or asynchronous messaging patterns (like email).

Autocrypt v2 chose time-based deletion because email is inherently **asynchronous** and messages can be delayed, queued, or stored on servers for extended periods. A message-based approach would require real-time coordination that is not practical with email.

## Threat Model

Reliable deletion protects against these threats:

| Threat | Protection Level |
|--------|-----------------|
| **Device theft (after key rotation)** | ✅ Old messages protected — old keys are destroyed |
| **Device theft (before key rotation)** | ⚠️ Current rotation period's messages are exposed |
| **Server compromise** | ✅ All end-to-end encrypted messages are protected (server never has secret keys) |
| **Future quantum computer** | ✅ ML-KEM-768 provides post-quantum security |
| **Legal compulsion to hand over keys** | ✅ Old keys genuinely do not exist — they cannot be handed over |

## Best Practices for Implementations

If you are building software that supports Autocrypt v2, here are guidelines for reliable deletion:

1. **Use secure memory clearing**: When destroying key material, overwrite the memory with zeros or random data before freeing it. Do not just "delete" the pointer.
2. **Delete from all storage layers**: Keys may be cached in RAM, written to disk, or stored in a database. Make sure all copies are destroyed.
3. **Consider filesystem journaling**: Some filesystems (like ext4) keep journal copies of written data. Use secure deletion techniques appropriate for your storage medium.
4. **Hardware security modules**: Where possible, generate and store long-term keys (primary and fallback) in hardware security modules that resist physical extraction.
5. **Audit key storage**: Regularly verify that old key material is not inadvertently retained in backups, logs, or debug dumps.

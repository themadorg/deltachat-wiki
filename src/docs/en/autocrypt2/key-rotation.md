---
title: Key Rotation & Ratcheting
description: Learn how Autocrypt v2 automatically rotates encryption keys using a deterministic ratchet, providing forward secrecy.
category: autocrypt2
order: 3
---

# Key Rotation & Ratcheting

One of the most important features of Autocrypt v2 is **automatic key rotation**. Encryption keys are regularly replaced with new ones, and old keys are destroyed. This is the mechanism that enables **[reliable deletion](/autocrypt2/reliable-deletion)** — when a user deletes a message and the corresponding old key is destroyed, even an attacker who recorded the encrypted message in transit can never recover it.

## What is Key Rotation?

Key rotation means regularly creating a new encryption key and stopping the use of the old one. Think of it like changing the lock on your door periodically — even if someone copied your old key, it would not work anymore.

In Autocrypt v2:

1. A new **rotating subkey** is created at regular intervals.
2. The old rotating subkey **expires** and is eventually **destroyed**.
3. The process is **automatic** — users do not need to do anything.

## Rotation Timing

Key rotation is controlled by two time periods:

| Parameter | Name | Default | Meaning |
|-----------|------|---------|---------|
| **max_rd** | Maximum Rotation Duration | ~60 days (5,242,880 seconds) | How long a rotating subkey is valid for. |
| **min_rd** | Minimum Rotation Duration | Half of max_rd (~30 days) | How soon a new key is created before the old one expires. |

The overlap between `min_rd` and `max_rd` ensures there is always a valid key available:

```
      .          .
      +----K0----+
      '     .    '     .
            +----K1----+
            '     .    '     .
                  +----K2----+
                  '     .    '     .
                        +----K3----+
                        '     .    '
                              +--- ...

Time  +-------------------------------------------->
```

In this diagram:
- Each key (`K0`, `K1`, `K2`, ...) is valid for the duration `max_rd`.
- A new key is created after `min_rd` (halfway through the old key's lifetime).
- There is always an **overlap period** where both the old and new keys are valid.

### Why Overlap?

The overlap is important because:

- **Senders may have an old copy** of your certificate. During the overlap, both the old and new rotating subkeys work.
- **Network delays** mean updated certificates take time to spread.
- **No messages are lost** — a message encrypted to either key can still be decrypted.

## The AC2_Ratchet Function

The core of key rotation is the **AC2_Ratchet** function. It takes the current rotating subkey and creates the next one in a **deterministic** way.

### What "Deterministic" Means

"Deterministic" means that given the same input, the function always produces the same output. This is critical because:

- **Multiple devices** can all generate the same next key independently, without communicating with each other.
- The only thing each device needs is the current rotating subkey's secret material.
- No coordination, no internet connection, no shared seed is required.

### How AC2_Ratchet Works

Here is the process step by step:

```
+------------------------+---------------------------+--------+
| "Autocrypt_v2_ratchet" | public primary key packet | max_rd |
+-+----------------------+---------------------------+--------+
  |
  | +-------+-------------------------------------+
  | | start | prior rotating public subkey packet |
  | +--+----+-------------------------------------+
  |    |
  |    | +---------------------------------------+
  |    | | prior rotating subkey secret material |
  |    | +-----------+---------------------------+
  |    |             |
  |    |             | normalize X25519 scalar
  |    |             |
  |    |      +------+-----+
  |    |      |    IKM     |
  +----+------+-----+------+
  |    |             |
  |    info          | HKDF-SHA512
  |            salt  |
  |                  |
  |            +-----+-----+
  |            |  ks (160)  |
  |            +--+------+--+
  |               |      |
  |        +------+  +---+-------+
  |        |ks 0:64| |ks 64:160  |
  |        +--+----+ +-----+-----+
  |           |             |
  |      SHA512         normalize
  |           |         X25519
  |     +-----+---+        |
  |     |first 32 |  +-----+------+
  |     | bytes   |  | new secret |
  |     +----+----+  +-----+------+
  |          |              |
  |       bssalt       make secret subkey
  |          |              |
  |          |        +-----+------+
  |          |        | new subkey |
  |          +--------+-----+------+
  |                         |
  |                   bind subkey
  |                         |
  |                +--------+----------+
  |                | new signed subkey |
  |                +-------------------+
```

### Step-by-Step Explanation

1. **Extract the secret material (IKM)**: Take the 96 bytes of secret key material from the current rotating subkey. This consists of:
   - 32 bytes: X25519 secret key
   - 64 bytes: ML-KEM-768 seed

2. **Normalize the X25519 scalar**: Apply the standard X25519 clamping rules from RFC 7748:
   - Clear the three least-significant bits of the first byte.
   - Clear the most-significant bit of the 32nd byte.
   - Set the second-most-significant bit of the 32nd byte.

3. **Prepare the HKDF inputs**:
   - **Salt** = `start timestamp (4 bytes, big-endian)` + `public subkey packet of the current rotating key`
   - **Info** = `"Autocrypt_v2_ratchet"` + `public primary key packet` + `max_rd (4 bytes, big-endian)`
   - **IKM** = the normalized secret material from step 2.

4. **Run HKDF-SHA512**: Expand the IKM to 160 bytes of output (`ks`).

5. **Split the output**:
   - `ks[0:64]` → used to generate the **binding signature salt** (`bssalt = SHA512(ks[0:64])[0:32]`).
   - `ks[64:160]` → the **new secret key material** (96 bytes), which is then normalized (X25519 clamped).

6. **Create the new subkey**: Use `ks[64:160]` to create a new ML-KEM-768+X25519 secret subkey.

7. **Bind the subkey**: Create a binding signature using the primary key and the deterministic salt (`bssalt`), linking the new subkey to the certificate.

### Why HKDF-SHA512?

**HKDF** (HMAC-Based Key Derivation Function) is a standard way to derive new keys from existing key material. SHA-512 is used as the underlying hash function because:

- It provides 256-bit security (more than enough for post-quantum protection).
- It is well-standardized and widely implemented.
- It produces enough output for the 160 bytes needed.

## When to Ratchet

A device (called a UMA — User-Managed Agent) should create a new rotating subkey when:

1. The current time (`now`) is past `base_start + max_rd - min_rd`, where `base_start` is the creation time of the current rotating subkey.
2. In simpler terms: ratchet when the current key has been active for at least half its lifetime.

### The Ratcheting Algorithm

Here is the ratcheting procedure in pseudocode:

```
function add_rotating_subkeys(tsk, R, now):
    // tsk = the full secret key (transferable secret key)
    // R = max_rd (rotation duration)
    // now = current time

    loop:
        base = most recent rotating subkey from tsk
        base_start = creation time of base

        if now < base_start:
            abort (clock is wrong)

        next_start = base_start + R - (R / 2)
        // next_start = base_start + half of max_rd

        if now < next_start:
            done (no need to ratchet yet)

        // Time to ratchet!
        (new_subkey, binding_sig) = AC2_Ratchet(
            primary_key, base, R, next_start
        )

        add new_subkey + binding_sig to tsk
        destroy secret material of base
```

## Multiple Ratchets

If a device has been offline for a long time, it may need to ratchet **multiple times** to catch up. The algorithm handles this by looping:

1. Ratchet from `K0` → `K1`.
2. Destroy `K0`'s secret material.
3. Check if another ratchet is needed.
4. Ratchet from `K1` → `K2`.
5. Continue until caught up with the current time.

This is safe because each ratchet step is deterministic — the device will produce exactly the same keys that it would have produced if it had been online the entire time.

## Distributing Updated Certificates

After ratcheting, the device needs to share the updated certificate (with the new rotating subkey) with its contacts:

1. Create a **public certificate** from the updated TSK (removing all secret material).
2. Distribute the public certificate the same way the original was shared (e.g., via Autocrypt email headers or other key distribution methods).
3. Peers will see the new rotating subkey and start encrypting to it.

## Key Destruction Schedule

After ratcheting:

| Event | When | What Happens |
|-------|------|-------------|
| New key created | At `next_start` | New rotating subkey is generated and added to the certificate. |
| Old key expires | At `base_start + max_rd` | Old rotating subkey's binding signature expires. Peers stop encrypting to it. |
| Old key destroyed | Shortly after expiration | All devices delete the old secret key material from storage. |

The gap between "old key expires" and "old key destroyed" allows for a small grace period to decrypt any late-arriving messages encrypted to the old key.

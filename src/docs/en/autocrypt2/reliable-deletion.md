---
title: Reliable Deletion
description: How Autocrypt v2 enables truly permanent deletion of messages, even against attackers who recorded all encrypted traffic.
category: autocrypt2
order: 4
---

# Reliable Deletion

Reliable deletion is the ability to **permanently delete a message** so that no attacker can ever recover it — not even an attacker who recorded the encrypted message as it passed through the network and later compromises your device and secret keys.

This is the security property commonly called **forward secrecy**, but the Autocrypt v2 specification deliberately uses the term "reliable deletion" to emphasize that the goal is about **messages**, not just keys.

## The Threat: A Recording Attacker

To understand why reliable deletion matters, consider this attacker:

1. **An attacker records all encrypted email traffic** passing through a server (or any network point). They cannot read the messages now, but they store them.
2. **Months or years later**, the attacker compromises your device — stealing both your secret key material and your message archive.
3. **Without reliable deletion**, the attacker can now go back and decrypt every message they recorded, including messages you thought you deleted long ago.

With reliable deletion:

1. You **delete a message** on your device (removing the cleartext from your archive).
2. The scheduled [key rotation](/autocrypt2/key-rotation) **destroys the old encryption key** that was used to decrypt that message.
3. Now the attacker has only the encrypted copy they recorded — but the key to decrypt it **no longer exists anywhere**. The message is truly gone.

## Both Parts Are Required

Reliable deletion is not just about destroying keys. It requires **two things**:

| What Must Be Destroyed | Why |
|------------------------|-----|
| **The message cleartext** (from your archive) | If the attacker compromises your device, they must not find a readable copy of the message. |
| **The decryption key** (the rotating subkey's secret material) | If the attacker recorded the encrypted message in transit, they must not be able to decrypt their copy later. |

Only when **both** the cleartext and the corresponding key are destroyed is the message truly unrecoverable.

> The IETF specification uses the term "reliable deletion" instead of "forward secrecy" to emphasize this: **the cleartext is the targeted asset**, not just the key. Destroying a key without deleting the message (or deleting a message without destroying the key) does not achieve the goal.

## How Key Rotation Enables Reliable Deletion

The [key rotation](/autocrypt2/key-rotation) mechanism is what makes reliable deletion possible:

1. **Encryption keys rotate regularly** (~every 10 days by default). Each rotating subkey is only valid for a limited window (`max_rd`).
2. **Old key material is destroyed** after the rotation window (plus a grace period for late-arriving messages).
3. **Any message encrypted to a destroyed key** can never be decrypted again — not by you, not by the attacker, not by anyone.

This means that once you delete a message and the corresponding key rotation cycle completes, the message is permanently unrecoverable:

```
Time →

     Message received,        Message deleted       Key destroyed
     decrypted, archived      from archive          (rotation cycle)
           |                       |                       |
           v                       v                       v
   [ You can read it ]   [ Cleartext gone ]   [ Even recorded copy
                                                 is now unrecoverable ]
```

## How to Handle Messages for Reliable Deletion

When your app receives an encrypted message, it needs to process it in a way that allows reliable deletion later. The specification describes three approaches:

### 1. Archiving Cleartext

The simplest approach: your app decrypts the message and stores only the cleartext, discarding the original encrypted form entirely.

- **To read later**: Just read the stored cleartext.
- **To delete**: Delete the cleartext file. Once the key is destroyed, the recorded encrypted copy is useless.
- **Assumption**: The attacker does not normally have access to your message archive. (If they did, they could just read the cleartext directly.)

### 2. Stashing Session Keys

Your app keeps the original encrypted message but stores the OpenPGP session key separately (in a secure look-aside table).

- **To read later**: Decrypt using the stashed session key, even after the asymmetric key is destroyed.
- **To delete**: Delete the stashed session key. Without it or the rotating subkey, the encrypted message is unreadable.
- **Advantage**: Works even when the attacker has regular access to the message archive (e.g., an IMAP server), because the archive only contains encrypted messages. The session keys are stored separately in a more secure location.

### 3. Re-Encrypting

Your app re-encrypts the message to a separate long-term archival key that you control.

- **To read later**: Decrypt using the archival key.
- **To delete**: Delete the re-encrypted copy. The original encrypted copy (recorded by the attacker) is still encrypted to the destroyed rotating subkey and remains unreadable.
- **Assumption**: The attacker does not normally have access to the archive. Otherwise, they could record the re-encrypted message and later decrypt it if they compromise the archival key.

### Comparison

| Strategy | Keeps original encrypted message? | Needs secure storage beyond archive? | Deletable if attacker can access archive? |
|----------|----------------------------------|-------------------------------------|----------------------------------------|
| **Archive cleartext** | No | No | No |
| **Stash session keys** | Yes | Yes (for session keys) | Yes |
| **Re-encrypt** | No | No | No |

## The Window of Recoverability

There is always a period of time during which a message **cannot** yet be reliably deleted. This is called the **window of recoverability**:

- A message that is **still in transit** (not yet delivered) cannot be reliably deleted — the sender might have already handed it to the network.
- A message encrypted to a **still-active rotating subkey** cannot be reliably deleted yet — the key still exists.
- In a **group conversation**, deletion is only as reliable as the slowest, most disconnected member of the group.

The default Autocrypt v2 parameters create a window of recoverability of at most about **20 days** (`max_rd` of 10 days + `max_latency` grace period of 10 days). After that window, a deleted message is truly unrecoverable.

## Reliable Deletion Across Multiple Devices

When you have multiple devices (phone, laptop, tablet), reliable deletion requires all devices to destroy old key material at the same time.

Because the ratchet is **deterministic** (see [Key Rotation](/autocrypt2/key-rotation)):

1. All devices (UMAs) independently calculate when to ratchet.
2. All devices generate the **exact same** new rotating subkey.
3. All devices destroy the old rotating subkey's secret material at the same time.

No communication between devices is needed. Each device just needs:
- The current rotating subkey's secret material.
- An accurate clock.

## The Fallback Subkey Limitation

Messages encrypted to the **fallback subkey** can **never** be reliably deleted. The fallback subkey is intentionally never destroyed (it is the safety net for when senders have outdated certificates), so an attacker who recorded such a message could always decrypt it later.

This is why well-behaved senders always prefer the rotating subkey: it is the only path to reliable deletion. The fallback is only used when no valid rotating subkey is available.

For maximum security, store the fallback key's secret material on a **hardware security device** (like a YubiKey) that resists physical extraction.

## Threat Model Summary

| Threat | Protection |
|--------|-----------|
| **Server records encrypted messages, later compromises device** | ✅ Deleted messages are unrecoverable — both cleartext and key are destroyed |
| **Attacker compromises device during active rotation period** | ⚠️ Messages from the current rotation period may be exposed |
| **Attacker records message encrypted to fallback subkey** | ⚠️ No reliable deletion — fallback key is never destroyed |
| **Legal compulsion to hand over old keys** | ✅ Old rotating keys genuinely do not exist — they were destroyed on schedule |
| **Future quantum computer + recorded messages** | ✅ ML-KEM-768 provides post-quantum security for the encrypted copies |

## Best Practices for Implementations

1. **Delete cleartext when the user deletes a message**: Do not just hide it — actually remove it from storage, indexes, caches, and any search databases.
2. **Use secure memory clearing**: When destroying key material, overwrite the memory with zeros or random data before freeing it.
3. **Delete from all storage layers**: Keys and cleartext may be cached in RAM, written to disk, or stored in a database. All copies must be destroyed.
4. **Consider filesystem journaling**: Some filesystems (like ext4) keep journal copies of written data. Use secure deletion techniques appropriate for your storage medium.
5. **Hardware security modules**: Where possible, generate and store long-term keys (primary and fallback) in hardware security modules that resist physical extraction.
6. **Audit for unintended retention**: Regularly verify that old key material and deleted message cleartext are not retained in backups, logs, debug dumps, or search indexes.

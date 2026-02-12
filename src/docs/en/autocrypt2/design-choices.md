---
title: Design Choices
description: Why specific algorithms, parameters, and structures were chosen for Autocrypt v2.
category: autocrypt2
order: 8
---

# Design Choices

This page explains the reasoning behind the key design decisions in Autocrypt v2. Understanding these choices helps you see why the specification is the way it is.

## Why No User IDs?

Traditional OpenPGP certificates include User IDs (name and email address). Autocrypt v2 intentionally removes them.

**Reasons:**
- **Privacy**: User IDs leak personal information. When a certificate is distributed, the User ID is visible to anyone who sees it.
- **Simplicity**: User IDs create complexity around identity certification (the "Web of Trust"). Autocrypt does not use the Web of Trust.
- **Identification by fingerprint**: The certificate is uniquely identified by its fingerprint. The email app maps fingerprints to contacts internally.

The binding between a certificate and an email address happens at the application layer (e.g., through the Autocrypt email header), not inside the certificate itself.

## Why Time-Based Rotation Instead of Message-Based?

Systems like Signal's Double Ratchet rotate keys on every message. Autocrypt v2 uses time-based rotation (~5 day intervals). Why?

**Email is asynchronous**: Messages can be delayed, queued on servers, or delivered out of order. A message-based ratchet would require strict ordering and real-time coordination that is not possible with email.

**Multi-device support**: With time-based rotation, all devices only need an accurate clock to stay synchronized. With message-based rotation, devices would need to agree on message counts, which requires coordination.

**Simplicity**: Time-based rotation only depends on the current clock and the current key material. No message counters, no session state, no handshakes.

## Why ML-KEM-768 Instead of ML-KEM-1024?

ML-KEM comes in three security levels:

| Variant | Security Level | Public Key Size | Ciphertext Size |
|---------|---------------|----------------|----------------|
| ML-KEM-512 | Level 1 (~128 bits) | 800 bytes | 768 bytes |
| ML-KEM-768 | Level 3 (~192 bits) | 1,184 bytes | 1,088 bytes |
| ML-KEM-1024 | Level 5 (~256 bits) | 1,568 bytes | 1,568 bytes |

Autocrypt v2 uses **ML-KEM-768** as a balance between security and size:

- **ML-KEM-512** is considered too close to the minimum security margin for a system meant to last decades.
- **ML-KEM-1024** would make certificates significantly larger (~400 bytes more per subkey), which matters for email headers.
- **ML-KEM-768** provides ample security (Level 3) while keeping certificates around 3 KB.

## Why Hybrid Encryption (ML-KEM + X25519)?

Using only ML-KEM would be risky because it is relatively new. Using only X25519 would not protect against quantum computers. The hybrid approach combines both:

- If ML-KEM is broken, X25519 still protects messages.
- If X25519 is broken by quantum computers, ML-KEM still protects.
- Both would need to be broken simultaneously to compromise a message.

This is the conservative, **belt-and-suspenders** approach recommended by most cryptographers for the transition to post-quantum cryptography.

## Why Ed25519 for the Primary Key?

The primary key uses Ed25519 (a signing algorithm) because:

- **Small keys**: Ed25519 keys are only 32 bytes.
- **Fast verification**: Signature verification is very fast.
- **Wide support**: Ed25519 is supported by virtually all modern cryptographic libraries.
- **Not encryption**: The primary key only signs and certifies. It does not encrypt. Quantum computers threaten encryption more than signing in the short term.

> **Note**: The reference implementations may use **Ed448** (which provides higher security margins), but the specification defines Ed25519 as the standard algorithm for wider compatibility.

## Why Seed-Free Ratcheting?

The ratchet in Autocrypt v2 uses only the **current rotating subkey's secret material** as input. It does not use any additional "seed" or "shared secret."

**Why not add a seed?**

- **Coordination problem**: A seed would need to be shared between all devices. How would you transmit it securely? If it is stored alongside the TSK, legacy tools might accidentally leak it.
- **Hardware security**: By not depending on the primary key or fallback key for ratcheting, those long-term keys can live on hardware security devices (like YubiKeys) that never expose their secret material.
- **Simplicity**: The ratchet is fully self-contained. It only needs the current rotating subkey to produce the next one.

## Why Is the Fallback Subkey Never Destroyed?

The fallback subkey is intentionally kept forever, even though this limits forward secrecy for messages encrypted to it.

**Reasons:**
- **Robustness**: If a sender has a very old certificate, they can still encrypt to the fallback key.
- **Recovery**: If something goes wrong with the ratchet chain, the fallback key provides a safety net.
- **Rare usage**: In practice, well-behaved senders always prefer the rotating subkey. The fallback is only used when no valid rotating subkey is available.

For maximum security, store the fallback key's secret material on a **hardware security device** that resists physical extraction.

## Why Overlapping Key Validity?

When a new rotating subkey is created, the old one remains valid for a period (the overlap between `min_rd` and `max_rd`). This means there is always at least one valid rotating subkey, and often two.

**Benefits:**
- Senders with slightly outdated certificates can still encrypt successfully.
- Network delays in distributing updated certificates do not cause failures.
- No messages are lost during key transitions.

**Trade-off:** The overlap period slightly reduces forward secrecy, because the old key material is retained for longer. The default 50% overlap (5 days of overlap in a 10-day rotation) is a practical compromise.

## Why SEIPDv2 (AEAD)?

Autocrypt v2 requires **SEIPDv2** (Symmetrically Encrypted Integrity Protected Data version 2), which uses AEAD (Authenticated Encryption with Associated Data).

**Advantages over SEIPDv1:**
- AEAD provides both confidentiality and integrity in a single operation.
- No vulnerability to the type of attacks that affected older MDC-based encryption.
- Better performance due to hardware acceleration (AES-NI).
- Cleaner security proofs.

The specific AEAD algorithm is **AES-256 with OCB mode**, which is fast and has a strong theoretical foundation.

## Why No Explicit "Autocrypt v2" Marker?

An Autocrypt v2 certificate does not contain any explicit label saying "I am Autocrypt v2." Instead, it is identified by its structure:

- Ed25519 primary key.
- ML-KEM-768+X25519 subkeys.
- No User IDs.
- Specific key flag patterns.

**Reason:** The goal is interoperability. Any OpenPGP v6 implementation can encrypt to an Autocrypt v2 certificate without knowing anything about Autocrypt v2. An explicit marker would create unnecessary complexity and reduce interoperability with standard OpenPGP tools.

## Default Parameters

| Parameter | Value | Reasoning |
|-----------|-------|-----------|
| **max_rd** | 864,000 seconds (~10 days) | Long enough for delayed email delivery, short enough for meaningful forward secrecy |
| **min_rd** | max_rd / 2 = 432,000 seconds (~5 days) | 50% overlap provides robust key transition |
| **HKDF output** | 160 bytes | 64 bytes for signature salt derivation + 96 bytes for new key material |
| **Signature hash** | SHA-512 | Widely supported, provides 256-bit security |
| **Key derivation** | HKDF-SHA512 | Standard (RFC 5869), sufficient output length |

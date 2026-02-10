---
title: Certificate Structure
description: Understand the structure of an Autocrypt v2 OpenPGP certificate — its keys, subkeys, and signatures.
category: autocrypt2
order: 2
---

# Certificate Structure

An Autocrypt v2 certificate is a standard **OpenPGP v6 certificate**. It is made of six packets (data blocks) that work together. This page explains each part and how they connect.

## Overview

Here is the basic structure of an Autocrypt v2 certificate:

```
.------------------------------------------------------.
| A. Primary Key (Ed25519)                              |
+-------------------------------------------------------+
|    B. Direct key sig (cert+sign, no expire)           |
| C. Fallback Subkey (ML-KEM-768+X25519)                |
|    D. Subkey binding sig (encrypt, no expire)         |
| E. Rotating Subkey (ML-KEM-768+X25519)                |
|    F. Subkey binding sig (encrypt, expires in max_rd) |
 '------------------------------------------------------'
```

Let's look at each packet in detail.

## A. Primary Key (Ed25519)

The **primary key** is the identity key of the certificate. It uses the **Ed25519** signature algorithm.

- **Purpose**: Signs and certifies all other parts of the certificate.
- **Type**: OpenPGP v6 Public Key Packet.
- **Algorithm**: Ed25519 (a fast, well-tested elliptic curve signing algorithm).
- **Expiration**: **None** — the primary key does not expire.
- **Key Flags**: Certify + Sign.

The primary key is the anchor of trust. When someone trusts your certificate, they are trusting this key. All subkeys and signatures are bound to it.

> **Why Ed25519?** Ed25519 provides small keys (only 32 bytes) and fast signatures. It is widely supported and has been extensively analyzed by the cryptographic community.

## B. Direct Key Signature

The **direct key signature** is a self-signature on the primary key. It declares what the key can do and what algorithms it supports.

- **Type**: Signature Type `0x1f` (Direct Key Signature).
- **Hash Algorithm**: SHA-512.
- **Key Flags**: Certify + Sign (the primary key can sign and certify).
- **Features**: Announces support for **SEIPDv2** (Symmetrically Encrypted Integrity Protected Data version 2) — the modern OpenPGP encryption format.
- **Preferred AEAD**: AES-256 with OCB mode.
- **Expiration**: **None**.

### What is SEIPDv2?

SEIPDv2 is the modern way OpenPGP encrypts messages. It uses **AEAD (Authenticated Encryption with Associated Data)**, which provides both confidentiality and integrity in one step. This is more secure than the older MDC (Modification Detection Code) approach used in earlier OpenPGP versions.

## C. Fallback Subkey (ML-KEM-768+X25519)

The **fallback subkey** is a long-lived encryption key. It exists as a safety net.

- **Purpose**: Encryption when the sender has an old copy of your certificate (without the latest rotating subkey).
- **Algorithm**: **ML-KEM-768+X25519** (post-quantum hybrid encryption).
- **Expiration**: **None** — the fallback subkey does not expire.
- **Key Flags**: Encrypt Communications + Encrypt Storage.

### When is the Fallback Subkey Used?

The fallback subkey is only used when a sender cannot find a valid (non-expired) rotating subkey on your certificate. This can happen if:

- The sender has a very old copy of your certificate.
- The sender's software does not support key rotation.
- The network failed to deliver an updated certificate.

Because the fallback subkey never expires, messages can always be encrypted to your certificate, even in these situations.

### What is ML-KEM-768+X25519?

This is a **hybrid encryption** algorithm that combines two different systems:

| Component | Type | Purpose |
|-----------|------|---------|
| **X25519** | Classical (Elliptic Curve Diffie-Hellman) | Proven, fast, well-tested encryption. Secure against classical computers. |
| **ML-KEM-768** | Post-Quantum (Module Lattice Key Encapsulation) | Secure against both classical and quantum computers. Based on the NIST-standardized FIPS 203 algorithm. |

By combining both, Autocrypt v2 is secure even if one of the two algorithms turns out to have a weakness. This is the **belt-and-suspenders** approach to cryptography.

## D. Fallback Subkey Binding Signature

This signature **binds** the fallback subkey to the primary key. It proves that the primary key owner created and approved this subkey.

- **Type**: Subkey Binding Signature (type `0x18`).
- **Key Flags**: Encrypt Communications + Encrypt Storage.
- **Expiration**: **None**.
- **Issuer**: The primary key.

## E. Rotating Subkey (ML-KEM-768+X25519)

The **rotating subkey** is the main encryption key that people should use when sending you messages. It changes regularly through a process called **ratcheting**.

- **Purpose**: Short-term encryption. Provides forward secrecy.
- **Algorithm**: **ML-KEM-768+X25519** (same as the fallback).
- **Expiration**: Set to **max_rd** (the maximum rotation duration, default: about 60 days).
- **Key Flags**: Encrypt Communications only (not Encrypt Storage).

### Why Only "Encrypt Communications"?

The rotating subkey is marked as "Encrypt Communications" only, **not** "Encrypt Storage." This is intentional:

- **Encrypt Communications** = use this key for messages being sent right now.
- **Encrypt Storage** = use this key for data stored for later.

Since the rotating subkey will be destroyed after a period of time, it should not be used for long-term storage. Only the fallback subkey has the "Encrypt Storage" flag.

### How Senders Choose Which Key to Use

When someone wants to encrypt a message to you, their email app looks at your certificate and picks the best encryption subkey:

1. **First choice**: the most recent non-expired **rotating subkey** (Encrypt Communications).
2. **Fallback**: the **fallback subkey** (if no valid rotating subkey is found).

This happens automatically — the sender does not need to know about key rotation.

## F. Rotating Subkey Binding Signature

This signature binds the rotating subkey to the primary key and sets an expiration time.

- **Type**: Subkey Binding Signature (type `0x18`).
- **Key Flags**: Encrypt Communications only.
- **Expiration**: **max_rd** (the rotation duration).
- **Issuer**: The primary key.

## Certificate Timeline

Here is how the certificate evolves over time:

```
                Time
    max_rd       |
      |       .- +--+--------------------------------------.
      |      |   |  | primary key + fallback subkey created |
      |      |   |  | first rotating subkey created         |
       '-----+   |  | cert generated                        |
             |   |  | cert distribution begins              |
             |   |  +--------------------------------------'
             |   |
  min_rd    .--- +--+-------------------------------------------.
             |   |  | time to ratchet:                           |
              '--+  |   generate next rotating subkey            |
             |   |  |   apply next rotating subkey to cert       |
             |   |  |   distribute updated cert to peers         |
             |   |  +-------------------------------------------'
             |   |
             '-- +--+-------------------------------------------.
                 |  | previous rotating subkey expires           |
                 |  | (peers should stop encrypting to it)      |
                 |  +-------------------------------------------'
                 |
                 +--+-------------------------------------------.
                 |  | SECRET key of previous rotating subkey is  |
                 |  | destroyed by all UMAs                      |
                 |  +-------------------------------------------'
                 v
```

This schedule means there is always a valid rotating subkey available. Old subkeys expire before new ones take over, creating a smooth, overlapping transition.

## No User IDs

Unlike many traditional OpenPGP certificates, Autocrypt v2 certificates have **no User IDs** (no name, no email address). This is intentional:

- **Privacy**: Keeping the certificate free of personal information reduces information leakage.
- **Simplicity**: User IDs create complexity around identity certification (the "Web of Trust" model), which Autocrypt does not use.
- **Identification**: The certificate is identified by its **fingerprint** (a hash of the primary key), not by a name or email address.

## Certificate Size

An Autocrypt v2 public certificate is approximately **3,164 bytes** (about 3 KB). This is small enough to include in email headers, which is how Autocrypt distributes certificates.

| Part | Approximate Size |
|------|-----------------|
| Primary key packet | ~69 bytes |
| Direct key signature | ~221 bytes |
| Fallback subkey + signature | ~1,437 bytes |
| Rotating subkey + signature | ~1,437 bytes |
| **Total** | **~3,164 bytes** |

Most of the size comes from the ML-KEM-768 public keys, which are larger than classical keys. This is the trade-off for post-quantum security.

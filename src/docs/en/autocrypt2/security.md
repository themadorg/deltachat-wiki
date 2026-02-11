---
title: Security
description: Security properties, threat model, and protections provided by Autocrypt v2 certificates.
category: autocrypt2
order: 5
---

# Security

This page explains the security properties of Autocrypt v2, what it protects against, and what its limitations are.

## Security Goals

Autocrypt v2 is designed to achieve the following security goals:

### 1. End-to-End Encryption

All messages are encrypted from the sender to the receiver. No one in between (not the email server, not the internet provider, not even the Autocrypt developers) can read the message content.

### 2. Post-Quantum Security

Autocrypt v2 uses **ML-KEM-768+X25519** for encryption. This hybrid approach ensures:

- **Today**: X25519 provides classical security that has been widely tested and deployed.
- **Tomorrow**: ML-KEM-768 provides security against quantum computers.
- **Belt-and-suspenders**: Even if one algorithm is broken, the other still protects your messages.

### 3. Reliable Deletion (Forward Secrecy)

When a user deletes a message, it should become truly unrecoverable — even against an attacker who recorded the encrypted copy as it passed through the network and later compromises the user's device. Through scheduled [key rotation](/autocrypt2/key-rotation), old encryption keys are automatically destroyed, making the recorded encrypted copies permanently unreadable. See [Reliable Deletion](/autocrypt2/reliable-deletion) for details.

### 4. No Identity Binding

Autocrypt v2 certificates contain **no User IDs** — no names, no email addresses, no personal information. This minimizes information leakage from the certificate itself.

### 5. Minimal Coordination

The system is designed to work with **email**, which is asynchronous and decentralized. All cryptographic operations (including key rotation) can happen independently on each device without real-time communication.

## Threat Model

### What Autocrypt v2 Protects Against

| Threat | Protection |
|--------|-----------|
| **Passive eavesdropping** | ✅ Messages are end-to-end encrypted. Network observers see only encrypted data. |
| **Server compromise** | ✅ The email server never has access to secret keys. It can only see encrypted message envelopes. |
| **Future quantum attacks** | ✅ ML-KEM-768 is designed to be secure against quantum computers (NIST FIPS 203). |
| **Key theft (past messages)** | ✅ Reliable deletion through key rotation. Old keys are destroyed; deleted messages whose keys have been rotated away are unrecoverable. |
| **Metadata minimization** | ✅ No User IDs in the certificate reduce identity exposure. |

### What Autocrypt v2 Does NOT Protect Against

| Threat | Limitation |
|--------|-----------|
| **Active man-in-the-middle (MITM)** | ⚠️ Autocrypt v2 itself does not provide MITM protection. This must be handled by a separate verification step (e.g., comparing fingerprints out-of-band). Delta Chat uses the **SecureJoin** protocol for this. |
| **Device compromise (current period)** | ⚠️ If an attacker has access to your device right now, they can read messages encrypted to the current rotating subkey. Forward secrecy only protects *past* messages. |
| **Metadata analysis** | ⚠️ Email headers (sender, recipient, subject, timestamp) are not encrypted by OpenPGP. Network observers can see who communicates with whom. |
| **Malicious software on your device** | ⚠️ If your device has malware, it can read messages after they are decrypted. This is beyond the scope of any encryption protocol. |

## Cryptographic Algorithms

Here is the complete list of cryptographic algorithms used in Autocrypt v2:

| Purpose | Algorithm | Standard |
|---------|-----------|----------|
| **Primary key (signing)** | Ed25519 | RFC 8032 |
| **Encryption subkeys** | ML-KEM-768+X25519 | NIST FIPS 203 + RFC 7748 |
| **Key derivation (ratchet)** | HKDF-SHA512 | RFC 5869 |
| **Message encryption** | AES-256-OCB (SEIPDv2) | RFC 9580 |
| **Hash (signatures)** | SHA-512 | FIPS 180-4 |
| **Hash (ratchet)** | SHA-512 | FIPS 180-4 |

### Why These Algorithms?

- **Ed25519** is used instead of Ed448 for the *specification* to keep certificates smaller. The reference implementation uses Ed448, but the specification supports both. Ed25519 provides 128-bit security against classical attacks, which is widely considered sufficient.
- **ML-KEM-768** provides NIST Security Level 3 (roughly 192-bit classical equivalent). ML-KEM-1024 was considered but would make certificates significantly larger.
- **X25519** is the most widely deployed elliptic curve Diffie-Hellman function. It is fast, constant-time, and well-analyzed.
- **AES-256-OCB** is an efficient AEAD mode that provides both confidentiality and integrity. OCB is particularly fast and has a clean security proof.
- **HKDF-SHA512** is the standard key derivation function from RFC 5869, used here because it is well-established and provides enough output length.

## Key Material Security

### X25519 Scalar Normalization

When the ratchet derives new X25519 key material, it applies **scalar clamping** as specified in RFC 7748 Section 5:

1. Clear the three least-significant bits of the first byte (ensures the scalar is a multiple of 8).
2. Clear the most-significant bit of byte 32 (ensures the scalar is less than 2^255).
3. Set the second-most-significant bit of byte 32 (ensures the scalar has a fixed high bit).

This normalization ensures that the derived X25519 keys are valid and secure, avoiding weak keys or timing side-channels.

### ML-KEM-768 Seed Handling

The ML-KEM-768 component uses a 64-byte seed. This seed is used to deterministically generate the full ML-KEM key pair. The seed is treated as sensitive secret material and must be destroyed along with the rest of the rotating subkey's secret material during key rotation.

## Deterministic Signatures

Autocrypt v2 uses **deterministic binding signatures** for rotating subkeys. This means:

- The signature salt (randomness) is derived from the ratchet output, not from a random number generator.
- Given the same input, the same signature is always produced.
- This allows all devices to generate identical certificates independently.

The binding signature salt is computed as:

```
bssalt = SHA512(ks[0:64])[0:32]
```

where `ks[0:64]` is the first 64 bytes of the HKDF output. This provides 256 bits of entropy, which is more than sufficient for signature salt.

## Secure Transfer of Secret Keys

When setting up a new device, the user needs to transfer the **Transferable Secret Key (TSK)** to the new device. The TSK includes:

- The primary key's secret material.
- The fallback subkey's secret material.
- The current rotating subkey's secret material.

This transfer should be done securely:

- **Over a direct, authenticated channel** (e.g., scanning a QR code in person).
- **Encrypted** (if transmitted over a network).
- **Not through email** (email servers would have access to the unencrypted TSK).

Delta Chat uses the **Autocrypt Setup Message** and **SecureJoin** protocol for secure key transfer between devices.

## Security of the Ratchet Chain

The ratchet provides **one-way security**:

- **Forward**: Given the current key, you can derive all future keys (this is by design, so any device can ratchet forward).
- **Backward**: Given a ratcheted key, you **cannot** recover previous keys. The HKDF function is one-way.

This means:

- If an attacker captures your device at time T, they can potentially derive future rotating subkeys (if they also have the primary key to sign new bindings). However, they **cannot** recover any rotating subkeys from before time T.
- To mitigate the forward-derivation risk, a compromised device should trigger a **key reset** — generating a completely new primary key and starting a fresh ratchet chain.

## Comparison of Security Levels

| System | Post-Quantum | Forward Secrecy | Offline Capable | No Coordination |
|--------|-------------|----------------|----------------|----------------|
| **Autocrypt v2** | ✅ ML-KEM-768 | ✅ ~30-60 day rotation | ✅ Yes | ✅ Yes |
| **Signal (Double Ratchet)** | ❌ X25519 only | ✅ Per-message | ❌ Requires online first message | ❌ Requires coordination |
| **PGP (traditional)** | ❌ RSA/ECDH | ❌ No rotation | ✅ Yes | ✅ Yes |
| **Autocrypt v1** | ❌ RSA/Curve25519 | ❌ No rotation | ✅ Yes | ✅ Yes |

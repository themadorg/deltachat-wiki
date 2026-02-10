---
title: Comparisons
description: How Autocrypt v2 compares to other end-to-end encryption systems like Signal, PGP, and Autocrypt v1.
category: autocrypt2
order: 6
---

# Comparisons

This page compares Autocrypt v2 with other end-to-end encryption systems.

## Quick Comparison Table

| Feature | Autocrypt v2 | Signal | Traditional PGP | Autocrypt v1 |
|---------|-------------|--------|-----------------|-------------|
| **Post-Quantum** | ✅ ML-KEM-768+X25519 | ❌ X25519 only | ❌ RSA/ECDH | ❌ RSA/Curve25519 |
| **Forward Secrecy** | ✅ ~30-60 days | ✅ Per-message | ❌ None | ❌ None |
| **Works Offline** | ✅ Fully | ⚠️ Needs initial setup | ✅ Fully | ✅ Fully |
| **Multi-Device** | ✅ No coordination | ⚠️ Requires sync | ✅ Manual | ✅ Manual |
| **Key Rotation** | ✅ Automatic | ✅ Per-message | ❌ Manual | ❌ Manual |
| **User IDs** | ❌ None (privacy) | ❌ Phone number | ✅ Name + Email | ✅ Name + Email |
| **Standard** | OpenPGP v6 | Custom protocol | OpenPGP (RFC 9580) | OpenPGP (RFC 4880) |

## Autocrypt v2 vs. Signal

Signal's Double Ratchet is the gold standard for real-time chat encryption. Autocrypt v2 is designed for email.

**Forward Secrecy**: Signal ratchets on every message. Autocrypt v2 ratchets every ~30 days. Signal provides finer-grained protection but requires real-time interaction.

**Network**: Signal needs both parties online for the first message (X3DH). Autocrypt v2 works fully offline — essential for email where messages can be delayed for days.

**Multi-Device**: Signal requires synchronizing session state across devices. Autocrypt v2 uses a deterministic ratchet, so all devices independently compute the same keys — no sync needed.

**Compatibility**: Autocrypt v2 uses standard OpenPGP. Any app supporting OpenPGP v6 can encrypt to an Autocrypt v2 certificate without special code.

| Scenario | Better Choice |
|----------|--------------|
| Real-time chat | Signal |
| Email encryption | Autocrypt v2 |
| Multi-device without coordination | Autocrypt v2 |
| Maximum forward secrecy | Signal |
| Post-quantum protection | Autocrypt v2 |

## Autocrypt v2 vs. Traditional PGP

**Key Rotation**: Traditional PGP users must manually generate and distribute new keys. Most never do. Autocrypt v2 rotates keys automatically every ~30 days.

**Forward Secrecy**: Traditional PGP has none. If your key is compromised, all past messages are exposed. Autocrypt v2 destroys old keys.

**Post-Quantum**: Traditional PGP uses RSA or ECDH, both vulnerable to quantum computers. Autocrypt v2 uses ML-KEM-768+X25519.

**User IDs**: Traditional PGP certificates include name and email, visible on keyservers. Autocrypt v2 has no User IDs — only a fingerprint.

**Ease of Use**: Traditional PGP requires understanding key management, trust models, and keyservers. Autocrypt v2 is fully automatic.

## Autocrypt v2 vs. Autocrypt v1

| Aspect | Autocrypt v1 | Autocrypt v2 |
|--------|-------------|-------------|
| **Signing key** | RSA-2048 or Ed25519 | Ed25519 |
| **Encryption key** | RSA-2048 or Curve25519 | ML-KEM-768+X25519 |
| **OpenPGP version** | v4 | v6 |
| **Message encryption** | SEIPD v1 (MDC) | SEIPD v2 (AEAD) |
| **Key rotation** | None | Automatic (~30 days) |
| **Forward secrecy** | None | Yes |
| **User IDs** | Yes | None |

## Key Rotation Strategies

### Back-to-Back (No Overlap)

```
      +----K0----+
                 +----K1----+
                            +----K2----+
```

Each key is valid only until the next starts. **Problem**: senders with outdated certificates cannot encrypt.

### Overlapping (Autocrypt v2)

```
      +-------K0------+
                 +------K1-------+
                            +------K2-------+
```

Keys overlap during transitions. Both old and new keys work. This is **robust** against delayed certificate updates.

### Superset (Accumulating)

```
      +----K0----+
      +---------K1----------+
      +---------------K2---------------+
```

All keys stay valid. **Problem**: no forward secrecy, certificate grows forever.

Autocrypt v2 uses **overlapping** for the best balance of forward secrecy, robustness, and bounded size.

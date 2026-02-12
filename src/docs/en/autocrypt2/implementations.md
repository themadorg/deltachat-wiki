---
title: Reference Implementations
description: Explore the Rust and Python reference implementations for creating and managing Autocrypt v2 certificates.
category: autocrypt2
order: 7
---

# Reference Implementations

Autocrypt v2 has reference implementations in **Rust** and **Python**. These implementations demonstrate how to create certificates, perform key rotation, and generate test vectors.

## Rust Implementation

The Rust implementation is the primary reference. It provides a complete library for creating and managing Autocrypt v2 certificates.

### Structure

The Rust code is organized into these modules:

| Module | Purpose |
|--------|---------|
| `certificate.rs` | Create certificates, generate subkeys, binding signatures |
| `ratchet.rs` | The AC2_Ratchet function, HKDF key derivation, X25519 normalization |
| `params.rs` | Configuration parameters (rotation period, creation time, key material) |
| `main.rs` | CLI tool for generating certificates and performing ratcheting |
| `lib.rs` | Public API that re-exports all functions |

### Key Functions

#### `create_autocrypt_v2_cert()`

Creates a new Autocrypt v2 certificate with:
- An Ed25519 primary key (the reference Rust implementation uses Ed448 for higher security margins).
- An ML-KEM-768+X25519 fallback subkey (no expiration).
- An ML-KEM-768+X25519 rotating subkey (with expiration).

```rust
use autocrypt_v2_cert::{create_autocrypt_v2_cert, CertParams};

let mut rng = rand::rngs::OsRng;
let params = CertParams::default();
let signed_key = create_autocrypt_v2_cert(&mut rng, &params).unwrap();
```

#### `ac2_ratchet()`

Derives the next rotating subkey from the current one:

```rust
use autocrypt_v2_cert::ac2_ratchet;
use std::time::Duration;

let rotation_period = Duration::from_secs(864000); // 10 days (spec default)
let new_subkey = ac2_ratchet(
    &primary_key,
    &current_rotating_subkey,
    rotation_period,
    next_start_time,
).unwrap();
```

The ratchet is **deterministic** — calling it twice with the same inputs always produces the same output. This is verified by tests.

#### `should_ratchet()`

Checks if it is time to create a new rotating subkey:

```rust
use autocrypt_v2_cert::should_ratchet;

if should_ratchet(&cert, rotation_period, now) {
    // Time to ratchet!
}
```

#### `add_subkey_to_certificate()`

Adds a newly ratcheted subkey to an existing certificate:

```rust
use autocrypt_v2_cert::add_subkey_to_certificate;

let updated_cert = add_subkey_to_certificate(cert, new_signed_subkey);
```

### Configuration Parameters

The `CertParams` struct controls certificate creation:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `creation_time` | Current time | When the certificate was created |
| `rotation_period` | 864,000 seconds (~10 days, spec default) | How long each rotating subkey is valid |
| `primary_key_material` | Random | Optional: fixed primary key for test vectors |
| `fallback_subkey_material` | Random | Optional: fixed fallback key for test vectors |
| `rotating_subkey_material` | Random | Optional: fixed rotating key for test vectors |
| `direct_key_salt` | Random | Optional: fixed salt for deterministic signatures |
| `fallback_key_salt` | Random | Optional: fixed salt for fallback binding sig |
| `rotating_key_salt` | Random | Optional: fixed salt for rotating binding sig |

### Dependencies

The Rust implementation uses these key crates:

- **`pgp`** — OpenPGP library for key creation and packet handling.
- **`hkdf`** — HKDF key derivation (RFC 5869).
- **`sha2`** — SHA-512 hash function.
- **`chrono`** — Time handling.
- **`rand`** — Cryptographic random number generation.
- **`hex-literal`** — Hex literals for test vectors.

## Python Implementation

The Python implementation is used primarily for generating **test vectors** — deterministic certificates that can be used to verify other implementations.

### What It Does

The `generate.py` script:

1. Takes fixed key material as input (not random).
2. Creates an Autocrypt v2 certificate with known, reproducible keys.
3. Performs one ratchet step to generate the next rotating subkey.
4. Outputs the certificates and intermediate values for testing.

### Test Vector Parameters

The Python script uses these fixed values:

| Parameter | Value |
|-----------|-------|
| **Creation time** | `2025-11-01T17:33:45Z` |
| **Rotation period** | `5,242,880 seconds` (used for test vectors; spec default is 864,000 seconds = 10 days) |
| **Overlap** | `0.5` (50% overlap between consecutive keys) |

### How Test Vectors Work

Test vectors ensure that different implementations produce the same output:

1. The Python script generates a certificate with fixed key material.
2. The Rust implementation uses the same fixed key material.
3. Both should produce **byte-identical** certificates and ratcheted keys.
4. If they do not match, there is a bug in one of the implementations.

The test vectors include:
- `initial.key` — The initial secret key (TSK).
- `initial.cert` — The initial public certificate.
- `ikm.hexdump` — The extracted input key material (IKM) used in the ratchet.
- `ks.hexdump` — The HKDF output used to derive the new subkey.

## Running the Implementations

### Rust

```bash
cd rust/
cargo build
cargo test        # Run all tests including test vector verification
cargo run         # Generate a certificate and perform ratcheting
```

### Python

```bash
cd python/
pip install -r requirements.txt  # Install dependencies
python generate.py               # Generate test vectors
```

## Packet Structure Verification

The Rust test suite verifies that generated certificates have the correct packet structure:

```
Expected packets for a basic Autocrypt v2 certificate:
- 1 primary key (packet A)
- 1 direct key signature (packet B)
- 2 subkeys (packets C and E)
- 2 subkey binding signatures (packets D and F)
- 0 user IDs
- 0 revocations
Total: 6 packets
```

The tests also verify:
- Primary key uses Ed448 algorithm (the reference implementation choice; the spec defines Ed25519 as the standard).
- Both subkeys use ML-KEM-768+X25519.
- All keys are OpenPGP v6.
- Fallback subkey has Encrypt Storage + Encrypt Communications flags.
- Rotating subkey has Encrypt Communications only.
- SEIPDv2 feature is enabled.
- Public certificate is approximately 2,938 bytes in binary form (larger if using Ed448 as in the reference implementation).
- Ratcheting is deterministic (same inputs → same outputs).

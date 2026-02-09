---
title: TLS Configuration
category: Reference
---

# TLS configuration

## Server-side

TLS certificates are obtained by modules called "certificate loaders". The `tls` directive arguments specify the name of the loader to use and its arguments.

```
tls file cert.pem key.pem {
    protocols tls1.2 tls1.3
    curves X25519
    ciphers ...
}

tls {
    loader file cert.pem key.pem {
        # Options for loader go here.
    }
    protocols tls1.2 tls1.3
    curves X25519
    ciphers ...
}
```

### Available certificate loaders

- `file` – Accepts argument pairs specifying certificate and then key. E.g., `tls file certA.pem keyA.pem certB.pem keyB.pem`. If multiple certificates are listed, SNI will be used.
- `acme` – Automatically obtains a certificate using the ACME protocol (Let's Encrypt).
- `off` – Explicitly disables TLS for endpoint(s).

## Advanced TLS configuration

**Note:** Madmail uses secure defaults, and the TLS handshake is resistant to active downgrade attacks. There is no need to change anything in most cases.

### `protocols [min-version] [max-version]`
Default: `tls1.0 tls1.3`

Minimum/maximum accepted TLS version. If only one value is specified, it will be the only usable version. Valid values: `tls1.0`, `tls1.1`, `tls1.2`, `tls1.3`.

### `ciphers [ciphers...]`
Default: Go-defined set of secure ciphers.

List of supported cipher suites, in preference order. Not used with TLS 1.3.

### `curves [curves...]`
Default: Go-defined curves.

The elliptic curves used in an ECDHE handshake. Valid values: `p256`, `p384`, `p521`, `X25519`.

## Client configuration

The `tls_client` directive allows customizing the behavior of the TLS client for outbound connections.

```
tls_client {
    protocols tls1.2 tls1.3
    ciphers ...
    curves X25519
    root_ca /etc/ssl/cert.pem

    cert /etc/ssl/private/madmail-client.pem
    key /etc/ssl/private/madmail-client.pem
}
```

### `protocols [min-version] [max-version]`
Default: `tls1.0 tls1.3`

### `root_ca [paths...]`
Default: system CA pool.

List of files with PEM-encoded CA certificates to use when verifying server certificates.

### `cert [path]` and `key [path]`
Default: not specified.

Presents the specified certificate when a server requests a client certificate.

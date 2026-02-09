---
title: ACME (Let's Encrypt)
category: Reference
---

# Automatic certificate management via ACME

Madmail supports obtaining certificates using the ACME protocol (e.g., Let's Encrypt).

To use it, create a configuration named for `tls.loader.acme` and reference it from endpoints:

```
tls.loader.acme local_tls {
    email put-your-email-here@example.org
    agreed # indicate your agreement with Let's Encrypt ToS
    challenge dns-01
}

smtp tcp://127.0.0.1:25 {
    tls &local_tls
    ...
}
```

You can also use a global `tls` directive:

```
tls {
    loader acme {
        email madmail-acme@example.org
        agreed
        challenge dns-01
    }
}
```

Currently, the only supported challenge is `dns-01`. Therefore, you must configure a DNS provider:

```
tls.loader.acme local_tls {
    email madmail-acme@example.org
    agreed
    challenge dns-01
    dns PROVIDER_NAME {
        ...
    }
}
```

## Configuration directives

### `debug [boolean]`
Default: global directive value.
Enables debug logging for ACME operations.

### `hostname [str]`
**Required.**
Domain name to issue the certificate for.

### `store_path [path]`
Default: `state_dir/acme`
Where to store issued certificates and metadata (filesystem-only).

### `ca [url]`
Default: Let's Encrypt production CA.
URL of the ACME directory.

### `test_ca [url]`
Default: Let's Encrypt staging CA.
Used for retries should the primary CA fail to avoid rate limits.

### `override_domain [domain]`
Overrides the domain for the TXT record in `dns-01` challenge (for delegation).

### `email [str]`
Account registration email.

### `agreed [boolean]`
Must be true to indicate agreement with CA's Terms of Service.

## DNS providers

Support for some providers requires custom builds with the `libdns_PROVIDER` tag.

### Common Providers

- **Cloudflare**
  ```
  dns cloudflare {
      api_token "..."
  }
  ```
- **DigitalOcean**
  ```
  dns digitalocean {
      api_token "..."
  }
  ```
- **Gandi**
  ```
  dns gandi {
      api_token "token"
  }
  ```
- **Hetzner**
  ```
  dns hetzner {
      api_token "..."
  }
  ```
- **Route53**
  ```
  dns route53 {
      secret_access_key "..."
      access_key_id "..."
  }
  ```

Many other providers are supported (Namecheap, Vultr, Google Cloud DNS, Alibaba Cloud, etc.). Check [libdns](https://github.com/libdns) for specific configuration requirements.

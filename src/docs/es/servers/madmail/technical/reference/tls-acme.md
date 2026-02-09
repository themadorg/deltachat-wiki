---
title: ACME (Let's Encrypt)
category: Referencia
---

# Gestión automática de certificados a través de ACME

Madmail admite la obtención de certificados utilizando el protocolo ACME (por ejemplo, Let's Encrypt).

Para utilizarlo, crea una configuración llamada para `tls.loader.acme` y referénciala desde los puntos finales (endpoints):

```
tls.loader.acme tls_local {
    email pon-tu-correo-aqui@ejemplo.org
    agreed # indica tu acuerdo con los ToS de Let's Encrypt
    challenge dns-01
}

smtp tcp://127.0.0.1:25 {
    tls &tls_local
    ...
}
```

También puedes utilizar una directiva global `tls`:

```
tls {
    loader acme {
        email madmail-acme@ejemplo.org
        agreed
        challenge dns-01
    }
}
```

Actualmente, el único desafío (challenge) admitido es `dns-01`. Por lo tanto, debes configurar un proveedor de DNS:

```
tls.loader.acme tls_local {
    email madmail-acme@ejemplo.org
    agreed
    challenge dns-01
    dns NOMBRE_PROVEEDOR {
        ...
    }
}
```

## Directivas de configuración

### `debug [boolean]`
Por defecto: valor de la directiva global.
Activa el registro de depuración para las operaciones de ACME.

### `hostname [str]`
**Requerido.**
Nombre de dominio para el que se va a emitir el certificado.

### `store_path [path]`
Por defecto: `state_dir/acme`
Lugar donde se almacenan los certificados emitidos y los metadatos (solo en el sistema de archivos).

### `ca [url]`
Por defecto: CA de producción de Let's Encrypt.
URL del directorio ACME.

### `test_ca [url]`
Por defecto: CA de staging de Let's Encrypt.
Se utiliza para los reintentos en caso de que la CA primaria falle, para evitar los límites de frecuencia (rate limits).

### `override_domain [domain]`
Anula el dominio para el registro TXT en el desafío `dns-01` (para delegación).

### `email [str]`
Correo electrónico de registro de la cuenta.

### `agreed [boolean]`
Debe ser true para indicar el acuerdo con los Términos de Servicio de la CA (Autoridad de Certificación).

## Proveedores de DNS

El soporte para algunos proveedores requiere construcciones personalizadas con la etiqueta `libdns_NOMBREPROVEEDOR`.

### Proveedores comunes

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

Se admiten muchos otros proveedores (Namecheap, Vultr, Google Cloud DNS, Alibaba Cloud, etc.). Consulta [libdns](https://github.com/libdns) para conocer los requisitos de configuración específicos.

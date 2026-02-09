---
title: Configuración de TLS
category: Referencia
---

# Configuración de TLS

## Lado del servidor

Los certificados TLS son obtenidos por módulos llamados "cargadores de certificados" (certificate loaders). Los argumentos de la directiva `tls` especfican el nombre del cargador a utilizar y sus argumentos.

```
tls file cert.pem key.pem {
    protocols tls1.2 tls1.3
    curves X25519
    ciphers ...
}

tls {
    loader file cert.pem key.pem {
        # Las opciones para el cargador van aquí.
    }
    protocols tls1.2 tls1.3
    curves X25519
    ciphers ...
}
```

### Cargadores de certificados disponibles

- `file` – Acepta pares de argumentos que especifican el certificado y luego la clave. P. ej., `tls file certA.pem keyA.pem certB.pem keyB.pem`. Si se enumeran varios certificados, se utilizará SNI.
- `acme` – Obtiene automáticamente un certificado utilizando el protocolo ACME (Let's Encrypt).
- `off` – Desactiva explícitamente TLS para los puntos finales (endpoints).

## Configuración avanzada de TLS

**Nota:** Madmail utiliza valores predeterminados seguros, y el apretón de manos (handshake) TLS es resistente a los ataques de degradación activos. En la mayoría de los casos no es necesario cambiar nada.

### `protocols [min-version] [max-version]`
Por defecto: `tls1.0 tls1.3`

Versión mínima/máxima de TLS aceptada. Si solo se especifica un valor, será la única versión utilizable. Valores válidos: `tls1.0`, `tls1.1`, `tls1.2`, `tls1.3`.

### `ciphers [ciphers...]`
Por defecto: conjunto de cifrados seguros definidos por Go.

Lista de conjuntos de cifrado (cipher suites) compatibles, en orden de preferencia. No se utiliza con TLS 1.3.

### `curves [curves...]`
Por defecto: curvas definidas por Go.

Las curvas elípticas utilizadas en un apretón de manos ECDHE. Valores válidos: `p256`, `p384`, `p521`, `X25519`.

## Configuración del cliente

La directiva `tls_client` permite personalizar el comportamiento del cliente TLS para las conexiones salientes.

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
Por defecto: `tls1.0 tls1.3`

### `root_ca [paths...]`
Por defecto: fondo de CAs del sistema (system CA pool).

Lista de archivos con certificados de CA codificados en PEM para utilizar al verificar los certificados del servidor.

### `cert [path]` y `key [path]`
Por defecto: no especificado.

Presenta el certificado especificado cuando un servidor solicita un certificado de cliente.

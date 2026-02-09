---
title: Referencia del punto final IMAP
description: Referencia para el punto final imap, que implementa el protocolo IMAP4rev1 en Madmail.
category: Técnico
---

# Punto final IMAP4rev1

El módulo 'imap' es un escuchador (listener) que implementa el protocolo IMAP4rev1 y proporciona acceso al almacenamiento de mensajes local especificado por la directiva 'storage'.

En la mayoría de los casos, los módulos de almacenamiento local crearán automáticamente las cuentas cuando se acceda a ellas a través de IMAP. Esto depende de que el proveedor de autenticación utilizado por el punto final IMAP proporcione lo que es, esencialmente, un control de acceso. Sin embargo, hay una advertencia: esta creación automática no ocurrirá al entregar mensajes entrantes a través de SMTP, ya que no hay ninguna autenticación para confirmar que esta cuenta deba ser creada de hecho.

## Directivas de configuración

```
imap tcp://0.0.0.0:143 tls://0.0.0.0:993 {
    tls /etc/ssl/private/cert.pem /etc/ssl/private/pkey.key
    io_debug no
    debug no
    insecure_auth no
    sasl_login no
    auth pam
    storage &buzones_locales
    auth_map identity
    auth_map_normalize auto
    storage_map identity
    storage_map_normalize auto
}
```

### tls _ruta-certificado_ _ruta-clave_ 
Por defecto: valor de la directiva global

Certificado TLS y clave a utilizar. Es posible realizar un ajuste fino de otras propiedades de TLS especificando un bloque de configuración y opciones dentro del mismo:

```
tls cert.crt key.key {
    protocols tls1.2 tls1.3
}
```

Consulta [Configuración de TLS / Servidor](/es/docs/servers/madmail/technical/reference/tls/#lado-del-servidor) para más detalles.

---

### proxy_protocol _ips confiables..._ 
Por defecto: no activado

Activa el uso del protocolo PROXY de HAProxy. Admite los protocolos v1 y v2. Si se proporciona una lista de direcciones IP o subredes de confianza, solo se confiará en las conexiones procedentes de ellas.

El TLS para el canal entre los proxies y maddy se puede configurar utilizando una directiva 'tls':
```
proxy_protocol {
    trust 127.0.0.1 ::1 192.168.0.1/24
    tls &tls_proxy
}
```
Ten en cuenta que la directiva 'tls' de nivel superior no se hereda aquí. Si necesitas TLS por encima del protocolo PROXY, protegiendo el encabezado del protocolo, debes declarar el TLS explícitamente.

---

### io_debug _booleano_
Por defecto: `no`

Escribe todos los comandos y respuestas en stderr.

---

### io_errors _booleano_
Por defecto: `no`

Registra los errores de E/S.

---

### debug _booleano_
Por defecto: valor de la directiva global

Activa el registro detallado.

---

### insecure_auth _booleano_
Por defecto: `no` (`yes` si el TLS está desactivado)

Permite la autenticación en texto plano sobre conexiones no cifradas.

---

### sasl_login _booleano_
Por defecto: `no`

Activa el soporte para el mecanismo de autenticación SASL LOGIN utilizado por algunos clientes anticuados.

---

### auth _referencia-módulo_
**Requerido.**

Utiliza el módulo especificado para la autenticación.

---

### storage _referencia-módulo_
**Requerido.**

Utiliza el módulo especificado para el almacenamiento de mensajes.

---

### storage_map _referencia-módulo_
Por defecto: `identity`

Utiliza la tabla especificada para mapear los nombres de usuario de SASL a los nombres de las cuentas de almacenamiento.

Antes de que se busque el nombre de usuario, este se normaliza utilizando la función definida por `storage_map_normalize`.

Esta directiva es útil si quieres que los usuarios usuario@ejemplo.org y usuario@ejemplo.com compartan la misma cuenta de almacenamiento llamada "usuario". En este caso, utiliza:

```
    storage_map email_localpart
```

Ten en cuenta que `storage_map` no afecta al nombre de usuario pasado al proveedor de autenticación.

Tampoco afecta a cómo se gestiona la entrega del mensaje; debes especificar `delivery_map` en el módulo de almacenamiento para definir cómo mapear las direcciones de correo electrónico a las cuentas de almacenamiento. P. ej.

```
    storage.imapsql buzones_locales {
        ...
        delivery_map email_localpart # entregar "usuario@*" al buzón de "usuario"
    }
```

---

### storage_map_normalize _función_
Por defecto: `auto`

Igual que `auth_map_normalize` pero para `storage_map`.

---

### auth_map_normalize _función_
Por defecto: `auto`

Anula el valor global de `auth_map_normalize` para este punto final.

Consulta [Configuración global](/es/docs/servers/madmail/technical/reference/global-config) para más detalles.

---
title: Referencia de autenticación LDAP
description: Referencia para el módulo auth.ldap, que permite la autenticación a través de LDAP utilizando el enlace DN en Madmail.
category: Técnico
---

# Enlace de DN por LDAP (LDAP BindDN)

maddy admite la autenticación a través de LDAP utilizando el enlace DN. Las contraseñas son verificadas por el servidor LDAP.

maddy necesita conocer el DN que debe utilizar para el enlace. Puede obtenerse mediante una búsqueda en el directorio o mediante una plantilla (template).

Ten en cuenta que los backends de almacenamiento convencionalmente utilizan direcciones de correo electrónico; si utilizas identificadores que no sean correos electrónicos como nombres de usuario, deberías mapearlos a correos electrónicos en la entrega utilizando `auth_map` (consulta la página de documentación del backend de almacenamiento utilizado).

auth.ldap también puede utilizarse como un módulo de tabla. De esta forma puedes comprobar si la cuenta existe. Solo funciona si no se utiliza una plantilla de DN.

```
auth.ldap {
    urls ldap://maddy.test:389

    # Especificar las credenciales de enlace iniciales. No es necesario ('bind off')
    # si se utiliza una plantilla de DN.
    bind plain "cn=maddy,ou=people,dc=maddy,dc=test" "123456"

    # Especificar la plantilla de DN para saltarse la búsqueda.
    dn_template "cn={username},ou=people,dc=maddy,dc=test"

    # Especificar base_dn y filtro para buscar el DN.
    base_dn "ou=people,dc=maddy,dc=test"
    filter "(&(objectClass=posixAccount)(uid={username}))"

    tls_client { ... }
    starttls off
    debug off
    connect_timeout 1m
}
```
```
auth.ldap ldap://maddy.test.389 {
    ...
}
```

## Directivas de configuración

### urls _servidores..._

**Requerido.**

URLs de los servidores de directorio a utilizar. Se utiliza el primer servidor disponible; no se realiza un equilibrado de carga.

Las URL deben utilizar los esquemas `ldap://`, `ldaps://`, `ldapi://`.

---

### bind `off` | `unauth` | `external` | `plain` _nombre_usuario_ _contraseña_

Por defecto: `off`

Credenciales a utilizar para el enlace inicial. Se requiere si se utiliza la búsqueda de DN.

`unauth` realiza un enlace no autenticado. `external` realiza un enlace externo, lo cual es útil para conexiones por socket Unix (`ldapi://`) o autenticación por certificado de cliente TLS (el certificado se establece mediante la directiva tls_client). `plain` realiza un enlace simple utilizando las credenciales proporcionadas.

---

### dn_template _plantilla_

Plantilla de DN a utilizar para el enlace. `{username}` se sustituye por el nombre de usuario especificado por el usuario.

---

### base_dn _dn_

DN base a utilizar para la búsqueda.

---

### filter _cadena_

Filtro de búsqueda de DN. `{username}` se sustituye por el nombre de usuario especificado por el usuario.

Ejemplo:

```
(&(objectClass=posixAccount)(uid={username}))
```

Ejemplo (usando ActiveDirectory):

```
(&(objectCategory=Person)(memberOf=CN=user-group,OU=example,DC=example,DC=org)(sAMAccountName={username})(!(UserAccountControl:1.2.840.113556.1.4.803:=2)))
```

Ejemplo:

```
(&(objectClass=Person)(mail={username}))
```

---

### starttls _bool_
Por defecto: `off`

Indica si se debe actualizar la conexión a TLS mediante STARTTLS.

---

### tls_client

Configuración avanzada del cliente TLS. Consulta [Configuración de TLS / Cliente](/es/docs/servers/madmail/technical/reference/tls/#configuración-del-cliente) para más detalles.

---

### connect_timeout _duración_
Por defecto: `1m`

Tiempo de espera para la conexión inicial con el servidor de directorio.

---

### request_timeout _duración_
Por defecto: `1m`

Tiempo de espera para cada solicitud (enlace, búsqueda).

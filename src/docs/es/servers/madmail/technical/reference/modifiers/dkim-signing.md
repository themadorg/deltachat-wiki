---
title: Referencia de firma DKIM
description: Referencia para el módulo modify.dkim, que firma los mensajes de salida utilizando el protocolo DKIM en Madmail.
category: Técnico
---

# Firma DKIM

El módulo modify.dkim es un modificador que firma los mensajes utilizando el protocolo DKIM (RFC 6376).

Cada bloque de configuración especifica un único selector y uno o más dominios.

Se generará o se leerá una clave para cada dominio; la clave a utilizar para cada mensaje se seleccionará en función del remitente del sobre SMTP (envelope sender). La excepción a esto es que para la dirección de postmaster sin dominio y la dirección nula, se utilizará la clave del primer dominio. Si el dominio en el remitente del sobre no coincide con ninguna de las claves cargadas, el mensaje no se firmará.
Además, para cada mensaje se comprueba que el encabezado From coincida con MAIL FROM y con la identidad de autorización (el nombre de usuario con el que el remitente ha iniciado sesión). Esto puede controlarse mediante la directiva `require_sender_match`.

Las claves privadas generadas se almacenan en formato PKCS#8 sin cifrar en `directorio_estado/dkim_keys` (`/var/lib/maddy/dkim_keys`). En el mismo directorio se generan archivos `.dns` que contienen la clave pública para cada dominio formateada en forma de registro DNS.

## Argumentos

Los dominios y el selector pueden especificarse en los argumentos, por lo que el uso real de modify.dkim puede acortarse a lo siguiente:

```
modify {
    dkim ejemplo.org selector
}
```

## Directivas de configuración

```
modify.dkim {
    debug no
    domains ejemplo.org ejemplo.com
    selector default
    key_path dkim-keys/{domain}-{selector}.key
    oversign_fields ...
    sign_fields ...
    header_canon relaxed
    body_canon relaxed
    sig_expiry 120h # 5 días
    hash sha256
    newkey_algo rsa2048
}
```

### debug _booleano_
Por defecto: valor de la directiva global

Activa el registro detallado.

---

### domains _lista-de-cadenas_
**Requerido**. <br>
Por defecto: no especificado


Dominios de Gestión Administrativa (ADMDs) que asumen la responsabilidad de los mensajes.

Debe especificarse como una directiva o como un argumento.

---

### selector _cadena_
**Requerido**. <br>
Por defecto: no especificado

Identificador de la clave utilizada dentro del ADMD.
Debe especificarse como una directiva o como un argumento.

---

### key_path _cadena_
Por defecto: `dkim_keys/{domain}_{selector}.key`

Ruta a la clave privada. Debe estar en formato PKCS#8 envuelto en codificación PAM.
Si la clave no existe, se generará utilizando el algoritmo especificado en `newkey_algo`.

Los marcadores de posición `{domain}` y `{selector}` se sustituirán por los valores correspondientes de las directivas domain y selector.

Además, modify.dkim puede leer claves en formatos PKCS#1 ("RSA PRIVATE KEY") y RFC 5915 ("EC PRIVATE KEY"). Ten en cuenta, sin embargo, que las claves recién generadas siempre están en PKCS#8.

---

### oversign_fields _lista..._
Por defecto: ver más abajo

Campos del encabezado que deben firmarse n+1 veces, siendo n las veces que están presentes en el mensaje. Esto hace que sea imposible sustituir el valor de un campo anteponiendo otro campo con el mismo nombre al mensaje.

Los campos especificados aquí no tienen por qué especificarse también en `sign_fields`.

Conjunto por defecto de campos "oversigned" (firmados en exceso):

- Subject
- To
- From
- Date
- MIME-Version
- Content-Type
- Content-Transfer-Encoding
- Reply-To
- Message-Id
- References
- Autocrypt
- Autocrypt-Setup-Message
- Openpgp

---

### sign_fields _lista..._
Por defecto: ver más abajo

Campos de encabezado que deben firmarse n veces, siendo n las veces que están presentes en el mensaje. Para estos campos, los relays intermedios pueden anteponer valores adicionales, pero los valores existentes no pueden cambiarse.

Conjunto por defecto de campos firmados:

- List-Id
- List-Help
- List-Unsubscribe
- List-Post
- List-Owner
- List-Archive
- Resent-To
- Resent-Sender
- Resent-Message-Id
- Resent-Date
- Resent-From
- Resent-Cc

---

### header_canon `relaxed` | `simple`
Por defecto: `relaxed`

Algoritmo de normalización a utilizar para los campos del encabezado. Con `relaxed`, los espacios en blanco dentro de los campos pueden modificarse sin romper la firma; con `simple` no se permiten modificaciones.

---

### body_canon `relaxed` | `simple`
Por defecto: `relaxed`

Algoritmo de normalización a utilizar para el cuerpo del mensaje. Con `relaxed`, los espacios en blanco dentro del cuerpo pueden modificarse sin romper la firma; con `simple` no se permiten modificaciones.

---

### sig_expiry _duración_
Por defecto: `120h`

Tiempo durante el cual la firma debe considerarse válida. Se utiliza principalmente para evitar el reenvío no autorizado de mensajes antiguos.

---

### hash _hash_
Por defecto: `sha256`

Algoritmo de hash a utilizar al calcular el hash del cuerpo.

sha256 es el único algoritmo compatible por ahora.

---

### newkey_algo `rsa4096` | `rsa2048` | `ed25519`
Por defecto: `rsa2048`

Algoritmo a utilizar al generar una nueva clave.

Actualmente, ed25519 **no** es compatible con la mayoría de las plataformas.

---

### require_sender_match _ids..._
Por defecto: `envelope auth`

Requiere que los identificadores especificados coincidan con el campo de encabezado From y el dominio de la clave; de lo contrario, no se firma el mensaje.

Si el campo From contiene varias direcciones, el mensaje no se firmará a menos que también se especifique `allow_multiple_from`. En ese caso, solo se comparará la primera dirección.

La coincidencia se realiza sin distinguir entre mayúsculas y minúsculas.

Valores válidos:

- `off` – Desactiva la comprobación, firma siempre.
- `envelope` – Requiere que la dirección MAIL FROM coincida con el encabezado From.
- `auth` – Si la identidad de autorización contiene @, requiere que coincida plenamente con el encabezado From. De lo contrario, comprueba solo la parte local (nombre de usuario).

---

### allow_multiple_from _booleano_
Por defecto: `no`

Permite múltiples direcciones en el campo de encabezado From a efectos de las comprobaciones de `require_sender_match`. No obstante, solo se comprobará la primera dirección.

---

### sign_subdomains _booleano_
Por defecto: `no`

Firma los correos electrónicos de los subdominios utilizando una clave del dominio superior.

Permite especificar solo un dominio (puede solucionarse utilizando `modify.dkim` varias veces).

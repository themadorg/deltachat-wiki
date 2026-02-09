---
title: Referencia del punto final SMTP/LMTP/Submission
description: Referencia para los módulos smtp, submission y lmtp, que implementan protocolos de transferencia y envío de correo en Madmail.
category: Técnico
---

# Punto final SMTP/LMTP/Submission

El módulo 'smtp' es un escuchador (listener) que implementa el protocolo ESMTP con autenticación opcional y soporte para LMTP y Submission (envío). Los mensajes entrantes se procesan de acuerdo con las reglas del pipeline (explicadas en la sección Pipeline de mensajes más abajo).

```
smtp tcp://0.0.0.0:25 {
    hostname ejemplo.org
    tls /etc/ssl/private/cert.pem /etc/ssl/private/pkey.key
    io_debug no
    debug no
    insecure_auth no
    sasl_login no
    read_timeout 10m
    write_timeout 1m
    max_message_size 32M
    max_header_size 1M
    auth pam
    defer_sender_reject yes
    dmarc yes
    smtp_max_line_length 4000
    limits {
        endpoint rate 10
        endpoint concurrency 500
    }

    # Ejemplo de configuración del pipeline.
    destination ejemplo.org {
        deliver_to &buzones_locales
    }
    default_destination {
        reject
    }
}
```

## Directivas de configuración

### hostname _cadena_
Por defecto: valor de la directiva global

Nombre del servidor a utilizar en el banner SMTP.

```
220 ejemplo.org ESMTP Service Ready
```

---

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

---

### io_debug _booleano_
Por defecto: `no`

Escribe todos los comandos y respuestas en stderr.

---

### debug _booleano_
Por defecto: valor de la directiva global

Activa el registro detallado.

---

### insecure_auth _booleano_
Por defecto: `no` (`yes` si el TLS está desactivado)

Permite la autenticación en texto plano sobre conexiones no cifradas. ¡No se recomienda!

---

### sasl_login _booleano_
Por defecto: `no`

Activa el soporte para el mecanismo de autenticación SASL LOGIN utilizado por algunos clientes anticuados.

---

### read_timeout _duración_
Por defecto: `10m`

Tiempo de espera de lectura de E/S.

---

### write_timeout _duración_
Por defecto: `1m`

Tiempo de espera de escritura de E/S.

---

### max_message_size _tamaño_
Por defecto: `32M`

Limita el tamaño de los mensajes entrantes al 'tamaño' especificado.

---

### max_header_size _tamaño_
Por defecto: `1M`

Limita el tamaño de los encabezados de los mensajes entrantes al 'tamaño' especificado.

---

### auth _referencia-módulo_
Por defecto: no especificado

Utiliza el módulo especificado para la autenticación.

---

### defer_sender_reject _booleano_
Por defecto: `yes`

Aplica las comprobaciones basadas en el remitente y la lógica de enrutamiento cuando se recibe el primer comando RCPT TO. Esto permite a maddy registrar la dirección del destinatario del mensaje rechazado y también mejora la interoperabilidad con los clientes (mal implementados) que no esperan un error al principio de la sesión.

---

### max_logged_rcpt_errors _entero_
Por defecto: `5`

Cantidad de errores en el momento del RCPT que deben registrarse. Los errores posteriores se manejarán silenciosamente. Esto es para evitar la inundación del registro durante ataques de diccionario de correo electrónico (sondeo de direcciones).

---

### max_received _entero_
Por defecto: `50`

Cantidad máxima de campos de encabezado Received en el encabezado del mensaje. Si el mensaje entrante tiene más campos que este número, será rechazado con el error permanente 5.4.6 ("Routing loop detected").

---

### buffer `ram`<br>buffer `fs` _ruta_ <br>buffer `auto` _tamaño-máximo_ _ruta_
Por defecto: `auto 1M DirectorioEstado/buffer`

Almacenamiento temporal a utilizar para el cuerpo de los mensajes aceptados.

- `ram` – Almacena el cuerpo en la memoria RAM.
- `fs` – Escribe el mensaje en el sistema de archivos (FS) y lo vuelve a leer según sea necesario.
`ruta` puede omitirse y por defecto es DirectorioEstado/buffer.
- `auto` – Almacena los cuerpos de los mensajes de tamaño inferior al `_tamaño_máximo_` íntegramente en la RAM, de lo contrario los escribe en el FS. `ruta` puede omitirse y por defecto es `DirectorioEstado/buffer`.

---

### smtp_max_line_length _entero_
Por defecto: `4000`

La longitud máxima de línea permitida en el flujo de entrada SMTP. Si el cliente envía una línea más larga, la conexión se cerrará y el mensaje (si lo hay) será rechazado con un error permanente.

El RFC 5321 recomienda un límite de 998 bytes. No se requiere que los servidores manejen correctamente líneas más largas, pero algunos remitentes pueden producirlas.

A menos que el remitente utilice la extensión BDAT, esta limitación también se aplica al cuerpo del mensaje.

---

### dmarc _booleano_
Por defecto: `yes`

Impone la política DMARC del remitente. Debido a las limitaciones de la implementación, no es un módulo de comprobación (check).

**Nota**: La generación de informes no está implementada por ahora.

**Nota**: DMARC necesita las comprobaciones SPF y DKIM para funcionar correctamente. Sin ellas, la comprobación DMARC no se ejecutará.

---

## Limitación de frecuencia y concurrencia

### limits
Por defecto: sin límites

Permite configurar un conjunto de restricciones al flujo de mensajes, incluyendo la concurrencia máxima y la frecuencia por punto final, por origen y por destino.

Los límites se especifican como directivas dentro del bloque:

```
limits {
	all rate 20
	destination concurrency 5
}
```

Límites admitidos:

### _alcance_ rate _ráfaga_ _periodo_

Límite de frecuencia (rate limit). Restringe la cantidad de mensajes procesados en el _periodo_ a la cantidad de mensajes de _ráfaga_. Si no se especifica el periodo, se utiliza 1 segundo.

### _alcance_ concurrency _máximo_
Límite de concurrencia. Restringe la cantidad de mensajes procesados en paralelo al número _máximo_.

Para cada limitación admitida, el _alcance_ (scope) determina si debe aplicarse a todos los mensajes ("all"), por IP del remitente ("ip"), por dominio del remitente ("source") o por dominio del destinatario ("destination"). Tener un alcance distinto de "all" significa que la restricción se aplicará de forma independiente para cada grupo determinado por el alcance. P. ej., "ip rate 20" significa que la misma IP no puede enviar más de 20 mensajes por segundo. "destination concurrency 5" significa que no se pueden enviar más de 5 mensajes en paralelo a un solo dominio.

**Nota**: Por el momento, el punto final SMTP por sí solo no admite límites por destinatario. No tendrán efecto. Si quieres imponer una restricción por destinatario en los mensajes de salida, hazlo utilizando la directiva 'limits' para el módulo 'table.remote'.

Es posible compartir los contadores de límites entre varios puntos finales (o cualquier otro módulo). Para ello, define un bloque de configuración de nivel superior para el módulo "limits" y referéncialo donde sea necesario utilizando la sintaxis estándar &. P. ej.:

```
limits limites_entrantes {
	all rate 20
}

smtp smtp://0.0.0.0:25 {
	limits &limites_entrantes
	...
}

submission tls://0.0.0.0:465 {
	limits &limites_entrantes
	...
}
```

Usar una restricción "all rate" de esta manera significa que no pueden entrar en el servidor más de 20 mensajes a través de ambos puntos finales en un segundo.

# Módulo Submission (envío) (submission)

El módulo 'submission' implementa toda la funcionalidad del módulo 'smtp' y añade cierto procesamiento previo de los mensajes; además, siempre se requiere autenticación.

El módulo 'submission' comprueba si las direcciones en los campos de encabezado From, Sender, To, Cc, Bcc, Reply-To son correctas y añade Message-ID y Date si faltan.

```
submission tcp://0.0.0.0:587 tls://0.0.0.0:465 {
    # ... igual que smtp ...
}
```

# Módulo LMTP (lmtp)

El módulo 'lmtp' implementa toda la funcionalidad del módulo 'smtp' pero utiliza el protocolo LMTP (RFC 2033).

```
lmtp unix://lmtp.sock {
    # ... igual que smtp ...
}
```

## Limitaciones de la implementación de LMTP

- No se puede utilizar con TCP.
- La entrega al almacenamiento del módulo 'sql' es siempre atómica: o bien todos los destinatarios tienen éxito o ninguno lo tendrá.

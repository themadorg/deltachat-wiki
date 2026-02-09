---
title: Referencia de DNSBL
description: Referencia para el módulo check.dnsbl, que permite la comprobación de la IP de origen y el nombre de host contra listas de agujeros negros basadas en DNS (DNSBL) en Madmail.
category: Técnico
---

# Búsqueda en DNSBL

El módulo check.dnsbl implementa la comprobación de la IP de origen y los nombres de host contra un conjunto de listas de agujeros negros basadas en DNS (DNSBL).

Su configuración consiste en directivas de configuración del módulo y un conjunto de bloques que especifican las listas a utilizar y el tipo de búsquedas a realizar en ellas.

```
check.dnsbl {
    debug no
    check_early no

    quarantine_threshold 1
    reject_threshold 1

    # Ejemplo de configuración de listas.
    dnsbl.example.org {
        client_ipv4 yes
        client_ipv6 no
        ehlo no
        mailfrom no
        score 1
    }
    hsrbl.example.org {
        client_ipv4 no
        client_ipv6 no
        ehlo yes
        mailfrom yes
        score 1
    }
}
```

## Argumentos

Los argumentos especifican la lista de BLs basadas en IP a utilizar.

Las siguientes configuraciones son equivalentes.

```
check {
    dnsbl dnsbl.example.org dnsbl2.example.org
}
```

```
check {
    dnsbl {
        dnsbl.example.org dnsbl2.example.org {
            client_ipv4 yes
            client_ipv6 no
            ehlo no
            mailfrom no
            score 1
        }
    }
}
```

## Directivas de configuración

### debug _booleano_
Por defecto: valor de la directiva global

Activa el registro detallado.

---

### check_early _booleano_
Por defecto: `no`

Comprueba las BLs antes de que comience la entrega del correo y rechaza silenciosamente a los clientes en lista negra.

Para que esto funcione correctamente, la comprobación (check) no debe utilizarse en un bloque de pipeline source/destination.

En concreto, esto significa que:

- No se realiza ningún registro de los mensajes rechazados.
- No se toma ninguna acción si se alcanza `quarantine_threshold`, solo se aplica `reject_threshold`.
- `defer_sender_reject` de la configuración SMTP no surte efecto.
- No se comprueba MAIL FROM, incluso si se especifica.

Si recibes ataques de spam a menudo, se recomienda activar esta configuración para ahorrar recursos del servidor.

---

### quarantine_threshold _entero_
Por defecto: `1`

Puntuación DNSBL necesaria (igual o superior) para poner el mensaje en cuarentena.

---

### reject_threshold _entero_
Por defecto: `9999`

Puntuación DNSBL necesaria (igual o superior) para rechazar el mensaje.

## Configuración de la lista

```
dnsbl.example.org dnsbl.example.com {
    client_ipv4 yes
    client_ipv6 no
    ehlo no
    mailfrom no
    responses 127.0.0.1/24
	score 1
}
```

El nombre de la directiva y los argumentos especifican la zona DNS real a consultar al comprobar la lista. El uso de varios argumentos equivale a especificar la misma configuración por separado para cada lista.

### client_ipv4 _booleano_
Por defecto: `yes`

Indica si se debe comprobar la dirección de los clientes IPv4 contra la lista.

---

### client_ipv6 _booleano_
Por defecto: `yes`

Indica si se debe comprobar la dirección de los clientes IPv6 contra la lista.

---

### ehlo _booleano_
Por defecto: `no`

Indica si se debe comprobar el nombre de host especificado en el comando HELO/EHLO contra la lista.

Esto solo funciona correctamente con DNSBLs basadas en dominios.

---

### mailfrom _booleano_
Por defecto: `no`

Indica si se debe comprobar la parte del dominio de la dirección MAIL FROM contra la lista.

Esto solo funciona correctamente con DNSBLs basadas en dominios.

---

### responses _cidr_ | _ip..._
Por defecto: `127.0.0.1/24`

Redes IP (en notación CIDR) o direcciones permitidas en los resultados de la búsqueda de la lista. Las direcciones que no coincidan con ninguna entrada de estas directivas serán ignoradas.

---

### score _entero_
Por defecto: `1`

Valor de puntuación a añadir al mensaje si está en la lista.

Si la suma de las puntuaciones de las listas es igual o superior a `quarantine_threshold`, el mensaje se pondrá en cuarentena.

Si la suma de las puntuaciones de las listas es igual o superior a `reject_threshold`, el mensaje será rechazado.

Es posible especificar un valor negativo para que la lista actúe como una lista blanca (whitelist) y anule los resultados de otras listas de bloqueo (blocklists).

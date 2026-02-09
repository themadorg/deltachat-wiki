---
title: Referencia de filtro de comandos
description: Referencia para el módulo check.command, que ejecuta comandos del sistema como parte del proceso de validación de mensajes en Madmail.
category: Técnico
---

# Filtro de comandos del sistema

Este módulo ejecuta un comando arbitrario del sistema durante una fase específica de la ejecución de las comprobaciones (checks).

```
command nombre_ejecutable arg0 arg1 ... {
	run_on body

	code 1 reject
	code 2 quarantine
}
```

## Argumentos

Los argumentos del módulo especifican el comando a ejecutar. Si el primer argumento no es una ruta absoluta, se busca en el directorio Libexec (/usr/lib/maddy en Linux) y en el $PATH (en ese orden). Ten en cuenta que no se realiza ningún manejo adicional de los argumentos; en concreto, el comando se ejecuta directamente, no a través del shell del sistema.

Existe un conjunto de cadenas especiales que se sustituyen por los valores correspondientes específicos del mensaje:

- `{source_ip}` – Dirección IPv4/IPv6 del MTA remitente.
- `{source_host}` – Nombre de host del MTA remitente, según el comando HELO/EHLO.
- `{source_rdns}` – Registro PTR de la dirección IP del MTA remitente.
- `{msg_id}` – Identificador interno del mensaje. Único para cada entrega.
- `{auth_user}` – Nombre de usuario del cliente, si se ha autenticado mediante SASL PLAIN.
- `{sender}` – Dirección del remitente del mensaje, tal y como se especifica en el comando SMTP MAIL FROM.
- `{rcpts}` – Lista de direcciones de destinatarios aceptadas, incluida la que se está procesando actualmente.
- `{address}` – Dirección procesada actualmente. Se trata de una dirección de destinatario si el comando se llama durante el procesamiento del comando RCPT TO (`run_on rcpt`) o de una dirección de remitente si el comando se llama durante el procesamiento del comando MAIL FROM (`run_on sender`).

Si el valor es indefinido (por ejemplo, `{source_ip}` para un mensaje aceptado a través de un socket Unix) o no está disponible (el comando se ejecuta demasiado pronto), el marcador de posición se sustituye por una cadena vacía. Ten en cuenta que no puede eliminar el argumento. P. ej., `-i {source_ip}` no se convertirá simplemente en `-i`, sino en `-i ""`.

Los marcadores de posición no definidos no se sustituyen.

## Salida estándar (stdout) del comando

La salida estándar del comando debe estar vacía o contener un encabezado RFC 5322 válido. Si contiene un flujo de bytes que no parece un encabezado válido, el mensaje será rechazado con un error temporal.

El encabezado de la salida estándar se **antepondrá** al encabezado del mensaje.

## Directivas de configuración

### run_on `conn` | `sender` | `rcpt` | `body`
Por defecto: `body`

Cuándo ejecutar el comando. Esta directiva también afecta a la información visible para el mensaje.

- `conn`<br>
    Se ejecuta antes de que se procese la dirección del remitente (MAIL FROM).<br>
    **Stdin**: Vacío <br>
    **Marcadores de posición disponibles**: {source_ip}, {source_host}, {msg_id}, {auth_user}.

- `sender`<br>
    Se ejecuta durante el procesamiento de la dirección del remitente (MAIL FROM).<br>
    **Stdin**: Vacío <br>
    **Marcadores de posición disponibles**: Marcadores de posición de `conn` + {sender}, {address}.
    El marcador de posición {address} contiene la dirección de MAIL FROM.

- `rcpt`<br>
    Se ejecuta durante el procesamiento de la dirección del destinatario (RCPT TO). El comando se ejecuta una vez por cada comando RCPT TO, incluso si se especifica el mismo destinatario varias veces.<br>
    **Stdin**: Vacío <br>
    **Marcadores de posición disponibles**: Marcadores de posición de `sender` + {rcpts}.
    El marcador de posición {address} contiene la dirección del destinatario.

- `body`<br>
    Se ejecuta durante el procesamiento del cuerpo del mensaje.<br>
    **Stdin**: El encabezado del mensaje + el cuerpo <br>
    **Marcadores de posición disponibles**: todos excepto {address}.

---

### code _entero_ ignore <br>code _entero_ quarantine <br>code _entero_ reject _codigo-smtp_ _codigo-smtp-mejorado_ _mensaje-smtp_

Esta directiva especifica el mapeo desde el código de salida del comando _entero_ a la acción del pipeline de mensajes.

Se definen dos códigos de forma implícita: el código de salida 1 hace que el mensaje sea rechazado con un error permanente, y el código de salida 2 hace que el mensaje se ponga en cuarentena. Ambas acciones pueden ser anuladas utilizando la directiva 'code'.

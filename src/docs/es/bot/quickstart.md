---
title: Inicio rápido - Escribe un bot
description: Crea un bot de eco en Python usando deltabot-cli.
category: Bot
---

# Escribir un Bot

Para empezar, vamos a construir un bot de "eco" en Python. Para cada mensaje que le envíes, responderá con ese mismo texto.
¡Puedes mirar este [repositorio de ejemplo](https://github.com/deltachat-bot/echo) para ver soluciones en diferentes lenguajes de programación!

## Configuración del entorno virtual

Primero, configuremos un entorno virtual de Python donde podamos instalar y probar de forma segura las dependencias que necesitamos:

```sh
pip install virtualenv
virtualenv .venv
source .venv/bin/activate
```

## Instalación de dependencias

Ahora que tenemos un entorno virtual activo para las pruebas, instalemos `deltabot-cli`, una biblioteca de alto nivel para frameworks de bots que simplifica la escritura de bots y acelerará el desarrollo:

```sh
pip install deltabot-cli
```

## Creación de un archivo de script de Python

Ahora crea un archivo llamado `echobot.py` donde pondrás el código de tu bot. Lo primero que pondremos dentro es la importación de las dependencias que utilizaremos:

```python
from deltabot_cli import BotCli
from deltachat2 import MsgData, events
```

## Configuración de la CLI del bot

Ahora configuremos la interfaz de línea de comandos (CLI) del bot:

```python
cli = BotCli("echobot")
```

Esto crea un objeto `cli` que utilizará `echobot` como nombre de carpeta predeterminado para la carpeta de configuración del bot (ej. `~/.config/echobot/` en Linux).

## Manejo de mensajes entrantes

Con el objeto `cli` ahora podemos registrar manejadores de eventos:

```python
@cli.on(events.NewMessage)
def echo(bot, accid, event):
    msg = event.msg
    reply = MsgData(text=msg.text)
    bot.rpc.send_msg(accid, msg.chat_id, reply)
```

La línea `@cli.on(events.NewMessage)` significa que la siguiente función se llamará cuando se reciba un nuevo mensaje. La función recibe estos parámetros:
- `bot`: la instancia del bot,
- `accid`: el ID de la cuenta donde se recibió el mensaje (esto sería relevante para un bot que utiliza múltiples cuentas)
- `event`: el objeto del evento. Dado que estamos escuchando NewMessage, `event` ofrece información sobre el mensaje recibido:
  - `event.msg` es un objeto que describe el mensaje recibido 
  - `event.command` y `event.payload` son cadenas con el comando emitido por el usuario y la carga útil del comando. Por ejemplo, si el usuario envió un mensaje con el texto: `/uppercase hola`, entonces `event.command == "/uppercase"` y `event.payload == "hola"`.

  Para nuestro bot de eco no necesitamos ningún comando, así que accedemos al objeto del mensaje entrante directamente a través de `event.msg`.

Con `reply = MsgData(text=msg.text)` creamos un objeto de respuesta con el mismo texto que el mensaje entrante.

Utilizamos `bot.rpc.send_msg(accid, msg.chat_id, reply)` para enviar el mensaje de respuesta al mismo chat donde se recibió el mensaje entrante. El objeto `bot.rpc` te permite interactuar con la [API core de chatmail](https://github.com/chatmail/core/blob/main/deltachat-jsonrpc/src/api.rs).

## Iniciando la CLI

Cuando se ejecuta nuestro script `echobot.py`, necesitamos iniciar la CLI del bot para que se procesen los eventos:

```python
if __name__ == "__main__":
    cli.start()
```

¡Esto dota a nuestro bot de una CLI completa con opciones para configurar y ejecutar nuestro bot!

## Código fuente completo

¡Eso es todo! Tenemos un bot de eco totalmente funcional, aquí está el código fuente completo de nuestro script `echobot.py`:

```python
from deltabot_cli import BotCli
from deltachat2 import MsgData, events

cli = BotCli("echobot")

@cli.on(events.NewMessage)
def echo(bot, accid, event):
    msg = event.msg
    reply = MsgData(text=msg.text)
    bot.rpc.send_msg(accid, msg.chat_id, reply)

if __name__ == "__main__":
    cli.start()
```

## Probando el bot

¡Ahora es el momento de probar nuestro nuevo programa bot!

### Configurar

Primero, creemos el perfil de chatmail del bot:

```sh
python ./echobot.py init DCACCOUNT:https://nine.testrun.org/new
```

**CONSEJO:** Estaremos utilizando el relay de chatmail nine.testrun.org, puedes registrar una nueva cuenta en muchos otros [relays de chatmail](https://chatmail.at/relays) existentes.

Después de crear el perfil, podemos ajustar el nombre de pantalla del bot, el avatar y el mensaje de estado/descripción:

```sh
python ./echobot.py config displayname "Mi Bot de Eco"
python ./echobot.py config selfstatus "Hola, soy un bot de eco"
python ./echobot.py config selfavatar "./bot-avatar.png"
```

### Obtener el enlace de invitación de chat del bot

Para entrar en contacto con el bot, necesitamos obtener el enlace de invitación del bot:

```sh
python ./echobot.py link
```

El enlace de invitación del bot se imprimirá en la consola, ábrelo con tu cliente de Delta Chat o en el navegador y escanea el código QR. La invitación de chat será aceptada por el bot una vez que dejes que el bot procese los mensajes entrantes, sigue leyendo el siguiente paso.

### Ejecutar el bot

¡Finalmente ha llegado el momento de empezar a chatear con tu bot!
Instruimos al bot para que se conecte y procese mensajes usando el comando:

```sh
python ./echobot.py serve
```

Ahora ve a tu Delta Chat, ya deberías tener un chat con el bot, ¡intenta enviarle "hola" o cualquier otro mensaje de texto!

### Próximos pasos

¡Felicidades! ¡Ya tienes los conceptos básicos para crear y ejecutar un bot de Delta Chat!

Lecturas adicionales:

* [Referencia de eventos](./events)
* [Página de deltabot-cli](https://github.com/deltachat-bot/deltabot-cli-py)
* [Biblioteca deltachat2 utilizada por deltabot-cli](https://github.com/adbenitez/deltachat2)
* [Ejemplos de implementación de echo-bot en diferentes idiomas](https://github.com/deltachat-bot/echo)
* [Documentación renderizada de TypeScript](https://js.jsonrpc.delta.chat/classes/RawClient.html)
  (No hay documentación auto-renderizada para la API de Python, pero la API de TypeScript es muy similar a las funciones que se pueden llamar en `event.rpc`)

**NOTA:** Las bibliotecas `deltabot-cli` y `deltachat2` están en desarrollo y falta documentación adecuada, por ahora tendrás que leer sus ejemplos proporcionados y su código fuente.
Para una lista de los métodos JSON-RPC disponibles [haz clic aquí](https://github.com/chatmail/core/blob/main/deltachat-jsonrpc/src/api.rs)

---
title: Información para desarrolladores
description: Detalles técnicos para desarrolladores de bots.
category: Bot
---

# Información para desarrolladores

Construir tu propio bot de Delta Chat es fácil.
Sigue leyendo para obtener información básica y tal vez echa un vistazo a nuestros [bots de ejemplo](https://deltachat-bot.github.io/public-bots/).

## API

Los bots de Delta Chat utilizan el [core de chatmail](https://github.com/chatmail/core), el motor que realiza la mayor parte del trabajo.

Tu trabajo como autor del bot es utilizar la salida de ese motor y darle instrucciones. No analizarás ningún mensaje de correo electrónico, ni comprobarás las conexiones, ni te preocuparás por el cifrado; todo eso es trabajo del motor.

El motor central se puede utilizar de forma nativa desde Rust y a través de una [API JSON-RPC](https://jsonrpc.delta.chat/) desde cualquier otro lenguaje.
(Ten en cuenta que la API todavía está sujeta a cambios)

Si necesitas un punto de partida para tu bot, mira el [echo bot](https://github.com/deltachat-bot/echo), que tiene ejemplos para empezar en varios lenguajes.

(Si falta tu lenguaje preferido aquí, ¡por favor considera escribir una interfaz para la API para él!)


## Antecedentes

El motor central de Delta Chat gestiona todas las conexiones de red y vigila la actividad.
También proporciona formas de interactuar con los datos conocidos (por ejemplo, leer mensajes) así como de crear nuevos datos (por ejemplo, gestionar contactos, enviar mensajes).

Iniciar el motor core de Delta Chat significa iniciar hilos que se conectan a tu servidor de correo electrónico y trabajan en tareas como vigilar nuevos mensajes, obtener mensajes y enviar mensajes.
Cualquier actividad que el motor core considere que vale la pena conocer se difunde a través de eventos.
Para estar al tanto de lo que sucede, tu bot debe escuchar los eventos que quiera manejar.

#### Eventos

Aquí tienes una [lista de todos los eventos disponibles](./events) con descripciones de su significado.

La mayoría de los eventos llevan una carga útil de uno o dos argumentos, que contienen los datos asociados. Podría ser un mensaje entrante, pero también podría ser un número que significa el progreso de una operación.

Un ejemplo útil de un evento y su carga útil sería [`DC_EVENT_INCOMING_MSG`](./events), el evento emitido cuando ha llegado un nuevo mensaje para un chat existente.
Su carga útil es el ID del chat por el que llegó el mensaje y el ID del mensaje en sí.
Si un argumento de la carga útil es 0, ocurrió un error. Los errores se difunden a través de diferentes eventos.
Para acceder al chat y al mensaje real, tu código tendrá que obtenerlo de la base de datos llamando a la API.

> **Nota**: los frameworks de bots de alto nivel manejan el `DC_EVENT_INCOMING_MSG` por ti y te proporcionan los datos del mensaje entrante, esto solo se menciona para explicar el trasfondo.

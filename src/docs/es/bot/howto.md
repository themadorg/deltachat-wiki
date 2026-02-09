---
title: Cómo ejecutar un bot
description: Guía sobre cómo ejecutar un bot de Delta Chat.
category: Bot
---

# Cómo ejecutar un bot de Delta Chat

Para ejecutar un bot de Delta Chat no necesitas ser programador ni un administrador de sistemas experimentado.
Básicamente, cualquier computadora servirá, siempre que pueda conectarse a tu proveedor de correo electrónico.
Para fines de prueba, bien podría ser tu máquina local. :)

### Requisitos
Los detalles dependen del bot que elijas.
Por favor, lee su documentación (ver abajo para los enlaces).

En general, necesitas:
* una conexión a Internet,
* una instalación del lenguaje de programación que utiliza el bot (por ejemplo, Python o NodeJS),
* y algunos paquetes de software adicionales (no te asustes, la instalación no será complicada).

Algunos bots tendrán esas dependencias empaquetadas en una imagen de contenedor, entonces solo necesitas la posibilidad de ejecutar un contenedor (por ejemplo, con docker o podman).

### Configuración
Cada bot de Delta Chat requiere al menos una dirección de correo electrónico y una contraseña; después de todo, un bot de Delta Chat es básicamente un cliente de correo electrónico de propósito especial.

Puede haber pasos de preparación adicionales descritos en la documentación del bot, por favor no olvides leerla.

> **Consejo**: Elige un proveedor de correo electrónico que no filtre, bloquee ni retrase los correos electrónicos entrantes o salientes. Con buenos proveedores de correo electrónico, los mensajes llegan a los compañeros de chat en pocos segundos, los malos proveedores pueden causar largos retrasos.

### Ejecución
Si no usas una imagen de contenedor, iniciarás el bot ejecutando un comando. Para mantenerlo en ejecución cuando cierres la sesión, tal vez quieras usar una herramienta como [tmux](https://github.com/tmux/tmux/).

## Bots

Hemos empezado a recopilar bots ejecutables [en nuestro foro](https://support.delta.chat/c/bots), ¡echa un vistazo!

El foro es también el lugar adecuado para hacer preguntas o solicitar ayuda en caso de problemas. No dudes en publicar :)

## Referencias
* [Referencia de eventos](./events)

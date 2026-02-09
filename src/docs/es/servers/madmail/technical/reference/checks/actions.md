---
title: Referencia de acciones de comprobación
description: Resumen de las acciones estándar que pueden tomar las comprobaciones de Madmail cuando se determina que un mensaje es "malo".
category: Técnico
---

# Acciones de comprobación

Cuando un determinado módulo de comprobación (check) considera que el mensaje es "malo", toma algunas acciones dependiendo de su configuración. La mayoría de las comprobaciones siguen la misma estructura de configuración y permiten que se tomen las siguientes acciones ante un fallo en la comprobación:

- No hacer nada (`action ignore`)

Útil para probar el despliegue de nuevas comprobaciones. Los fallos en las comprobaciones se siguen registrando, pero no tienen efecto en la entrega del mensaje.

- Rechazar el mensaje (`action reject`)

Rechaza el mensaje en el momento de la conexión. No se genera ningún rebote (bounce) localmente.

- Poner el mensaje en cuarentena (`action quarantine`)

Marca el mensaje como 'en cuarentena'. Si el mensaje se entrega posteriormente al almacenamiento local, el backend de almacenamiento puede colocar el mensaje en el buzón de correo no deseado ('Junk'). Otra cosa a tener en cuenta es que el módulo 'target.remote' se negará a enviar mensajes en cuarentena.

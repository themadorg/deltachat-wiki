---
title: Peculiaridades de implementación
description: Documentación de comportamientos inusuales o no estándar en las implementaciones de protocolos de Madmail.
category: Técnico
---

# Peculiaridades de implementación

Esta página documenta el comportamiento inusual de las implementaciones de los protocolos de maddy.
Algunos de estos problemas rompen los estándares, otros no, pero aún así pueden perjudicar la interoperabilidad.

## SMTP

- El campo `for` nunca se incluye en el campo de encabezado `Received`.

  Esto está permitido por el [RFC 2821].

## IMAP

### `sql`

- La bandera `\Recent` no se restablece en todos los casos.

  Esto _no_ rompe con el [RFC 3501]. Los clientes que dependan de ella funcionarán de forma (mucho) menos eficiente.

[RFC 2821]: https://tools.ietf.org/html/rfc2821
[RFC 3501]: https://tools.ietf.org/html/rfc3501

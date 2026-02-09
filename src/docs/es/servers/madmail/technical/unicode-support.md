---
title: Soporte Unicode
description: Información sobre el soporte de primer nivel de Madmail para Unicode, correo electrónico internacionalizado y la aplicación del perfil PRECIS.
category: Técnico
---

# Soporte Unicode

maddy tiene soporte de primer nivel para Unicode en todos sus componentes (módulos). No tienes que realizar ninguna acción para que funcione con dominios internacionalizados, nombres de buzones o encabezados de mensajes que no sean ASCII.

Internamente, todos los campos de texto en maddy se representan en UTF-8 y se gestionan mediante operaciones compatibles con Unicode para comparaciones, plegado de mayúsculas (case-folding), etc.

## Datos no ASCII en los encabezados y cuerpos de los mensajes

La implementación de SMTP de maddy no se preocupa por las codificaciones utilizadas en los encabezados MIME o en el campo charset de `Content-Type text/*`.

Sin embargo, la implementación de almacenamiento IMAP local necesita realizar ciertas operaciones sobre el contenido de los encabezados. Esto es principalmente para la funcionalidad SEARCH (Búsqueda). Para que la búsqueda IMAP funcione correctamente, el cuerpo y los encabezados del mensaje deben utilizar una de las siguientes codificaciones:

- ASCII
- UTF-8
- ISO-8859-1, 2, 3, 4, 9, 10, 13, 14, 15 o 16
- Windows-1250, 1251 o 1252 (también conocido como Code Page 1250, etc.)
- KOI8-R
- ~~HZGB2312~~, GB18030
- GBK (también conocido como Code Page 936)
- Shift JIS (también conocido como Code Page 932 o Windows-31J)
- Big-5 (también conocido como Code Page 950)
- EUC-JP
- ISO-2022-JP

_El soporte para HZGB2312 está desactivado actualmente debido a errores con implicaciones de seguridad._

Si un buzón incluye un mensaje con cualquier codificación que no figure en esta lista, no se devolverá en los resultados de búsqueda para ninguna solicitud.

El comportamiento relativo al manejo de codificaciones ajenas a Unicode no se considera estable y puede cambiar entre versiones (incluida la eliminación de codificaciones admitidas). Si necesitas que tus cosas funcionen correctamente, empieza a utilizar UTF-8.

## Archivos de configuración

Se asume que los archivos de configuración de maddy están codificados en UTF-8. El uso de cualquier otra codificación romperá las cosas; no lo hagas.

Los nombres de dominio (por ejemplo, en la directiva hostname o en las reglas de pipeline) pueden representarse mediante la forma ACE (también conocida como Punycode). Se convertirán internamente a la forma Unicode.

## Credenciales locales

El backend de almacenamiento 'sql' y el proveedor de autenticación imponen una serie de restricciones adicionales a los nombres de cuenta utilizados.

Se impone el perfil PRECIS UsernameCaseMapped para las direcciones de correo electrónico locales.
Limita el uso de caracteres de control y Bidi para asegurar que el valor utilizado pueda representarse de forma consistente en una variedad de contextos. Además, la dirección se convierte a minúsculas y se normaliza a la forma NFC para un manejo interno consistente.

Se impone el perfil PRECIS OpaqueString para las contraseñas. Aquí se aplican reglas menos estrictas. Las secuencias de caracteres de espacio en blanco de Unicode se sustituyen por un único espacio ASCII. Posteriormente se aplica la normalización NFC. Si la cadena resultante está vacía, la contraseña no es aceptada.

Ambos perfiles están definidos en el RFC 8265, consúltalo para más detalles.

## Soporte de protocolos

### Extensión SMTPUTF8

La implementación de SMTP de maddy incluye soporte para la extensión SMTPUTF8 tal y como se define en el RFC 6531.

Esto significa que maddy puede gestionar nombres de buzones y dominios internacionalizados en los comandos MAIL FROM y RCPT TO, tanto para la entrega saliente como entrante.

maddy no aceptará mensajes con direcciones de sobre (envelope addresses) que no sean ASCII a menos que se solicite el soporte SMTPUTF8. Si un mensaje con el flag SMTPUTF8 activado se reenvía a un servidor sin soporte SMTPUTF8, la entrega fallará a menos que sea posible representar las direcciones de sobre en forma ASCII (solo los dominios utilizan Unicode y pueden convertirse a Punycode). El contenido del cuerpo del mensaje (y del encabezado) no se tiene en cuenta y siempre se acepta y se envía tal cual; no se realiza ninguna degradación o recodificación automática.

### Extensiones IMAP UTF8, I18NLEVEL

Actualmente, maddy no incluye soporte para las extensiones IMAP UTF8 e I18NLEVEL. Sin embargo, no es un problema que le impida gestionar correctamente los mensajes UTF-8 (o incluso los mensajes en otras codificaciones no ASCII mencionadas anteriormente).

Los clientes que quieran implementar un manejo adecuado de las cadenas Unicode pueden asumir que maddy no las gestiona correctamente en, por ejemplo, los comandos SEARCH, por lo que dichos clientes pueden descargar los mensajes y procesarlos localmente.

---
title: Base de datos de configuración
description: Resumen técnico de las tablas de configuración dinámica y el almacenamiento de metadatos de Madmail.
category: Técnico
---

# Base de datos de configuración de Madmail

Madmail utiliza tablas SQL dedicadas para almacenar la configuración dinámica y los metadatos de los usuarios. Esto permite que el servidor cambie su comportamiento (por ejemplo, abrir el registro, desactivar los registros) sin necesidad de reiniciar o modificar el archivo de configuración.

## Tabla de configuración (`settings`)

La tabla `settings` es un almacén simple de clave-valor utilizado para los campos de configuración de todo el servidor. En `maddy.conf`, suele configurarse mediante la directiva `settings_table` tanto en `auth.pass_table` como en `storage.imapsql`.

| Clave | Tipo de valor | Descripción |
| :--- | :--- | :--- |
| `__REGISTRATION_OPEN__` | Booleano (`true`/`false`) | Controla si las nuevas cuentas se aprovisionan automáticamente durante la entrega SMTP o a través del punto final de registro de chatmail. |
| `__TURN_ENABLED__` | Booleano (`true`/`false`) | Controla si la funcionalidad del servidor TURN está activa para los usuarios. |
| `__LOG_DISABLED__` | Booleano (`true`/`false`) | Cuando se establece en `true`, el servidor desactiva dinámicamente el registro en la salida de error estándar o en archivos (utiliza `log.NopOutput`). |

## Tabla de cuotas (`quota`)

La tabla `quota` gestiona los límites de almacenamiento para los usuarios y los valores predeterminados globales.

| Nombre de usuario | Descripción |
| :--- | :--- |
| `__GLOBAL_DEFAULT__` | Una entrada especial que establece la cuota predeterminada para todos los usuarios del servidor si no se define una cuota específica para ellos. |
| *[nombre_de_usuario]* | Almacena el límite `MaxStorage` (en bytes) para un usuario específico. |

## Otras tablas

- **`contacts`**: Almacena los enlaces para compartir contactos de DeltaChat (slug, URL, nombre).
- **`passwords`**: Almacena las credenciales de los usuarios y las contraseñas hasheadas.
- **`msgs` / `mboxes` / `users`**: Tablas centrales de IMAP gestionadas por el motor de almacenamiento.

---
title: Introducción a los módulos
category: Referencia
---

# Introducción a los módulos

Madmail está construido a partir de muchos componentes pequeños llamados "módulos". Cada módulo realiza una tarea determinada y bien definida. Los módulos pueden conectarse entre sí de formas arbitrarias para lograr la funcionalidad deseada. El archivo de configuración por defecto define un conjunto de módulos que, juntos, implementan la pila típica de un servidor de correo electrónico.

Para especificar el módulo que debe ser utilizado por otro módulo para algo, busca las directivas de configuración con el argumento "module reference" (referencia de módulo). A continuación, pon el nombre del módulo como argumento para el mismo. Opcionalmente, si el módulo referenciado lo necesita, pon argumentos adicionales después del nombre. También puedes poner un bloque de configuración con directivas adicionales que especifiquen la configuración del módulo.

Aquí tienes algunos ejemplos:

```
smtp ... {
    # Entregar mensajes al módulo 'dummy' con la configuración por defecto.
    deliver_to dummy

    # Entregar mensajes al módulo 'target.smtp' con
    # el argumento 'tcp://127.0.0.1:1125' como configuración.
    deliver_to smtp tcp://127.0.0.1:1125

    # Entregar mensajes al módulo 'queue' con la configuración especificada.
    deliver_to queue {
        target ...
        max_tries 10
    }
}
```

Además, la configuración del módulo puede colocarse en un bloque con nombre separado en el nivel superior y referenciarse por su nombre donde sea necesario.

Aquí tienes el ejemplo:
```
storage.imapsql buzones_locales {
    driver sqlite3
    dsn all.db
}

smtp ... {
    deliver_to &buzones_locales
}
```

Se recomienda utilizar esta sintaxis para los módulos que son 'costosos' de inicializar, como los backends de almacenamiento y los proveedores de autenticación.

Para la definición de un bloque de configuración de nivel superior, la sintaxis es la siguiente:
```
namespace.nombre_modulo nombre_bloque_config... {
    configuracion_modulo
}
```
Si se omite `nombre_bloque_config`, será el mismo que `nombre_modulo`. Se pueden especificar varios nombres. Todos los nombres deben ser únicos.

Ten en cuenta el prefijo `storage.`. Este es el nombre real del módulo e incluye el "espacio de nombres" (namespace). Es un pequeño truco para crear nombres más concisos y puede omitirse cuando se hace referencia al módulo donde se utiliza, ya que puede estar implícito (por ejemplo, poner una referencia de módulo en `check{}` probablemente signifique que quieres algo con el prefijo `check.`).

Los argumentos habituales del módulo no pueden especificarse cuando se utiliza esta sintaxis; sin embargo, los módulos suelen proporcionar directivas explícitas que permiten especificar los valores necesarios. Por ejemplo, `sql sqlite3 all.db` es equivalente a:
```
storage.imapsql {
    driver sqlite3
    dsn all.db
}
```

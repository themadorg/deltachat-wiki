---
title: Pipeline SMTP
category: Referencia
---

# Enrutamiento de mensajes SMTP (pipeline)

Un pipeline de mensajes es un conjunto de referencias a módulos y reglas asociadas que describen cómo manejar los mensajes.

El pipeline es responsable de:

- Ejecutar los filtros de mensajes (llamados "checks"), (por ejemplo, verificación de la firma DKIM, búsqueda en DNSBL, etc.).
- Ejecutar los modificadores de mensajes (por ejemplo, creación de la firma DKIM).
- Asociar a cada destinatario del mensaje uno o más objetivos de entrega (delivery targets).

Un objetivo de entrega es un módulo que realiza el procesamiento final (entrega) del mensaje.

## Flujo de manejo de mensajes

1. Ejecutar las comprobaciones (checks) referenciadas en los bloques `check` de nivel superior (si los hay).
2. Ejecutar los modificadores referenciados en los bloques `modify` de nivel superior (si los hay).
3. Si hay bloques `source`, seleccionar el que coincida con el remitente del mensaje (según se especifica en `MAIL FROM`). Si no hay bloques `source`, se asume que toda la configuración es el bloque `default_source`.
4. Ejecutar las comprobaciones referenciadas en los bloques `check` dentro del bloque `source` seleccionado (si los hay).
5. Ejecutar los modificadores referenciados en los bloques `modify` dentro del bloque `source` seleccionado (si los hay).

**Después, para cada destinatario:**

1. Seleccionar el bloque `destination` que coincida con él. Si no hay bloques `destination`, todo el bloque `source` utilizado se interpreta como si fuera un bloque `default_destination`.
2. Ejecutar las comprobaciones referenciadas en el bloque `check` dentro del bloque `destination` seleccionado (si los hay).
3. Ejecutar los modificadores referenciados en el bloque `modify` dentro del bloque `destination` seleccionado (si los hay).
4. Si el bloque utilizado contiene la directiva `reject`, rechazar al destinatario con el código de estado SMTP especificado.
5. Si el bloque utilizado contiene la directiva `deliver_to`, pasar el mensaje al módulo de destino especificado. Solo los destinatarios que son manejados por el bloque utilizado son visibles para el destino.

Cada destinatario es manejado solamente por un único bloque `destination`; en caso de reglas de `destination` que se solapen, la primera tiene prioridad.

```
destination ejemplo.org {
    deliver_to targetA
}
destination ejemplo.org { # ambiguo y por tanto no permitido
    deliver_to targetB
}
```

Lo mismo ocurre con los bloques `source`; cada mensaje es manejado solamente por un único bloque.

Cada bloque de destinatario debe contener al menos una directiva `deliver_to` o una directiva `reject`. Si se utilizan bloques `destination`, entonces también debe utilizarse el bloque `default_destination` para especificar el comportamiento de los destinatarios que no coincidan. Lo mismo ocurre con los bloques de origen: debe utilizarse `default_source` si se utiliza `source`.

La configuración del pipeline debe especificar explícitamente el comportamiento para cada combinación posible de remitente/destinatario.

Las directivas que especifican las decisiones finales de manejo (`deliver_to`, `reject`) no pueden utilizarse al mismo nivel que las reglas `source`/`destination`.

## Directivas

### `check { ... }`
**Contexto:** configuración del pipeline, bloque source, bloque destination

Lista de referencias a módulos para las comprobaciones que deben ejecutarse en los mensajes manejados por el bloque donde se coloca `check`.

Las comprobaciones del cuerpo del mensaje colocadas en los bloques destination se ignoran actualmente. Debido a la forma en que se define el protocolo SMTP, harían que el mensaje fuera rechazado para todos los destinatarios, lo que normalmente no se desea en estas configuraciones.

```
check {
    # Referencia a la configuración por defecto definida implícitamente para el check.
    spf

    # Definición en línea de una configuración personalizada.
    spf {
         permerr_action reject
    }
}
```

### `modify { ... }`
**Contexto:** configuración del pipeline, bloque source, bloque destination

Lista de referencias a módulos para los modificadores que deben ejecutarse en los mensajes manejados por el bloque donde se coloca `modify`.

Los modificadores procesan el mensaje y sus metadatos antes de la entrega final. Por ejemplo, un modificador puede reemplazar las direcciones de los destinatarios o añadir una firma DKIM.

**Nota:** Los modificadores que afectan a la dirección de origen solo pueden utilizarse globalmente o por cada origen; no tienen efecto dentro de los bloques de destino.

```
modifiers modificadores_locales {
    replace_rcpt file /etc/maddy/aliases
}

# ... en algún otro lugar ...
{
    modify &modificadores_locales
}
```

### `reject [code] [enhanced-code] [description]`
**Contexto:** bloque destination

Rechaza el mensaje con el error SMTP especificado. Si se omiten los argumentos, el valor por defecto es "message is rejected due to policy reasons" (el mensaje se rechaza por razones de política).

```
reject 541 5.4.0 "No nos gusta ejemplo.org, vete de aquí"
```

### `deliver_to [target]`
**Contexto:** configuración del pipeline, bloque source, bloque destination

Entrega el mensaje al objetivo de entrega referenciado. Dentro de un bloque `destination`, solo se pasan los destinatarios que coinciden.

### `source_in [table] { ... }`
**Contexto:** configuración del pipeline

Maneja los mensajes con remitentes de sobre presentes en la tabla especificada. Tiene prioridad sobre las directivas `source`.

### `source [rules...] { ... }`
**Contexto:** configuración del pipeline

Maneja los mensajes que coinciden con las reglas de la dirección del remitente. Las reglas pueden ser un dominio o una dirección completa. La coincidencia no distingue entre mayúsculas y minúsculas.

```
source ejemplo.org {
    deliver_to &buzones_locales
}
default_source {
    reject 521 5.0.0 "Prohibido"
}
```

### `reroute { ... }`
**Contexto:** pipeline, source, destination

Permite tomar decisiones de enrutamiento basadas en el resultado de los modificadores (por ejemplo, tras la expansión de alias).

```
destination ejemplo.org {
    modify {
        replace_rcpt file /etc/maddy/aliases
    }
    reroute {
        destination ejemplo.org {
            deliver_to &buzones_locales
        }
        default_destination {
            deliver_to &cola_remota
        }
    }
}
```

### `destination_in [table] { ... }`
**Contexto:** pipeline, source

Maneja los destinatarios de sobre presentes en una tabla. Tiene prioridad sobre las reglas `destination`.

### `destination [rules...] { ... }`
**Contexto:** pipeline, source

Maneja los destinatarios que coinciden con las reglas (dominio o dirección completa).

## Snippets reutilizables (`msgpipeline`)

El pipeline de mensajes puede utilizarse independientemente del módulo SMTP a través del módulo `msgpipeline`.

```
msgpipeline enrutamiento_local {
    destination loquesea.com {
        deliver_to dummy
    }
}

# ... en algún otro lugar ...
deliver_to &enrutamiento_local
```

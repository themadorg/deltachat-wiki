---
title: Sintaxis de configuración
category: Referencia
---

# Sintaxis de los archivos de configuración

**Nota:** Este archivo es un documento técnico que describe cómo Madmail analiza los archivos de configuración.

La configuración consiste en "directivas" delimitadas por nuevas líneas. Cada directiva puede tener cero o más argumentos.

```
directiva0
directiva1 arg0 arg1
```

Cualquier línea que comience con `#` es ignorada. Las líneas vacías también son ignoradas.

## Uso de comillas (Quoting)

Las cadenas con espacios en blanco deben envolverse entre comillas dobles para asegurar que se interpreten como un único argumento.

```
directiva0 dos argumentos
directiva1 "un argumento"
```

Una cadena envuelta entre comillas puede contener saltos de línea y no se interpretarán como un separador de directivas.

```
directiva0 "un argumento largo
y grande para la directiva0"
```

Las comillas, y solo las comillas, pueden escaparse dentro de los literales: `\"`

La barra invertida (backslash) puede utilizarse al final de una línea para continuar la directiva en la siguiente.

## Bloques

Una directiva puede tener varias subdirectivas. Se escriben en un bloque encerrado entre llaves `{}` como este:
```
directiva0 arg0 arg1 {
    subdirectiva0 arg0 arg1
    subdirectiva1 etc
}
```

Las subdirectivas también pueden tener bloques.

```
directiva0 {
    subdirectiva0 {
        subdirectiva2 {
            a
            b
            c
        }
    }
    subdirectiva1 { }
}
```

El nivel de anidamiento está limitado, pero nunca deberías alcanzar el límite con una configuración correcta.

En la mayoría de los casos, un bloque vacío es equivalente a no tener bloque:
```
directiva { }
directiva2 # igual que el anterior
```

## Variables de entorno

Se puede hacer referencia a las variables de entorno en la configuración utilizando la sintaxis `$VARIABLE` o `{env:NOMBRE_VARIABLE}`.

Las variables inexistentes se expanden a cadenas vacías y no se eliminan de la lista de argumentos. En el siguiente ejemplo, `directiva0` tendrá un argumento independientemente de si `VAR` está definida.

```
directiva0 {env:VAR}
```

El analizador es tolerante y los marcadores de posición de variables incompletos (por ejemplo, `{env:VAR`) se dejarán tal cual. Las variables también se expanden dentro de las comillas.

## Snippets e importaciones

Puedes reutilizar bloques de configuración definiéndolos como "snippets". Un snippet es simplemente una directiva con un bloque, declarada en el nivel superior (no dentro de ningún bloque) y con el nombre de la directiva envuelto entre paréntesis.

```
(nombresnippet) {
    a
    b
    c
}
```

A continuación, se puede hacer referencia al snippet utilizando la meta-directiva `import`.

```
no_relacionado0
no_relacionado1
import nombresnippet
```

El ejemplo anterior se expandirá en la siguiente configuración:

```
no_relacionado0
no_relacionado1
a
b
c
```

La sentencia `import` también puede utilizarse para incluir el contenido de otros archivos. Funciona exactamente de la misma manera que con los snippets, pero en su lugar debe utilizarse la ruta del archivo. La ruta puede ser relativa a la ubicación del archivo de configuración procesado actualmente o absoluta. Si existen tanto un snippet como un archivo con el mismo nombre, se utilizará el snippet.

```
# /etc/maddy/tls.conf
tls ruta_larga_al_certificado ruta_larga_a_la_clave_privada

# /etc/maddy/maddy.conf
smtp tcp://0.0.0.0:25 {
    import tls.conf
}
```

```
# Expandido en:
smtp tcp://0.0.0.0:25 {
    tls ruta_larga_al_certificado ruta_larga_a_la_clave_privada
}
```

El archivo importado puede introducir nuevos snippets y se puede hacer referencia a ellos en cualquier archivo de configuración procesado.

## Valores de duración

Las directivas que aceptan una duración utilizan el siguiente formato: Una secuencia de dígitos decimales con una fracción opcional y un sufijo de unidad (el cero puede especificarse sin sufijo). Si se especifican varios valores, se sumarán.

Sufijos de unidad válidos: `h` (horas), `m` (minutos), `s` (segundos), `ms` (milisegundos). La implementación también acepta `us` y `ns` para microsegundos y nanosegundos, pero estos valores son inútiles en la práctica.

Ejemplos:
```
1h
1h 5m
1h5m
0
```

## Valores de tamaño de datos

Similares a los valores de duración, pero no se permiten fracciones y los sufijos son diferentes.

Sufijos de unidad válidos: `G` (gibibyte, 1.024³ bytes), `M` (mebibyte, 1.024² bytes), `K` (kibibyte, 1.024 bytes), `B` o `b` (byte).

Ejemplos:
```
32M
3M 5K
5b
```

Ten en cuenta también que lo siguiente no es válido, a diferencia de la sintaxis de los valores de Duración:
```
32M5K
```

## Definiciones de direcciones

La configuración de Madmail utiliza una sintaxis similar a la de las URL para especificar las direcciones de red.

- `unix://ruta_archivo` – Socket de dominio Unix. Las rutas relativas son relativas al directorio de ejecución (`/run/maddy`).
- `tcp://DIRECCIÓN:PUERTO` – Socket TCP/IP.
- `tls://DIRECCIÓN:PUERTO` – Socket TCP/IP utilizando TLS.

## Módulo Dummy

Módulo sin operación (no-op). No necesita ser configurado explícitamente y puede referenciarse usando el nombre "dummy". Puede actuar como un objetivo de entrega (delivery target) o puerto de autenticación. En este último caso, aceptará cualquier credencial, permitiendo que cualquier cliente se autentique usando cualquier nombre de usuario y contraseña (¡úsalo con precaución!).

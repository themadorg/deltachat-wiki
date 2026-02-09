---
title: Madmail y SQLite
description: Buenas prácticas y detalles técnicos del uso de SQLite como motor de almacenamiento para despliegues de Madmail.
category: Técnico
---

# maddy y SQLite

SQLite es una opción perfecta para pequeños despliegues porque no se requiere ninguna configuración adicional para empezar. Se recomienda para casos en los que se tengan menos de 10 cuentas de correo.

**Nota: SQLite requiere el bloqueo de toda la base de datos para la escritura, lo que significa que no se pueden aceptar múltiples mensajes en paralelo. Este no es el caso de los RDBMS basados en servidor, donde maddy puede aceptar múltiples mensajes en paralelo incluso para un solo buzón.**

## Modo WAL

maddy impone el modo de diario WAL para SQLite. Esto hace que las cosas sean razonablemente rápidas y reduce la contienda de bloqueo, lo que puede ser importante para un servidor de correo típico.

maddy utiliza un intervalo de autocheckpoint de WAL incrementado. Esto significa que, mientras se mantiene un alto rendimiento de escritura, maddy tendrá que detenerse un poco (0,5-1 segundo) cada vez que se escriban 78 MiB en la base de datos (con la configuración por defecto son 15 MiB).

Ten en cuenta que al mover la base de datos de sitio necesitas mover también los archivos del diario WAL (`-wal`) y de memoria compartida (`-shm`), de lo contrario se perderán algunos cambios en la base de datos.

## Estadísticas del planificador de consultas

maddy actualiza las estadísticas del planificador de consultas al apagar y cada 5 horas. Esto proporciona al planificador de consultas información para acceder a la base de datos de forma más eficiente, ya que el esquema de go-imap-sql utiliza unos pocos índices de los llamados de "baja calidad".

## Autovacuado (Auto-vacuum)

maddy activa la función de autovacuado de SQLite. Esto significa que el tamaño del archivo de la base de datos se reducirá cuando se eliminen datos (en comparación con el modo por defecto, en el que el espacio permanece sin usar).

## Vacuado manual (Manual vacuuming)

El autovacuado puede provocar la fragmentación de la base de datos y, por tanto, reducir el rendimiento de la lectura. Para realizar una operación de vacuado manual para reempaquetar y desfragmentar el archivo de la base de datos, instala la utilidad de consola SQLite3 y ejecuta los siguientes comandos:
```
sqlite3 -cmd 'vacuum' ruta_al_archivo_de_la_db.db
sqlite3 -cmd 'pragma wal_checkpoint(truncate)' ruta_al_archivo_de_la_db.db
```

Tardará un poco en completarse; puedes cerrar la utilidad cuando aparezca el prompt `sqlite>`.

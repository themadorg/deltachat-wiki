---
title: Referencia del almacenamiento de blobs en el sistema de archivos
description: Referencia para el módulo storage.blob.fs, que almacena los cuerpos de los mensajes en un directorio del sistema de archivos.
category: Técnico
---

# Sistema de archivos (Filesystem)

Este módulo almacena los cuerpos de los mensajes en un directorio del sistema de archivos.

```
storage.blob.fs {
    root <directorio>
}
```

```
storage.blob.fs <directorio>
```

## Directivas de configuración

### root _ruta_
Por defecto: no establecido

Ruta al directorio del sistema de archivos. El proceso del servidor debe tener permisos de lectura y escritura en él. Si no existe, se creará (para ello, el directorio padre debe tener permisos de escritura). Las rutas relativas se interpretan en relación con el directorio de estado del servidor.

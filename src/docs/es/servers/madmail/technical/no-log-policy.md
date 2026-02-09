---
title: Política de no registros
description: Detalles técnicos de cómo Madmail impone su política de privacidad de "No registros".
category: Técnico
---

# Política de no registros

## Resumen
Chatmail está diseñado con un fuerte enfoque en la privacidad de los usuarios. Esta política garantiza que no se almacenen registros persistentes que contengan metadatos sensibles (direcciones de remitente/destinatario, marcas de tiempo, intentos de autenticación) en el servidor cuando la política está activa.

## Aplicación técnica

### Configuración global
El registro puede desactivarse globalmente en `maddy.conf` utilizando la directiva `log`:
```hcl
log off
```
Cuando se establece en `off`, el servidor utiliza un backend `NopOutput`, que descarta todos los eventos de registro inmediatamente. No se crean archivos de registro y no se envía ninguna salida a `stderr` o `syslog`.

### Conmutación dinámica del registro
El registro también se puede conmutar dinámicamente a través de la base de datos de configuración. Esto permite a los administradores suprimir el registro sin reiniciar el servicio.

- **Estado de conmutación**:
  ```bash
  maddy creds logging off  # Desactiva el registro inmediatamente
  maddy creds logging on   # Activa el registro (requiere reiniciar el servicio para que surta efecto por completo)
  ```
- **Backend de la base de datos**: El estado se almacena en la tabla `settings` bajo la clave `__LOG_DISABLED__`. 

### Salvaguardias de privacidad
1.  **Persistencia cero**: Cuando el registro está desactivado, el sistema no abre ningún gestor de archivos con fines de registro.
2.  **Protección de metadatos**: Esto evita la acumulación de rastros de auditoría a largo plazo que podrían utilizarse para reconstruir los patrones de comunicación de los usuarios.
3.  **Fase de arranque**: Solo se informa al diario del sistema (stdout/stderr) durante la fase de arranque de los errores críticos de inicialización que impiden que el servidor se ponga en marcha. Una vez inicializado, la política de "No registros" toma el control.

## Verificación
Para verificar que no se están generando registros:
- Comprueba que `/var/log/maddy/` (o el directorio de registros configurado) permanece vacío.
- Ejecuta `journalctl -u maddy` y confirma que no aparecen nuevos registros de eventos después del mensaje "Listening for incoming connections...".

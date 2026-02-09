---
title: Especificación de autenticación
description: Detalles técnicos del patrón de registro Just-In-Time (JIT) y la lógica de autenticación de Madmail.
category: Técnico
---

# Especificación de autenticación de Chatmail

## Resumen
Chatmail implementa un patrón de registro "just-in-time" (justo a tiempo). A diferencia de los servidores de correo tradicionales que requieren la provisión manual de cuentas, Chatmail permite que las cuentas se creen automáticamente durante el primer intento de autenticación exitoso (envío IMAP o SMTP).

## Lógica de autenticación
La lógica principal reside en el módulo `auth.pass_table` (`internal/auth/pass_table/table.go`).

### Escenario: Inicio de sesión del usuario (IMAP/SMTP)
1.  **Normalización**: El nombre de usuario se normaliza (se eliminan las diferencias de mayúsculas/minúsculas y se limpia) utilizando PRECIS.
2.  **Búsqueda de credenciales**: El sistema intenta encontrar al usuario en la tabla `passwords`.
3.  **Lógica de ramificación**:
    *   **El usuario existe**: Se realiza la verificación de contraseña estándar (comparación de hash Bcrypt).
    *   **El usuario no existe**:
        *   El sistema consulta el estado del registro JIT (`__JIT_REGISTRATION_ENABLED__`).
        *   Si `__JIT_REGISTRATION_ENABLED__` es `true`:
            *   Se crea una nueva entrada de usuario inmediatamente.
            *   La contraseña proporcionada se hashea y se almacena.
            *   Se concede el intento de inicio de sesión.
        *   Si `__JIT_REGISTRATION_ENABLED__` es `false`:
            *   El intento de inicio de sesión se rechaza con `Invalid Credentials` (Credenciales no válidas).

## Detalles técnicos de implementación

### Arquitectura de módulos
- **Proveedor de autenticación**: `internal/auth/pass_table`
- **Backend de almacenamiento**: `internal/storage/imapsql`
- **Gestión de flags**: `internal/table/sql_table`

### Configuración dinámica (Tabla de configuración)
Los flags de todo el sistema están desacoplados de las credenciales de usuario para asegurar el rendimiento y prevenir conflictos de esquema:
- **Nombre de la tabla**: `settings` (o como esté configurado en `maddy.conf` a través de `settings_table`).
- **Par clave-valor**: `__REGISTRATION_OPEN__` -> `"true"`/`"false"`.
- **Precedencia**: Si falta la clave en la tabla, el sistema recurre al valor estático `auto_create` definido en `maddy.conf`.

El flag de registro JIT (`__JIT_REGISTRATION_ENABLED__`) controla la creación automática de cuentas. Si no se establece explícitamente, su valor por defecto es el de `__REGISTRATION_OPEN__`.

### Provisión de buzones
Cuando un usuario se auto-registra durante el inicio de sesión, su buzón IMAP se aprovisiona de forma diferida (lazy) en el primer acceso o en la primera entrega de correo. 
- **Hook de entrega**: `internal/storage/imapsql/delivery.go` también verifica el estado del registro JIT para determinar si un destinatario inexistente debe ser autocreado durante la entrega de correo entrante.

## Registro JIT frente a Registro por API

Chatmail admite dos formas principales de crear cuentas:

1.  **JIT (Just-In-Time)**: Se activa mediante un intento de inicio de sesión. 
    - **Pros**: Cero fricción para los usuarios.
    - **Contras**: Puede dar lugar a la "ocupación de direcciones" (address squatting) o a la creación accidental de cuentas si la contraseña no coincide con una política prevista.
2.  **Basado en API (`/new`)**: Se activa mediante una solicitud POST al punto final web.
    - **Pros**: Permite al servidor controlar la generación de nombres de usuario y asegurar la unicidad antes de que el cliente intente iniciar sesión. 
    - **Flujo controlado**: Incluso si `__JIT_REGISTRATION_ENABLED__` es `false`, la API `/new` seguirá funcionando siempre que `__REGISTRATION_OPEN__` sea `true`. Esto permite a los operadores desactivar la creación automática al iniciar sesión, permitiendo al mismo tiempo que los nuevos usuarios se registren a través de la página web oficial.

## CLI de gestión
El estado del registro puede activarse o desactivarse sin reiniciar el servidor:
```bash
maddy creds registration open   # Establece __REGISTRATION_OPEN__ a true
maddy creds registration close  # Establece __REGISTRATION_OPEN__ a false
```

El registro JIT se puede gestionar de forma independiente:
```bash
maddy creds jit enable   # Habilitar la creación automática de cuentas
maddy creds jit disable  # Deshabilitar la creación automática de cuentas
maddy creds jit status   # Mostrar el estado actual del registro JIT
```

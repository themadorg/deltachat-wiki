---
title: Referencia de comprobaciones misceláneas
description: Referencia para comprobaciones de seguridad misceláneas en Madmail, incluyendo registro MX, rDNS y requisitos de TLS.
category: Técnico
---

# Comprobaciones misceláneas

## Directivas de configuración

Las siguientes directivas se definen para todos los módulos enumerados a continuación.

### fail_action `ignore` | `reject` | `quarantine`
Por defecto: `quarantine`

Acción a tomar cuando falla la comprobación. Consulta [Acciones de comprobación](../actions/) para más detalles.

---

### debug _booleano_
Por defecto: valor de la directiva global

Registra tanto las ejecuciones de comprobación exitosas como las fallidas, en lugar de solo las fallidas.

---

### require_mx_record

Comprueba que el dominio en el comando MAIL FROM tiene un registro MX y que ninguno de ellos es "nulo" (contiene un único punto como host).

Por defecto, pone en cuarentena los mensajes procedentes de servidores a los que les faltan los registros MX; utiliza la directiva `fail_action` para cambiar este comportamiento.

---

### require_matching_rdns

Comprueba que la IP del servidor de origen tiene un registro PTR que apunta al dominio especificado en el comando EHLO/HELO.

Por defecto, pone en cuarentena los mensajes procedentes de servidores con un registro PTR que no coincida o que falte; utiliza la directiva `fail_action` para cambiar este comportamiento.

---

### require_tls

Comprueba que el servidor de origen está conectado a través de TLS, ya sea directamente o mediante el comando STARTTLS.

Por defecto, rechaza los mensajes procedentes de servidores no cifrados. Utiliza la directiva `fail_action` para cambiar este comportamiento.

---
title: Referencia de verificación SPF
description: Referencia para el módulo check.spf, que verifica si la IP de un cliente está autorizada para el dominio del remitente en Madmail.
category: Técnico
---

# SPF

check.spf es el módulo de comprobación que verifica si la dirección IP del cliente está autorizada para enviar mensajes para el dominio en la dirección MAIL FROM.

Los estados de SPF se mapean a las acciones de comprobación de maddy de la forma especificada por las directivas \*_action. Por defecto, el fallo de SPF da como resultado que el mensaje se ponga en cuarentena y los errores (tanto permanentes como temporales) hacen que el mensaje sea rechazado.
El campo Authentication-Results se genera independientemente del estado.

## Anulación por DMARC (DMARC override)

El estándar DMARC recomienda no fallar la entrega basándose únicamente en la política SPF y comprobar siempre la política DMARC y actuar en consecuencia.

Si `enforce_early` es `no`, el módulo check.spf no tomará ninguna medida ante un fallo de la política SPF si el dominio del remitente tiene un registro DMARC con una política de 'quarantine' o 'reject'. En su lugar, confiará en el soporte de DMARC para tomar las medidas necesarias utilizando los resultados de SPF como entrada.

Desactivar `enforce_early` sin activar el soporte de DMARC hará que las políticas de SPF no tengan efecto y se considera inseguro.

## Directivas de configuración

```
check.spf {
    debug no
    enforce_early no
    fail_action quarantine
    softfail_action ignore
    permerr_action reject
    temperr_action reject
}
```

### debug _booleano_
Por defecto: valor de la directiva global

Activa el registro detallado para check.spf.

---

### enforce_early _booleano_
Por defecto: `no`

Toma la decisión de la política en la fase MAIL FROM (antes de que se reciba el cuerpo del mensaje). Esto hace que sea imposible aplicar la anulación por DMARC (ver arriba).

---

### none_action `reject` | `quarantine` | `ignore`
Por defecto: `ignore`

Acción a tomar cuando la política SPF evalúa un resultado 'none'.

Consulta [https://tools.ietf.org/html/rfc7208#section-2.6](https://tools.ietf.org/html/rfc7208#section-2.6) para conocer el significado de los resultados de SPF.

---

### neutral_action `reject` | `quarantine` | `ignore`
Por defecto: `ignore`

Acción a tomar cuando la política SPF evalúa un resultado 'neutral'.

Consulta [https://tools.ietf.org/html/rfc7208#section-2.6](https://tools.ietf.org/html/rfc7208#section-2.6) para conocer el significado de los resultados de SPF.

---

### fail_action `reject` | `quarantine` | `ignore`
Por defecto: `quarantine`

Acción a tomar cuando la política SPF evalúa un resultado 'fail'.

---

### softfail_action `reject` | `quarantine` | `ignore`
Por defecto: `ignore`

Acción a tomar cuando la política SPF evalúa un resultado 'softfail'.

---

### permerr_action `reject` | `quarantine` | `ignore`
Por defecto: `reject`

Acción a tomar cuando la política SPF evalúa un resultado 'permerror'.

---

### temperr_action `reject` | `quarantine` | `ignore`
Por defecto: `reject`

Acción a tomar cuando la política SPF evalúa un resultado 'temperror'.

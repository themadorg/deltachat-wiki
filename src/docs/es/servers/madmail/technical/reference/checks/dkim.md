---
title: Referencia de verificación DKIM
description: Referencia para el módulo check.dkim, que realiza la verificación de las firmas DKIM en los mensajes entrantes en Madmail.
category: Técnico
---

# DKIM

Este es el módulo de comprobación (check) que realiza la verificación de las firmas DKIM presentes en los mensajes entrantes.

## Directivas de configuración

```
check.dkim {
    debug no
    required_fields From Subject
    allow_body_subset no
    no_sig_action ignore
    broken_sig_action ignore
	fail_open no
}
```

### debug _booleano_
Por defecto: valor de la directiva global

Registra tanto las ejecuciones de comprobación exitosas como las fallidas, en lugar de solo las fallidas.

---

### required_fields _cadena..._
Por defecto: `From Subject`

Campos de encabezado que deben incluirse en cada firma. Si la firma carece de alguno de los campos enumerados en esta directiva, se considerará inválida.

Ten en cuenta que el campo From es obligatorio que esté firmado siempre, incluso si no se incluye en esta directiva.

---

### no_sig_action _acción_
Por defecto: `ignore` (recomendado por el RFC 6376)

Acción a tomar cuando se recibe un mensaje sin ninguna firma.

Ten en cuenta que la política DMARC del dominio del remitente puede solicitar un manejo más estricto ante la falta de firmas DKIM.

---

### broken_sig_action _acción_
Por defecto: `ignore` (recomendado por el RFC 6376)

Acción a tomar cuando no hay firmas válidas en un mensaje.

Ten en cuenta que la política DMARC del dominio del remitente puede solicitar un manejo más estricto ante firmas DKIM dañadas o incorrectas.

---

### fail_open _booleano_
Por defecto: `no`

Indica si se debe aceptar el mensaje si ocurre un error temporal durante la verificación DKIM. Rechazar el mensaje con un código 4xx obligará al remitente a volver a enviarlo más tarde con la esperanza de que el problema se haya resuelto.

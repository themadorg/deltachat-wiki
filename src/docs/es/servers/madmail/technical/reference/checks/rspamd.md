---
title: Referencia de Rspamd
description: Referencia para el módulo check.rspamd, que integra Madmail con el servidor de filtrado Rspamd a través de la API HTTP.
category: Técnico
---

# rspamd

El módulo 'rspamd' implementa el filtrado de mensajes contactando con el servidor rspamd a través de la API HTTP.

```
check.rspamd {
	tls_client { ... }
	api_path http://127.0.0.1:11333
	settings_id loquesea
	tag maddy
	hostname mx.ejemplo.org
	io_error_action ignore
	error_resp_action ignore
	add_header_action quarantine
	rewrite_subj_action quarantine
	flags pass_all
}

rspamd http://127.0.0.1:11333
```

## Directivas de configuración

### tls_client 
Por defecto: no establecido

Configura el cliente TLS si se utiliza HTTPS. Consulta [Configuración de TLS / Cliente](/es/docs/servers/madmail/technical/reference/tls/#configuración-del-cliente) para más detalles.

---

### api_path _url_
Por defecto: `http://127.0.0.1:11333`

URL del punto final de la API HTTP. Admite tanto HTTP como HTTPS y puede incluir un elemento de ruta.

---

### settings_id _cadena_
Por defecto: no establecido

ID de configuración a pasar al servidor.

---

### tag _cadena_
Por defecto: `maddy`

Valor a enviar en el campo de encabezado MTA-Tag.

---

### hostname _cadena_ <br>
Por defecto: valor de la directiva global

Valor a enviar en el campo de encabezado MTA-Name.

---

### io_error_action _acción_
Por defecto: `ignore`

Acción a tomar en caso de imposibilidad de contactar con el servidor rspamd.

---

### error_resp_action _acción_
Por defecto: `ignore`

Acción a tomar en caso de recibir una respuesta 5xx o 4xx del servidor rspamd.

---

### add_header_action _acción_
Por defecto: `quarantine`

Acción a tomar cuando rspamd solicita "añadir encabezado" (add header).

X-Spam-Flag y X-Spam-Score se añaden al encabezado independientemente del valor.

---

### rewrite_subj_action _acción_
Por defecto: `quarantine`

Acción a tomar cuando rspamd solicita "reescribir el asunto" (rewrite subject).

X-Spam-Flag y X-Spam-Score se añaden al encabezado independientemente del valor.

---

### flags _lista-de-cadenas..._
Por defecto: `pass_all`

Banderas (flags) a pasar al servidor rspamd.
Consulta [https://rspamd.com/doc/architecture/protocol.html](https://rspamd.com/doc/architecture/protocol.html) para más detalles.

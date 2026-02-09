---
title: Referencia de reescritura del sobre
description: Referencia para los módulos replace_sender y replace_rcpt, utilizados para la reescritura de las direcciones del sobre SMTP en Madmail.
category: Técnico
---

# Reescritura del remitente / destinatario del sobre

Los módulos `replace_sender` y `replace_rcpt` reemplazan las direcciones del sobre (envelope) SMTP basándose en el mapeo definido por el módulo de tabla (maddy-tables(5)). Es posible especificar mapeos 1:N. Esto permite, por ejemplo, implementar listas de correo.

La dirección se normaliza antes de la búsqueda (se decodifica el Punycode en la parte del dominio, el Unicode se normaliza a NFC y se pasa toda la cadena a minúsculas).

Primero se busca la dirección completa. Si no hay reemplazo, se busca la parte local de la dirección por separado y se reemplaza en la dirección manteniendo intacta la parte del dominio. Los reemplazos no se aplican de forma recursiva, es decir, la búsqueda no se repite para el reemplazo.

Los destinatarios no se deduplican después de la expansión, por lo que el mensaje puede entregarse varias veces a un mismo destinatario. No obstante, el objetivo de entrega utilizado puede aplicar dicha deduplicación (el almacenamiento imapsql lo hace).

Definición:

```
replace_rcpt <table> [argumentos de la tabla] {
	[configuración extendida de la tabla]
}
replace_sender <table> [argumentos de la tabla] {
	[configuración extendida de la tabla]
}
```

Ejemplos de uso:

```
modify {
	replace_rcpt file /etc/maddy/aliases
	replace_rcpt static {
		entry a@ejemplo.org b@ejemplo.org
		entry c@ejemplo.org c1@ejemplo.org c2@ejemplo.org
	}
	replace_rcpt regexp "(.+)@ejemplo.net" "$1@ejemplo.org"
	replace_rcpt regexp "(.+)@ejemplo.net" "$1@ejemplo.org" "$1@ejemplo.com"
}
```

Posible contenido de /etc/maddy/aliases en el ejemplo anterior:

```
# Reemplazar 'cat' con cualquier dominio por 'dog'.
# P. ej. cat@ejemplo.net -> dog@ejemplo.net
cat: dog

# Reemplazar cat@ejemplo.org con cat@ejemplo.com.
# Tiene prioridad sobre la línea anterior.
cat@ejemplo.org: cat@ejemplo.com

# Usar alias en varias líneas
cat2: dog
cat2: mouse
cat2@ejemplo.org: cat@ejemplo.com
cat2@ejemplo.org: cat@ejemplo.net

# Alias separados por comas en varias líneas
cat3: dog , mouse
cat3@ejemplo.org: cat@ejemplo.com , cat@ejemplo.net
```

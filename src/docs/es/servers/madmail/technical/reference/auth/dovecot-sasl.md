---
title: Referencia de Dovecot SASL
description: Referencia para el módulo auth.dovecot_sasl, que permite a Madmail utilizar Dovecot como fuente de credenciales.
category: Técnico
---

# Dovecot SASL

El módulo 'auth.dovecot_sasl' implementa el lado del cliente del protocolo de autenticación de Dovecot, lo que permite a maddy utilizarlo como fuente de credenciales.

Actualmente, el soporte de los mecanismos SASL está limitado a los mecanismos admitidos por maddy, por lo que no se puede obtener, por ejemplo, SCRAM-MD5 por esta vía.

```
auth.dovecot_sasl {
	endpoint unix://ruta_al_socket
}

dovecot_sasl unix://ruta_al_socket
```

## Directivas de configuración

### endpoint _esquema://dirección_
Por defecto: no establecido

Establece la dirección a utilizar para contactar con el servidor SASL de Dovecot en el formato estándar de punto final (endpoint).

`tcp://10.0.0.1:2222` para TCP, `unix:///var/lib/dovecot/auth.sock` para sockets de dominio Unix.

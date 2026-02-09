---
title: Preguntas frecuentes sobre Madmail
description: Preguntas frecuentes sobre la gestión de un servidor Madmail.
category: Servidores
---

# Preguntas frecuentes

## ¿Cuál es el uso de recursos de Madmail?
Para un pequeño servidor personal, no necesitas mucho más de **1 GiB de RAM** y un espacio mínimo en disco. Es extremadamente ligero y puede ejecutarse en una Raspberry Pi.

## ¿Cómo se compara Madmail con MailCow o Mail-In-The-Box?
MailCow y MIAB son conjuntos de muchos componentes de software distintos (Dovecot, Postfix, etc.) gestionados conjuntamente. Madmail es un **único binario** que implementa un subconjunto de esas funciones. Es mucho más fácil de desplegar y no depende de Docker.

## ¿Existe una interfaz web para la administración?
La mayor parte de la administración se realiza a través de la interfaz de línea de comandos (comando `maddy`). Sin embargo, Madmail incluye una sencilla interfaz web para la incorporación y el registro de usuarios.

## ¿Puedo utilizar un dominio personalizado?
Sí, puedes utilizar un dominio personalizado. Durante la instalación, simplemente proporciona tu dominio en lugar de tu dirección IP.

## ¿Por qué mis correos van a la carpeta de spam en GMail/Outlook?
Los proveedores de las grandes tecnológicas utilizan sistemas de reputación opacos. Asegúrate de tener:
1. **rDNS (DNS inverso)** correctamente configurado para tu IP.
2. Registros **DKIM/SPF/DMARC válidos** (Madmail gestiona el DKIM por ti).
3. Una IP limpia que no esté en ninguna lista negra.

## ¿Madmail admite el filtrado de spam?
Por defecto, Madmail es un relay mínimo que se centra en el cumplimiento de la política del remitente (DKIM/TLS). Sin embargo, puedes integrar [rspamd](https://rspamd.com/) para un filtrado más avanzado.

## ¿Está listo para producción?
Madmail se considera en fase "beta" pero lo suficientemente estable para muchos servidores personales y comunitarios. Lo utilizan activamente cientos de usuarios de Delta Chat en todo el mundo.

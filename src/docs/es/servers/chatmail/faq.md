---
title: Preguntas frecuentes
description: Preguntas comunes sobre los relays de chatmail y su funcionamiento.
category: Servidores
---

# Preguntas frecuentes

## ¿Cuál es la diferencia entre los relays de chatmail y los servidores de correo electrónico clásicos?

Un relay de chatmail es una configuración mínima de Agente de Transporte de Correo (MTA) que va más allá de lo que ofrecen los servidores de correo electrónico clásicos:

- **Estado Cero:** No se recogen datos privados ni metadatos, los mensajes se eliminan automáticamente, bajo uso del disco.
- **Instantáneo/Tiempo Real:** Entrega de mensajes en menos de un segundo, streaming P2P en tiempo real, Notificaciones Push que preservan la privacidad para Apple, Google y [Ubuntu Touch](https://docs.ubports.com/en/latest/appdev/guides/pushnotifications.html).
- **Aplicación de la Seguridad:** Solo se acepta TLS estricto, DKIM y OpenPGP con metadatos minimizados.
- **Federación y Descentralización Fiables:** Sin comprobaciones de spam o de reputación de IP; la federación depende de los estándares y protocolos establecidos por la IETF.

## ¿Qué hay de la interoperabilidad con los servidores de correo clásicos?

En general, los relays de chatmail interoperan bien con los servidores de correo clásicos. Sin embargo, algunos relays de chatmail pueden ser bloqueados por los proveedores de correo electrónico de las grandes tecnológicas (Big-Tech) que utilizan técnicas no transparentes y propietarias para escanear correos electrónicos en texto claro, o porque utilizan sistemas de reputación de IP cuestionables.

**Los relays de chatmail, en cambio, utilizan y requieren una criptografía fuerte, lo que permite a cualquier persona participar sin tener que someterse a las restricciones de las Big-Tech.**

## ¿Cómo funcionan los relays de chatmail? ¿Puedo gestionar uno yo mismo?

Los relays de chatmail están diseñados para que su funcionamiento resulte muy barato y, por lo general, se autofinancian. Todos los relays se despliegan y actualizan automáticamente mediante el [repositorio chatmail/relay](https://github.com/chatmail/relay). Están compuestos por componentes estándar (Postfix, Dovecot) y diseñados para funcionar sin intervención. Pueden ejecutarse en hardware de gama baja como una Raspberry Pi.

## ¿Qué tan fiables son los relays de chatmail?

Los relays de chatmail imponen el cifrado de extremo a extremo, y clientes como [Delta Chat](https://delta.chat) lo imponen por su cuenta. La protección incluye los archivos multimedia adjuntos, los nombres de usuario, los avatares y los nombres de los grupos. Lo que es visible para los operadores es la fecha del mensaje, el remitente y las direcciones del receptor.

Por favor, consulta las [Preguntas frecuentes de Delta Chat sobre cifrado y seguridad](https://delta.chat/en/help#e2ee) para más información.

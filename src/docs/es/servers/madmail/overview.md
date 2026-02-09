---
title: Introducción a Madmail
description: Resumen del proyecto Madmail, un fork de Maddy optimizado para Delta Chat.
category: Servidores
---

# Madmail

**Madmail** es un fork especializado del [Servidor de Correo Maddy](https://maddy.email/), optimizado específicamente para servir como un servidor **Chatmail** de alto rendimiento y fácil de desplegar para Delta Chat.

A diferencia del relay estándar de Chatmail (que utiliza una combinación de Postfix, Dovecot y scripts de Python), Madmail proporciona una **solución de binario único** que integra todos los componentes necesarios.

## Características clave

- **Binario único**: No es necesario gestionar instalaciones separadas de Dovecot, Postfix y Nginx.
- **Auto-registro**: Creación de cuentas "justo a tiempo" (just-in-time) durante el primer inicio de sesión.
- **TURN integrado**: Soporte integrado para llamadas WebRTC.
- **Proxy Shadowsocks**: Proxy restringido integrado para una mejor conectividad.
- **Política de No Registros**: Mecanismos de privacidad profundamente integrados para minimizar el almacenamiento de metadatos.
- **Política de solo PGP**: Aplicación opcional del cifrado de extremo a extremo para todo el correo entrante y saliente.

## ¿Por qué Madmail?

Madmail está diseñado para usuarios que desean un servidor **"todo incluido"** que sea extremadamente fácil de instalar y mantener, especialmente en hardware con recursos limitados como Raspberry Pi o pequeñas instancias de VPS.

## Recursos
- [Repositorio en GitHub](https://github.com/themadorg/madmail)
- [Lanzamientos y Binarios](https://github.com/themadorg/madmail/releases)

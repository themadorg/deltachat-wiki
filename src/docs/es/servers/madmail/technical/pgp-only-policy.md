---
title: Política de solo PGP
description: Cómo Madmail impone la comunicación exclusivamente cifrada mediante PGP/MIME y gestiona los apretones de manos de Secure Join.
category: Técnico
---

# Política de correo electrónico solo PGP

Madmail/Chatmail impone una política de "Solo PGP" para garantizar que todas las comunicaciones sean seguras y privadas por defecto. Este documento describe qué solicitudes de correo electrónico se aceptan y cuáles son rechazadas por el servidor.

## Resumen

El servidor valida cada mensaje que pasa por él, ya sea enviado por **SMTP** o cargado mediante **IMAP APPEND**. La regla por defecto es que solo se permiten los mensajes **PGP/MIME** correctamente cifrados.

## Solicitudes aceptadas

El servidor acepta los siguientes tipos de mensajes:

### 1. Mensajes cifrados PGP/MIME
Los mensajes deben seguir estrictamente el estándar [RFC 3156](https://tools.ietf.org/html/rfc3156) para el cifrado PGP/MIME:
- **Content-Type**: `multipart/encrypted; protocol="application/pgp-encrypted"`
- **Estructura**:
  - La primera parte debe ser `application/pgp-encrypted` con el contenido `Version: 1`.
  - La segunda parte debe ser `application/octet-stream` y contener datos OpenPGP válidos.

#### El algoritmo de verificación
El servidor realiza una inspección profunda de la carga útil de OpenPGP sin descifrarla:
- **Manejo de armadura (Armor)**: Si tiene formato ASCII, el servidor extrae el contenido en Base64, eliminando el encabezado `-----BEGIN PGP MESSAGE-----`, los encabezados PGP opcionales y la **suma de comprobación CRC24** (líneas que empiezan por `=`).
- **Formato de paquetes**: Solo se aceptan paquetes de **Formato Nuevo** (según RFC 4880, indicado por los bits `0xC0`).
- **Codificación de longitud**: El algoritmo gestiona correctamente:
  - Codificaciones de longitud de un octeto, dos octetos y cinco octetos.
  - **Longitudes parciales del cuerpo (Partial Body Lengths)**: Procesa iterativamente las longitudes parciales (224-254) para calcular con precisión los límites de los paquetes.
- **Secuencia de paquetes**:
  - Valida que la carga útil consista en uno o más paquetes **PKESK** (Public-Key Encrypted Session Key, Tipo 1) o **SKESK** (Symmetric-Key Encrypted Session Key, Tipo 3).
  - La secuencia **debe** terminar exactamente con un paquete **SEIPD** (Symmetrically Encrypted and Integrity Protected Data, Tipo 18).

### 2. Handshake de Secure Join
Para permitir que los usuarios establezcan una conexión verificada (arranque de confianza), se aceptan las solicitudes iniciales de Secure Join sin cifrar:
- **Encabezados**: Contiene `Secure-Join: vc-request` o `Secure-Join: vg-request`.
- **Cuerpo**: Es igual a `secure-join: vc-request` o `secure-join: vg-request` (insensible a mayúsculas/minúsculas).

### 3. Mensajes automáticos del sistema (Rebotados o Bounces)
Ciertos mensajes automáticos se permiten para el buen estado del sistema:
- **Remitente**: El remitente del sobre (envelope from) debe ser `mailer-daemon@`.
- **Content-Type**: `multipart/report`.
- **Auto-Submitted**: Debe estar presente y no estar establecido en `no`.

### 4. Excepciones permitidas (Whitelisted)
Los administradores pueden configurar excepciones específicas:
- **Remitentes permitidos**: Configurados mediante `passthrough_senders`.
- **Destinatarios permitidos**: Configurados mediante `passthrough_recipients` (admite direcciones completas o para todo un dominio `@example.com`).

---

## Solicitudes rechazadas

Cualquier mensaje que no cumpla los criterios anteriores será rechazado:

### 1. Texto plano no cifrado
Los correos electrónicos estándar no cifrados se rechazan con el código de error **523**.
- **Error SMTP**: `523 Encryption Needed: Invalid Unencrypted Mail`
- **Error IMAP**: `Encryption Needed: Invalid Unencrypted Mail`

### 2. Estructura PGP no válida
- Falta de `Version: 1` en la primera parte de `multipart/encrypted`.
- Tipos de paquetes inesperados (por ejemplo, paquetes de datos literales simples o firmas sin cifrado).
- Codificaciones de longitud dañadas o Base64 no válido.
- Más de dos partes en la estructura MIME.

### 3. Discordancia de encabezados
Para evitar el spoofing (suplantación de identidad):
- La dirección **From de MIME** debe coincidir exactamente con el **Remitente del Sobre** (MAIL FROM).
- El fallo resulta en: `554 From header does not match envelope sender`.

### 4. Formato de destinatario no válido
Las direcciones mal formadas se rechazan con el código **554** antes de la validación del cifrado.

## Detalles de implementación

La lógica de estas comprobaciones se implementa en los siguientes componentes:
- `internal/check/pgp_encryption/`: El módulo de comprobación SMTP.
- `internal/pgp_verify/`: Lógica central de validación de PGP y Secure Join.
- `internal/endpoint/imap/`: El envoltorio IMAP que impone estas comprobaciones en los comandos `APPEND`.
- `internal/endpoint/chatmail/`: El punto final de entrega por HTTP (MX-Deliv).

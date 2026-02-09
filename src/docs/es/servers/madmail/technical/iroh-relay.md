---
title: Integración de relay Iroh
description: Cómo Madmail integra el relay de Iroh para una comunicación P2P de alto rendimiento en tiempo real en WebXDC.
category: Técnico
---

# Integración del relay Iroh en Chatmail

Este documento explica cómo funciona la integración del relay Iroh (antes DERP) en Madmail, cubriendo el descubrimiento a través de IMAP, el servidor relay integrado y la coordinación P2P del lado del cliente.

## Resumen

Delta Chat utiliza la pila de red Iroh para la comunicación de par a par (P2P) de alto rendimiento y en tiempo real, especialmente para aplicaciones WebXDC. Dado que muchos usuarios están detrás de NAT o cortafuegos que impiden las conexiones directas, un **relay Iroh** actúa como un recurso de respaldo para enrutar el tráfico cifrado entre pares.

El sistema consta de tres partes principales:
1.  **Extensión de metadatos IMAP**: Proporciona a los clientes la URL del relay Iroh local.
2.  **Relay Iroh integrado**: Un proceso auxiliar o servicio integrado que retransmite los paquetes de Iroh.
3.  **Chatmail Core**: Gestiona la lógica de la red P2P (swarm logic), uniéndose a los temas de difusión (gossip topics) y enviando/recibiendo datos en tiempo real.

## Descubrimiento a través de IMAP

Los clientes de Delta Chat descubren el relay de Iroh consultando al servidor IMAP por metadatos específicos.

-   **Capacidad IMAP**: El servidor anuncia la capacidad `METADATA` (RFC 5464).
-   **Clave de metadatos**: `/shared/vendor/deltachat/irohrelay`
-   **Solicitud**: `GETMETADATA "" /shared/vendor/deltachat/irohrelay`

El servidor responde con la URL completa del relay, por ejemplo: `http://mail.example.org:3340`.

## Relay Iroh integrado

Madmail incluye una versión específica de `iroh-relay` (actualmente la **v0.35.0** para que coincida con la versión del core de Delta Chat) como un auxiliar integrado.

### Soporte de protocolos
- **iroh-relay-v1**: El relay implementa el protocolo estándar de relay de Iroh. 
- **Actualización a WebSocket**: Las conexiones se establecen a través de HTTP/HTTPS y se actualizan a un protocolo de relay basado en WebSocket utilizando el subprotocolo `iroh-relay-v1`.

### Autenticación
En la implementación actual de Chatmail/Madmail, el relay está configurado con `access = "everyone"`. Esto permite que cualquier usuario de Delta Chat en el servidor utilice el relay para la coordinación P2P sin necesidad de una configuración adicional.

## P2P en tiempo real (WebXDC)

Cuando una aplicación WebXDC solicita una conexión en tiempo real:
1.  El cliente obtiene la URL del relay a través de IMAP.
2.  El cliente se conecta al relay y recibe una conexión de larga duración.
3.  El cliente anuncia su **ID de nodo Iroh** a otros participantes a través de mensajes estándar de Delta Chat (anuncio en tiempo real).
4.  Los pares utilizan los IDs de nodo anunciados y el relay para establecer un grupo de difusión (gossip swarm).
5.  Los datos se envían por P2P cuando es posible, o a través del relay como respaldo.

## Configuración

El relay de Iroh está activado por defecto en las nuevas instalaciones de Madmail. Se configura en `maddy.conf`:

```hcl
endpoint.imap imap {
    # ... otra configuración ...
    iroh_relay_url http://$(public_ip):3340
}
```

El propio relay se gestiona como un servicio de systemd (`iroh-relay.service`) con su configuración en `/etc/maddy/iroh-relay.toml`:

```toml
enable_relay = true
http_bind_addr = "[::]:3340"
enable_stun = false
enable_metrics = false
access = "everyone"
```

> **Nota**: `enable_stun` suele establecerse en `false` en la configuración del relay de Iroh si el servidor ya proporciona un servicio TURN/STUN dedicado, para evitar conflictos de puertos.

## Pruebas y verificación

Puedes verificar la integración de Iroh utilizando el conjunto de pruebas E2E:

- **Prueba de descubrimiento**: `uv run python3 tests/deltachat-test/main.py --test-15`
- **Prueba de P2P en tiempo real**: `uv run python3 tests/deltachat-test/main.py --test-16`

Los registros del servidor pueden inspeccionarse mediante:
```bash
journalctl -u iroh-relay.service -f
```

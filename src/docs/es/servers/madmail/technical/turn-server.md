---
title: Integración con el servidor TURN
description: Cómo Madmail integra un servidor TURN para las llamadas WebRTC y proporciona descubrimiento automatizado a través de IMAP.
category: Técnico
---

# Integración del servidor TURN en Chatmail

Este documento explica cómo funciona la integración del servidor TURN (Traversal Using Relays around NAT) en Madmail, tratando el descubrimiento a través de IMAP, la autenticación basada en tokens y la implementación interna del servidor TURN.

## Resumen

Delta Chat utiliza WebRTC para las llamadas de audio y vídeo. Dado que muchos usuarios están detrás de NAT o cortafuegos, a menudo se requiere un servidor TURN para retransmitir el tráfico multimedia. Madmail proporciona un servidor TURN integrado y un mecanismo de descubrimiento para los clientes.

El sistema consta de tres partes principales:
1.  **Extensión de metadatos IMAP**: Proporciona a los clientes los detalles del servidor TURN y credenciales temporales.
2.  **Punto final TURN**: Un servidor TURN integrado que valida las credenciales utilizando un secreto compartido.
3.  **Chatmail Core**: Gestiona la lógica del lado del cliente para analizar la información del servidor ICE y resolver los nombres de host.

## Descubrimiento a través de IMAP

Los clientes de Delta Chat descubren el servidor TURN consultando el servidor IMAP por metadatos específicos.

-   **Capacidad IMAP**: El servidor anuncia la capacidad `METADATA` (RFC 5464).
-   **Clave de metadatos**: `/shared/vendor/deltachat/turn`
-   **Solicitud**: `GETMETADATA "" /shared/vendor/deltachat/turn`

### Generación de credenciales temporales

Cuando un cliente solicita los metadatos de TURN, el servidor IMAP genera credenciales temporales utilizando un mecanismo de **Secreto Compartido**:

1.  **Nombre de usuario**: Una marca de tiempo Unix que indica el tiempo de expiración (por ejemplo, `tiempo_actual + 24h`).
2.  **Contraseña**: Una firma HMAC-SHA1 del nombre de usuario, calculada utilizando el `turn_secret`.
3.  **Formato de salida**: `nombre_de_host:puerto:nombre_de_usuario:contraseña`

Esto permite al servidor emitir credenciales válidas por un tiempo limitado sin tener que almacenarlas en una base de datos.

## Servidor TURN integrado

El servidor TURN se implementa en `internal/endpoint/turn/turn.go` utilizando la biblioteca `pion/turn`.

### Flujo de autenticación

Cuando un cliente se conecta al servidor TURN:
1.  El cliente proporciona el `username` (marca de tiempo de expiración) y el `password` (firma HMAC).
2.  El servidor TURN comprueba si coincide con el `realm`.
3.  El servidor TURN vuelve a calcular el HMAC-SHA1 del `username` proporcionado utilizando su propia copia del `turn_secret`.
4.  Si la firma calculada coincide con el `password` proporcionado, la autenticación es correcta.

### Asignación de relay (Relay Allocation)
El servidor utiliza un `MinimalRelayGenerator` para asignar las direcciones de relay. Admite tanto hilos de escucha (listeners) **UDP** como **TCP**. La configuración `relay_ip` determina la dirección IP que el servidor TURN indica a los clientes que utilicen para la retransmisión.

## Lógica del core del cliente (Rust)

El core de Rust (`chatmail-core/src/calls.rs`) gestiona la lista de servidores ICE:

-   **Análisis (Parsing)**: Analiza la cadena de metadatos recibida de IMAP.
-   **Resolución**: Resuelve los nombres de host TURN/STUN a direcciones IP. Esto es crítico para Delta Chat Desktop, que puede funcionar en entornos donde la resolución DNS no es fiable o no está disponible para la aplicación.
-   **Recurso de respaldo (Fallback)**: Si los metadatos IMAP no proporcionan ningún servidor TURN, utiliza servidores de respaldo codificados (por ejemplo, `turn.delta.chat`).

## Configuración

En `maddy.conf` (o en la configuración equivalente), la integración de TURN y TURNS se configura de la siguiente manera:

```hcl
endpoint.imap imap {
    # ... otra configuración ...
    turn_enable yes
    turn_server turn.example.com
    turn_port 443
    turn_secret "tu-secreto-compartido"
    turn_ttl 86400
    turn_prefer_tls yes  # Anuncia TURNS como predeterminado
}

endpoint.turn turn {
    realm example.com
    secret "tu-secreto-compartido"
    relay_ip 1.2.3.4
    
    # TLS opcional para TURNS
    tls {
        cert /ruta/al/certificado.pem
        key /ruta/al/clave.pem
    }
}
```

### Soporte de protocolos

-   **TURN**: TURN estándar sobre UDP/TCP (normalmente el puerto 3478).
-   **TURNS**: TURN sobre TLS (normalmente el puerto 443 o 5349). Para activar TURNS, utiliza el prefijo `tls://` en las direcciones del punto final `turn` y proporciona un bloque `tls`.

Los metadatos IMAP ahora admiten tanto las claves `/shared/vendor/deltachat/turn` como `/shared/vendor/deltachat/turns` para el descubrimiento por parte de los clientes.

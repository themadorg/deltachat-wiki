---
title: Integración con Dovecot
description: Cómo integrar Madmail con Dovecot para mejorar el rendimiento o utilizar funciones avanzadas de IMAP.
category: Técnico
---

# Dovecot

Es posible que el servidor IMAP integrado en maddy no cumpla con tus requisitos en términos de rendimiento, fiabilidad o cualquier otro aspecto. Por esta razón, es posible integrarlo con cualquier servidor IMAP externo que implemente los protocolos necesarios. A continuación se explica cómo hacerlo para Dovecot.

1. Elimina el punto final `imap` y los bloques `local_authdb` y `local_mailboxes` existentes.

2. Configura Dovecot para que proporcione un punto final LMTP.

Aquí tienes un fragmento de configuración de ejemplo:
```
# /etc/dovecot/dovecot.conf
protocols = imap lmtp

# /etc/dovecot/conf.d/10-master.conf
service lmtp {
 unix_listener lmtp-maddy {
   mode = 0600
   user = maddy
  }
}
```

Añade el bloque `local_mailboxes` a la configuración de maddy utilizando el módulo `target.lmtp`:
```
target.lmtp buzones_locales {
    targets unix:///var/run/dovecot/lmtp-maddy
}
```

### Autenticación

Además del servicio MTA, maddy también proporciona el servicio Submission (envío), pero necesita los datos del proveedor de autenticación para funcionar correctamente. maddy puede utilizar el protocolo de autenticación SASL de Dovecot para ello.

Necesitas lo siguiente en el archivo `10-master.conf` de Dovecot:
```
service auth {
  unix_listener auth-maddy-client {
    mode = 0660
    user = maddy
  }
}
```

Después, simplemente configura el módulo `dovecot_sasl` para `submission`:
```
submission ... {
    auth dovecot_sasl unix:///var/run/dovecot/auth-maddy-client
    ... otra configuración ...
}
```

## Otros servidores IMAP

La integración con otros servidores IMAP puede ser más problemática porque no existe un protocolo estándar para la delegación de la autenticación. Es posible que tengas que configurar el servidor IMAP para que implemente la funcionalidad MSA reenviando los mensajes a maddy para la entrega de salida. Esto puede requerir más cambios de configuración en maddy, ya que por defecto no permitirá el relay en el puerto 25, ni siquiera para las direcciones de localhost. La forma más sencilla es crear otro punto final SMTP en algún puerto (probablemente el puerto de Submission):
```
smtp tcp://127.0.0.1:587 {
    deliver_to &cola_remota
}
```
Y configurar el servicio de Submission del servidor IMAP para que reenvíe los mensajes de salida allí.

Dependiendo de cómo esté implementado el servicio de Submission, es posible que también tengas que enrutar los mensajes para los dominios locales de vuelta al mismo a través de LMTP:
```
smtp tcp://127.0.0.1:587 {
    destination postmaster $(local_domains) {
        deliver_to &enrutamiento_local
    }
    default_destination {
        deliver_to &cola_remota
    }
}
```

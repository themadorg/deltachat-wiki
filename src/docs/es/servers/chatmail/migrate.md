---
title: Migración a una nueva máquina
description: Guía paso a paso para migrar de forma segura un relay de chatmail.
category: Servidores
---

<script>
    import Steps from '$lib/components/Steps.svelte';
    import Step from '$lib/components/Step.svelte';
</script>

# Migración a una nueva máquina

Este tutorial de migración proporciona un enfoque paso a paso para migrar de forma segura un relay de chatmail de una máquina remota a otra.

## Notas preliminares y suposiciones

- Si la migración es un movimiento planeado, se recomienda bajar el Tiempo de Vida (TTL) de tus registros DNS a un valor como 300 (5 minutos), preferiblemente mucho antes de la migración real planeada. Esto acelera la propagación de los cambios de DNS en Internet una vez completada la migración.
- Los pasos de la migración se probaron con un portátil Linux; es posible que tengas que ajustar algunos de los pasos a tu entorno local.
- Tu `mail_domain` es `mail.example.org`.
- Todas las máquinas remotas ejecutan Debian 12.
- La dirección IP versión 4 del sitio antiguo es `$OLD_IP4`.
- Las direcciones IP del nuevo sitio son `$NEW_IP4` y `$NEW_IPV6`.

## Los seis pasos para migrar

Ten en cuenta que durante algunos de los siguientes pasos puede que recibas una advertencia sobre el cambio de las claves de host SSH; en ese caso, simplemente ejecuta `ssh-keygen -R "mail.example.org"` como se recomienda.

<Steps>
<Step number="1" title="Transferencia inicial de buzones">

Inicia sesión en el sitio antiguo, reenviando tu ssh-agent con `ssh -A` para permitir el uso de ssh para copiar directamente los archivos del sitio antiguo al nuevo.

```sh
ssh -A root@$OLD_IP4
tar c /home/vmail/mail | ssh root@$NEW_IP4 "tar x -C /"
```

</Step>
<Step number="2" title="Pre-configuración del nuevo sitio">

Pre-configura el nuevo sitio pero mantenlo inactivo hasta el paso 6:

```sh
CMDEPLOY_STAGES=install,configure scripts/cmdeploy run --ssh-host $NEW_IP4
```

</Step>
<Step number="3" title="Desactivación de los servicios de correo en el sitio antiguo">

Desactiva los servicios de correo en el sitio antiguo. Los usuarios no podrán enviar ni recibir mensajes hasta que se completen todos los pasos. Otros relays y servidores de correo reintentarán entregar los mensajes de vez en cuando, por lo que no se pierde nada para los usuarios.

```sh
scripts/cmdeploy run --disable-mail --ssh-host $OLD_IP4
```

</Step>
<Step number="4" title="Sincronización final">

Sincronización final de los secretos TLS/DKIM, las colas de correo y los buzones. De nuevo, utilizamos el reenvío del agente ssh (`-A`) para permitir la transferencia de todos los datos importantes directamente del sitio antiguo al nuevo.

```sh
ssh -A root@$OLD_IP4
tar c /var/lib/acme /etc/dkimkeys /var/spool/postfix | ssh root@$NEW_IP4 "tar x -C /"
rsync -azH /home/vmail/mail root@$NEW_IP4:/home/vmail/
```

Inicia sesión en el nuevo sitio y asegúrate de que la propiedad de los archivos esté correctamente configurada:

```sh
ssh root@$NEW_IP4
chown root: -R /var/lib/acme
chown opendkim: -R /etc/dkimkeys
chown vmail: -R /home/vmail/mail
```

</Step>
<Step number="5" title="Actualización de las entradas DNS">

Actualiza las entradas DNS para que apunten al nuevo sitio. Solo necesitas cambiar los registros `A` y `AAAA`, por ejemplo:

```text
mail.example.org.    IN A    $NEW_IP4
mail.example.org.    IN AAAA $NEW_IP6
```

</Step>
<Step number="6" title="Activación del relay en el nuevo sitio" isLast={true}>

Activa el relay de chatmail en el nuevo sitio:

```sh
CMDEPLOY_STAGES=activate scripts/cmdeploy run --ssh-host $NEW_IP4
```

</Step>
</Steps>

¡Listo! Los usuarios podrán utilizar el relay tan pronto como se hayan propagado los cambios de DNS.

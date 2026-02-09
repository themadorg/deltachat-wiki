---
title: Primeros pasos con Madmail
description: Cómo desplegar tu propio servidor Madmail para Delta Chat.
category: Servidores
---

<script>
    import Steps from '$lib/components/Steps.svelte';
    import Step from '$lib/components/Step.svelte';
</script>

# Configuración de un servidor Madmail

Madmail está diseñado para un despliegue rápido, especialmente en entornos de red restringidos. Esta guía explica cómo poner en marcha tu servidor rápidamente.

## Requisitos mínimos

- Un servidor limpio con **Debian 12** o **Ubuntu**.
- Una dirección IP pública (IPv4 o IPv6).
- 1 GB de RAM y entre 5 y 10 GB de almacenamiento suelen ser suficientes.

## Despliegue rápido (basado en IP)

Madmail admite el despliegue directo basado en IP para evitar problemas relacionados con el DNS.

<Steps>
<Step number="1" title="Instalación automatizada">

Ejecuta el siguiente comando en tu servidor para instalar Madmail de forma rápida utilizando tu IP pública:

```bash
wget https://github.com/themadorg/madmail/releases/latest/download/madmail && \
chmod +x madmail && \
sudo ./madmail install --simple --ip [TU_IP_PÚBLICA] && \
sudo systemctl start maddy
```

</Step>
<Step number="2" title="Instalación manual del binario" isLast={true}>

Si tienes el binario `madmail` localmente:

1. **Sube el binario**:
   ```bash
   scp madmail root@[IP_DE_TU_SERVIDOR]:/root/
   ```
2. **Ejecuta la instalación**:
   ```bash
   ssh root@[IP_DE_TU_SERVIDOR] "chmod +x /root/madmail && ./root/madmail install --simple --ip [IP_DE_TU_SERVIDOR] && systemctl start maddy"
   ```

</Step>
</Steps>

*Sustituye `[IP_DE_TU_SERVIDOR]` por la IP real de tu servidor.*

## Configuración avanzada

### Gestión del auto-registro (JIT)
El registro JIT (Just-In-Time) permite que las cuentas se creen automáticamente cuando un usuario inicia sesión por primera vez.

```bash
# Habilitar la creación automática de cuentas
sudo maddy --config /etc/maddy/maddy.conf creds jit enable

# Deshabilitar la creación automática de cuentas
sudo maddy --config /etc/maddy/maddy.conf creds jit disable

# Consultar el estado
sudo maddy --config /etc/maddy/maddy.conf creds jit status
```

### Puertos requeridos
Asegúrate de que los siguientes puertos estén abiertos en tu cortafuegos:
- **80 / 443**: Interfaz de usuario para el registro web y la incorporación.
- **25**: SMTP (Federación con otros servidores).
- **465 / 587**: Envío SMTP (Envío de mensajes).
- **143 / 993**: IMAP (Recepción de mensajes).
- **3340**: Relay Iroh (Requerido para las funciones en tiempo real de Webxdc).

## Actualización de Madmail
El comando integrado `update` verifica automáticamente las firmas digitales:

```bash
sudo maddy update https://github.com/themadorg/madmail/releases/latest/download/madmail
```

## Soporte de la comunidad
Para obtener los últimos binarios y consejos:
👉 [Canal de Telegram de Madmail](https://t.me/the_madmail)

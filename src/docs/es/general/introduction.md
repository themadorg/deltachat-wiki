---
title: Introducción a Delta Chat
description: ¿Qué es Delta Chat, cómo funciona y por qué deberías probarlo?
category: Primeros pasos
order: 1
---

<script>
  import DCFeatureCard from '$lib/components/DCFeatureCard.svelte';
  import ToolCard from '$lib/components/ToolCard.svelte';
  import ToolGrid from '$lib/components/ToolGrid.svelte';
</script>

# ¿Qué es Delta Chat?

Delta Chat es una aplicación de mensajería instantánea fiable, descentralizada y segura que se ve y funciona como WhatsApp o Signal. Puedes enviar mensajes de texto, fotos, videos, notas de voz y archivos. Puedes crear grupos y añadir reacciones con emojis. Se siente familiar desde el primer momento.

Pero Delta Chat es **fundamentalmente diferente** de todos los demás mensajeros. He aquí por qué:

**Delta Chat no tiene sus propios servidores.** En su lugar, utiliza la red de correo electrónico existente, el sistema de mensajería más grande y abierto del mundo. Cualquier persona con una dirección de correo electrónico puede chatear contigo.

<DCFeatureCard title="No se necesita número de teléfono" icon="Smartphone">

No necesitas un número de teléfono para usar Delta Chat. Solo abre la aplicación, crea un perfil y empieza a chatear. Utiliza [relays de chatmail](https://chatmail.at/relays) seguros e interoperables para que puedas empezar al instante.

</DCFeatureCard>

## ¿Cómo funciona?

Cuando envías un mensaje en Delta Chat, este viaja a través de servidores de correo electrónico. Pero nunca ves ningún correo electrónico: la aplicación se encarga de todo automáticamente con una interfaz de chat moderna.

- Si **ambas personas** usan Delta Chat, los mensajes se **cifran de extremo a extremo** automáticamente utilizando el estándar OpenPGP.
- Si la otra persona **no usa** Delta Chat, recibirá tu mensaje como un correo electrónico normal. Tu respuesta aparecerá como un mensaje de chat en tu aplicación.

Esto significa que puedes comunicarte con **cualquier persona que tenga una dirección de correo electrónico**, incluso si nunca ha oído hablar de Delta Chat.

## ¿Qué hace especial a Delta Chat?

### Descentralizado y estandarizado
No hay ninguna empresa central que controle tus mensajes. No hay un único servidor que pueda cerrarse. Delta Chat se basa en [Estándares de Internet](https://github.com/chatmail/core/blob/main/standards.md#standards-used-in-delta-chat), lo que garantiza que funcione con diferentes proveedores y aplicaciones.

### Multinivel y multidispositivo
Puedes usar el mismo perfil en [múltiples dispositivos](https://delta.chat/en/help#multiclient), e incluso tener [múltiples perfiles](https://delta.chat/en/help#multiple-accounts) en el mismo dispositivo (por ejemplo, para el trabajo, la familia o actividades políticas).

### Tú eres el dueño de tus datos
Tus mensajes se almacenan en **tu dispositivo**, no en la nube de una empresa. Ninguna corporación lee tus mensajes, vende tus datos o cambia las reglas a su antojo.

### Código abierto y auditado
Todo el código de Delta Chat está [disponible públicamente en GitHub](https://github.com/deltachat). La aplicación y su cifrado han sido sometidos a [seis auditorías de seguridad independientes](https://delta.chat/en/help#security-audits) entre 2019 y 2024 para garantizar su seguridad frente a ataques a la red y al servidor.

### Gratis, de todas las formas
Delta Chat es completamente gratuito. Sin suscripciones, sin niveles premium y sin anuncios. Nunca.

## ¿Quién está detrás de Delta Chat?

Delta Chat fue iniciado en 2017 por Bjoern Petersen, del norte de Alemania, como un fork de Telegram para Android, utilizando servidores de correo electrónico como backend en lugar de servidores centralizados. El esfuerzo evolucionó hacia un gran esfuerzo comunitario arraigado en la comunidad hacker FOSS europea. Hoy en día, colaboradores de todos los continentes producen aplicaciones de Delta Chat para todas las plataformas, desarrollan [relays de chatmail](https://chatmail.at) y el ecosistema [webxdc](/webxdc/overview). Hay más de 150 relays de servidores de correo operados por la comunidad, con una fracción listada públicamente en [chatmail.at](https://chatmail.at).

## ¿Listo para probarlo?

Empezar lleva menos de dos minutos:

1. **Descarga** Delta Chat desde [delta.chat](https://delta.chat/en) — disponible para Android, iOS, Windows, macOS y Linux.
2. **Abre la aplicación** y toca "Crear nuevo perfil".
3. **Introduce un nombre o apodo**: no se requieren datos personales.
4. **¡Empieza a chatear!** Añade contactos escaneando códigos QR o compartiendo enlaces de invitación.

Eso es todo. Ya estás dentro.

## Explora la guía

<ToolGrid cols={2}>
  <ToolCard
    title="Instalación"
    description="Guía paso a paso para configurar Delta Chat en dispositivos móviles y de escritorio."
    icon="Download"
    href="general/installation"
  />
  <ToolCard
    title="Características"
    description="Descubre todo lo que puedes hacer, desde grupos hasta mensajes que desaparecen."
    icon="MessageSquare"
    href="general/features"
  />
  <ToolCard
    title="Privacidad y Seguridad"
    description="Conoce cómo Delta Chat protege tus datos con cifrado de extremo a extremo."
    icon="Shield"
    href="general/privacy"
  />
  <ToolCard
    title="Apps Webxdc"
    description="Explora el mundo de las mini-apps que se ejecutan directamente dentro de tus chats."
    icon="Box"
    href="webxdc/overview"
  />
</ToolGrid>

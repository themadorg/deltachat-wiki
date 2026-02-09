---
title: Características
description: Todo lo que Delta Chat puede hacer - mensajería, grupos, cifrado y más.
---

<script>
  import DCFeatureCard from '$lib/components/DCFeatureCard.svelte';
</script>

# Características de Delta Chat

Delta Chat tiene todo lo que esperas de un mensajero moderno, y algunas características únicas que ninguna otra aplicación ofrece.

## Mensajería

<DCFeatureCard title="Organizando tus Chats" icon="Layers">

Mantén tu lista de chats limpia y organizada:
- **Ancla** chats importantes en la parte superior para un acceso rápido.
- **Silencia** chats si no quieres recibir notificaciones.
- **Archiva** chats para ocultarlos de la lista principal. Volverán a aparecer cuando llegue un nuevo mensaje (a menos que estén silenciados).

</DCFeatureCard>

<DCFeatureCard title="Mensajes guardados y Notas" icon="Bookmark">

Usa el chat de **Mensajes guardados** para llevar un registro de información importante o tomar notas personales. Puedes guardar mensajes de cualquier chat y se sincronizarán en todos tus dispositivos.

</DCFeatureCard>

<DCFeatureCard title="Texto, Fotos, Videos y Archivos" icon="MessageSquare">

Envía fotos, videos, notas de voz y documentos. Por defecto, las imágenes están optimizadas para el rendimiento, pero puedes enviarlas como un "archivo" para conservar la calidad original.

</DCFeatureCard>

<DCFeatureCard title="Reacciones, Respuestas y Ediciones" icon="Heart">

Reacciona con emojis, responde a mensajes específicos e incluso **edita tus mensajes** después de enviarlos para corregir erratas.

</DCFeatureCard>

<DCFeatureCard title="Mensajes que desaparecen" icon="Clock">

Configura los mensajes para que se eliminen automáticamente después de un tiempo elegido (desde 5 minutos hasta 1 año). El temporizador comienza cuando el destinatario ve el mensaje por primera vez.

</DCFeatureCard>

## Grupos

- **Chats de grupo**: Crea grupos con tantas personas como quieras.
- **Grupos verificados**: Seguridad adicional con cifrado verificado. Los miembros se unen escaneando un código QR, lo que hace imposible que extraños se cuelen.
- **Añadir e introducir**: Añade fácilmente contactos a grupos existentes o comparte un contacto en un chat para presentar a amigos entre sí.

## Conociendo el estado

Delta Chat utiliza marcas de verificación simples para mostrar el estado de tus mensajes:
- **Una marca (✓)**: Mensaje enviado con éxito al servidor relay.
- **Dos marcas (✓✓)**: El destinatario ha leído el mensaje (requiere que ambos lados tengan habilitados los Confirmaciones de lectura).
- **Punto verde**: Indica que un contacto ha estado activo recientemente (en los últimos 10 minutos).

## Cifrado

<DCFeatureCard title="Cifrado de extremo a extremo" icon="Lock">

Los mensajes entre usuarios de Delta Chat se cifran automáticamente utilizando el estándar OpenPGP y el protocolo [Autocrypt](https://autocrypt.org). [Autocrypt v2](https://autocrypt2.org), programado para 2026, traerá cifrado resistente a la computación cuántica y secreto hacia adelante (forward secrecy). Solo tú y la otra persona pueden leerlos.

</DCFeatureCard>

El cifrado es totalmente automático. No necesitas gestionar claves. Para una máxima seguridad, puedes verificar los contactos escaneando códigos QR en persona.

## Funciona con cualquier persona

Esta es la característica más única de Delta Chat. Debido a que utiliza la red de correo electrónico:
- Puedes **enviar mensajes a cualquier persona con una dirección de correo electrónico**, incluso si no tienen Delta Chat.
- Reciben tu mensaje como un correo electrónico normal, y su respuesta aparece en tu chat.

## Apps Webxdc

<DCFeatureCard title="Apps dentro del chat" icon="Box">

Delta Chat soporta **webxdc**: pequeñas aplicaciones web que se ejecutan directamente dentro de tu chat. Juega a juegos, comparte encuestas y colabora en listas, todo sin ningún tipo de rastreo.

</DCFeatureCard>

Las aplicaciones Webxdc son archivos pequeños que puedes compartir en cualquier chat. Funcionan sin conexión, no tienen rastreo y tus datos permanecen en tu dispositivo. Hay una colección creciente de aplicaciones en la [Tienda de Aplicaciones Webxdc](https://webxdc.org/apps).

## Soporte multidispositivo

Usa Delta Chat en **múltiples dispositivos al mismo tiempo** (teléfono, tableta, computadora). Tus mensajes y Mensajes guardados se sincronizan sin problemas. Añadir un nuevo dispositivo es tan fácil como escanear un código QR.

## Servidores Chatmail

Cuando creas un perfil con "Configuración instantánea", Delta Chat te conecta a un **servidor Chatmail**. Estos son servidores especiales optimizados para el chat:

- **Registro anónimo**: No se requiere información personal.
- **Los mensajes no se almacenan permanentemente**: Se eliminan del servidor tan pronto como se entregan a tu dispositivo (normalmente en cuestión de horas, máximo 40 días).
- **Muy rápido**: Diseñado específicamente para la mensajería instantánea.
- **Extremadamente eficiente**: Cerca de 100.000 usuarios pueden ser atendidos por aproximadamente 500 € al año en costes operativos.

También puedes gestionar tu propio servidor Chatmail si quieres tener el control total.

## Videollamadas

Aunque Delta Chat no tiene videollamadas integradas, puedes integrar fácilmente herramientas de código abierto como **Jitsi Meet**. Solo tienes que añadir la URL de un servidor Jitsi en los ajustes y podrás iniciar videollamadas directamente desde cualquier chat.

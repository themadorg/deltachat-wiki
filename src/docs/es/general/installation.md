---
title: Instalación y configuración
description: Cómo instalar Delta Chat en tu teléfono o computadora y empezar a chatear en minutos.
category: Primeros pasos
order: 2
---

<script>
  import DCFeatureCard from '$lib/components/DCFeatureCard.svelte';
  import Step from '$lib/components/Step.svelte';
  import DownloadCard from '$lib/components/DownloadCard.svelte';
  import DownloadGrid from '$lib/components/DownloadGrid.svelte';
</script>

# Instalando Delta Chat

Delta Chat está disponible en todas las plataformas principales. Es gratuito para descargar desde las tiendas de aplicaciones oficiales y directamente desde el sitio web del desarrollador. Las versiones de escritorio no requieren que Delta Chat esté instalado en un teléfono.

## Dónde conseguirlo

<DownloadGrid>
  <DownloadCard 
    platform="Android" 
    icon="Smartphone" 
    description="Teléfonos y Tabletas"
    links={[
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=chat.delta", type: "primary" },
      { label: "Descargar APK", href: "https://download.delta.chat/android/deltachat-gplay-release-2.35.0.apk", type: "secondary" },
      { label: "F-Droid", href: "https://f-droid.org/en/packages/chat.delta/", type: "secondary" },
      { label: "Código Fuente", href: "https://github.com/deltachat/deltachat-android", type: "code" }
    ]}
  />

  <DownloadCard 
    platform="iOS / iPhone" 
    icon="Smartphone" 
    description="iPhone y iPad"
    links={[
      { label: "App Store", href: "https://apps.apple.com/app/delta-chat/id1333069216", type: "primary" },
      { label: "Código Fuente", href: "https://github.com/deltachat/deltachat-ios", type: "code" }
    ]}
  />

  <DownloadCard 
    platform="Windows" 
    icon="Monitor" 
    description="Escritorio y Portátil"
    links={[
      { label: "Descargar Setup.exe", href: "https://download.delta.chat/desktop/v2.35.0/DeltaChat-2.35.0-Setup.x64.exe", type: "primary" },
      { label: "Versión Portable", href: "https://download.delta.chat/desktop/v2.35.0/DeltaChat-2.35.0-Portable.x64.exe", type: "secondary" }
    ]}
    commands={["winget install 9PJTXX7HN3PK"]}
  />

  <DownloadCard 
    platform="macOS" 
    icon="Monitor" 
    description="Intel y Apple Silicon"
    links={[
      { label: "Universal .dmg", href: "https://download.delta.chat/desktop/v2.35.0/DeltaChat-2.35.0-universal.dmg", type: "primary" },
      { label: "Apple Silicon", href: "https://download.delta.chat/desktop/v2.35.0/DeltaChat-2.35.0-arm64.dmg", type: "secondary" }
    ]}
    commands={["brew install --cask deltachat"]}
  />

  <DownloadCard 
    platform="Linux" 
    icon="Monitor" 
    description="Flatpak, AppImage, DEB, RPM"
    links={[
      { label: "Descargar AppImage", href: "https://download.delta.chat/desktop/v2.35.0/DeltaChat-2.35.0-x86_64.AppImage", type: "primary" },
      { label: "Debian / Ubuntu", href: "https://download.delta.chat/desktop/v2.35.0/deltachat-desktop_2.35.0_amd64.deb", type: "secondary" },
      { label: "Fedora / RPM", href: "https://download.delta.chat/desktop/v2.35.0/deltachat-desktop-2.35.0.x86_64.rpm", type: "secondary" }
    ]}
    commands={["flatpak install flathub chat.delta.desktop"]}
  />
</DownloadGrid>

👉 Visita la [página oficial de descargas de Delta Chat](https://delta.chat/en/download) para obtener todos los enlaces, sumas de comprobación y detalles técnicos.

## Configuración de tu cuenta

Hay dos formas de empezar con Delta Chat:

### Opción 1: Configuración instantánea (Recomendado)

Esta es la forma más rápida y privada de empezar. No se necesita un correo electrónico existente.

<Step number={1}>

  Abre la aplicación y toca **"Crear nuevo perfil"**.

</Step>

<Step number={2}>

  Escribe un **nombre o apodo**. Esto es lo que verán tus contactos.

</Step>

<Step number={3} isLast={true}>

  Toca **"Aceptar y crear perfil"**. ¡Hecho! La aplicación crea automáticamente una cuenta aleatoria en un servidor Chatmail.

</Step>

Eso es todo: **sin correo electrónico, sin número de teléfono, sin contraseña** que recordar. La aplicación almacena tus credenciales de forma segura en tu dispositivo.

### Opción 2: Usa tu correo electrónico actual

Si ya tienes una dirección de correo electrónico y quieres usarla:

<Step number={1}>

  Abre la aplicación y elige **"Usar otro servidor"** o **"Iniciar sesión con correo electrónico"**.

</Step>

<Step number={2}>

  Introduce tu **dirección de correo electrónico** y **contraseña**.

</Step>

<Step number={3} isLast={true}>

  La aplicación detectará tu servidor de correo automáticamente. Algunos proveedores (como Gmail) requieren una **Contraseña de aplicación** en lugar de tu contraseña habitual.

</Step>

> **Consejo de los desarrolladores:** *"Recomendamos obtener una dirección de correo electrónico separada para chatear con Delta Chat, ya que mezclar el correo electrónico normal con el chat instantáneo puede ser confuso".*

## Añadiendo contactos

Después de la configuración, puedes conectarte con personas de varias maneras:

- **Escanear un código QR**: La forma más segura. Reúnete en persona y escanead vuestros códigos QR. Esto intercambia las claves de cifrado directamente.
- **Compartir un enlace de invitación**: Envía tu enlace a través de cualquier canal (otro mensajero, correo electrónico, redes sociales).
- **Introducir una dirección de correo electrónico**: Si conoces el correo de alguien, puedes enviarle un mensaje directamente. Recibirán tu mensaje incluso si no usan Delta Chat.

## Usando múltiples dispositivos

¿Quieres Delta Chat en tu teléfono Y en tu computadora? Añadir un segundo dispositivo es fácil:

1. En tu nuevo dispositivo, elige **"Añadir como segundo dispositivo"**.
2. En tu dispositivo actual, ve a **Ajustes → Añadir segundo dispositivo**.
3. **Escanea el código QR** que se muestra en pantalla.

Tus mensajes y contactos se sincronizarán con el nuevo dispositivo.

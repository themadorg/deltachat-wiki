---
title: Configuración de un relay de chatmail
description: Todo lo necesario para configurar un relay de chatmail listo para usar.
category: Servidores
---

<script>
    import Steps from '$lib/components/Steps.svelte';
    import Step from '$lib/components/Step.svelte';
</script>

# Configuración de un relay de chatmail

Este apartado contiene todo lo necesario para configurar un relay de chatmail listo para usar.
La configuración automatizada está diseñada y optimizada para proporcionar direcciones de chatmail para una incorporación inmediata y sin necesidad de permisos a través de aplicaciones de chat y bots.
Las direcciones de chatmail se crean automáticamente en el primer inicio de sesión, tras lo cual se requiere la contraseña especificada inicialmente para enviar y recibir mensajes a través de ellas.

## Requisitos mínimos y prerrequisitos

Necesitarás lo siguiente:

- **Control sobre un dominio** a través de un proveedor de DNS de tu elección.
- Un **servidor de despliegue con Debian 12** con los puertos SMTP/SUBMISSIONS/IMAPS/HTTPS accesibles. Se recomienda el uso de IPv6 si está disponible. Los servidores de relay de chatmail solo requieren 1 GB de RAM, una CPU y quizás 10 GB de almacenamiento para unos pocos miles de direcciones de chatmail activas.
- Una **máquina de construcción Linux o Unix** con acceso SSH basado en clave al usuario root del servidor de despliegue. Debes añadir una clave privada protegida por frase de paso a tu ssh-agent local porque no podrás escribir tu frase de paso durante el despliegue. (Se requiere una clave privada ed25519 debido a un [error en paramiko](https://github.com/paramiko/paramiko/issues/2191))

## Configuración con scripts/cmdeploy

Utilizamos `chat.example.org` como dominio de chatmail en los siguientes pasos. Por favor, sustitúyelo por tu propio dominio.

<Steps>
<Step number="1" title="Configuración de los registros DNS iniciales">

Configura los registros DNS iniciales para tu servidor de despliegue. El siguiente es un ejemplo en el formato de archivo de zona BIND con un TTL de 1 hora (3600 segundos). Por favor, sustituye tu dominio y tus direcciones IP.

```text
chat.example.org. 3600 IN A 198.51.100.5
chat.example.org. 3600 IN AAAA 2001:db8::5
www.chat.example.org. 3600 IN CNAME chat.example.org.
mta-sts.chat.example.org. 3600 IN CNAME chat.example.org.
```

</Step>
<Step number="2" title="Clonar el repositorio">

Clona el repositorio e inicializa el virtualenv de Python en tu PC local:

```sh
git clone https://github.com/chatmail/relay
cd relay
scripts/initenv.sh
```

</Step>
<Step number="3" title="Crear un archivo de configuración">

Crea un archivo de configuración de chatmail `chatmail.ini` en tu máquina de construcción local:

```sh
scripts/cmdeploy init chat.example.org  # <-- usa tu dominio
```

</Step>
<Step number="4" title="Verificar el inicio de sesión root por SSH">

Verifica que el inicio de sesión root por SSH al servidor de despliegue funciona:

```sh
ssh root@chat.example.org  # <-- usa tu dominio
```

</Step>
<Step number="5" title="Instalación y configuración" isLast={true}>

Instala y configura el servidor de despliegue remoto:

```sh
scripts/cmdeploy run
```

Este script también comprobará que tienes todos los registros DNS necesarios. Si faltan registros DNS, te recomendará cuáles debes configurar en tu proveedor de DNS.

</Step>
</Steps>

## Otros comandos útiles

Para comprobar el estado de tu servidor de despliegue:
```sh
scripts/cmdeploy status
```

Para mostrar y comprobar todos los registros DNS recomendados:
```sh
scripts/cmdeploy dns
```

Para comprobar si tu servicio de chatmail funciona correctamente:
```sh
scripts/cmdeploy test
```

Para medir el rendimiento de tu servicio de chatmail:
```sh
scripts/cmdeploy bench
```

## Modificar la página de inicio

`cmdeploy run` también crea páginas web estáticas por defecto y las despliega en un servidor web Nginx:
- `index.html`: página de inicio por defecto con un código QR para una fácil incorporación.
- `info.html`: enlazada desde la página de inicio.
- `policy.html`: página de la política de privacidad.

Todos los archivos `.html` se generan a partir de los archivos markdown `.md` correspondientes en el directorio `www/src`.

## Perfeccionamiento de las páginas web

```sh
scripts/cmdeploy webdev
```
Esto inicia un ciclo de desarrollo local interactivo para las páginas web de chatmail, permitiéndote previsualizar los cambios en tiempo real.

## Páginas web personalizadas

Puedes omitir la subida de una página web configurando `www_folder=disabled` en `chatmail.ini`.
Para utilizar un directorio personalizado para tus páginas web, establece `www_folder` en ese directorio. `cmdeploy run` lo subirá como la página de inicio del servidor.

## Desactivar la creación automática de direcciones

Si necesitas detener la creación de direcciones, inicia sesión por SSH en la máquina de despliegue y ejecuta:
```sh
touch /etc/chatmail-nocreate
```

## Migrar a una nueva máquina de construcción

Para mover o añadir una máquina de construcción, clona el repositorio en la nueva máquina y copia el archivo `chatmail.ini` de la antigua. Asegúrate de que `rsync` esté instalado, luego:

```sh
./scripts/initenv.sh
./scripts/cmdeploy dns
./scripts/cmdeploy status
```

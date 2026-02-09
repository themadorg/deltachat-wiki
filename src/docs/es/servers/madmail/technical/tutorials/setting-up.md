---
title: Instalación y configuración inicial
description: Una guía práctica sobre cómo configurar un servidor de correo utilizando Madmail para uso personal.
category: Tutoriales
---

# Instalación y configuración inicial

Esta es la guía práctica sobre cómo configurar un servidor de correo utilizando maddy para uso personal. Omite la mayoría de los detalles técnicos en aras de la brevedad y simplemente ofrece la lista mínima de cosas de las que debes ser consciente y qué hacer para que las cosas funcionen.

Con fines de claridad, en este tutorial se utilizan estos valores como ejemplos; dondequiera que los veas, debes sustituirlos por tus valores reales:

- Dominio: ejemplo.org
- Dominio MX (nombre de host): mx1.ejemplo.org
- Dirección IPv4: 10.2.3.4
- Dirección IPv6: 2001:beef::1

## Obtener un servidor

Dónde conseguir un servidor para ejecutar maddy está fuera del alcance de este artículo. Cualquier VPS (servidor privado virtual) funcionará bien para configuraciones pequeñas. No obstante, hay que tener en cuenta algunas cosas:

- Asegúrate de que tu proveedor no bloquea el tráfico SMTP (puerto TCP 25). La mayoría de los proveedores de VPS no lo hacen, pero algunos proveedores de "nube" (como Google Cloud) sí lo hacen, por lo que no podrías alojar tu correo allí.

- Se recomienda ejecutar tu propio resolvedor DNS con la verificación DNSSEC activada.

## Instalación de maddy

Tus opciones son:

* Tarball precompilado (Linux, amd64)

    Disponible en [GitHub](https://github.com/foxcpp/maddy/releases) o en [maddy.email/builds](https://maddy.email/builds/).

	El tarball incluye el ejecutable de maddy que puedes copiar en `/usr/local/bin`, así como el archivo de unidad de systemd que puedes utilizar en las distribuciones basadas en systemd para el arranque automático y la supervisión del servicio. También deberías crear el usuario y el grupo "maddy". Más adelante encontrarás instrucciones más detalladas.

* Imagen de Docker (Linux, amd64)

    ```
    docker pull foxcpp/maddy:0.6
    ```

    Consulta [aquí](../../docker) para ver las instrucciones específicas de Docker.

* Construcción desde el código fuente

    Consulta [aquí](../building-from-source) para ver las instrucciones (en inglés).

* Paquetes de Arch Linux

	Para los usuarios de Arch Linux, los PKGBUILDs `maddy` y `maddy-git` están disponibles en el AUR. Además, existen paquetes binarios disponibles en el repositorio de terceros en [https://maddy.email/archlinux/](https://maddy.email/archlinux/).

## Configuración del sistema (distribución basada en systemd)

Si has construido maddy desde el código fuente y has utilizado `./build.sh install`, los archivos de unidad de systemd deberían estar ya instalados. Si has utilizado un tarball precompilado, copia manualmente `systemd/*.service` a `/etc/systemd/system`.

Debes recargar la configuración del gestor de servicios para que el servicio esté disponible:

```
systemctl daemon-reload
```

Además, deberías crear el usuario y el grupo maddy. A diferencia de la mayoría de los demás servidores de correo de Linux, maddy nunca se ejecuta como root.

```
useradd -mrU -s /sbin/nologin -d /var/lib/maddy -c "servidor de correo maddy" maddy
```

## Nombre de host + dominio

Abre `/etc/maddy/maddy.conf` con tu editor favorito y cambia las siguientes líneas para que coincidan con el nombre de tu servidor y con el dominio para el que quieres gestionar el correo.
Si configuras un servidor de correo muy pequeño, puedes usar ejemplo.org en ambos campos. No obstante, para facilitar una futura migración del servicio, se recomienda utilizar una entrada DNS independiente para ese fin. Normalmente es mx1.ejemplo.org, mx2, etc. Por supuesto, puedes utilizar otro subdominio, por ejemplo: smtp1.ejemplo.org. Un servidor de respaldo de correo (failover) será posible si diriges mx2.ejemplo.org a otro servidor (siempre que lo configures para gestionar tu dominio).

```
$(hostname) = mx1.ejemplo.org
$(primary_domain) = ejemplo.org
```

Si quieres gestionar varios dominios, todavía tienes que designar uno como "primario". Añade todos los demás dominios a la línea `local_domains`:

```
$(local_domains) = $(primary_domain) ejemplo.com otro.ejemplo.com
```

## Certificados TLS

Una cosa que no se puede configurar automáticamente son los certificados TLS. Si ya los tienes en algún sitio, utilízalos: abre `/etc/maddy/maddy.conf` y pon las rutas correctas. Debes asegurarte de que maddy pueda leerlos mientras se ejecuta como usuario sin privilegios (maddy nunca se ejecuta como root, ni siquiera durante el arranque); una forma de hacerlo es utilizar ACLs (sustituye por tus rutas reales):
```
$ sudo setfacl -R -m u:maddy:rX /etc/ssl/mx1.ejemplo.org.crt /etc/ssl/mx1.ejemplo.org.key
```

maddy recarga los certificados TLS desde el disco una vez por minuto, por lo que detectará la renovación. Es posible forzar la recarga mediante `systemctl reload maddy` (o simplemente `killall -USR2 maddy`).

### Let's Encrypt y certbot

Si utilizas certbot para gestionar tus certificados, puedes simplemente crear un enlace simbólico de `/etc/maddy/certs` hacia `/etc/letsencrypt/live`. maddy elegirá el certificado correcto dependiendo del dominio que hayas especificado durante la instalación.

No obstante, aún tienes que hacer que las claves sean legibles para maddy:
```
$ sudo setfacl -R -m u:maddy:rX /etc/letsencrypt/{live,archive}
```

### ACME.sh

Si utilizas acme.sh para gestionar tus certificados, podrías simplemente ejecutar:

```
mkdir -p /etc/maddy/certs/mx1.ejemplo.org
acme.sh --force --install-cert -d mx1.ejemplo.org \
  --key-file       /etc/maddy/certs/mx1.ejemplo.org/privkey.pem  \
  --fullchain-file /etc/maddy/certs/mx1.ejemplo.org/fullchain.pem
```

## Primera ejecución

```
systemctl start maddy
```

El demonio debería estar funcionando ahora, salvo que es inútil porque no hemos configurado los registros DNS.

## Registros DNS

Cómo se configure depende de tu proveedor de DNS (o servidor, si ejecutas el tuyo propio). Así es como debería ser tu zona DNS:
```
; Registros básicos dominio->IP, probablemente ya los tengas.
ejemplo.org.   A     10.2.3.4
ejemplo.org.   AAAA  2001:beef::1

; Dice que el "servidor mx1.ejemplo.org está gestionando los mensajes para ejemplo.org".
ejemplo.org.   MX    10 mx1.ejemplo.org.
; Por supuesto, mx1 también debe tener una entrada A/AAAA:
mx1.ejemplo.org.   A     10.2.3.4
mx1.ejemplo.org.   AAAA  2001:beef::1

; Usa SPF para decir que los servidores en el "MX" de arriba están autorizados a enviar correo
; para este dominio, y nadie más.
ejemplo.org.     TXT   "v=spf1 mx ~all"
; Se recomienda servir el registro SPF tanto para el dominio como para el nombre de host del MX
mx1.ejemplo.org. TXT   "v=spf1 a ~all"

; Suscríbete a DMARC con una política permisiva y solicita informes sobre mensajes con fallos.
_dmarc.ejemplo.org.   TXT    "v=DMARC1; p=quarantine; ruf=mailto:postmaster@ejemplo.org"

; Marca el dominio como compatible con MTA-STS (consulta la siguiente sección)
; y solicita que los informes sobre fallos se envíen a postmaster@ejemplo.org
_mta-sts.ejemplo.org.   TXT    "v=STSv1; id=1"
_smtp._tls.ejemplo.org. TXT    "v=TLSRPTv1;rua=mailto:postmaster@ejemplo.org"
```

Y el último, la clave DKIM, es un poco complicado. maddy generó una clave para ti en el primer arranque. Puedes encontrarla en `/var/lib/maddy/dkim_keys/ejemplo.org_default.dns`. Debes ponerla en un registro TXT para el dominio `default._domainkey.ejemplo.org.`, de esta manera:
```
default._domainkey.ejemplo.org.    TXT   "v=DKIM1; k=ed25519; p=nAcUUozPlhc4VPhp7hZl+owES7j7OlEv0laaDEDBAqg="
```

## MTA-STS y DANE

Por defecto, SMTP no está protegido contra ataques activos. La política MTA-STS indica a los remitentes compatibles que utilicen siempre TLS debidamente autenticado al hablar con tu servidor, ofreciendo una forma sencilla de desplegar una protección para tu servidor contra los ataques MitM en el puerto 25.

Básicamente, tienes que crear un archivo con el siguiente contenido y hacerlo disponible en `https://mta-sts.ejemplo.org/.well-known/mta-sts.txt`:
```
version: STSv1
mode: enforce
max_age: 604800
mx: mx1.ejemplo.org
```

**Nota**: mx1.ejemplo.org en el archivo es el nombre de host de tu MX. En una configuración sencilla, será el mismo que tu nombre de host ejemplo.org.
en configuraciones más complejas, tendrías varios servidores MX; añádelos todos, uno por línea, así:

```
mx: mx1.ejemplo.org
mx: mx2.ejemplo.org
```

También se recomienda establecer un registro TLSA (DANE).
Usa https://www.huque.com/bin/gen_tlsa para generar uno.
Establece el puerto en 25, el Protocolo de Transporte en "tcp" y el Nombre de Dominio en **el nombre de host del MX**.
Ejemplo de un registro válido:
```
_25._tcp.mx1.ejemplo.org. TLSA 3 1 1 7f59d873a70e224b184c95a4eb54caa9621e47d48b4a25d312d83d96e3498238
```

## Cuentas de usuario y el comando maddy

Un servidor de correo es inútil sin buzones, ¿verdad? A diferencia de programas como postfix y dovecot, maddy utiliza "usuarios virtuales" por defecto, lo que significa que no le importan ni conoce los usuarios del sistema.

Los buzones IMAP ("cuentas") y las credenciales de autenticación se mantienen separados.

Para registrar las credenciales de un usuario, utiliza el comando `maddy creds create`.
De esta manera:
```
$ maddy creds create postmaster@ejemplo.org
```

Ten en cuenta que el nombre de usuario es una dirección de correo electrónico. Esto es necesario ya que el nombre de usuario se utiliza para autorizar el acceso IMAP y SMTP (a menos que configures asignaciones personalizadas, que no se describen aquí).

Tras registrar las credenciales del usuario, también debes crear una cuenta de almacenamiento local:
```
$ maddy imap-acct create postmaster@ejemplo.org
```

Nota: para ejecutar los comandos de la CLI de `maddy`, tu usuario debe estar en el grupo `maddy`. Alternativamente, simplemente usa `sudo -u maddy`.

Eso es todo. Ahora tienes tu primera dirección de correo electrónico. Cuando te autentiques con tu cliente de correo, no olvides que el nombre de usuario es "postmaster@ejemplo.org", no simplemente "postmaster".

Puede que te resulten útiles los comandos `maddy creds --help` y `maddy imap-acct --help` para conocer otros comandos. Ten en cuenta que las cuentas IMAP y las credenciales se gestionan por separado, aunque los nombres de usuario deben coincidir de forma predeterminada para que todo funcione.

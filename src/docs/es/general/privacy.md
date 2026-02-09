---
title: Privacidad y Seguridad
description: Cómo Delta Chat protege tus mensajes, tus datos y tu identidad.
---

<script>
  import DCFeatureCard from '$lib/components/DCFeatureCard.svelte';
  import ComparisonTable from '$lib/components/ComparisonTable.svelte';

  const messengerHeaders = ["Característica", "Delta Chat", "WhatsApp", "Telegram", "Signal"];
  const messengerRows = [
    { feature: "No requiere número de teléfono", cols: [
      { status: 'yes' }, { status: 'no' }, { status: 'no' }, { status: 'no' }
    ]},
    { feature: "Metadatos mínimos", cols: [
      { status: 'yes' }, { status: 'no', text: 'Extensos' }, { status: 'no', text: 'Extensos' }, { status: 'warn', text: 'Algunos' }
    ]},
    { feature: "Sin mensajes en servidores de la empresa", cols: [
      { status: 'yes' }, { status: 'warn', text: 'Copias' }, { status: 'no' }, { status: 'yes' }
    ]},
    { feature: "Totalmente código abierto", cols: [
      { status: 'yes' }, { status: 'no' }, { status: 'warn', text: 'Parcial' }, { status: 'yes' }
    ]},
    { feature: "Descentralizado", cols: [
      { status: 'yes' }, { status: 'no' }, { status: 'no' }, { status: 'no' }
    ]},
    { feature: "Funciona sin app en el otro lado", cols: [
      { status: 'yes' }, { status: 'no' }, { status: 'no' }, { status: 'no' }
    ]},
  ];

  const e2eeHeaders = ["Característica", "Autocrypt v2", "Signal", "Matrix", "MLS"];
  const e2eeRows = [
    { feature: "Post-Cuántica", cols: [
      { status: 'yes' }, { status: 'yes' }, { status: 'dev', text: 'En des.' }, { status: 'yes' }
    ]},
    { feature: "Eliminación fiable", cols: [
      { status: 'yes' }, { status: 'yes' }, { status: 'yes', text: '+ UTD' }, { status: 'yes' }
    ]},
    { feature: "Metadatos mínimos", cols: [
      { status: 'yes' }, { status: 'warn', text: 'Binding' }, { status: 'warn', text: 'servers' }, { status: 'warn', text: 'Binding' }
    ]},
    { feature: "Descentralizado", cols: [
      { status: 'yes' }, { status: 'no' }, { status: 'yes' }, { status: 'dev', text: 'en des.' }
    ]},
    { feature: "Especificación formal", cols: [
      { status: 'yes' }, { status: 'no' }, { status: 'yes' }, { status: 'yes' }
    ]},
    { feature: "Implementación simple", cols: [
      { status: 'yes' }, { status: 'no' }, { status: 'no' }, { status: 'no' }
    ]},
  ];
</script>

# Privacidad y Seguridad

Delta Chat está diseñado desde cero para respetar tu privacidad y proteger tu comunicación. He aquí cómo.

## No se requieren datos personales

<DCFeatureCard title="Anónimo por defecto" icon="Shield">

Delta Chat no te pide tu número de teléfono, tu nombre real ni ninguna información personal. Cuando creas un perfil con un servidor Chatmail, la aplicación genera un nombre de usuario y una contraseña aleatorios, sin ninguna conexión con tu identidad real.

</DCFeatureCard>

Compara esto con WhatsApp, que requiere tu número de teléfono. O con Telegram, que también requiere un número de teléfono y almacena tus contactos en sus servidores. Delta Chat no requiere **nada**.

## Estándares de cifrado de extremo a extremo

Todos los mensajes entre usuarios de Delta Chat se cifran utilizando el consolidado estándar **OpenPGP**.

- **Autocrypt**: Establece el cifrado automáticamente entre contactos y miembros de grupos.
- **[Autocrypt v2](https://autocrypt2.org)**: Programado para su implementación completa en 2026, aportará cifrado resistente a la post-cuántica y secreto hacia adelante (forward secrecy).
- **Secure-Join**: Utiliza códigos QR o enlaces de invitación para intercambiar la configuración del cifrado de forma segura.
- **[Compartir un contacto](https://github.com/chatmail/core/blob/main/spec.md#attaching-a-contact-to-a-message)**: Permite a los receptores utilizar el cifrado con un contacto compartido al instante.
- **Auditado**: La aplicación y su cifrado han superado [seis auditorías de seguridad independientes](https://delta.chat/en/help#security-audits) entre 2019 y 2024.

Desde el lanzamiento de la versión 2 de Delta Chat (julio de 2025), el cifrado es tan central que **no hay iconos de candado ni marcadores**: todo entre usuarios de Delta Chat está simplemente cifrado por defecto, y si utilizas [relays de chatmail](https://chatmail.at/relays), es técnicamente imposible enviar o recibir mensajes sin cifrar.

## Protección de metadatos

A diferencia de la mayoría de los mensajeros, Delta Chat no almacena metadatos sobre tus contactos o grupos en los servidores. En su lugar, todos los metadatos de los grupos se cifran de extremo a extremo y se almacenan únicamente en tus dispositivos.

Los servidores solo pueden ver:
- Direcciones del remitente y del destinatario (que son aleatorias por defecto).
- Tamaño del mensaje.

Todo lo demás —contenido del mensaje, **adjuntos (incluidos los nombres de archivo)**, nombres de contactos y miembros de grupos— está completamente cifrado.

## Seguridad a prueba de futuro (Hoja de ruta 2026)

Estamos trabajando activamente en la implementación de **Autocrypt v2**, que traerá:
- **Perfect Forward Secrecy (PFS)**: Rotación automática de claves para proteger mensajes pasados si una clave se filtra.
- **Criptografía Post-Cuántica (PQC)**: Protección contra futuros ataques con ordenadores cuánticos.

Estas características están programadas para su implementación completa en 2026.

## Protección contra el embargo de dispositivos

Delta Chat ayuda a protegerte incluso si tu dispositivo es confiscado. Al utilizar [perfiles efímeros](https://delta.chat/en/help#device-seizure) y direcciones aleatorias, tu identidad y tus contactos permanecen ocultos. También puedes configurar un temporizador de autodestrucción para todos los mensajes en tu dispositivo.

## Tu dirección IP

Como la mayoría de las aplicaciones de Internet, el servidor relay necesita conocer tu dirección IP para entregar los mensajes. Las direcciones IP se utilizan únicamente para la conectividad y no se guardan ni se exponen. Para una máxima privacidad, recomendamos usar Delta Chat con una **VPN**.

## Tus mensajes, tu dispositivo

Delta Chat almacena los mensajes cifrados **solo en tu dispositivo**. No hay ninguna copia de seguridad en la nube controlada por una empresa.

En los servidores de Chatmail, los mensajes se retienen **solo temporalmente** para su entrega, normalmente solo unas pocas horas. Tras la entrega, se eliminan del servidor. Esto es fundamentalmente diferente de servicios como Telegram, donde todos los mensajes y grupos normales se almacenan en sus servidores de forma permanente.

## Contactos verificados

Para una máxima seguridad, Delta Chat admite **contactos verificados**. Cuando te reúnes con alguien en persona y escaneáis vuestros códigos QR, creáis un vínculo criptográfico que protege vuestra conversación contra ataques avanzados como la interceptación intermediaria (man-in-the-middle).

Los grupos verificados llevan esto un paso más allá: cada miembro debe estar verificado, creando un canal de comunicación verdaderamente confiable.

## Descentralización = Resiliencia

Debido a que Delta Chat utiliza la red de correo electrónico, **no hay un único punto de fallo**:

- Si un servidor deja de funcionar, solo sus usuarios se ven afectados. Todos los demás siguen chateando.
- Ninguna empresa puede cerrar toda la red con una sola decisión.
- Si un gobierno bloquea un servidor, puedes cambiar a otro o ejecutar el tuyo propio.
- Incluso configurar tu propio servidor es sencillo y cuesta menos de 10 € al mes.

Esto hace que Delta Chat sea extremadamente **resistente a la censura y a las interrupciones**.

## Código Abierto = Confianza

Todo el código de Delta Chat es de código abierto. Los expertos en seguridad pueden **auditar** el código y no hay **funciones ocultas** ni recolección secreta de datos. No tienes que confiar en las promesas de una empresa; puedes verificarlo todo tú mismo.

## Cómo se compara

<ComparisonTable 
  title="Delta Chat frente a otros mensajeros"
  headers={messengerHeaders}
  rows={messengerRows}
/>

<ComparisonTable 
  title="Comparación con otros esfuerzos de E2EE" 
  headers={e2eeHeaders}
  rows={e2eeRows} 
/>

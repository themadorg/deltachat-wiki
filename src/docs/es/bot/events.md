---
title: Referencia de eventos
description: Lista completa de los eventos del Core de Delta Chat y sus significados.
category: Bot
---

# Eventos del Core de Delta Chat

Esta es una lista exhaustiva de los eventos emitidos por el motor del Core de Delta Chat. Los bots deben escuchar estos eventos para reaccionar a diversas actividades como mensajes entrantes, cambios de conectividad o actualizaciones de configuración.

| Nombre del evento | Descripción |
| :--- | :--- |
| **DC_EVENT_ACCOUNTS_BACKGROUND_FETCH_DONE** | Indica que la obtención en segundo plano se ha completado (o ha agotado el tiempo de espera). |
| **DC_EVENT_ACCOUNTS_CHANGED** | Informa que la lista de cuentas ha cambiado (se ha eliminado o añadido una cuenta o el orden de las cuentas ha cambiado). Este evento solo lo emite el gestor de cuentas. |
| **DC_EVENT_ACCOUNTS_ITEM_CHANGED** | Informa que una propiedad de la cuenta como `is_configured`, `displayname`, `selfavatar` o `private_tag` ha cambiado. |
| **DC_EVENT_CALL_ENDED** | Una llamada entrante o saliente terminó, o no fue aceptada en 1 minuto. |
| **DC_EVENT_CHANNEL_OVERFLOW** | Informa que se han omitido algunos eventos debido al desbordamiento del canal de eventos. |
| **DC_EVENT_CHAT_DELETED** | El chat fue eliminado. |
| **DC_EVENT_CHAT_EPHEMERAL_TIMER_MODIFIED** | El temporizador de mensajes temporales del chat cambió. |
| **DC_EVENT_CHAT_MODIFIED** | El chat cambió (por ejemplo, título, avatar o miembros). |
| **DC_EVENT_CHATLIST_CHANGED** | Informa que el conjunto de chats o el orden de los chats en la lista de chats ha cambiado. |
| **DC_EVENT_CHATLIST_ITEM_CHANGED** | Informa que todos o un solo elemento de la lista de chats ha cambiado y necesita volver a renderizarse. Si `chat_id` es 0, todos los chats visibles necesitan volver a renderizarse. |
| **DC_EVENT_CONFIG_SYNCED** | Un valor de configuración sincronizado entre varios dispositivos cambió. |
| **DC_EVENT_CONFIGURE_PROGRESS** | Informa sobre el progreso de la configuración iniciado por `dc_configure()`. |
| **DC_EVENT_CONNECTIVITY_CHANGED** | La conectividad con el servidor cambió (por ejemplo, conectando, en línea, fuera de línea). |
| **DC_EVENT_CONTACTS_CHANGED** | Contacto(s) creado(s), renombrado(s), verificado(s), bloqueado(s) o eliminado(s). |
| **DC_EVENT_DELETED_BLOB_FILE** | Se emite cuando un archivo blob (imagen/adjunto) se eliminó correctamente. |
| **DC_EVENT_ERROR** | El usuario de la biblioteca debe informar de un error al usuario final. |
| **DC_EVENT_ERROR_SELF_NOT_IN_GROUP** | Una acción no se puede realizar porque requiere ser miembro del grupo. |
| **DC_EVENT_IMAP_CONNECTED** | Se emite cuando se establece la conexión IMAP y el inicio de sesión fue exitoso. |
| **DC_EVENT_IMAP_INBOX_IDLE** | Se emite antes de entrar en estado IDLE en la carpeta Inbox. |
| **DC_EVENT_IMAP_MESSAGE_DELETED** | Se emite cuando un mensaje se marcó correctamente como eliminado en el servidor IMAP. |
| **DC_EVENT_IMAP_MESSAGE_MOVED** | Se emite cuando un mensaje se movió correctamente en IMAP. |
| **DC_EVENT_IMEX_FILE_WRITTEN** | Se ha exportado un archivo (por ejemplo, durante la copia de seguridad/exportación). |
| **DC_EVENT_IMEX_PROGRESS** | Informa sobre el progreso de la importación/exportación iniciado por `dc_imex()`. |
| **DC_EVENT_INCOMING_CALL** | Se recibe una llamada entrante. |
| **DC_EVENT_INCOMING_CALL_ACCEPTED** | El destinatario aceptó una llamada entrante en este u otro dispositivo. |
| **DC_EVENT_INCOMING_MSG** | Se ha recibido un mensaje nuevo y se ha guardado en la base de datos. |
| **DC_EVENT_INCOMING_MSG_BUNCH** | La descarga de un grupo de mensajes acaba de terminar. |
| **DC_EVENT_INCOMING_REACTION** | Se recibió una reacción a un mensaje propio enviado. |
| **DC_EVENT_INCOMING_WEBXDC_NOTIFY** | Un webxdc quiere informar de un mensaje de información o de un cambio en el resumen. |
| **DC_EVENT_INFO** | Una cadena informativa se escribe en el registro. |
| **DC_EVENT_LOCATION_CHANGED** | La ubicación de uno o más contactos ha cambiado. |
| **DC_EVENT_MSG_DELETED** | Se elimina un solo mensaje. |
| **DC_EVENT_MSG_DELIVERED** | Un solo mensaje se envía correctamente y es recibido por el proveedor. |
| **DC_EVENT_MSG_FAILED** | Un solo mensaje no pudo enviarse. |
| **DC_EVENT_MSG_READ** | Un solo mensaje es marcado como leído por el receptor. |
| **DC_EVENT_MSGS_CHANGED** | Los mensajes o chats cambiaron; notificación general para refrescar la interfaz de usuario. |
| **DC_EVENT_MSGS_NOTICED** | El usuario marcó los mensajes como notados o vistos. |
| **DC_EVENT_NEW_BLOB_FILE** | Se emite cuando un nuevo archivo blob (adjunto/avatar) se escribió correctamente. |
| **DC_EVENT_OUTGOING_CALL_ACCEPTED** | Una llamada realizada con `dc_place_outgoing_call()` fue aceptada por el destinatario. |
| **DC_EVENT_REACTIONS_CHANGED** | Las reacciones a los mensajes (me gusta, respuestas con emojis) cambiaron. |
| **DC_EVENT_SECUREJOIN_INVITER_PROGRESS** | Progreso de un apretón de manos de unión segura desde la vista del invitador. |
| **DC_EVENT_SECUREJOIN_JOINER_PROGRESS** | Progreso de un apretón de manos de unión segura desde la vista del que se une. |
| **DC_EVENT_SELFAVATAR_CHANGED** | El avatar propio del usuario cambió. |
| **DC_EVENT_SMTP_CONNECTED** | Se emite cuando se establece la conexión SMTP y el inicio de sesión fue exitoso. |
| **DC_EVENT_SMTP_MESSAGE_SENT** | Se emite cuando un mensaje se envió correctamente al servidor SMTP. |
| **DC_EVENT_TRANSPORTS_MODIFIED** | Relay de transporte añadido/eliminado o el predeterminado cambió. |
| **DC_EVENT_WARNING** | Una cadena de advertencia se escribe en el registro. |
| **DC_EVENT_WEBXDC_INSTANCE_DELETED** | Se eliminó un mensaje que contenía una instancia de webxdc. |
| **DC_EVENT_WEBXDC_REALTIME_ADVERTISEMENT** | Recibido anuncio para comunicación por canal efímero de par a par. |
| **DC_EVENT_WEBXDC_REALTIME_DATA** | Datos recibidos a través de un canal efímero de par a par. |
| **DC_EVENT_WEBXDC_STATUS_UPDATE** | Actualización de estado de webxdc recibida (para sincronización de estado). |

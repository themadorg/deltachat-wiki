---
title: Events Reference
description: Full list of Delta Chat Core events and their meanings.
category: Bot
---

# Delta Chat Core Events

This is a comprehensive list of events emitted by the Delta Chat Core engine. Bots should listen for these events to react to various activities like incoming messages, connectivity changes, or configuration updates.

| Event Name | Description |
| :--- | :--- |
| **DC_EVENT_ACCOUNTS_BACKGROUND_FETCH_DONE** | Tells that the Background fetch was completed (or timed out). |
| **DC_EVENT_ACCOUNTS_CHANGED** | Inform that the list of accounts has changed (an account removed or added or the account order changes). This event is only emitted by the account manager. |
| **DC_EVENT_ACCOUNTS_ITEM_CHANGED** | Inform that an account property such as `is_configured`, `displayname`, `selfavatar`, or `private_tag` has changed. |
| **DC_EVENT_CALL_ENDED** | An incoming or outgoing call was ended, or not accepted within 1 minute. |
| **DC_EVENT_CHANNEL_OVERFLOW** | Inform that some events have been skipped due to event channel overflow. |
| **DC_EVENT_CHAT_DELETED** | Chat was deleted. |
| **DC_EVENT_CHAT_EPHEMERAL_TIMER_MODIFIED** | Chat ephemeral timer changed. |
| **DC_EVENT_CHAT_MODIFIED** | Chat changed (e.g., title, avatar, or members). |
| **DC_EVENT_CHATLIST_CHANGED** | Inform that set of chats or the order of the chats in the chatlist has changed. |
| **DC_EVENT_CHATLIST_ITEM_CHANGED** | Inform that all or a single chat list item changed and needs to be rerendered. If `chat_id` is 0, all visible chats need rerendering. |
| **DC_EVENT_CONFIG_SYNCED** | A multi-device synced config value changed. |
| **DC_EVENT_CONFIGURE_PROGRESS** | Inform about the configuration progress started by `dc_configure()`. |
| **DC_EVENT_CONNECTIVITY_CHANGED** | The connectivity to the server changed (e.g., connecting, online, offline). |
| **DC_EVENT_CONTACTS_CHANGED** | Contact(s) created, renamed, verified, blocked or deleted. |
| **DC_EVENT_DELETED_BLOB_FILE** | Emitted when a blob file (image/attachment) was successfully deleted. |
| **DC_EVENT_ERROR** | The library-user should report an error to the end-user. |
| **DC_EVENT_ERROR_SELF_NOT_IN_GROUP** | An action cannot be performed because it requires being a member of the group. |
| **DC_EVENT_IMAP_CONNECTED** | Emitted when IMAP connection is established and login was successful. |
| **DC_EVENT_IMAP_INBOX_IDLE** | Emitted before going into IDLE on the Inbox folder. |
| **DC_EVENT_IMAP_MESSAGE_DELETED** | Emitted when a message was successfully marked as deleted on the IMAP server. |
| **DC_EVENT_IMAP_MESSAGE_MOVED** | Emitted when a message was successfully moved on IMAP. |
| **DC_EVENT_IMEX_FILE_WRITTEN** | A file has been exported (e.g., during backup/export). |
| **DC_EVENT_IMEX_PROGRESS** | Inform about the import/export progress started by `dc_imex()`. |
| **DC_EVENT_INCOMING_CALL** | An incoming call is received. |
| **DC_EVENT_INCOMING_CALL_ACCEPTED** | The callee accepted an incoming call on this or another device. |
| **DC_EVENT_INCOMING_MSG** | A fresh message has been received and saved to the database. |
| **DC_EVENT_INCOMING_MSG_BUNCH** | Downloading a bunch of messages just finished. |
| **DC_EVENT_INCOMING_REACTION** | A reaction to one's own sent message was received. |
| **DC_EVENT_INCOMING_WEBXDC_NOTIFY** | A webxdc wants an info message or a changed summary to be notified. |
| **DC_EVENT_INFO** | An informational string is written to the log. |
| **DC_EVENT_LOCATION_CHANGED** | Location of one or more contact has changed. |
| **DC_EVENT_MSG_DELETED** | A single message is deleted. |
| **DC_EVENT_MSG_DELIVERED** | A single message is sent successfully and received by the provider. |
| **DC_EVENT_MSG_FAILED** | A single message could not be sent. |
| **DC_EVENT_MSG_READ** | A single message is marked as read by the receiver. |
| **DC_EVENT_MSGS_CHANGED** | Messages or chats changed; general notification to refresh UI. |
| **DC_EVENT_MSGS_NOTICED** | Messages were marked noticed or seen by the user. |
| **DC_EVENT_NEW_BLOB_FILE** | Emitted when a new blob file (attachment/avatar) was successfully written. |
| **DC_EVENT_OUTGOING_CALL_ACCEPTED** | A call placed using `dc_place_outgoing_call()` was accepted by the callee. |
| **DC_EVENT_REACTIONS_CHANGED** | Message reactions (likes, emoji responses) changed. |
| **DC_EVENT_SECUREJOIN_INVITER_PROGRESS** | Progress of a secure-join handshake from the inviter's view. |
| **DC_EVENT_SECUREJOIN_JOINER_PROGRESS** | Progress of a secure-join handshake from the joiner's view. |
| **DC_EVENT_SELFAVATAR_CHANGED** | The user's own avatar changed. |
| **DC_EVENT_SMTP_CONNECTED** | Emitted when SMTP connection is established and login was successful. |
| **DC_EVENT_SMTP_MESSAGE_SENT** | Emitted when a message was successfully sent to the SMTP server. |
| **DC_EVENT_TRANSPORTS_MODIFIED** | Transport relay added/deleted or default has changed. |
| **DC_EVENT_WARNING** | A warning string is written to the log. |
| **DC_EVENT_WEBXDC_INSTANCE_DELETED** | Message deleted which contained a webxdc instance. |
| **DC_EVENT_WEBXDC_REALTIME_ADVERTISEMENT** | Advertisement for ephemeral peer-to-peer channel communication received. |
| **DC_EVENT_WEBXDC_REALTIME_DATA** | Data received over an ephemeral peer-to-peer channel. |
| **DC_EVENT_WEBXDC_STATUS_UPDATE** | Webxdc status update received (for state synchronization). |

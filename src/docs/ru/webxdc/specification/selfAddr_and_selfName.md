---
title: selfAddr и selfName
description: Документация свойств selfAddr и selfName для webxdc.
category: Спецификация
---

# selfAddr и selfName

## selfName

```js
window.webxdc.selfName
```

`selfName` — это никнейм или отображаемое имя пользователя, которое приложение webxdc может показывать в своем интерфейсе.

## selfAddr

```js
window.webxdc.selfAddr
```

Строка («уникальный ID»), идентифицирующая пользователя в текущем приложении webxdc. Каждый пользователь приложения должен иметь свой уникальный `selfAddr`. Значение `selfAddr` должно оставаться неизменным при повторных запусках приложения тем же пользователем на том же или другом устройстве. Однако при открытии другим пользователем того же приложения или тем же пользователем другого приложения `selfAddr` **ДОЛЖЕН** быть другим, чтобы избежать отслеживания связей между приложениями. Даже если приложение заставит пользователя скопировать и вставить свой `selfAddr` в другое приложение, адреса в этих приложениях не должны совпадать.

Обратите внимание, что `selfAddr`:

-   не имеет смысла вне данного приложения webxdc;
-   не должен отображаться в интерфейсе приложения (для этого используйте `selfName`).

## Пример использования selfAddr и selfName

Ниже приведен пример простого чат-приложения, которое отправляет ответы, используя отображаемые имена, но применяет адреса для уведомлений.

```js
// Собираем всех участников чата
let users = new Set();

window.webxdc.setUpdateListener((update) => {
    const prompt = `${update.payload.senderName} (${update.payload.senderAddr}):`;
    users.add(update.payload.senderAddr);
    console.log(`${prompt} ${update.message}`);
});

// Функция отправки сообщения
function sendMessage(text) {
    let payload = {
        senderAddr: window.webxdc.selfAddr,
        senderName: window.webxdc.selfName,
        message: text
    };

    // Уведомляем всех участников, кто хоть раз отправлял сообщение
    let notify = {};
    for (const addr of users) {
        notify[addr] = `новое сообщение от ${webxdc.selfName}`;
    }

    window.webxdc.sendUpdate({
        payload: payload,
        notify: notify
    });
}
```

[`sendUpdate()`]: ./sendUpdate.html

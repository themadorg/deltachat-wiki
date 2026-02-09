---
title: API
description: Документация API для webxdc.
category: Спецификация
---

## Webxdc Javascript API

Приложения webxdc распространяются в чате, и каждое устройство запускает свой собственный экземпляр приложения, когда получатель нажимает «Запустить». Приложения изолированы от сети, но могут обмениваться состоянием через [`sendUpdate()`](./sendUpdate) и [`setUpdateListener()`](./setUpdateListener).

Мессенджеры предоставляют API через модуль `webxdc.js`. Чтобы активировать API webxdc, вам нужно добавить ссылку на скрипт `webxdc.js` в вашем приложении на HTML5:

```html
<script src="webxdc.js"></script>
```

Файл `webxdc.js` **не должен** добавляться в ваш `.xdc` файл, так как он предоставляется самим мессенджером. Для симуляции webxdc в браузере вы можете использовать файл `webxdc.js` из проекта [Hello](https://github.com/webxdc/hello) или инструмент [webxdc-dev](https://github.com/webxdc/webxdc-dev) — оба позволяют тестировать и отлаживать приложения без самого мессенджера.

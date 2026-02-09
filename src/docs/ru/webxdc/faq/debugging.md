---
title: Отладка
description: Документация по отладке приложений webxdc.
category: FAQ
---

# Отладка

## Отладка с помощью eruda.js

Если вы не можете использовать [отладку внутри Delta Chat](#отладка-внутри-delta-chat) (например, нет компьютера для подключения или вы используете iOS), вы можете попробовать [eruda.js](https://github.com/liriliri/eruda) в качестве альтернативы встроенным инструментам разработчика браузера.

1.  Загрузите [автономную версию eruda.js](https://cdn.jsdelivr.net/npm/eruda).
2.  Скопируйте `eruda.js` рядом с вашим файлом `index.html`.
3.  Добавьте следующий фрагмент в секцию `<head>` вашего `index.html`:

    ```html
    <script src="eruda.js"></script>
    <script>
      eruda.init();
    </script>
    ```

При запуске приложения webxdc в углу появится плавающая кнопка. Нажмите на неё, чтобы открыть инструменты разработчика.

## Отладка внутри Delta Chat

### Отладка webxdc в Android через Chrome DevTools

1.  Включите отладку WebView в настройках Delta Chat:
    `Настройки` > `Расширенные` > `Режим разработчика`:
    <img alt="изображение экрана расширенных настроек" src="../images/android_remote_debug_enable.png" style="max-height:40vh" />

2.  Включите режим разработчика и отладку по ADB на вашем устройстве:
    _(перейдите в системные настройки, «О телефоне», нажмите 7+ раз на «Номер сборки», пока не появится уведомление, что вы стали разработчиком. Затем в новом меню для разработчиков включите «Отладка по USB» / «ADB debugging»)._

3.  Подключите устройство к компьютеру через USB.

4.  Откройте Chromium (или Google Chrome) и перейдите по адресу `chrome://inspect/#devices`.

5.  Запустите приложение webxdc, которое хотите отладить.

6.  Нажмите кнопку `inspect` в браузере:

<p>
<img
src="../images/android_remote_debug_list.png"
alt="скриншот списка устройств в chrome dev tools"
style="max-height:40vh"
/>
</p>

| Инспектор HTML | Консоль JavaScript |
| --- | --- |
| ![инспектор инструментов разработчика](../images/android_remote_debug_inspector.png) | ![консоль инструментов разработчика](../images/android_remote_debug_console.png) |

> Не забудьте **выключить отладку по ADB** после завершения работы!

### Отладка webxdc в Delta Chat Desktop

Сначала включите инструменты разработчика для webxdc в настройках:

`Настройки` > `Расширенные` > Экспериментальные функции > `Включить инструменты разработчика Webxdc`

> Примечание: для вступления изменений в силу нужно закрыть и снова открыть активные приложения webxdc.

Запустите приложение webxdc и нажмите `F12`, чтобы открыть инструменты разработчика:

<p>
<img
src="../images/desktop_debug_open.png"
alt="скриншот окна настольной версии webxdc с инструментами разработчика"
style="max-height:40vh"
/>
</p>

Выглядит мелковато? Вы можете растянуть окно по **ширине** или **открепить** (undock) инструменты разработчика в отдельное окно:

<p>
<img
src="../images/desktop_debug_undock.png"
alt="открепление инструментов разработчика"
style="max-height:40vh"
/>
</p>

<p>
<img
src="../images/desktop_debug_extra_window.png"
alt="открепленные инструменты разработчика"
style="max-height:40vh"
/>
</p>

## Обмен переменными между скриптами в iOS

Пример кода:

`a.js`
```js
const CONFIG = { difficulty: "hard", hasCoins: true };
```

`b.js`
```js
if (CONFIG.difficulty == "hard") {
  /** делаем игру сложнее **/
}
```

`index.html`
```html
<html>
  <head>
    <!-- ... -->
  </head>
  <body>
    <!-- ... -->
    <script src="a.js"></script>
    <script src="b.js"></script>
  </body>
</html>
```

На iOS вы можете получить ошибку в консоли JS:
```
Can't find variable: CONFIG
```

Есть несколько способов решить эту проблему:
- Используйте сборщик (bundler), чтобы объединить весь ваш JS в один файл (например, Parcel, Webpack, Esbuild).
- Используйте ESM-модули (подробнее на [MDN](https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Modules)).
- Определите переменные во встроенном (inline) скрипте в файле HTML (между тегами `<script>...</script>`).
- Привяжите глобальные переменные к объекту `window`: `window.myVar = 1;` и используйте их как `window.myVar`.

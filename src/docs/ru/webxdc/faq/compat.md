---
title: Совместимость
description: Документация по вопросам совместимости webxdc.
category: FAQ
---

# Совместимость

### Чего не рекомендуется делать

-   `document.cookie` — известно, что это не работает в десктопной версии и на iOS; используйте `localStorage` вместо этого.
-   События `unload`, `beforeunload` и `pagehide` — не работают на iOS и нестабильно работают в других системах. Это также частично не рекомендуется [Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event); используйте `visibilitychange` вместо них.
-   `<title>` и `document.title` — игнорируются Webxdc; используйте свойство `name` из `manifest.toml`.
-   Новейшие возможности JavaScript могут не поддерживаться во всех веб-представлениях (webviews); возможно, вам стоит транспилировать ваш код в более старую версию JS (например, с помощью [Babel](https://babeljs.io)).
-   `<a href="https://example.org/foo">` и другие внешние ссылки заблокированы по определению; вместо этого встраивайте контент или используйте ссылки `mailto:` для связи.
-   `<a href="data: ...">` (и другие внутренние ссылки) — не гарантируется открытие диалога загрузки; используйте [`sendToChat()`](../specification/sendToChat) для экспорта файлов.
-   Возможности, требующие разрешений пользователя или включенные через [Permissions Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy), могут не работать (геолокация, камера, микрофон и т.д.).
-   `window.open()`, `alert()`, `prompt()`, `confirm()` — не работают в некоторых реализациях.

## Транспиляция современного JavaScript с помощью Babel.js

Старые устройства могут не поддерживать новейшие возможности/синтаксис JavaScript в своем WebView. Мы рекомендуем транспилировать ваш код в более старую версию JS (ES5/ES6) с помощью [Babel](https://babeljs.io).

Целевые платформы:

-   **Desktop** (Electron -> примерно Chrome 91)
-   **iOS** (iOS 11 -> WebKit 604.1.38)
-   **Android** (Android 5 -> системный компонент WebView может быть обновлен пользователем через [Google Play](https://play.google.com/store/apps/details?id=com.google.android.webview))

Если вы хотите использовать новый API, обязательно проверьте его поддержку на [caniuse.com](https://caniuse.com). Если вам нужен только современный синтаксис JS, Babel.js — отличный инструмент для его преобразования в код, понятный старым браузерам.

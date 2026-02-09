---
title: سازگاری
description: مستندات سازگاری برای webxdc.
category: FAQ
---


# سازگاری

### روش‌های غیرتوصیه شده

- `document.cookie` شناخته شده که در دسکتاپ و iOS کار نمی‌کند — به جای آن از `localStorage` استفاده کنید
- رویدادهای `unload`، `beforeunload` و `pagehide` شناخته شده که در iOS کار نمی‌کنند و در سایر سیستم‌ها ناپایدار هستند
  (همچنین تا حدی توسط [mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event) غیرتوصیه شده) — به جای آن از `visibilitychange` استفاده کنید
- `<title>` و `document.title` توسط Webxdc نادیده گرفته می‌شوند؛
  به جای آن از خاصیت `name` از `manifest.toml` استفاده کنید
- آخرین ویژگی‌های JavaScript ممکن است روی تمام webviewها کار نکنند،
  ممکن است بخواهید کد خود را به نسخه قدیمی‌تر js تبدیل کنید
  مثلاً با <https://babeljs.io>
- `<a href="https://example.org/foo">` و سایر لینک‌های خارجی طبق تعریف مسدود شده‌اند؛
  به جای آن، محتوا را جاسازی کنید یا از لینک `mailto:` برای ارائه راهی برای تماس استفاده کنید
- `<a href="data: or otherwise internal">` تضمین نمی‌شود که دیالوگ دانلود باز کند؛
  به جای آن، از [`sendToChat()`](../specification/sendToChat) برای صادرات فایل‌ها استفاده کنید.
- ویژگی‌هایی که نیاز به مجوز کاربر دارند
  یا از طریق [سیاست مجوزها](https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy) فعال می‌شوند ممکن است کار نکنند،
  موقعیت جغرافیایی، دوربین، میکروفون و غیره.
- `window.open()`، `alert()`، `prompt()`، `confirm()` شناخته شده که در برخی پیاده‌سازی‌ها کار نمی‌کنند



## تبدیل JavaScript جدیدتر با Babel.js

دستگاه‌های قدیمی‌تر ممکن است جدیدترین ویژگی‌ها/نحو JavaScript را در webview خود نداشته باشند، ممکن است بخواهید کد خود را به نسخه قدیمی‌تر JavaScript تبدیل کنید مثلاً با [Babel](https://babeljs.io).

اهداف:

- دسکتاپ (electron -> chrome 91 است)
- iOS (iOS 11 -> webkit 604.1.38)
- اندروید (android 5 -> کامپوننت سیستم webview توسط کاربر قابل به‌روزرسانی است: <https://play.google.com/store/apps/details?id=com.google.android.webview>)

اگر می‌خواهید از API جدیدتری استفاده کنید مطمئن شوید که در <https://caniuse.com> بررسی کنید. اگر فقط می‌خواهید از نحو JavaScript جدیدتر استفاده کنید، babel.js ابزار مناسب شماست - JS جدید را به JS قدیمی‌تر ترجمه می‌کند که قابل تفسیر است.

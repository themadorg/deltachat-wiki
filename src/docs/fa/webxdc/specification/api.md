---
title: API
description: مستندات API برای webxdc.
category: مشخصات
---


## API جاوااسکریپت Webxdc

برنامه‌های Webxdc در یک چت به اشتراک گذاشته می‌شوند و هر دستگاه نمونه خود را روی دستگاه گیرنده هنگام کلیک روی «شروع» اجرا می‌کند. برنامه‌ها از شبکه ایزوله هستند اما می‌توانند وضعیت را از طریق [`sendUpdate()`](./sendUpdate) و [`setUpdateListener()`](./setUpdateListener) به اشتراک بگذارند.

پیاده‌سازی‌های پیام‌رسان API را از طریق ماژول `webxdc.js` در دسترس قرار می‌دهند. برای فعال‌سازی API webxdc باید از مرجع اسکریپت `webxdc.js` در برنامه HTML5 خود استفاده کنید:

```html
<script src="webxdc.js"></script>
```

`webxdc.js` نباید به فایل `.xdc` شما اضافه شود زیرا توسط پیام‌رسان ارائه می‌شود. برای شبیه‌سازی webxdc در مرورگر،
می‌توانید از فایل `webxdc.js` از [Hello](https://github.com/webxdc/hello) استفاده کنید،
یا از [ابزار webxdc-dev](https://github.com/webxdc/webxdc-dev) استفاده کنید که
هر دو امکان شبیه‌سازی و دیباگ برنامه‌های webxdc بدون هیچ پیام‌رسانی را فراهم می‌کنند.

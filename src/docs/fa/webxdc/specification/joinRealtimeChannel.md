---
title: joinRealtimeChannel (آزمایشی)
description: مستندات joinRealtimeChannel (آزمایشی) برای webxdc.
category: مشخصات
---

# joinRealtimeChannel (آزمایشی)

```js
const realtimeChannel = window.webxdc.joinRealtimeChannel();
```

کانال بلادرنگ برای این برنامه را راه‌اندازی و برگردانید،
با متدهایی برای گوش دادن و ارسال داده و همچنین ترک کانال.
کانال‌های بلادرنگ هر برنامه:

- **خصوصی** هستند: هیچ‌کس خارج از چت نمی‌تواند در کانال‌های بلادرنگ شرکت کند.

- **ایزوله** هستند: برنامه‌ها نمی‌توانند در کانال‌های بلادرنگ برنامه‌های دیگر شرکت کنند.

- **موقت** هستند: هر داده ارسالی فقط توسط همتاهای متصل فعلی دریافت خواهد شد
  و نه توسط همتاهایی که بعداً متصل می‌شوند.

فراخوانی `joinRealtimeChannel` بار دوم بدون ترک قبلی
خطا ایجاد خواهد کرد.

## بررسی موجود بودن API

این API آزمایشی است و ممکن است توسط هر پیام‌رسانی پیاده‌سازی نشده باشد.
با `window.webxdc.joinRealtimeChannel !== undefined` بررسی کنید که موجود است
(برای Delta Chat، این API از نسخه 1.48 به بعد موجود و به طور پیش‌فرض فعال است)

## `realtimeChannel.setListener((data) => {})`

شروع گوش دادن به کانال بلادرنگ با استفاده از callback مشخص شده.
callback آیتم‌های داده `Uint8Array` ارسال شده از همتاهای متصل را دریافت می‌کند.
فراخوانی `setListener` بار دوم listener قبلی را جایگزین می‌کند.


## `realtimeChannel.send(data)`

یک آیتم داده `Uint8Array` به همتاهای متصل ارسال کنید.
اندازه آرایه نباید از 128000 بایت تجاوز کند.

هیچ تضمینی وجود ندارد که کسی داده ارسالی را دریافت کند
زیرا ممکن است هیچ همتای گوش‌دهنده‌ای وجود نداشته باشد،
یا اتصالات شبکه شکست بخورند.
تعیین وضعیت اتصال با همتاهای دیگر
با نظارت و ایجاد پیام‌های داده بر عهده برنامه است.


## `realtimeChannel.leave()`

کانال بلادرنگ را ترک کنید.
پس از آن `realtimeChannel` نامعتبر است و
دیگر نمی‌توان از آن برای ارسال یا دریافت داده استفاده کرد.
باید `window.webxdc.joinRealtimeChannel()` را دوباره فراخوانی کنید
تا مجدداً به کانال بلادرنگ هر برنامه بپیوندید.

## مثال

```js
const realtimeChannel = window.webxdc.joinRealtimeChannel();
realtimeChannel.setListener((data) => {
    console.log("Received realtime data: ", data);
    const msg = new TextDecoder().decode(data);
    console.log("decoded message: ", msg);
})

let numMsgs = 0
const refreshIntervalId = setInterval(() => {
    const myId = window.webxdc.selfAddr;
    const data = new TextEncoder().encode(`[${numMsgs}] hello from ${myId}`);
    numMsgs += 1
    console.log("Sending message", data);
    realtimeChannel.send(data);
    if (numMsgs >= 100) {
        realtimeChannel.leave();
        clearInterval(refreshIntervalId);
    }

}, 1000)
```

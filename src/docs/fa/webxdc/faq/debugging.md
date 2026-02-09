---
title: دیباگ
description: مستندات دیباگ برای webxdc.
category: FAQ
---


# دیباگ

## دیباگ با eruda.js

وقتی نمی‌توانید از [دیباگ داخل Delta Chat](#دیباگ-داخل-delta-chat) استفاده کنید،
یا به این دلیل که کامپیوتری برای اتصال ندارید یا اگر روی iOS هستید،
ممکن است [eruda.js](https://github.com/liriliri/eruda)
را به عنوان جایگزینی برای ابزارهای دیباگ بومی مرورگر امتحان کنید.

1. یک [eruda.js مستقل](https://cdn.jsdelivr.net/npm/eruda) دانلود کنید

1. `eruda.js` را کنار `index.html` خود کپی کنید

1. قطعه کد زیر را به بخش head فایل index.html خود اضافه کنید:

    ```html
    <script src="eruda.js"></script>
    <script>
      eruda.init();
    </script>
    ```

وقتی برنامه webxdc شما شروع می‌شود،
یک دکمه شناور در گوشه ظاهر خواهد شد.
روی آن ضربه بزنید تا ابزارهای توسعه‌دهنده را ببینید.

## دیباگ داخل Delta Chat

### دیباگ برنامه webxdc در اندروید از طریق Chrome DevTools

1. دیباگ webView را در تنظیمات Delta Chat فعال کنید
   `تنظیمات` > `پیشرفته` > `حالت توسعه‌دهنده`:
   <img alt="تصویر صفحه پیشرفته" src="../images/android_remote_debug_enable.png" style="max-height:40vh" />

1. حالت توسعه‌دهنده و دیباگ ADB را روی دستگاه خود فعال کنید
   _(به تنظیمات سیستم، اطلاعات دستگاه بروید، ۷ بار یا بیشتر روی شماره ساخت کلیک کنید
   تا پیامی ظاهر شود که به شما بگوید اکنون «توسعه‌دهنده» هستید،
   سپس به منوی جدید توسعه‌دهنده بروید و «دیباگ ADB» را فعال کنید،
   همچنین ببینید [مستندات اندروید: فعال‌سازی دیباگ ADB روی دستگاه](https://developer.android.com/studio/command-line/adb#Enabling))._

1. دستگاه خود را از طریق USB به کامپیوتر متصل کنید

1. chromium (یا google chrome) را باز کنید و به `chrome://inspect/#devices` بروید

1. webxdc مورد نظر برای دیباگ را شروع کنید

1. روی `inspect` کلیک کنید:

<p>
<img
src="../images/android_remote_debug_list.png"
alt="اسکرین‌شات لیست دستگاه‌های chrome dev tools"
style="max-height:40vh"
/>
</p>

| بررسی HTML                                                      | کنسول JavaScript                                               |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| ![بازرس dev tools](../images/android_remote_debug_inspector.png) | ![کنسول js dev tools](../images/android_remote_debug_console.png) |

> مطمئن شوید که پس از اتمام دیباگ، **دیباگ adb را دوباره غیرفعال کنید**!


### دیباگ برنامه webxdc در Delta Chat Desktop

ابتدا devTools را برای webxdc در تنظیمات فعال کنید:

  `تنظیمات` > `پیشرفته` > ویژگی‌های آزمایشی > `فعال‌سازی Webxdc Devtools`

> توجه داشته باشید که باید هر webxdc فعالی را ببندید و دوباره باز کنید تا تغییرات اعمال شوند

webxdc مورد نظر برای دیباگ را شروع کنید و `F12` را فشار دهید تا ابزارهای توسعه‌دهنده باز شوند:

<p>
<img
src="../images/desktop_debug_open.png"
alt="اسکرین‌شات پنجره webxdc دسکتاپ با devtool"
style="max-height:40vh"
/>
</p>

کمی کوچک نیست؟ آن را با تغییر اندازه **عرض** پنجره یا **جدا کردن** ابزارهای توسعه‌دهنده برطرف کنید:

<p>
<img
src="../images/desktop_debug_undock.png"
alt="جدا کردن devtools"
style="max-height:40vh"
/>
</p>

<p>
<img
src="../images/desktop_debug_extra_window.png"
alt="جدا کردن devtools"
style="max-height:40vh"
/>
</p>

## نمی‌توانم متغیرها را در iOS بین اسکریپت‌ها به اشتراک بگذارم!

کد شما:

`a.js`

```js
const CONFIG = { difficulty: "hard", hasCoins: true };
```

`b.js`

```js
if (CONFIG.difficulty == "hard") {
  /** بازی را سخت‌تر کنید **/
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

اساساً خطاهای زیادی در کنسول JS خود می‌بینید مانند:

```
Can't find variable: CONFIG
```

چند راه برای حل این مشکل وجود دارد:

- از یک باندلر برای بسته‌بندی تمام JS خود در یک فایل استفاده کنید (برخی باندلرها: parcel، webpack، esbuild)
- از ماژول‌های esm استفاده کنید (ببینید <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules>)
- متغیرهای خود را به عنوان اسکریپت inline در فایل HTML خود تعریف کنید. (اسکریپت inline به این معنی است که اسکریپت در فایل HTML بین تگ‌های `<script>` قرار دارد: `<script>my code</script>`)
- متغیرهای سراسری خود را به آبجکت window اضافه کنید: `window.myVar = 1;` و مانند `console.log(window.myVar)` استفاده کنید

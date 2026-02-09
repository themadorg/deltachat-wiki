---
title: شروع کار
description: نحوه ساخت و اشتراک‌گذاری برنامه‌های webxdc را بیاموزید.
category: webxdc
order: 2
---

# شروع کار

<script>
    import VideoPlayer from '$lib/components/VideoPlayer.svelte';
</script>

Webxdc برنامه‌های وب را به چت‌های پیام‌رسان می‌آورد، در قالب فایلی ساده شامل HTML5، CSS، JavaScript و سایر فایل‌های دارایی.
تمام احراز هویت، مدیریت هویت، کشف اجتماعی و انتقال پیام
به پیام‌رسان میزبان واگذار شده که فایل کانتینر برنامه webxdc را اجرا
و پیام‌های به‌روزرسانی برنامه را بین کاربران برنامه ارسال می‌کند،
و به هر برنامه اجازه می‌دهد قابلیت‌های آفلاین-اول و رمزگذاری سرتاسری
پیاده‌سازی شده توسط پیام‌رسان میزبان را به ارث ببرد.

<VideoPlayer src="https://webxdc.org/assets/just-web-apps.mp4" />

[تماشای «فقط برنامه‌های وب» در یوتیوب](https://www.youtube.com/watch?v=I1K4pBvb2pI)

## یک مثال ساده

پیام‌رسان مبتنی بر ایمیل [Delta Chat](https://delta.chat)
و پیام‌رسان مبتنی بر XMPP [Cheogram](https://cheogram.com)
از [برنامه‌های webxdc](https://webxdc.org/apps) پشتیبانی می‌کنند که بدون هیچ تغییری روی هر دو پیام‌رسان اجرا می‌شوند.

`index.html` زیر یک برنامه webxdc کامل را نشان می‌دهد، با یک فیلد ورودی که در تمام همتاها نمایش داده می‌شود. داده‌های ارسال شده از طریق ورودی به تمام اعضای چت تحویل داده می‌شود.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <script src="webxdc.js"></script>
  </head>
  <body>
    <input id="input" type="text"/>
    <a href="" onclick="sendMsg(); return false;">Send</a>
    <p id="output"></p>
    <script>
      function sendMsg() {
        msg = document.getElementById("input").value;
        window.webxdc.sendUpdate({payload: msg}, 'Someone typed "'+msg+'".');
      }
    
      function receiveUpdate(update) {
        document.getElementById('output').innerHTML += update.payload + "<br>";
      }
      window.webxdc.setUpdateListener(receiveUpdate, 0);
    </script>
  </body>
</html>
```

برای بسته‌بندی برنامه به عنوان فایل `.xdc`، پوشه حاوی `index.html` و فایل‌های مرتبط را zip کنید:

```shell
(cd PATH_TO_DIR && zip -9 --recurse-paths - *) > myapp.xdc
```

حالا می‌توان فایل `myapp.xdc` را در هر چتی به اشتراک گذاشت: گیرندگان می‌توانند روی «شروع» بزنند تا از برنامه برای وارد کردن متن در این فیلد ورودی و ارسال به‌روزرسانی به یکدیگر استفاده کنند.

برای شبیه‌سازی چندین شرکت‌کننده چت در مرورگر، [Hello](https://github.com/webxdc/hello) را به عنوان مثال حداقلی امتحان کنید؛ شامل همه چیزهای لازم برای اجرای برنامه است و نیازی به سیستم ساخت ندارد.

[ابزار شبیه‌سازی webxdc-dev](https://github.com/webxdc/webxdc-dev) ابزار پیشنهادی
برای توسعه برنامه‌های webxdc است زیرا امکان شبیه‌سازی چند کاربره،
و مشاهده پیام‌های شبکه بین نمونه‌های برنامه را فراهم می‌کند.
با این حال، هیچ پیام‌رسانی برای توسعه برنامه webxdc با ابزار `webxdc-dev` مورد نیاز نیست.

## نمونه‌های بیشتر

[webxdc در Codeberg](https://codeberg.org/webxdc) و [webxdc در GitHub](https://github.com/webxdc)
شامل نمونه‌های منتخب برنامه‌های webxdc هستند.

[فروشگاه webxdc](https://webxdc.org/apps) شامل برنامه‌های webxdc کاربردی است که می‌توانید امروز استفاده کنید.
هر برنامه با لینک «کد منبع» ارائه می‌شود تا بتوانید یاد بگیرید و هر طور که می‌خواهید fork کنید.
می‌توانید [برنامه FOSS موجود خود را ارسال کنید](https://codeberg.org/webxdc/xdcget/src/branch/main/SUBMIT.md) تا در فروشگاه منتخب قرار گیرد.

## پیش‌زمینه مفید برای توسعه برنامه‌های webxdc

توسعه و استقرار برنامه‌های webxdc اساساً ساده‌تر از
توسعه برای یک سرور HTTP همیشه آنلاین و اختصاصی برنامه و نگهداری آن است.
اما بدون شک پیچیدگی‌هایی در مرتب‌سازی وضعیت سازگار برنامه وب
در دستگاه‌های کاربران وجود دارد، مسئله‌ای معمول برای هر سیستم شبکه همتا به همتا (P2P).
حتی اگر موضوع را عمیقاً مطالعه نکنید، خواندن [وضعیت مشترک برنامه وب](./shared-state/)
شما را با اصطلاحات و برخی ملاحظات ضروری آشنا می‌کند،
با تمرکز خاص بر webxdc و ارائه راهنمایی عملی.


## مشارکت در توسعه‌ها

- [انجمن پشتیبانی](https://support.delta.chat/c/webxdc/20): دسته webxdc در انجمن DeltaChat فضایی برای پرسیدن سؤال و اعلام پروژه‌های برنامه شماست. از طریق DeltaChat، Github یا با ساختن نام کاربری و رمز عبور در [انجمن](https://support.delta.chat) وارد شوید.

- اگر سؤالی درباره پشتیبانی Webxdc در پیام‌رسان مبتنی بر XMPP Cheogram دارید، به
  [کانال انجمن Cheogram](https://anonymous.cheogram.com/discuss@conference.soprani.ca) بروید

- اعلانات: توسعه‌های مرتبط با Delta Chat و Webxdc را می‌توان
  در [Fediverse](https://chaos.social/@delta) دنبال کرد

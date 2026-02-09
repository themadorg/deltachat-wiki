---
title: importFiles
description: مستندات importFiles برای webxdc.
category: مشخصات
---

# importFiles

```js
let files = await window.webxdc.importFiles(filter);
```

`importFiles()` به یک برنامه webxdc اجازه می‌دهد فایل‌ها را وارد کند.
بسته به پشتیبانی پلتفرم، این فقط انتخاب‌گر فایل سیستم را باز می‌کند یا یک انتخاب‌گر سفارشی.
این انتخاب‌گر فایل سفارشی باید پیوست‌های اخیر دریافت و ارسال شده را نشان دهد
تا وارد کردن فایلی که تازه از کسی دریافت کرده‌اید آسان‌تر شود
(نیازی نیست ابتدا آن را در سیستم فایل ذخیره کنید)،
اما همچنان دکمه‌ای برای باز کردن انتخاب‌گر فایل سیستم نمایش می‌دهد.

- `filter`: یک آبجکت با خصوصیات زیر:
  - `filter.extensions`: اختیاری - آرایه‌ای از پسوندهایی که لیست فایل باید به آن‌ها محدود شود.
    پسوندها باید با نقطه شروع شوند و فرمت `.ext` داشته باشند.
    اگر مشخص نشود، تمام فایل‌ها نمایش داده می‌شوند.
  - `filter.mimeTypes`: اختیاری - آرایه‌ای از نوع‌های mime
    که ممکن است به عنوان یک اشاره اضافی استفاده شوند مثلاً در صورتی که فایل پسوندی ندارد.
    **فایل‌هایی که با `filter.mimeTypes` یا `filter.extensions` مطابقت دارند نمایش داده می‌شوند**.
    مشخص کردن نوع mime نیاز به لیست کردن تمام پسوندهای معمولی نیز دارد -
    در غیر این صورت، ممکن است فایل‌هایی را از دست بدهید.
    برای جزئیات درباره فرمت ببینید <https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept#unique_file_type_specifiers>
  - `filter.multiple`: آیا اجازه انتخاب چندین فایل داده شود، پیش‌فرض false

متد یک `Promise` برمی‌گرداند که به آرایه‌ای از آبجکت‌های `File` resolve می‌شود.

مثال:
```js
// then/catch
window.webxdc.importFiles({
  mimeTypes: ["text/calendar"],
  extensions: [".ics"],
}).then((files) => {
  /* کاری با فایل‌ها انجام دهید */
}).catch((error) => {
    console.log(error);
});
// async/await
try {
  let files = await window.webxdc.importFiles({
    mimeTypes: ["text/calendar"],
    extensions: [".ics"],
  })
  /* کاری با فایل‌ها انجام دهید */
} catch (error) {
  console.log(error);
}
```



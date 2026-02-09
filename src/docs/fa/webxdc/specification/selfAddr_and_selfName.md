---
title: selfAddr و selfName
description: مستندات selfAddr و selfName برای webxdc.
category: مشخصات
---

# selfAddr و selfName

## selfName

```js
window.webxdc.selfName
```

`selfName` نام مستعار یا نام نمایشی کاربر است
که برنامه webxdc ممکن است در رابط کاربری خود نمایش دهد.


## selfAddr

```js
window.webxdc.selfAddr
```

یک رشته («شناسه منحصر به فرد») که کاربر را در برنامه webxdc فعلی شناسایی می‌کند.
هر کاربر یک برنامه webxdc باید `selfAddr` متفاوتی دریافت کند.
`selfAddr` باید در صورت شروع مجدد webxdc برای همان کاربر یکسان باشد،
در همان دستگاه یا دستگاه متفاوت.
با این حال، همان کاربر که برنامه webxdc متفاوتی باز می‌کند
باید `selfAddr` متفاوتی داشته باشد تا از قابلیت ارتباط بین برنامه‌ها جلوگیری شود:
حتی اگر یک برنامه وب کاربران را برای اشتراک‌گذاری مقادیر `selfAddr` از طریق کپی و چسباندن
به برنامه وب دیگری دستکاری کند، آدرس‌ها بین دو برنامه وب نباید قابل ارتباط باشند.

توجه داشته باشید که `selfAddr`

- خارج از برنامه webxdc معنایی ندارد،

- نباید در رابط کاربری برنامه webxdc نمایش داده شود
  (به جای آن از `selfName` استفاده کنید).



## مثال استفاده از selfAddr و selfName

اینجا یک برنامه چت ساده است که پاسخ‌ها را با استفاده از نام‌های نمایشی ارسال می‌کند
اما از آدرس‌ها برای اعلان‌ها استفاده می‌کند.

```js
// دریافت پیام از هر کسی در چت
let users = new Set();

window.webxdc.setUpdateListener((update) => {
    const prompt = `${update.payload.senderName} (${update.payload.senderAddr}):`;
    users.add(update.payload.senderAddr);
    console.log(`${prompt} ${update.message}`);
});

// شروع رابط کاربری که تابع زیر را برای
// ارسال پیام فراخوانی می‌کند

function sendMessage(text) {
    let payload = {
        senderAddr: window.webxdc.selfAddr,
        senderName: window.webxdc.selfName,
        message: text
    };

    // اطلاع‌رسانی به تمام کاربرانی که تا به حال پیامی در برنامه چت ارسال کرده‌اند
    let notify = {};
    for (const addr of users) {
        notify[addr] = `new message from ${webxdc.selfName}`;
    }

    window.webxdc.sendUpdate({
        payload: payload,
        notify: notify
    });
})
```


[`sendUpdate()`]: ./sendUpdate.html

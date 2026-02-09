---
title: مهاجرت به ماشین جدید
description: رویکرد گام‌به‌گام برای مهاجرت ایمن یک رله chatmail.
category: سرورها
---

<script>
    import Steps from '$lib/components/Steps.svelte';
    import Step from '$lib/components/Step.svelte';
</script>

# مهاجرت به ماشین جدید

این راهنمای مهاجرت، یک رویکرد مرحله‌به‌مرحله را برای انتقال ایمن رله chatmail از یک ماشین به ماشین دیگر ارائه می‌دهد.

## نکات اولیه و فرضیات

- اگر مهاجرت یک جابه‌جایی برنامه‌ریزی شده است، توصیه می‌شود زمان حیات (TTL) رکوردهای DNS خود را به مقداری مانند ۳۰۰ (۵ دقیقه) کاهش دهید، ترجیحاً مدتی قبل از شروع مهاجرت. این کار سرعت انتشار تغییرات DNS را در اینترنت پس از اتمام مهاجرت افزایش می‌دهد.
- مراحل مهاجرت با استفاده از یک لپ‌تاپ لینوکسی تست شده است؛ ممکن است لازم باشد برخی مراحل را با محیط محلی خود سازگار کنید.
- دامنه ایمیل شما `mail.example.org` فرض شده است.
- تمام سرورها از راه دور از Debian 12 استفاده می‌کنند.
- آدرس IPv4 سرور قدیمی `$OLD_IP4` است.
- آدرس‌های IP سرور جدید `$NEW_IP4` و `$NEW_IPV6` هستند.

## شش مرحله برای مهاجرت

توجه داشته باشید که در طول برخی مراحل زیر ممکن است با پیامی مبنی بر تغییر کلیدهای SSH Host مواجه شوید؛ در این صورت، طبق پیشنهاد، دستور `ssh-keygen -R "mail.example.org"` را اجرا کنید.

<Steps>
<Step number="1" title="انتقال اولیه صندوق‌های پستی">

به سرور قدیمی متصل شوید و با استفاده از پارامتر `-A` ایجنت ssh خود را فوروارد کنید تا اجازه داشته باشید فایل‌ها را مستقیماً از سرور قدیمی به جدید کپی کنید.

```sh
ssh -A root@$OLD_IP4
tar c /home/vmail/mail | ssh root@$NEW_IP4 "tar x -C /"
```

</Step>
<Step number="2" title="پیکربندی اولیه سرور جدید">

سرور جدید را از قبل پیکربندی کنید اما آن را تا مرحله ۶ غیرفعال نگه دارید:

```sh
CMDEPLOY_STAGES=install,configure scripts/cmdeploy run --ssh-host $NEW_IP4
```

</Step>
<Step number="3" title="غیرفعال کردن سرویس‌های ایمیل در سرور قدیمی">

سرویس‌های ایمیل را در سرور قدیمی غیرفعال کنید. کاربران تا اتمام تمام مراحل قادر به ارسال یا دریافت پیام نخواهند بود. سایر رله‌ها و سرورهای ایمیل تحویل پیام‌ها را هر از چند گاهی دوباره امتحان می‌کنند، بنابراین هیچ پیامی گم نخواهد شد.

```sh
scripts/cmdeploy run --disable-mail --ssh-host $OLD_IP4
```

</Step>
<Step number="4" title="همگام‌سازی نهایی">

همگام‌سازی نهایی کلیدهای امنیتی TLS/DKIM، صف‌های ایمیل و صندوق‌های پستی. دوباره از فوروارد کردن ssh-agent (`-A`) استفاده می‌کنیم تا تمام داده‌های مهم را مستقیماً از سرور قدیمی به جدید منتقل کنیم.

```sh
ssh -A root@$OLD_IP4
tar c /var/lib/acme /etc/dkimkeys /var/spool/postfix | ssh root@$NEW_IP4 "tar x -C /"
rsync -azH /home/vmail/mail root@$NEW_IP4:/home/vmail/
```

وارد سرور جدید شده و مطمئن شوید مالکیت فایل‌ها به‌درستی تنظیم شده است:

```sh
ssh root@$NEW_IP4
chown root: -R /var/lib/acme
chown opendkim: -R /etc/dkimkeys
chown vmail: -R /home/vmail/mail
```

</Step>
<Step number="5" title="به‌روزرسانی رکوردهای DNS">

رکوردهای DNS را به‌روزرسانی کنید تا به سرور جدید اشاره کنند. فقط نیاز است رکوردهای `A` و `AAAA` را تغییر دهید، برای مثال:

```text
mail.example.org.    IN A    $NEW_IP4
mail.example.org.    IN AAAA $NEW_IP6
```

</Step>
<Step number="6" title="فعال‌سازی رله در سرور جدید" isLast={true}>

فعال‌سازی رله chatmail در سرور جدید:

```sh
CMDEPLOY_STAGES=activate scripts/cmdeploy run --ssh-host $NEW_IP4
```

</Step>
</Steps>

تمام شد! کاربران به محض انتشار تغییرات DNS قادر به استفاده از رله خواهند بود.

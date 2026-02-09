---
title: مشخصات رعایت شده
description: لیست استانداردهای اینترنت و مشخصاتی که Madmail از آن‌ها پیروی می‌کند، شامل افزونه‌های IMAP و SMTP.
category: فنی
---

# مشخصات رعایت شده

این صفحه استانداردهای اینترنت و سایر مشخصاتی را که maddy از آن‌ها پیروی می‌کند، به همراه انحرافات شناخته شده لیست می‌کند.

## فرمت پیام

- [RFC 2822] - فرمت پیام اینترنتی
- [RFC 2045] - افزونه‌های چندمنظوره پست الکترونیک اینترنتی (MIME) (بخش ۱)
- [RFC 2046] - افزونه‌های چندمنظوره پست الکترونیک اینترنتی (MIME) (بخش ۲)
- [RFC 2047] - افزونه‌های چندمنظوره پست الکترونیک اینترنتی (MIME) (بخش ۳)
- [RFC 2048] - افزونه‌های چندمنظوره پست الکترونیک اینترنتی (MIME) (بخش ۴)
- [RFC 2049] - افزونه‌های چندمنظوره پست الکترونیک اینترنتی (MIME) (بخش ۵)
- [RFC 6532] - هدرهای ایمیل بین‌المللی شده
- [RFC 2183] - انتقال اطلاعات نمایش در پیام‌های اینترنتی: فیلد هدر Content-Disposition

## IMAP

- [RFC 3501] - پروتکل دسترسی به پیام اینترنتی - نسخه 4rev1
    * **جزئی**: پرچم `\Recent` گاهی اوقات ریست نمی‌شود.
- [RFC 2152] - UTF-7

### افزونه‌ها

- [RFC 2595] - استفاده از TLS با IMAP، POP3 و ACAP
- [RFC 7889] - افزونه IMAP APPENDLIMIT
- [RFC 3348] - افزونه Child Mailbox برای پروتکل IMAP4
- [RFC 6851] - افزونه MOVE برای پروتکل IMAP
- [RFC 6154] - افزونه LIST برای صندوق‌های پستی با استفاده خاص (Special-Use)
    * **جزئی**: تنها قابلیت SPECIAL-USE.
- [RFC 5255] - بین‌المللی‌سازی پروتکل دسترسی به پیام اینترنتی
    * **جزئی**: تنها قابلیت I18NLEVEL=1.
- [RFC 4978] - افزونه IMAP COMPRESS
- [RFC 3691] - دستور UNSELECT در پروتکل IMAP
- [RFC 2177] - دستور IDLE در پروتکل IMAP4
- [RFC 7888] - لیترال‌های غیرهمگام در IMAP4 (قابلیت LITERAL+)
- [RFC 4959] - افزونه IMAP برای پاسخ اولیه کلاینت در SASL

## SMTP

- [RFC 2033] - پروتکل انتقال ایمیل محلی (LMTP)
- [RFC 5321] - پروتکل ساده انتقال ایمیل (SMTP)
- [RFC 6409] - ارسال پیام برای ایمیل

### افزونه‌ها

- [RFC 1870] - افزونه سرویس SMTP برای اعلام اندازه پیام
- [RFC 2920] - افزونه سرویس SMTP برای خط لوله کردن دستورات (Command Pipelining)
    * تنها پشتیبانی سمت سرور، توسط کلاینت SMTP استفاده نمی‌شود.
- [RFC 2034] - افزونه سرویس SMTP برای بازگرداندن کدهای خطای پیشرفته
- [RFC 3207] - افزونه سرویس SMTP برای امنیت SMTP روی TLS
- [RFC 4954] - افزونه سرویس SMTP برای احراز هویت
- [RFC 6152] - افزونه SMTP برای MIME هشت بیتی (8-bit MIME)
- [RFC 6531] - افزونه SMTP برای ایمیل بین‌المللی شده

### متفرقه

- [RFC 6522] - نوع محتوای Multipart/Report برای گزارش پیام‌های مدیریتی سیستم ایمیل
- [RFC 3464] - فرمت پیام توسعه‌پذیر برای اعلان‌های وضعیت تحویل (DSN)
- [RFC 6533] - وضعیت تحویل بین‌المللی شده و اعلان‌های جابه‌جایی

## امنیت ایمیل

### احراز هویت کاربر

- [RFC 4422] - لایه ساده احراز هویت و امنیت (SASL)
- [RFC 4616] - مکانیزم PLAIN در SASL

### احراز هویت فرستنده

- [RFC 6376] - امضاهای DomainKeys Identified Mail (DKIM)
- [RFC 7001] - فیلد هدر پیام برای نشان دادن وضعیت احراز هویت پیام
- [RFC 7208] - چارچوب سیاست فرستنده (SPF) برای اجازه استفاده از دامنه‌ها در ایمیل، نسخه ۱
- [RFC 7372] - کدهای وضعیت احراز هویت ایمیل
- [RFC 7479] - احراز هویت، گزارش‌دهی و انطباق پیام مبتنی بر دامنه (DMARC)
    * **جزئی**: عدم تولید گزارش.
- [RFC 8301] - به‌روزرسانی الگوریتم‌های رمزنگاری و استفاده از کلید در DKIM
- [RFC 8463] - روش جدید امضای رمزنگاری شده برای DKIM
- [RFC 8616] - احراز هویت ایمیل برای ایمیل‌های بین‌المللی شده

### احراز هویت گیرنده

- [RFC 4033] - مقدمه و الزامات امنیت DNS
- [RFC 6698] - پروتکل TLS برای احراز هویت مبتنی بر DNS از موجودیت‌های نام‌گذاری شده (DANE): TLSA
- [RFC 7672] - امنیت SMTP از طریق احراز هویت فرصت‌طلبانه مبتنی بر DNS (DANE) و TLS
- [RFC 8461] - امنیت سخت‌گیرانه انتقال برای MTAهای SMTP (موسوم به MTA-STS)

## یونیکد، کدگذاری‌ها، بین‌المللی‌سازی

- [RFC 3492] - Punycode: کدگذاری Bootstring از یونیکد برای نام‌های دامنه بین‌المللی شده در برنامه‌ها (IDNA)
- [RFC 3629] - UTF-8، یک فرمت تبدیل ISO 10646
- [RFC 5890] - نام‌های دامنه بین‌المللی شده برای برنامه‌ها (IDNA): تعاریف و چارچوب مستندات
- [RFC 5891] - نام‌های دامنه بین‌المللی شده برای برنامه‌ها (IDNA): پروتکل
- [RFC 7616] - آماده‌سازی، اجبار و مقایسه رشته‌های بین‌المللی شده نشان‌دهنده نام‌های کاربری و رمزهای عبور
- [RFC 8264] - چارچوب PRECIS: آماده‌سازی، اجبار و مقایسه رشته‌های بین‌المللی شده در پروتکل‌های برنامه‌ها
- [Unicode 11.0.0]
    - [UAX #15] - فرم‌های نرمال‌سازی یونیکد

لیست بزرگی از کدگذاری‌های غیر یونیکد توسط تجزیه‌کننده پیام برای کش استاتیک و جستجوی IMAP پشتیبانی می‌شود. برای جزئیات به صفحه [پشتیبانی از یونیکد](unicode.md) مراجعه کنید.

## متفرقه

- [RFC 5782] - لیست‌های سیاه و سفید DNS (DNS Blacklists and Whitelists)


[GH 188]: https://github.com/foxcpp/maddy/issues/188

[RFC 2822]: https://tools.ietf.org/html/rfc2822
[RFC 2045]: https://tools.ietf.org/html/rfc2045
[RFC 2046]: https://tools.ietf.org/html/rfc2046
[RFC 2047]: https://tools.ietf.org/html/rfc2047
[RFC 2048]: https://tools.ietf.org/html/rfc2048
[RFC 2049]: https://tools.ietf.org/html/rfc2049
[RFC 6532]: https://tools.ietf.org/html/rfc6532
[RFC 2183]: https://tools.ietf.org/html/rfc2183
[RFC 3501]: https://tools.ietf.org/html/rfc3501
[RFC 2152]: https://tools.ietf.org/html/rfc2152
[RFC 2595]: https://tools.ietf.org/html/rfc2595
[RFC 7889]: https://tools.ietf.org/html/rfc7889
[RFC 3348]: https://tools.ietf.org/html/rfc3348
[RFC 6851]: https://tools.ietf.org/html/rfc6851
[RFC 6154]: https://tools.ietf.org/html/rfc6154
[RFC 5255]: https://tools.ietf.org/html/rfc5255
[RFC 4978]: https://tools.ietf.org/html/rfc4978
[RFC 3691]: https://tools.ietf.org/html/rfc3691
[RFC 2177]: https://tools.ietf.org/html/rfc2177
[RFC 7888]: https://tools.ietf.org/html/rfc7888
[RFC 4959]: https://tools.ietf.org/html/rfc4959
[RFC 2033]: https://tools.ietf.org/html/rfc2033
[RFC 5321]: https://tools.ietf.org/html/rfc5321
[RFC 6409]: https://tools.ietf.org/html/rfc6409
[RFC 1870]: https://tools.ietf.org/html/rfc1870
[RFC 2920]: https://tools.ietf.org/html/rfc2920
[RFC 2034]: https://tools.ietf.org/html/rfc2034
[RFC 3207]: https://tools.ietf.org/html/rfc3207
[RFC 4954]: https://tools.ietf.org/html/rfc4954
[RFC 6152]: https://tools.ietf.org/html/rfc6152
[RFC 6531]: https://tools.ietf.org/html/rfc6531
[RFC 6522]: https://tools.ietf.org/html/rfc6522
[RFC 3464]: https://tools.ietf.org/html/rfc3464
[RFC 6533]: https://tools.ietf.org/html/rfc6533
[RFC 4422]: https://tools.ietf.org/html/rfc4422
[RFC 4616]: https://tools.ietf.org/html/rfc4616
[RFC 6376]: https://tools.ietf.org/html/rfc6376
[RFC 7001]: https://tools.ietf.org/html/rfc7001
[RFC 7208]: https://tools.ietf.org/html/rfc7208
[RFC 7372]: https://tools.ietf.org/html/rfc7372
[RFC 7479]: https://tools.ietf.org/html/rfc7479
[RFC 8301]: https://tools.ietf.org/html/rfc8301
[RFC 8463]: https://tools.ietf.org/html/rfc8463
[RFC 8616]: https://tools.ietf.org/html/rfc8616
[RFC 4033]: https://tools.ietf.org/html/rfc4033
[RFC 6698]: https://tools.ietf.org/html/rfc6698
[RFC 7672]: https://tools.ietf.org/html/rfc7672
[RFC 8461]: https://tools.ietf.org/html/rfc8461
[RFC 3492]: https://tools.ietf.org/html/rfc3492
[RFC 3629]: https://tools.ietf.org/html/rfc3629
[RFC 5890]: https://tools.ietf.org/html/rfc5890
[RFC 5891]: https://tools.ietf.org/html/rfc5891
[RFC 7616]: https://tools.ietf.org/html/rfc7616
[RFC 8264]: https://tools.ietf.org/html/rfc8264
[RFC 5782]: https://tools.ietf.org/html/rfc5782

[Unicode 11.0.0]: https://www.unicode.org/versions/components-11.0.0.html
[UAX #15]: https://unicode.org/reports/tr15/

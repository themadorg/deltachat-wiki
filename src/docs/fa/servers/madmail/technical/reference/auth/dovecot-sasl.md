---
title: مرجع Dovecot SASL
description: مرجع ماژول auth.dovecot_sasl که به Madmail اجازه می‌دهد از Dovecot به‌عنوان منبع اطلاعات شناسایی استفاده کند.
category: فنی
---

# Dovecot SASL

ماژول 'auth.dovecot_sasl' سمت کلاینت پروتکل احراز هویت Dovecot را پیاده‌سازی می‌کند و به maddy اجازه می‌دهد از آن به‌عنوان منبع اطلاعات شناسایی (credentials) استفاده کند.

در حال حاضر پشتیبانی از مکانیزم‌های SASL محدود به مواردی است که توسط خود maddy پشتیبانی می‌شوند، بنابراین برای مثال نمی‌توانید از این طریق به SCRAM-MD5 دسترسی داشته باشید.

```hcl
auth.dovecot_sasl {
	endpoint unix://socket_path
}

dovecot_sasl unix://socket_path
```

## دستورالعمل‌های پیکربندی

### `endpoint [schema://address]`
پیش‌فرض: تنظیم نشده است

آدرس مورد استفاده برای تماس با سرور Dovecot SASL را در فرمت استاندارد نقاط انتهایی تنظیم می‌کند.

`tcp://10.0.0.1:2222` برای TCP و `unix:///var/lib/dovecot/auth.sock` برای سوکت‌های دامنه یونیکس.

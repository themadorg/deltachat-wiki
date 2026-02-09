---
title: مرجع احراز هویت LDAP
description: مرجع ماژول auth.ldap که امکان احراز هویت از طریق LDAP با استفاده از DN binding را در Madmail فراهم می‌کند.
category: فنی
---

# LDAP BindDN

maddy از احراز هویت از طریق LDAP با استفاده از DN binding پشتیبانی می‌کند. رمزهای عبور توسط سرور LDAP تأیید می‌شوند.

maddy نیاز به دانستن DN مورد نظر برای اتصال (binding) دارد. این مقدار می‌تواند از طریق جستجوی دایرکتوری یا قالب (template) به دست آید.

توجه داشته باشید که بک‌اِندهای ذخیره‌سازی به‌طور معمول از آدرس‌های ایمیل استفاده می‌کنند. اگر از شناسه‌هایی غیر از ایمیل به‌عنوان نام کاربری استفاده می‌کنید، باید آن‌ها را در زمان تحویل با استفاده از `auth_map` به ایمیل نقشه‌برداری کنید.

ماژول `auth.ldap` همچنین می‌تواند به‌عنوان یک ماژول جدول (table) استفاده شود. از این طریق می‌توانید بررسی کنید که آیا حساب کاربری وجود دارد یا خیر. این قابلیت تنها در صورتی کار می‌کند که از قالب DN استفاده نشود.

```hcl
auth.ldap {
    urls ldap://maddy.test:389

    # مشخص کردن اطلاعات شناسایی اولیه برای اتصال.
    # در صورت استفاده از قالب DN الزامی نیست ('bind off').
    bind plain "cn=maddy,ou=people,dc=maddy,dc=test" "123456"

    # مشخص کردن قالب DN برای نادیده گرفتن جستجو.
    dn_template "cn={username},ou=people,dc=maddy,dc=test"

    # مشخص کردن base_dn و فیلتر برای جستجوی DN.
    base_dn "ou=people,dc=maddy,dc=test"
    filter "(&(objectClass=posixAccount)(uid={username}))"

    tls_client { ... }
    starttls off
    debug off
    connect_timeout 1m
}
```

```hcl
auth.ldap ldap://maddy.test.389 {
    ...
}
```

## دستورالعمل‌های پیکربندی

### `urls [servers...]`

**الزامی.**

آدرس‌های URL سرورهای دایرکتوری برای استفاده. از اولین سرور در دسترس استفاده می‌شود و توزیع بار (load-balancing) انجام نمی‌شود.

آدرس‌ها باید از طرح‌های `ldap://`, `ldaps://`, `ldapi://` استفاده کنند.

---

### `bind off | unauth | external | plain [username] [password]`

پیش‌فرض: `off`

اطلاعات شناسایی برای اتصال اولیه. در صورت استفاده از جستجوی DN الزامی است.

`unauth` اتصال بدون احراز هویت را انجام می‌دهد. `external` از اتصال خارجی استفاده می‌کند که برای اتصالات سوکت یونیکس (`ldapi://`) یا احراز هویت با گواهی کلاینت TLS مفید است. `plain` یک اتصال ساده با استفاده از اطلاعات شناسایی ارائه شده انجام می‌دهد.

---

### `dn_template [template]`

قالب DN مورد استفاده برای اتصال. `{username}` با نام کاربری مشخص شده توسط کاربر جایگزین می‌شود.

---

### `base_dn [dn]`

Base DN مورد استفاده برای جستجو.

---

### `filter [str]`

فیلتر جستجوی DN. `{username}` با نام کاربری مشخص شده توسط کاربر جایگزین می‌شود.

مثال:
```hcl
(&(objectClass=posixAccount)(uid={username}))
```

مثال (با استفاده از ActiveDirectory):
```hcl
(&(objectCategory=Person)(memberOf=CN=user-group,OU=example,DC=example,DC=org)(sAMAccountName={username})(!(UserAccountControl:1.2.840.113556.1.4.803:=2)))
```

مثال ایمیل:
```hcl
(&(objectClass=Person)(mail={username}))
```

---

### `starttls [bool]`
پیش‌فرض: `off`

تعیین می‌کند که آیا اتصال با استفاده از STARTTLS به TLS ارتقا یابد یا خیر.

---

### `tls_client`

پیکربندی پیشرفته کلاینت TLS. برای جزئیات به [پیکربندی TLS / کلاینت](/fa/docs/servers/madmail/technical/reference/tls) مراجعه کنید.

---

### `connect_timeout [duration]`
پیش‌فرض: `1m`

زمان انتظار (timeout) برای اتصال اولیه به سرور دایرکتوری.

---

### `request_timeout [duration]`
پیش‌فرض: `1m`

زمان انتظار برای هر درخواست (binding, lookup).
 Victorian

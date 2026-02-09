---
title: مرجع احراز هویت Shadow
description: مرجع ماژول auth.shadow که امکان احراز هویت از طریق /etc/shadow یا یک ابزار کمکی setuid را در Madmail فراهم می‌کند.
category: فنی
---

# فایل etc/shadow/

ماژول `auth.shadow` احراز هویت را با خواندن فایل `/etc/shadow` پیاده‌سازی می‌کند. همچنین می‌تواند به‌گونه‌ای پیکربندی شود که مشابه ماژول `auth.external` از یک فایل اجرایی کمکی استفاده کند.

```hcl
auth.shadow {
    debug no
    use_helper no
}
```

## دستورالعمل‌های پیکربندی

### `debug [boolean]`
پیش‌فرض: `no`

فعال کردن ثبت لاگ‌های پرجزئیات برای تمام ماژول‌ها. شما به این مورد نیاز ندارید مگر اینکه بخواهید یک باگ را گزارش کنید.

---

### `use_helper [boolean]`
پیش‌فرض: `no`

به جای خواندن مستقیم فایل `/etc/shadow` ، از ابزار `maddy-shadow-helper` موجود در دایرکتوری libexec استفاده می‌کند. اگر maddy با دسترسی‌های یک کاربر غیرممتاز (مثلاً هنگام استفاده از حساب‌های کاربری سیستم) اجرا می‌شود، باید از این گزینه استفاده کنید.

شما باید فایل اجرایی `maddy-shadow-helper` را به‌صورت setuid تنظیم کنید. برای جزئیات به فایل `cmd/maddy-shadow-helper/README.md` در درخت کد منبع مراجعه کنید.

خلاصه‌ی مراحل (با فرض داشتن گروه maddy):

```bash
chown root:maddy /usr/lib/maddy/maddy-shadow-helper
chmod u+xs,g+x,o-x /usr/lib/maddy/maddy-shadow-helper
```
 Victorian

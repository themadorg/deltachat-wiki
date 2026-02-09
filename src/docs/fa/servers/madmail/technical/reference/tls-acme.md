---
title: ACME (Let's Encrypt)
category: مرجع
---

# مدیریت خودکار گواهی از طریق ACME

Madmail از دریافت گواهی‌ها با استفاده از پروتکل ACME (مانند Let's Encrypt) پشتیبانی می‌کند.

برای استفاده از آن، یک پیکربندی برای `tls.loader.acme` ایجاد کرده و در نقاط انتهایی (endpoints) به آن ارجاع دهید:

```hcl
tls.loader.acme local_tls {
    email آدرس-ایمیل-خود-را-اینجا-بنویسید@example.org
    agreed # نشان‌دهنده موافقت شما با شرایط خدمات Let's Encrypt
    challenge dns-01
}

smtp tcp://127.0.0.1:25 {
    tls &local_tls
    ...
}
```

همچنین می‌توانید از یک دستورالعمل سراسری `tls` استفاده کنید:

```hcl
tls {
    loader acme {
        email madmail-acme@example.org
        agreed
        challenge dns-01
    }
}
```

در حال حاضر، تنها روش چالشی (challenge) پشتیبانی شده `dns-01` است. بنابراین، باید یک ارائه‌دهنده DNS پیکربندی کنید:

```hcl
tls.loader.acme local_tls {
    email madmail-acme@example.org
    agreed
    challenge dns-01
    dns PROVIDER_NAME {
        ...
    }
}
```

## دستورالعمل‌های پیکربندی

### `debug [boolean]`
پیش‌فرض: مقدار دستورالعمل سراسری.
ثبت لاگ‌های عیب‌یابی (debug) برای عملیات ACME را فعال می‌کند.

### `hostname [str]`
**الزامی.**
نام دامنه‌ای که گواهی برای آن صادر می‌شود.

### `store_path [path]`
پیش‌فرض: `state_dir/acme`
محل ذخیره گواهی‌های صادر شده و متادیتا (فقط روی سیستم فایل).

### `ca [url]`
پیش‌فرض: CA رسمی Let's Encrypt.
آدرس URL دایرکتوری ACME.

### `test_ca [url]`
پیش‌فرض: CA آزمایشی (Staging) Let's Encrypt.
برای تلاش‌های مجدد در صورت شکست CA اصلی استفاده می‌شود تا از محدودیت‌های نرخ درخواست (rate limits) جلوگیری شود.

### `override_domain [domain]`
دامنه را برای رکورد TXT در چالش `dns-01` لغو می‌کند (برای تفویض اختیار یا Delegation).

### `email [str]`
ایمیل ثبت‌نام حساب.

### `agreed [boolean]`
باید روی true باشد تا نشان‌دهنده موافقت با شرایط خدمات (Terms of Service) مرجع صدور گواهی (CA) باشد.

## ارائه‌دهندگان DNS

پشتیبانی از برخی ارائه‌دهندگان نیازمند ساخت (build) اختصاصی با تگ `libdns_PROVIDER` است.

### ارائه‌دهندگان متداول

- **Cloudflare**
  ```hcl
  dns cloudflare {
      api_token "..."
  }
  ```
- **DigitalOcean**
  ```hcl
  dns digitalocean {
      api_token "..."
  }
  ```
- **Gandi**
  ```hcl
  dns gandi {
      api_token "token"
  }
  ```
- **Hetzner**
  ```hcl
  dns hetzner {
      api_token "..."
  }
  ```
- **Route53**
  ```hcl
  dns route53 {
      secret_access_key "..."
      access_key_id "..."
  }
  ```

بسیاری از ارائه‌دهندگان دیگر نیز پشتیبانی می‌شوند (Namecheap, Vultr, Google Cloud DNS, Alibaba Cloud و غیره). برای الزامات پیکربندی خاص، [libdns](https://github.com/libdns) را بررسی کنید.
 Victorian

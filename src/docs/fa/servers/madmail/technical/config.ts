export const sidebarConfig = [
    {
        title: "مستندات فنی",
        items: [
            { title: "منطق احراز هویت", slug: "servers/madmail/technical/authentication" },
            { title: "مجموعه تست E2E", slug: "servers/madmail/technical/e2e-test" },
            { title: "یکپارچه‌سازی رله Iroh", slug: "servers/madmail/technical/iroh-relay" },
            { title: "سیاست عدم ثبت لاگ", slug: "servers/madmail/technical/no-log-policy" },
            { title: "سیاست فقط PGP", slug: "servers/madmail/technical/pgp-only-policy" },
            { title: "دیتابیس تنظیمات", slug: "servers/madmail/technical/settings-database" },
            { title: "سرور TURN", slug: "servers/madmail/technical/turn-server" },
        ]
    },
    {
        title: "معماری داخلی",
        items: [
            { title: "نکات پیاده‌سازی", slug: "servers/madmail/technical/quirks" },
            { title: "مشخصات رعایت شده", slug: "servers/madmail/technical/specifications" },
            { title: "ذخیره‌سازی SQLite", slug: "servers/madmail/technical/sqlite-storage" },
            { title: "پشتیبانی از یونیکد", slug: "servers/madmail/technical/unicode-support" },
        ]
    },
    {
        title: "مرجع ماژول‌ها",
        items: [
            { title: "مقدمه ماژول‌ها", slug: "servers/madmail/technical/reference/modules-intro" },
            { title: "خط لوله SMTP", slug: "servers/madmail/technical/reference/smtp-pipeline" },
            { title: "پیکربندی TLS", slug: "servers/madmail/technical/reference/tls" },
            { title: "ACME (Let's Encrypt)", slug: "servers/madmail/technical/reference/tls-acme" },
            { title: "سینتکس پیکربندی", slug: "servers/madmail/technical/reference/config-syntax" },
            { title: "دستورالعمل‌های عمومی", slug: "servers/madmail/technical/reference/global-config" },
            {
                title: "احراز هویت",
                items: [
                    { title: "Dovecot SASL", slug: "servers/madmail/technical/reference/auth/dovecot-sasl" },
                    { title: "LDAP BindDN", slug: "servers/madmail/technical/reference/auth/ldap" },
                    { title: "کمکی خارجی", slug: "servers/madmail/technical/reference/auth/external" },
                    { title: "فایل Shadow", slug: "servers/madmail/technical/reference/auth/shadow" },
                ]
            },
            {
                title: "ذخیره‌سازی Blob",
                items: [
                    { title: "سیستم فایل", slug: "servers/madmail/technical/reference/blob/fs" },
                    { title: "Amazon S3", slug: "servers/madmail/technical/reference/blob/s3" },
                ]
            },
            {
                title: "بررسی‌ها (Checks)",
                items: [
                    { title: "عملیات‌های بررسی", slug: "servers/madmail/technical/reference/checks/actions" },
                    { title: "احراز هویت فرستنده", slug: "servers/madmail/technical/reference/checks/authorize-sender" },
                    { title: "فیلتر دستور", slug: "servers/madmail/technical/reference/checks/command" },
                    { title: "تأیید DKIM", slug: "servers/madmail/technical/reference/checks/dkim" },
                    { title: "جستجوی DNSBL", slug: "servers/madmail/technical/reference/checks/dnsbl" },
                    { title: "کلاینت Milter", slug: "servers/madmail/technical/reference/checks/milter" },
                    { title: "بررسی‌های متفرقه", slug: "servers/madmail/technical/reference/checks/misc" },
                    { title: "یکپارچه‌سازی Rspamd", slug: "servers/madmail/technical/reference/checks/rspamd" },
                    { title: "تأیید SPF", slug: "servers/madmail/technical/reference/checks/spf" },
                ]
            },
            {
                title: "نقاط انتهایی (Endpoints)",
                items: [
                    { title: "IMAP4rev1", slug: "servers/madmail/technical/reference/endpoints/imap" },
                    { title: "OpenMetrics", slug: "servers/madmail/technical/reference/endpoints/openmetrics" },
                    { title: "SMTP/LMTP", slug: "servers/madmail/technical/reference/endpoints/smtp" },
                ]
            },
            {
                title: "اصلاح‌کننده‌ها (Modifiers)",
                items: [
                    { title: "امضای DKIM", slug: "servers/madmail/technical/reference/modifiers/dkim-signing" },
                    { title: "بازنویسی پاکت نامه", slug: "servers/madmail/technical/reference/modifiers/envelope-rewriting" },
                ]
            }
        ]
    },
    {
        title: "آموزش‌ها",
        items: [
            { title: "راه‌اندازی اولیه", slug: "servers/madmail/technical/tutorials/setting-up" },
            { title: "یکپارچه‌سازی Dovecot", slug: "servers/madmail/technical/third-party/dovecot" },
        ]
    }
];

export const sidebarConfig = [
    {
        title: "Техническая документация",
        items: [
            { title: "Логика аутентификации", slug: "servers/madmail/technical/authentication" },
            { title: "Набор E2E-тестов", slug: "servers/madmail/technical/e2e-test" },
            { title: "Интеграция реле Iroh", slug: "servers/madmail/technical/iroh-relay" },
            { title: "Политика отсутствия логов", slug: "servers/madmail/technical/no-log-policy" },
            { title: "Политика PGP-Only", slug: "servers/madmail/technical/pgp-only-policy" },
            { title: "База данных настроек", slug: "servers/madmail/technical/settings-database" },
            { title: "TURN-сервер", slug: "servers/madmail/technical/turn-server" },
        ]
    },
    {
        title: "Внутренняя архитектура",
        items: [
            { title: "Особенности реализации", slug: "servers/madmail/technical/quirks" },
            { title: "Следование спецификациям", slug: "servers/madmail/technical/specifications" },
            { title: "Хранилище SQLite", slug: "servers/madmail/technical/sqlite-storage" },
            { title: "Поддержка Unicode", slug: "servers/madmail/technical/unicode-support" },
        ]
    },
    {
        title: "Справочник модулей",
        items: [
            { title: "Введение в модули", slug: "servers/madmail/technical/reference/modules-intro" },
            { title: "Конвейер SMTP", slug: "servers/madmail/technical/reference/smtp-pipeline" },
            { title: "Конфигурация TLS", slug: "servers/madmail/technical/reference/tls" },
            { title: "ACME (Let's Encrypt)", slug: "servers/madmail/technical/reference/tls-acme" },
            { title: "Синтаксис конфигурации", slug: "servers/madmail/technical/reference/config-syntax" },
            { title: "Глобальные директивы", slug: "servers/madmail/technical/reference/global-config" },
            {
                title: "Аутентификация",
                items: [
                    { title: "Dovecot SASL", slug: "servers/madmail/technical/reference/auth/dovecot-sasl" },
                    { title: "LDAP BindDN", slug: "servers/madmail/technical/reference/auth/ldap" },
                    { title: "Внешний обработчик", slug: "servers/madmail/technical/reference/auth/external" },
                    { title: "Файл Shadow", slug: "servers/madmail/technical/reference/auth/shadow" },
                ]
            },
            {
                title: "Хранилище объектов (Blob)",
                items: [
                    { title: "Файловая система", slug: "servers/madmail/technical/reference/blob/fs" },
                    { title: "Amazon S3", slug: "servers/madmail/technical/reference/blob/s3" },
                ]
            },
            {
                title: "Проверки",
                items: [
                    { title: "Действия при проверке", slug: "servers/madmail/technical/reference/checks/actions" },
                    { title: "Авторизация отправителя", slug: "servers/madmail/technical/reference/checks/authorize-sender" },
                    { title: "Командный фильтр", slug: "servers/madmail/technical/reference/checks/command" },
                    { title: "Проверка DKIM", slug: "servers/madmail/technical/reference/checks/dkim" },
                    { title: "Проверка DNSBL", slug: "servers/madmail/technical/reference/checks/dnsbl" },
                    { title: "Клиент Milter", slug: "servers/madmail/technical/reference/checks/milter" },
                    { title: "Прочие проверки", slug: "servers/madmail/technical/reference/checks/misc" },
                    { title: "Интеграция Rspamd", slug: "servers/madmail/technical/reference/checks/rspamd" },
                    { title: "Проверка SPF", slug: "servers/madmail/technical/reference/checks/spf" },
                ]
            },
            {
                title: "Конечные точки",
                items: [
                    { title: "IMAP4rev1", slug: "servers/madmail/technical/reference/endpoints/imap" },
                    { title: "OpenMetrics", slug: "servers/madmail/technical/reference/endpoints/openmetrics" },
                    { title: "SMTP/LMTP", slug: "servers/madmail/technical/reference/endpoints/smtp" },
                ]
            },
            {
                title: "Модификаторы",
                items: [
                    { title: "Подпись DKIM", slug: "servers/madmail/technical/reference/modifiers/dkim-signing" },
                    { title: "Перезапись конверта", slug: "servers/madmail/technical/reference/modifiers/envelope-rewriting" },
                ]
            }
        ]
    },
    {
        title: "Руководства",
        items: [
            { title: "Начальная настройка", slug: "servers/madmail/technical/tutorials/setting-up" },
            { title: "Интеграция Dovecot", slug: "servers/madmail/technical/third-party/dovecot" },
        ]
    }
];

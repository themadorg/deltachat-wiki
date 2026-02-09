export const sidebarConfig = [
    {
        title: "Documentación técnica",
        items: [
            { title: "Lógica de autenticación", slug: "servers/madmail/technical/authentication" },
            { title: "Pruebas E2E", slug: "servers/madmail/technical/e2e-test" },
            { title: "Integración de relay Iroh", slug: "servers/madmail/technical/iroh-relay" },
            { title: "Política de no registros", slug: "servers/madmail/technical/no-log-policy" },
            { title: "Política de solo PGP", slug: "servers/madmail/technical/pgp-only-policy" },
            { title: "Base de datos de configuración", slug: "servers/madmail/technical/settings-database" },
            { title: "Servidor TURN", slug: "servers/madmail/technical/turn-server" },
        ]
    },
    {
        title: "Arquitectura interna",
        items: [
            { title: "Peculiaridades de implementación", slug: "servers/madmail/technical/quirks" },
            { title: "Especificaciones seguidas", slug: "servers/madmail/technical/specifications" },
            { title: "Almacenamiento SQLite", slug: "servers/madmail/technical/sqlite-storage" },
            { title: "Soporte Unicode", slug: "servers/madmail/technical/unicode-support" },
        ]
    },
    {
        title: "Referencia de módulos",
        items: [
            { title: "Introducción a los módulos", slug: "servers/madmail/technical/reference/modules-intro" },
            { title: "Pipeline SMTP", slug: "servers/madmail/technical/reference/smtp-pipeline" },
            { title: "Configuración de TLS", slug: "servers/madmail/technical/reference/tls" },
            { title: "ACME (Let's Encrypt)", slug: "servers/madmail/technical/reference/tls-acme" },
            { title: "Sintaxis de configuración", slug: "servers/madmail/technical/reference/config-syntax" },
            { title: "Directivas globales", slug: "servers/madmail/technical/reference/global-config" },
            {
                title: "Autenticación",
                items: [
                    { title: "Dovecot SASL", slug: "servers/madmail/technical/reference/auth/dovecot-sasl" },
                    { title: "LDAP BindDN", slug: "servers/madmail/technical/reference/auth/ldap" },
                    { title: "Ayudante externo", slug: "servers/madmail/technical/reference/auth/external" },
                    { title: "Archivo Shadow", slug: "servers/madmail/technical/reference/auth/shadow" },
                ]
            },
            {
                title: "Almacenamiento Blob",
                items: [
                    { title: "Sistema de archivos", slug: "servers/madmail/technical/reference/blob/fs" },
                    { title: "Amazon S3", slug: "servers/madmail/technical/reference/blob/s3" },
                ]
            },
            {
                title: "Comprobaciones",
                items: [
                    { title: "Acciones de comprobación", slug: "servers/madmail/technical/reference/checks/actions" },
                    { title: "Autorización del remitente", slug: "servers/madmail/technical/reference/checks/authorize-sender" },
                    { title: "Filtro de comandos", slug: "servers/madmail/technical/reference/checks/command" },
                    { title: "Verificación DKIM", slug: "servers/madmail/technical/reference/checks/dkim" },
                    { title: "Búsqueda DNSBL", slug: "servers/madmail/technical/reference/checks/dnsbl" },
                    { title: "Cliente Milter", slug: "servers/madmail/technical/reference/checks/milter" },
                    { title: "Comprobaciones varias", slug: "servers/madmail/technical/reference/checks/misc" },
                    { title: "Integración con Rspamd", slug: "servers/madmail/technical/reference/checks/rspamd" },
                    { title: "Verificación SPF", slug: "servers/madmail/technical/reference/checks/spf" },
                ]
            },
            {
                title: "Puntos finales",
                items: [
                    { title: "IMAP4rev1", slug: "servers/madmail/technical/reference/endpoints/imap" },
                    { title: "OpenMetrics", slug: "servers/madmail/technical/reference/endpoints/openmetrics" },
                    { title: "SMTP/LMTP", slug: "servers/madmail/technical/reference/endpoints/smtp" },
                ]
            },
            {
                title: "Modificadores",
                items: [
                    { title: "Firma DKIM", slug: "servers/madmail/technical/reference/modifiers/dkim-signing" },
                    { title: "Reescritura de sobres", slug: "servers/madmail/technical/reference/modifiers/envelope-rewriting" },
                ]
            }
        ]
    },
    {
        title: "Tutoriales",
        items: [
            { title: "Configuración inicial", slug: "servers/madmail/technical/tutorials/setting-up" },
            { title: "Integración con Dovecot", slug: "servers/madmail/technical/third-party/dovecot" },
        ]
    }
];

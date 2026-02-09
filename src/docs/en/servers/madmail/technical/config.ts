export const sidebarConfig = [
    {
        title: "Technical Documentation",
        items: [
            { title: "Authentication Logic", slug: "servers/madmail/technical/authentication" },
            { title: "E2E Test Suite", slug: "servers/madmail/technical/e2e-test" },
            { title: "Iroh Relay Integration", slug: "servers/madmail/technical/iroh-relay" },
            { title: "No Log Policy", slug: "servers/madmail/technical/no-log-policy" },
            { title: "PGP-Only Policy", slug: "servers/madmail/technical/pgp-only-policy" },
            { title: "Settings Database", slug: "servers/madmail/technical/settings-database" },
            { title: "TURN Server", slug: "servers/madmail/technical/turn-server" },
        ]
    },
    {
        title: "Internal Architecture",
        items: [
            { title: "Implementation Quirks", slug: "servers/madmail/technical/quirks" },
            { title: "Followed Specifications", slug: "servers/madmail/technical/specifications" },
            { title: "SQLite Storage", slug: "servers/madmail/technical/sqlite-storage" },
            { title: "Unicode Support", slug: "servers/madmail/technical/unicode-support" },
        ]
    },
    {
        title: "Module Reference",
        items: [
            { title: "Modules Intro", slug: "servers/madmail/technical/reference/modules-intro" },
            { title: "SMTP Pipeline", slug: "servers/madmail/technical/reference/smtp-pipeline" },
            { title: "TLS Configuration", slug: "servers/madmail/technical/reference/tls" },
            { title: "ACME (Let's Encrypt)", slug: "servers/madmail/technical/reference/tls-acme" },
            { title: "Configuration Syntax", slug: "servers/madmail/technical/reference/config-syntax" },
            { title: "Global Directives", slug: "servers/madmail/technical/reference/global-config" },
            {
                title: "Authentication",
                items: [
                    { title: "Dovecot SASL", slug: "servers/madmail/technical/reference/auth/dovecot-sasl" },
                    { title: "LDAP BindDN", slug: "servers/madmail/technical/reference/auth/ldap" },
                    { title: "External Helper", slug: "servers/madmail/technical/reference/auth/external" },
                    { title: "Shadow File", slug: "servers/madmail/technical/reference/auth/shadow" },
                ]
            },
            {
                title: "Blob Storage",
                items: [
                    { title: "Filesystem", slug: "servers/madmail/technical/reference/blob/fs" },
                    { title: "Amazon S3", slug: "servers/madmail/technical/reference/blob/s3" },
                ]
            },
            {
                title: "Checks",
                items: [
                    { title: "Check Actions", slug: "servers/madmail/technical/reference/checks/actions" },
                    { title: "Sender Authorization", slug: "servers/madmail/technical/reference/checks/authorize-sender" },
                    { title: "Command Filter", slug: "servers/madmail/technical/reference/checks/command" },
                    { title: "DKIM Verification", slug: "servers/madmail/technical/reference/checks/dkim" },
                    { title: "DNSBL Lookup", slug: "servers/madmail/technical/reference/checks/dnsbl" },
                    { title: "Milter Client", slug: "servers/madmail/technical/reference/checks/milter" },
                    { title: "Misc Checks", slug: "servers/madmail/technical/reference/checks/misc" },
                    { title: "Rspamd Integration", slug: "servers/madmail/technical/reference/checks/rspamd" },
                    { title: "SPF Verification", slug: "servers/madmail/technical/reference/checks/spf" },
                ]
            },
            {
                title: "Endpoints",
                items: [
                    { title: "IMAP4rev1", slug: "servers/madmail/technical/reference/endpoints/imap" },
                    { title: "OpenMetrics", slug: "servers/madmail/technical/reference/endpoints/openmetrics" },
                    { title: "SMTP/LMTP", slug: "servers/madmail/technical/reference/endpoints/smtp" },
                ]
            },
            {
                title: "Modifiers",
                items: [
                    { title: "DKIM Signing", slug: "servers/madmail/technical/reference/modifiers/dkim-signing" },
                    { title: "Envelope Rewriting", slug: "servers/madmail/technical/reference/modifiers/envelope-rewriting" },
                ]
            }
        ]
    },
    {
        title: "Tutorials",
        items: [
            { title: "Initial Setup", slug: "servers/madmail/technical/tutorials/setting-up" },
            { title: "Dovecot Integration", slug: "servers/madmail/technical/third-party/dovecot" },
        ]
    }
];

export const sidebarConfig = [
    { title: "معرفی", slug: "servers/overview" },
    {
        title: "رله Chatmail",
        items: [
            { title: "معرفی", slug: "servers/chatmail/overview" },
            { title: "شروع کار", slug: "servers/chatmail/getting-started" },
            { title: "پراکسی معکوس", slug: "servers/chatmail/proxy" },
            { title: "مهاجرت", slug: "servers/chatmail/migrate" },
            { title: "سؤالات متداول", slug: "servers/chatmail/faq" },
        ]
    },
    {
        title: "Madmail",
        items: [
            { title: "معرفی", slug: "servers/madmail/overview" },
            { title: "شروع کار", slug: "servers/madmail/getting-started" },
            { title: "فنی", slug: "servers/madmail/technical/authentication", drilldown: true },
            { title: "سؤالات متداول", slug: "servers/madmail/faq" },
        ]
    },
    { title: "سرویس‌دهنده‌ها", slug: "servers/providers" }
];

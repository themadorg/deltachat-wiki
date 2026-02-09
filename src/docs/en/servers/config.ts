export const sidebarConfig = [
    { title: "Introduction", slug: "servers/overview" },
    {
        title: "Chatmail Relay",
        items: [
            { title: "Introduction", slug: "servers/chatmail/overview" },
            { title: "Getting Started", slug: "servers/chatmail/getting-started" },
            { title: "Reverse Proxy", slug: "servers/chatmail/proxy" },
            { title: "Migration", slug: "servers/chatmail/migrate" },
            { title: "FAQ", slug: "servers/chatmail/faq" },
        ]
    },
    {
        title: "Madmail",
        items: [
            { title: "Introduction", slug: "servers/madmail/overview" },
            { title: "Getting Started", slug: "servers/madmail/getting-started" },
            { title: "Technical", slug: "servers/madmail/technical/authentication", drilldown: true },
            { title: "FAQ", slug: "servers/madmail/faq" },
        ]
    },
    { title: "Providers", slug: "servers/providers" }
];

export const sidebarConfig = [
    { title: "Введение", slug: "servers/overview" },
    {
        title: "Реле Chatmail",
        items: [
            { title: "Введение", slug: "servers/chatmail/overview" },
            { title: "Начало работы", slug: "servers/chatmail/getting-started" },
            { title: "Обратный прокси", slug: "servers/chatmail/proxy" },
            { title: "Миграция", slug: "servers/chatmail/migrate" },
            { title: "FAQ", slug: "servers/chatmail/faq" },
        ]
    },
    {
        title: "Madmail",
        items: [
            { title: "Введение", slug: "servers/madmail/overview" },
            { title: "Начало работы", slug: "servers/madmail/getting-started" },
            { title: "Техническая информация", slug: "servers/madmail/technical/authentication", drilldown: true },
            { title: "FAQ", slug: "servers/madmail/faq" },
        ]
    },
    { title: "Провайдеры", slug: "servers/providers" }
];

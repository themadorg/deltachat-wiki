export const config = {
    brand: {
        name: "deltachat.wiki",
        tagline: "Learning to use the most decentralized messenger",
        description: "An independent guide to Delta Chat.",
        logoText: "deltachat.wiki"
    },
    socials: {
        github: "https://github.com/deltachat",
        mastodon: "https://chaos.social/@delta",
        youtube: "https://www.youtube.com/@deltachat",
        reddit: "https://www.reddit.com/r/DeltaChat/",
        forum: "https://support.delta.chat/",
        irc: "https://web.libera.chat/#deltachat"
    },
    wiki: {
        github: "https://github.com/themadorg/deltachat-wiki"
    },
    projects: {
        website: "https://delta.chat/",
        webxdc: "https://webxdc.org/",
        bots: "https://bots.delta.chat/",
        chatmail: "https://chatmail.org/",
        donate: "https://delta.chat/en/donate",
        download: "https://get.delta.chat/"
    },
    footer: {
        sections: [
            {
                titleKey: "footer_section_projects",
                links: [
                    { labelKey: "footer_link_website", href: "https://delta.chat/", external: true },
                    { labelKey: "footer_link_webxdc", href: "https://webxdc.org/", external: true },
                    { labelKey: "footer_link_bots", href: "https://bots.delta.chat/", external: true },
                    { labelKey: "footer_link_chatmail", href: "https://chatmail.org/", external: true }
                ]
            },
            {
                titleKey: "footer_section_community",
                links: [
                    { labelKey: "footer_link_forum", href: "https://support.delta.chat/", external: true },
                    { labelKey: "footer_link_mastodon", href: "https://chaos.social/@delta", external: true },
                    { labelKey: "footer_link_reddit", href: "https://www.reddit.com/r/DeltaChat/", external: true },
                    { labelKey: "footer_link_irc", href: "https://web.libera.chat/#deltachat", external: true }
                ]
            },
            {
                titleKey: "footer_section_resources",
                links: [
                    { labelKey: "footer_link_github", href: "https://github.com/deltachat", external: true },
                    { labelKey: "footer_link_youtube", href: "https://www.youtube.com/@deltachat", external: true },
                    { labelKey: "footer_link_donate", href: "https://delta.chat/en/donate", external: true },
                    { labelKey: "footer_link_download", href: "https://get.delta.chat/", external: true }
                ]
            }
        ]
    }
};
